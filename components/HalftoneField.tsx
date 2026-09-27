"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Generative halftone. No source image: a domain-warped noise field is
 * rendered at one texel per dot (pass 1), then pass 2 draws the dots, the
 * holographic color, and every effect the intro choreography drives through
 * `controls` (mutated in place each frame — no React renders involved).
 *
 * Underneath the dots is a water surface: a height field stepped with the 2D
 * wave equation at one cell per dot. Splashes (beats) and the cursor's wake
 * disturb it; waves travel, interfere and die out on their own. The dots ride
 * the surface — slope refracts them, height swells or shrinks them.
 */

export type FieldClip = { x: number; y: number; w: number; h: number; r: number };

export type FieldControls = {
  /** 0..1 — dot size/contrast pump (usually bass) */
  energy: number;
  /** 0..1 — field sucked into the center orb */
  collapse: number;
  /** center orb radius in css px */
  orb: number;
  /** seconds since the last shockwave (large = none) */
  shock: number;
  shockPower: number;
  /** 0..1 white-out */
  flash: number;
  /** 0..1 RGB split + scanline tearing */
  glitch: number;
  zoom: number;
  /** 0..1 global dot scale */
  reveal: number;
  /** palette offset; bump it to hard-cut colors on a beat */
  hue: number;
  /** 1 = forced black backdrop (intro), 0 = theme background */
  night: number;
  /** visible region in css px relative to the canvas; null = everything */
  clip: FieldClip | null;
  /** orb / shockwave / zoom origin in css px; null = canvas center */
  center: { x: number; y: number } | null;
  /** geometric figure drawn in dots (see Shape) */
  shape: number;
  /** seconds since the shape appeared; it expands and fades */
  shapeAge: number;
  /** mirror segments around the center; 0 = off */
  kaleido: number;
  /** dot grid multiplier; >1 = chunky */
  coarse: number;
  /** one-shot drop into the water (css px); consumed and cleared by the field */
  splash: { x: number; y: number; strength: number; radius: number } | null;
};

export const Shape = {
  none: 0,
  ring: 1,
  tunnel: 2,
  diamond: 3,
  cross: 4,
  bars: 5,
  spokes: 6,
  triangle: 7,
} as const;

export const createFieldControls = (): FieldControls => ({
  energy: 0,
  collapse: 1,
  orb: 0,
  shock: 99,
  shockPower: 0,
  flash: 0,
  glitch: 0,
  zoom: 1,
  reveal: 1,
  hue: 0,
  night: 1,
  clip: null,
  center: null,
  shape: 0,
  shapeAge: 99,
  kaleido: 0,
  coarse: 1,
  splash: null,
});

// Acidic holo palette; wraps so the gradient can slide forever without a seam.
// Light mode gets deeper versions of the same hues to hold contrast.
const PAL_DARK = ["#C8FF00", "#00FFB2", "#00CFFF", "#8A6CFF", "#FF5EDB"];
const PAL_LIGHT = ["#86C400", "#00B584", "#0096D6", "#6E54E8", "#E03FBE"];
const BG_DARK = [0, 0, 0];
const BG_LIGHT = [250 / 255, 250 / 255, 250 / 255];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const PAL_DARK_RGB = PAL_DARK.map(hex);
const PAL_LIGHT_RGB = PAL_LIGHT.map(hex);

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}`;

// Pass 1 — one texel per dot. Two levels of domain warping give the
// marbled, liquid-metal contours.
const FIELD_FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uGrid;
out vec4 o;
${NOISE}
void main() {
  vec2 c = (floor(gl_FragCoord.xy) + 0.5) * uGrid;
  vec2 q = c / 380.0;
  float t = uTime;
  vec2 w = vec2(fbm(q + vec2(0.0, t * 0.6)), fbm(q + vec2(5.2, 1.3) - t * 0.5));
  vec2 w2 = vec2(fbm(q + 2.2 * w + vec2(1.7, 9.2) + t * 0.3),
                 fbm(q + 2.2 * w + vec2(8.3, 2.8)));
  o = vec4(fbm(q + 2.6 * w2), 0.0, 0.0, 1.0);
}`;

