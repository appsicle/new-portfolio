// A light-gray knit fitness band, rendered with three.js. Loaded lazily by BandSpinner.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Wrist loop (an ellipse in the XZ plane) and strap cross-section, in scene units.
const A = 1; // half-width of the loop
const B = 0.8; // half-depth (wrists are oval)
const HALF_W = 0.145; // half the strap's width (along Y)
const HALF_T = 0.024; // half the strap's thickness
const CORNER = 0.018; // rounding on the strap's edges
const LOOP_SEGMENTS = 360;

/** Points around a rounded-rectangle cross-section, with outward normals. x is radial, y is up. */
function strapProfile(steps = 8) {
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];
  const cx = HALF_T - CORNER, cy = HALF_W - CORNER;
  const corners = [
    [cx, cy, 0],
    [-cx, cy, Math.PI / 2],
    [-cx, -cy, Math.PI],
    [cx, -cy, (3 * Math.PI) / 2],
  ] as const;
  for (const [ox, oy, a0] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (i / steps) * (Math.PI / 2);
      const nx = Math.cos(a), ny = Math.sin(a);
      pts.push({ x: ox + nx * CORNER, y: oy + ny * CORNER, nx, ny });
    }
  }
  pts.push(pts[0]); // close the loop for UVs
  return pts;
}

/** Sweeps the strap profile around the wrist ellipse, with UVs that run along the strap. */
function strapGeometry() {
  const profile = strapProfile();
  const P = profile.length;
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= LOOP_SEGMENTS; i++) {
    const t = (i / LOOP_SEGMENTS) * Math.PI * 2;
    const cx = A * Math.cos(t), cz = B * Math.sin(t);
    const nl = Math.hypot(B * Math.cos(t), A * Math.sin(t));
    const rx = (B * Math.cos(t)) / nl, rz = (A * Math.sin(t)) / nl; // outward, in-plane
    profile.forEach((p, j) => {
      pos.push(cx + rx * p.x, p.y, cz + rz * p.x);
      nor.push(rx * p.nx, p.ny, rz * p.nx);
      uv.push(i / LOOP_SEGMENTS, j / (P - 1));
    });
  }
  for (let i = 0; i < LOOP_SEGMENTS; i++) {
    for (let j = 0; j < P - 1; j++) {
      const a = i * P + j, b = (i + 1) * P + j;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** Knit stitch texture: rows of small V-shaped loops, drawn once to a canvas and used as a bump map. */
function knitTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6e6e6e";
  ctx.fillRect(0, 0, c.width, c.height);
  const sw = 8, sh = 8; // one stitch cell
  for (let y = 0; y < c.height; y += sh) {
    for (let x = 0; x < c.width; x += sw) {
      for (const side of [-1, 1]) {
        const g = ctx.createRadialGradient(x + sw / 2 + side * 1.6, y + sh / 2, 0, x + sw / 2 + side * 1.6, y + sh / 2, sh * 0.6);
        g.addColorStop(0, "#f2f2f2");
        g.addColorStop(1, "rgba(110,110,110,0)");
        ctx.save();
        ctx.translate(x + sw / 2 + side * 1.6, y + sh / 2);
        ctx.rotate(side * 0.55);
        ctx.scale(0.55, 1);
        ctx.translate(-(x + sw / 2 + side * 1.6), -(y + sh / 2));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x + sw / 2 + side * 1.6, y + sh / 2, sh * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 1);
  tex.anisotropy = 8;
  return tex;
}

export type BandScene = { render: (dt: number) => void; resize: () => void; refresh: () => void; dispose: () => void };

export function createBandScene(canvas: HTMLCanvasElement): BandScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 1.15, 3.55);
  camera.lookAt(0, -0.08, 0);

  // Soft key light from above-left that casts the contact shadow.
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.2, 4, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 10 });
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5a5a5a, 0.25));
  // Cool rim light from behind to separate the band from the page.
  const rim = new THREE.DirectionalLight(0xdfe8ff, 1.2);
  rim.position.set(2.5, 1.5, -3);
  scene.add(rim);

  const band = new THREE.Group();
  scene.add(band);

  // Knit strap
  const bump = knitTexture();
  const strapMat = new THREE.MeshPhysicalMaterial({
    color: 0xbcbec2,
    roughness: 0.95,
    bumpMap: bump,
    bumpScale: 1.1,
    sheen: 0.7,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(0xe8eaee),
  });
  const strap = new THREE.Mesh(strapGeometry(), strapMat);
  strap.castShadow = true;
  strap.receiveShadow = true;
  band.add(strap);

  // Sensor pod on the outside of the strap, at the front of the loop.
  const podMat = new THREE.MeshPhysicalMaterial({
    color: 0xc8cacd,
    roughness: 0.42,
    metalness: 0.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
  });
  const pod = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.27, 0.1, 10, 0.045), podMat);
  pod.position.set(0, 0, B + HALF_T + 0.03);
  pod.castShadow = true;
  band.add(pod);

  // A thin satin bezel around the pod's face.
  const bezel = new THREE.Mesh(
    new RoundedBoxGeometry(0.54, 0.21, 0.02, 6, 0.01),
    new THREE.MeshPhysicalMaterial({ color: 0xc9cacd, roughness: 0.2, metalness: 0.6, clearcoat: 1 })
  );
  bezel.position.set(0, 0, pod.position.z + 0.047);
  band.add(bezel);

  // Small brushed-metal clasp at the back of the loop.
  const clasp = new THREE.Mesh(
    new RoundedBoxGeometry(0.14, 0.33, 0.04, 6, 0.016),
    new THREE.MeshPhysicalMaterial({ color: 0xd9dbde, roughness: 0.35, metalness: 0.85 })
  );
  clasp.position.set(0, 0, -(B + HALF_T + 0.012));
  clasp.castShadow = true;
  band.add(clasp);

  // Invisible floor that only shows the soft shadow.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.22 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -HALF_W - 0.002;
  floor.receiveShadow = true;
  scene.add(floor);

  band.rotation.y = 0.6;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  return {
    render(dt) {
      band.rotation.y += dt * 0.35;
      renderer.render(scene, camera);
    },
    resize,
    // Reassigning the canvas size reallocates its drawing buffer, so the browser composites a fresh layer.
    refresh() {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      bump.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
