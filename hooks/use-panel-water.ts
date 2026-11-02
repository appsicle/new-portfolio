import { useEffect, type MutableRefObject, type RefObject } from "react";
import type { FieldControls } from "@/components/HalftoneField";

/** Seconds between drops */
const BEAT = 0.652;

/** Keeps the field clipped to its panel and rains drops into the water. */
export function usePanelWater(
  controls: MutableRefObject<FieldControls>,
  sectionRef: RefObject<HTMLElement>,
  panelRef: RefObject<HTMLElement>
) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = performance.now();
    let lastBeat = -1;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const k = controls.current;
      const sec = sectionRef.current;
      const panel = panelRef.current;
      if (!sec || !panel) return;

      const sr = sec.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const clip = { x: pr.left - sr.left, y: pr.top - sr.top, w: pr.width, h: pr.height, r: 8 };
      k.clip = clip;
      k.hue += dt * 0.015;

      const beat = Math.floor(now / 1000 / BEAT);
      if (beat === lastBeat) return;
      lastBeat = beat;
      if (reduced.matches) return;
      if (beat % 4 === 0) {
        // Downbeat: a big drop dead center
        k.splashes.push({ x: clip.x + clip.w / 2, y: clip.y + clip.h / 2, strength: -2.4, radius: 3.2 });
      } else {
        // Other beats: smaller drops scattered around, like rain
        const rx = Math.sin(beat * 12.9898) * 43758.5453;
        const ry = Math.sin(beat * 78.233) * 43758.5453;
        k.splashes.push({
          x: clip.x + clip.w * (0.2 + 0.6 * (rx - Math.floor(rx))),
          y: clip.y + clip.h * (0.2 + 0.6 * (ry - Math.floor(ry))),
          strength: -1.3,
          radius: 2.4,
        });
      }
    };
    // Run once now: the field must never draw a frame without its clip
    loop(last);
    return () => cancelAnimationFrame(raf);
  }, [controls, sectionRef, panelRef]);
}