// Water — one wave-equation step. State: r = height now, g = height last step.
const WATER_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform ivec2 uCells;
uniform vec4 uWake;       // cursor segment a.xy -> b.xy, in cells
uniform vec2 uWakeParams; // radius (cells), strength
uniform vec4 uSplash;     // x, y (cells), radius (cells), strength
uniform float uDamp;
out vec4 o;
float h(ivec2 c) { return texelFetch(uState, clamp(c, ivec2(0), uCells - 1), 0).r; }
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec2 st = texelFetch(uState, c, 0).rg;
  float n = (h(c + ivec2(1, 0)) + h(c - ivec2(1, 0)) + h(c + ivec2(0, 1)) + h(c - ivec2(0, 1))) * 0.5 - st.g;
  n *= uDamp;

  vec2 p = vec2(c) + 0.5;
  vec2 pa = p - uWake.xy, ba = uWake.zw - uWake.xy;
  float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  vec2 dw = pa - ba * t;
  n += uWakeParams.y * exp(-dot(dw, dw) / (uWakeParams.x * uWakeParams.x));
  vec2 ds = p - uSplash.xy;
  n += uSplash.w * exp(-dot(ds, ds) / (uSplash.z * uSplash.z));

  o = vec4(n, st.r, 0.0, 1.0);
}`;

// Pass 2 — dots, color, effects.
const DOT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform ivec2 uCells;
uniform vec2 uSize, uCenter;
uniform float uDpr, uTime, uGrid;
uniform float uEnergy, uCollapse, uOrb, uShock, uShockPower, uFlash, uGlitch, uZoom, uReveal, uHue;
uniform float uShape, uShapeAge, uKaleido, uCoarse;
uniform vec4 uClip;
uniform float uRadius;
uniform vec3 uBg;
uniform vec3 uPal[5];
uniform sampler2D uWater;
uniform float uWaterAmt;
out vec4 o;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 pal(float u) {
  u = fract(u) * 5.0;
  int i = int(floor(u));
  float f = fract(u);
  f = f * f * (3.0 - 2.0 * f);
  return mix(uPal[i], uPal[(i + 1) % 5], f);
}

float sdTriangle(vec2 p, float r) {
  const float k = 1.7320508;
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}

// Geometric figures, sampled at dot centers so they come out as halftone.
// They expand and fade with age.
float shapeMask(vec2 q) {
  if (uShape < 0.5 || uShapeAge > 1.5) return 0.0;
  float R = min(uSize.x, uSize.y) * 0.3 * (1.0 + uShapeAge * 0.6);
  float th = uGrid * 1.6;
  float r = length(q);
  int k = int(uShape + 0.5);
  float d;
  if (k == 1) {
    d = abs(r - R) - th;
  } else if (k == 2) {
    float w = R * 0.28;
    d = (abs(fract(r / w - uShapeAge * 2.0) - 0.5) - 0.18) * w;
  } else if (k == 3) {
    d = abs(abs(q.x) + abs(q.y) - R) - th;
  } else if (k == 4) {
    d = max(min(abs(q.x), abs(q.y)) - th * 1.5, r - R * 1.3);
  } else if (k == 5) {
    float w = R * 0.22;
    d = (abs(fract(q.y / w + uShapeAge * 1.5) - 0.5) - 0.2) * w;
  } else if (k == 6) {
    float a = atan(q.y, q.x);
    d = (abs(fract(a * 12.0 / 6.2831853) - 0.5) - 0.18) * r * 0.52;
    d = max(d, uGrid * 3.0 - r);
  } else {
    d = abs(sdTriangle(vec2(q.x, -q.y), R * 0.8)) - th;
  }
  return (1.0 - smoothstep(-uGrid * 0.5, uGrid * 0.5, d)) * exp(-uShapeAge * 3.2);
}

// x = coverage, y = palette coordinate
vec2 dotAt(vec2 p) {
  vec2 center = uCenter;
  vec2 z = (p - center) / uZoom + center;

  // Kaleidoscope: fold the plane into mirrored wedges around the center
  if (uKaleido > 0.5) {
    vec2 kq = z - center;
    float seg = 6.2831853 / uKaleido;
    float a = abs(mod(atan(kq.y, kq.x), seg) - seg * 0.5);
    z = center + length(kq) * vec2(cos(a), sin(a));
  }

  // Water: the surface slope refracts the dots, its height swells them
  vec2 texel = 1.0 / vec2(uCells);
  vec2 wuv = z / uGrid * texel;
  float wh = texture(uWater, wuv).r * uWaterAmt;
  vec2 slope = vec2(
    texture(uWater, wuv + vec2(texel.x, 0.0)).r - texture(uWater, wuv - vec2(texel.x, 0.0)).r,
    texture(uWater, wuv + vec2(0.0, texel.y)).r - texture(uWater, wuv - vec2(0.0, texel.y)).r
  ) * uWaterAmt;
  z += slope * 26.0;

  // Shockwave ring
  vec2 fromC = z - center;
  float dc = length(fromC);
  // Alternating crests (+) and troughs (-) trailing the wavefront, so it
  // reads as a water ripple even where the field is already dense
  float ring = 0.0;
  for (int i = 0; i < 4; i++) {
    float rr = uShock * 1700.0 - float(i) * 70.0;
    float sgn = mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0;
    ring += sgn * exp(-pow((dc - rr) / 40.0, 2.0)) * (1.0 - float(i) * 0.2) * step(0.0, rr);
  }
  ring *= uShockPower * exp(-uShock * 1.4);
  z += fromC / max(dc, 1e-3) * ring * 34.0;

  float g = uGrid * uCoarse;
  vec2 c = (floor(z / g) + 0.5) * g;
  float v = texelFetch(uField, clamp(ivec2(c / uGrid), ivec2(0), uCells - 1), 0).r;

  float s = smoothstep(0.3, 0.78, v);
  s = pow(s, mix(1.6, 0.6, uEnergy));

  // Collapse into the orb
  float cd = length(c - center);
  // Interpolate the mask width in log space so the collapse reads evenly
  float diag = length(uSize);
  float sig = diag * pow(uGrid * 0.6 / diag, uCollapse);
  s *= exp(-cd * cd / (2.0 * sig * sig));
  s = max(clamp(s + ring * 0.9 + wh * 0.9, 0.0, 1.0), shapeMask(c - center));

  float r = g * 0.62 * sqrt(s) * uReveal;
  float d = length(z - c);
  float aa = 0.7 / uZoom;
  // Fade tiny dots by radius too, or r = 0 still leaves half-coverage specks
  float cov = (1.0 - smoothstep(r - aa, r + aa, d)) * smoothstep(0.0, aa, r);

  float od = length(p - center);
  cov = max(cov, 1.0 - smoothstep(uOrb - 1.0, uOrb + 1.0, od));

  float hue = dot(c, vec2(0.82, 0.57)) / length(uSize) + uTime * 0.02 + v * 0.7 + uHue + wh * 0.05;
  return vec2(cov, hue);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;

  vec3 col;
  if (uGlitch > 0.01) {
    float tick = floor(uTime * 24.0);
    float band = floor(p.y / 22.0);
    float torn = step(0.72, hash(vec2(band * 1.7, tick)));
    float tear = (hash(vec2(band, tick)) - 0.5) * 2.0 * torn * uGlitch * 70.0;
    float split = uGlitch * 9.0;
    vec2 pp = p + vec2(tear, 0.0);
    vec2 a = dotAt(pp + vec2(split, 0.0));
    vec2 b = dotAt(pp);
    vec2 c = dotAt(pp - vec2(split, 0.0));
    col = vec3(mix(uBg.r, pal(a.y).r, a.x),
               mix(uBg.g, pal(b.y).g, b.x),
               mix(uBg.b, pal(c.y).b, c.x));
  } else {
    vec2 a = dotAt(p);
    col = mix(uBg, pal(a.y), a.x);
  }
  col = mix(col, vec3(1.0), uFlash);

  // Rounded-rect clip (premultiplied alpha)
  vec2 hc = uClip.zw * 0.5;
  vec2 q = abs(p - (uClip.xy + hc)) - hc + uRadius;
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float mask = 1.0 - smoothstep(-0.5, 0.5, sd);
  o = vec4(col * mask, mask);
}`;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
    }
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
  }
  const uniforms = new Map<string, WebGLUniformLocation | null>();
  const u = (name: string) => {
    if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(prog, name));
    return uniforms.get(name)!;
  };
  return { prog, u };
}

