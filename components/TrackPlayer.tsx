"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FieldClip, FieldControls } from "./HalftoneField";
import { DropAudio } from "@/lib/drop-audio";
import { BEAT, DROP_AT, STABS } from "@/lib/drop-timeline";

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

interface TrackPlayerProps {
  controls: React.MutableRefObject<FieldControls>;
  sectionRef: React.RefObject<HTMLElement>;
  panelRef: React.RefObject<HTMLElement>;
}

export default function TrackPlayer({ controls, sectionRef, panelRef }: TrackPlayerProps) {
  const audioRef = useRef<DropAudio | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "failed">("loading");
  const [music, setMusic] = useState<"none" | "playing" | "ended">("none");
  const [muted, setMuted] = useState(false);

  const meterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const a = (audioRef.current ??= new DropAudio("/audio/drop.m4a", 0.3));
    a.load().then((ok) => setLoadState(ok ? "ready" : "failed"));
    return () => a.stop();
  }, []);

  const play = () => {
    setMuted(false);
    audioRef.current?.play(0, () => setMusic("ended"));
    setMusic("playing");
  };

  const toggleMute = () => {
    const next = !muted;
    audioRef.current?.setMuted(next);
    setMuted(next);
  };

  // The driver: one rAF loop that keeps the field clipped to its panel and
  // turns the track (or, with no music, a silent clock) into water.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = performance.now();
    let bassSoft = 0;
    // Splashes fire once per cue; this remembers the last one fired
    let lastCue = "";

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
      const clip: FieldClip = {
        x: pr.left - sr.left,
        y: pr.top - sr.top,
        w: pr.width,
        h: pr.height,
        r: 8,
      };
      const center = { x: clip.x + pr.width / 2, y: clip.y + pr.height / 2 };

      const a = audioRef.current;
      const lv = a?.levels() ?? { bass: 0, mid: 0, high: 0 };
      bassSoft += (lv.bass - bassSoft) * Math.min(1, dt * 7);

      meterRefs.current.forEach((el, i) => {
        if (!el) return;
        const v = [lv.bass, lv.mid * 1.6, lv.high * 3][i];
        el.style.transform = `scaleY(${0.15 + 0.85 * clamp01(v)})`;
      });

      k.clip = clip;
      k.center = center;
      // Everything here is continuous — no cuts, no restarts. The beat only
      // drops splashes into the water and the waves do the rest.
      k.energy = Math.max(0.35, bassSoft * 0.9);
      k.zoom = 1 + bassSoft * 0.03;
      k.hue += dt * 0.015;

      const splash = (cue: string, x: number, y: number, strength: number, radius: number) => {
        if (cue === lastCue) return;
        lastCue = cue;
        if (!reduced.matches) k.splashes.push({ x, y, strength, radius });
      };
      // Smaller drops scattered around, like rain on the beat
      const rain = (cue: string, seed: number) => {
        const rx = Math.sin(seed * 12.9898) * 43758.5453;
        const ry = Math.sin(seed * 78.233) * 43758.5453;
        splash(
          cue,
          clip.x + clip.w * (0.2 + 0.6 * (rx - Math.floor(rx))),
          clip.y + clip.h * (0.2 + 0.6 * (ry - Math.floor(ry))),
          -1.3,
          2.4
        );
      };

      const d = a?.playing ? a.time() - DROP_AT : now / 1000;
      if (d >= 0) {
        const beat = Math.floor(d / BEAT);
        // Downbeat: a big drop dead center
        if (beat % 4 === 0) splash(`b${beat}`, center.x, center.y, -2.4, 3.2);
        else rain(`b${beat}`, beat);
      } else {
        const stab = STABS.filter((at) => d >= at).length;
        if (stab) rain(`s${stab}`, stab);
      }
    };
    // Run once now: the field must never draw a frame without its clip
    loop(last);
    return () => cancelAnimationFrame(raf);
  }, [controls, sectionRef, panelRef]);

  if (loadState === "failed") return null;

  return (
    <div
      className="fixed bottom-6 z-40 flex items-center gap-3 rounded-full border border-foreground/10 bg-background/70 py-1.5 pl-3 pr-1.5 text-[11px] text-muted-foreground backdrop-blur-md animate-fade-in-up"
      style={{ left: "clamp(1.5rem, 12vw, 12rem)" }}
    >
      {music === "playing" && (
        <span className="flex h-3 items-end gap-[2px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => {
                meterRefs.current[i] = el;
              }}
              className="h-full w-[2px] origin-bottom bg-foreground"
            />
          ))}
        </span>
      )}
      <span className="text-foreground">you broke my heart</span>
      <span className="hidden sm:inline">mylancore remix</span>
      {music === "playing" ? (
        <button
          type="button"
          onClick={toggleMute}
          className="rounded-full bg-foreground/10 px-2.5 py-1 text-foreground transition-colors hover:bg-foreground/20"
        >
          {muted ? "unmute" : "mute"}
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          disabled={loadState !== "ready"}
          className="rounded-full bg-foreground px-2.5 py-1 text-background transition-opacity disabled:opacity-40"
        >
          {music === "ended" ? "↺ replay" : "▶ play"}
        </button>
      )}
    </div>
  );
}
