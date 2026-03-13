"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

interface HalftoneImageProps {
  src: string;
  alt: string;
  dotColor?: { light: string; dark: string };
  bgColor?: { light: string; dark: string };
  gridSize?: number;
  maxHeight?: string;
  className?: string;
}

const defaultDotColor = { light: "#2939C6", dark: "#3B5FFF" };
const defaultBgColor = { light: "#fafafa", dark: "#000000" };

export default function HalftoneImage({
  src,
  alt,
  dotColor = defaultDotColor,
  bgColor = defaultBgColor,
  gridSize = 6,
  maxHeight = "40vh",
  className = "",
}: HalftoneImageProps) {
  const { resolvedTheme } = useTheme();
  const activeDotColor = resolvedTheme === "dark" ? dotColor.dark : dotColor.light;
  const activeBgColor = resolvedTheme === "dark" ? bgColor.dark : bgColor.light;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // Flat buffer: [baseX, baseY, baseRadius, ...] per dot
  const dotsRef = useRef<Float32Array>(new Float32Array(0));
  const dotCountRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const smoothRef = useRef({ x: -9999, y: -9999, influence: 0 });
  const rafRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Sample image pixels and build the dot grid
  // Each dot: [baseX, baseY, baseRadius, noiseA, noiseB]  (5 floats)
  //   noiseA — perturbs effective distance (breaks radial rings into organic contours)
  //   noiseB — tangential displacement weight (adds fabric-like swirl)
  const computeDots = useCallback(
    (width: number, height: number) => {
      const img = imgRef.current;
      if (!img) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, width, height);
      const { data } = offCtx.getImageData(0, 0, width, height);

      const step = gridSize;
      const maxRadius = step * 0.55;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      const dots = new Float32Array(cols * rows * 5);

      let idx = 0;
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const i = (Math.floor(y) * width + Math.floor(x)) * 4;
          const brightness =
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) /
            255;

          // Spatially coherent noise via layered sine waves
          // Different frequencies + irrational ratios → organic, non-repeating field
          const nx = x * 0.018;
          const ny = y * 0.018;
          const noiseA =
            Math.sin(nx * 1.7 + ny * 2.3 + 0.5) * 0.45 +
            Math.sin(nx * 3.1 - ny * 1.9 + 1.3) * 0.30 +
            Math.sin(nx * 0.7 + ny * 4.3 - 0.8) * 0.25;
          const noiseB =
            Math.sin(nx * 2.9 + ny * 1.1 + 2.1) * 0.40 +
            Math.sin(nx * 1.3 - ny * 3.7 - 0.4) * 0.30 +
            Math.sin(nx * 4.1 + ny * 0.9 + 1.7) * 0.20;

          dots[idx++] = x;
          dots[idx++] = y;
          dots[idx++] = maxRadius * (1 - brightness);
          dots[idx++] = noiseA;
          dots[idx++] = noiseB;
        }
      }

      dotsRef.current = dots;
      dotCountRef.current = idx / 5;
    },
    [gridSize]
  );

  // Core render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    computeDots(dimensions.width, dimensions.height);

    if (dotCountRef.current === 0) return;

    let active = true;

    const frame = () => {
      if (!active) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = dimensions.width;
      const h = dimensions.height;
      const dots = dotsRef.current;
      const count = dotCountRef.current;

      // --- Smooth cursor tracking ---
      const s = smoothRef.current;
      const m = mouseRef.current;
      if (m.active) {
        s.x += (m.x - s.x) * 0.25;
        s.y += (m.y - s.y) * 0.25;
        s.influence += (1 - s.influence) * 0.1;
      } else {
        s.influence *= 0.95;
      }

      // --- Draw ---
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = activeBgColor;
      ctx.fillRect(0, 0, w, h);

      // Difference of Gaussians (DoG) replaces Mexican hat:
      //   Narrow Gaussian — visible growth near cursor
      //   Wide Gaussian   — conservation spread so thin it's invisible
      //   Width ratio k = 3.5 → negative lobe is ~8% of peak (vs 44% for Mexican hat)
      const sigma = gridSize * 16;
      const strength = 0.5 * s.influence;
      const maxPush = gridSize * 1.0;
      const k = 3.5;
      const kSq = k * k;
      const invKSq = 1 / kSq;
      const invK = 1 / k;
      const dogPeak = 1 - invKSq; // normalization so peak ≈ 1
      const cutoff = sigma * k * 3; // wide enough for the broad Gaussian
      const cutoffSq = cutoff * cutoff;
      const invSigma = 1 / sigma;
      const hasInfluence = strength > 0.002;

      ctx.fillStyle = activeDotColor;
      ctx.beginPath();

      for (let i = 0; i < count; i++) {
        const bi = i * 5;
        const baseR = dots[bi + 2];
        if (baseR < 0.3) continue;

        let drawX = dots[bi];
        let drawY = dots[bi + 1];
        let drawR = baseR;

        if (hasInfluence) {
          const dx = drawX - s.x;
          const dy = drawY - s.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < cutoffSq) {
            const dist = Math.sqrt(distSq);
            const noiseA = dots[bi + 3];
            const noiseB = dots[bi + 4];

            // Perturb effective distance — breaks radial symmetry
            const tRaw = dist * invSigma;
            const t = tRaw * (1 + noiseA * 0.45);
            const t2 = t * t;

            // Narrow Gaussian (visible effect)
            const gaussN = Math.exp(-t2 * 0.5);
            // Wide Gaussian (diffuse compensation, 3.5× wider)
            const tW = t * invK;
            const gaussW = Math.exp(-tW * tW * 0.5);

            // DoG: sharp center growth, imperceptible distributed shrink
            // ∫DoG = 0 when A·σ₁² = B·σ₂², satisfied by B = 1/k²
            const dog = (gaussN - gaussW * invKSq) / dogPeak;
            const areaMul = 1 + strength * dog;
            drawR = baseR * Math.sqrt(Math.max(areaMul, 0.01));

            // Displacement: radial + tangential noise
            if (dist > 0.5) {
              const pushMag = strength * t * gaussN * maxPush;
              const invDist = 1 / dist;
              drawX += dx * invDist * pushMag;
              drawY += dy * invDist * pushMag;
              const tangMag = pushMag * noiseB * 0.4;
              drawX += -dy * invDist * tangMag;
              drawY += dx * invDist * tangMag;
            }
          }
        }

        ctx.moveTo(drawX + drawR, drawY);
        ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2);
      }

      ctx.fill();
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [dimensions, activeDotColor, activeBgColor, gridSize, computeDots]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth;
        const ar = img.naturalHeight / img.naturalWidth;
        let maxPx = Infinity;
        if (maxHeight.endsWith("vh"))
          maxPx = (parseFloat(maxHeight) / 100) * window.innerHeight;
        else if (maxHeight.endsWith("px")) maxPx = parseFloat(maxHeight);
        setDimensions({ width: cw, height: Math.min(cw * ar, maxPx) });
      }
    };
    img.src = src;
  }, [src, maxHeight]);

  // Resize
  useEffect(() => {
    const onResize = () => {
      const img = imgRef.current;
      if (!containerRef.current || !img) return;
      const cw = containerRef.current.clientWidth;
      const ar = img.naturalHeight / img.naturalWidth;
      let maxPx = Infinity;
      if (maxHeight.endsWith("vh"))
        maxPx = (parseFloat(maxHeight) / 100) * window.innerHeight;
      else if (maxHeight.endsWith("px")) maxPx = parseFloat(maxHeight);
      setDimensions({ width: cw, height: Math.min(cw * ar, maxPx) });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [maxHeight]);

  // Mouse handlers write to refs — no re-renders
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current.x = e.clientX - r.left;
    mouseRef.current.y = e.clientY - r.top;
    mouseRef.current.active = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={alt}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: dimensions.height || "auto",
        }}
      />
    </div>
  );
}