interface HalftoneFieldProps {
  controls: React.MutableRefObject<FieldControls>;
  grid?: number;
  className?: string;
}

export default function HalftoneField({ controls, grid = 7, className = "" }: HalftoneFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const darkRef = useRef(true);
  darkRef.current = resolvedTheme !== "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true });
    if (!gl) return;

    const fieldProg = compile(gl, VERT, FIELD_FRAG);
    const dotProg = compile(gl, VERT, DOT_FRAG);
    const waterProg = compile(gl, VERT, WATER_FRAG);
    if (!fieldProg || !dotProg || !waterProg) return;
    // Water needs float render targets; without them the dots just stay dry
    const waterOk = !!gl.getExtension("EXT_color_buffer_float");
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();

    const water = [gl.createTexture(), gl.createTexture()];
    const waterFbo = [gl.createFramebuffer(), gl.createFramebuffer()];
    let wi = 0;

    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cols = Math.ceil(w / grid) + 1;
      rows = Math.ceil(h / grid) + 1;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (waterOk) {
        for (let i = 0; i < 2; i++) {
          gl.bindTexture(gl.TEXTURE_2D, water[i]);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, cols, rows, 0, gl.RGBA, gl.HALF_FLOAT, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, waterFbo[i]);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, water[i], 0);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer → water. Moving drags a wake through it, pressing drops a
    // splash. Only while over the visible (clipped) region.
    const mouse = { x: 0, y: 0, px: 0, py: 0, inside: false, tracked: false };
    let pressSplash: FieldControls["splash"] = null;
    const locate = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      const c = controls.current.clip;
      mouse.inside = c
        ? mouse.x >= c.x && mouse.x <= c.x + c.w && mouse.y >= c.y && mouse.y <= c.y + c.h
        : mouse.x >= 0 && mouse.y >= 0 && mouse.x <= w && mouse.y <= h;
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      if (mouse.inside) pressSplash = { x: mouse.x, y: mouse.y, strength: -1.4, radius: 2.2 };
    };
    const onLeave = () => (mouse.inside = false);
    window.addEventListener("pointermove", locate, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let ambient = 0;
    let simClock = 0;
    const SIM_HZ = 120;
    let last = performance.now();
    const bg = [0, 0, 0];
    const palFlat = new Float32Array(15);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      if (!reduced.matches) ambient += dt;

      const k = controls.current;

      // Theme blend (intro forces night)
      const dark = darkRef.current;
      const night = dark ? 1 : k.night;
      const themeBg = dark ? BG_DARK : BG_LIGHT;
      for (let i = 0; i < 3; i++) bg[i] = themeBg[i] + (BG_DARK[i] - themeBg[i]) * night;
      for (let j = 0; j < 5; j++)
        for (let i = 0; i < 3; i++)
          palFlat[j * 3 + i] =
            PAL_LIGHT_RGB[j][i] + (PAL_DARK_RGB[j][i] - PAL_LIGHT_RGB[j][i]) * night;

      // Water: fixed-rate steps so wave speed doesn't depend on frame rate.
      // Disturbances go in on the first step of the frame only.
      if (waterOk) {
        let wake = [0, 0, 0, 0];
        let wakeStrength = 0;
        if (mouse.inside && mouse.tracked) {
          const speed = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
          if (speed > 0.5) {
            wake = [mouse.px / grid, mouse.py / grid, mouse.x / grid, mouse.y / grid];
            wakeStrength = -Math.min(0.55, speed * 0.015);
          }
        }
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.tracked = mouse.inside;

        const drop = pressSplash ?? k.splash;
        pressSplash = null;
        k.splash = null;

        simClock += dt;
        const steps = Math.min(4, Math.floor(simClock * SIM_HZ));
        simClock -= steps / SIM_HZ;

        gl.disable(gl.SCISSOR_TEST);
        gl.viewport(0, 0, cols, rows);
        gl.useProgram(waterProg.prog);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(waterProg.u("uState"), 0);
        gl.uniform2i(waterProg.u("uCells"), cols, rows);
        gl.uniform1f(waterProg.u("uDamp"), 0.991);
        for (let i = 0; i < steps; i++) {
          const first = i === 0;
          gl.bindFramebuffer(gl.FRAMEBUFFER, waterFbo[1 - wi]);
          gl.bindTexture(gl.TEXTURE_2D, water[wi]);
          gl.uniform4f(waterProg.u("uWake"), wake[0], wake[1], wake[2], wake[3]);
          gl.uniform2f(waterProg.u("uWakeParams"), 1.8, first ? wakeStrength : 0);
          gl.uniform4f(
            waterProg.u("uSplash"),
            (drop?.x ?? 0) / grid,
            (drop?.y ?? 0) / grid,
            drop?.radius ?? 1,
            first && drop ? drop.strength : 0
          );
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          wi = 1 - wi;
        }
      }

      // Pass 1: field
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, cols, rows);
      gl.disable(gl.SCISSOR_TEST);
      gl.useProgram(fieldProg.prog);
      gl.uniform1f(fieldProg.u("uTime"), ambient * 0.06 + k.energy * 0.02);
      gl.uniform1f(fieldProg.u("uGrid"), grid);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Pass 2: dots — scissored to the clip so a small panel is cheap
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const clip = k.clip ?? { x: 0, y: 0, w, h, r: 0 };
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(
        Math.floor(clip.x * dpr) - 1,
        Math.floor((h - clip.y - clip.h) * dpr) - 1,
        Math.ceil(clip.w * dpr) + 2,
        Math.ceil(clip.h * dpr) + 2
      );

      const u = dotProg.u;
      gl.useProgram(dotProg.prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(u("uField"), 0);
      gl.uniform2i(u("uCells"), cols, rows);
      gl.uniform2f(u("uSize"), w, h);
      gl.uniform2f(u("uCenter"), k.center?.x ?? w / 2, k.center?.y ?? h / 2);
      gl.uniform1f(u("uDpr"), dpr);
      gl.uniform1f(u("uTime"), ambient);
      gl.uniform1f(u("uGrid"), grid);
      gl.uniform1f(u("uEnergy"), k.energy);
      gl.uniform1f(u("uCollapse"), k.collapse);
      gl.uniform1f(u("uOrb"), k.orb);
      gl.uniform1f(u("uShock"), k.shock);
      gl.uniform1f(u("uShockPower"), k.shockPower);
      gl.uniform1f(u("uFlash"), k.flash);
      gl.uniform1f(u("uGlitch"), k.glitch);
      gl.uniform1f(u("uZoom"), k.zoom);
      gl.uniform1f(u("uReveal"), k.reveal);
      gl.uniform1f(u("uHue"), k.hue);
      gl.uniform1f(u("uShape"), k.shape);
      gl.uniform1f(u("uShapeAge"), k.shapeAge);
      gl.uniform1f(u("uKaleido"), k.kaleido);
      gl.uniform1f(u("uCoarse"), k.coarse);
      gl.uniform4f(u("uClip"), clip.x, clip.y, clip.w, clip.h);
      gl.uniform1f(u("uRadius"), clip.r);
      gl.uniform3f(u("uBg"), bg[0], bg[1], bg[2]);
      gl.uniform3fv(u("uPal"), palFlat);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waterOk ? water[wi] : null);
      gl.uniform1i(u("uWater"), 1);
      gl.uniform1f(u("uWaterAmt"), waterOk ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", locate);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(tex);
      gl.deleteFramebuffer(fbo);
      water.forEach((t) => gl.deleteTexture(t));
      waterFbo.forEach((f) => gl.deleteFramebuffer(f));
      gl.deleteProgram(waterProg.prog);
      gl.deleteProgram(fieldProg.prog);
      gl.deleteProgram(dotProg.prog);
    };
  }, [controls, grid]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
