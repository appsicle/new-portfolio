"use client";

import { useEffect, useRef } from "react";
import type { BandScene } from "./band-scene";

// A slowly turning 3D band. three.js loads only once the footer scrolls into view.
export default function BandSpinner({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: BandScene | null = null;
    let raf = 0, last = 0, visible = false, disposed = false, loading = false;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      scene?.render(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!scene || !visible || document.hidden) return;
      if (reduce) return scene.render(0);
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      async ([e]) => {
        visible = e.isIntersecting;
        if (visible && !scene && !loading) {
          loading = true;
          const { createBandScene } = await import("./band-scene");
          if (disposed) return;
          scene = createBandScene(canvas);
        }
        start();
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      scene?.resize();
      if (reduce) scene?.render(0);
    });
    ro.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);

    // The theme toggle runs a view transition, and some browsers leave a WebGL canvas showing the
    // transition's frozen snapshot afterwards. Once it has finished, rebuild the drawing surface and restart.
    let refreshTimer = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        scene?.refresh();
        start();
      }, 600);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mo.disconnect();
      window.clearTimeout(refreshTimer);
      scene?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A light gray fitness band slowly turning"
      className={className ?? "h-[200px] w-[340px] max-w-full"}
    />
  );
}
