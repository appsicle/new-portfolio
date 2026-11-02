import { useEffect, type MutableRefObject, type RefObject } from "react";
import type { FieldControls } from "@/components/HalftoneField";

/** Keeps the field clipped to its panel. */
export function usePanelClip(
  controls: MutableRefObject<FieldControls>,
  sectionRef: RefObject<HTMLElement>,
  panelRef: RefObject<HTMLElement>
) {
  useEffect(() => {
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const sec = sectionRef.current;
      const panel = panelRef.current;
      if (!sec || !panel) return;

      const sr = sec.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      controls.current.clip = { x: pr.left - sr.left, y: pr.top - sr.top, w: pr.width, h: pr.height, r: 8 };
    };
    // Run once now: the field must never draw a frame without its clip
    loop();
    return () => cancelAnimationFrame(raf);
  }, [controls, sectionRef, panelRef]);
}
