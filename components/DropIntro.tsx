"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { FieldClip, FieldControls } from "./HalftoneField";
import { DropAudio } from "@/lib/drop-audio";
import {
  BASS_CUT,
  BEAT,
  BEAT_DROPS,
  DIP,
  DROP_AT,
  DROP_DROP,
  FALL,
  QUIET_ENTRY,
  SETTLE,
  SETTLE_DURATION,
  STAB_DROPS,
  STABS,
  type Drop,
} from "@/lib/drop-timeline";

type Phase = "gate" | "intro" | "settled";

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInCubic = (t: number) => t * t * t;
const easeInQuad = (t: number) => t * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpClip = (a: FieldClip, b: FieldClip, t: number): FieldClip => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
});

/** Last step the content reveal reaches (heading → experience → socials) */
const LAST_STEP = 3;

/** Every droplet before the drop: one per stab, then the drop itself at d = 0 */
const LANDINGS = [...STABS.map((at, i) => ({ at, drop: STAB_DROPS[i] })), { at: 0, drop: DROP_DROP }];

interface DropIntroProps {
  controls: React.MutableRefObject<FieldControls>;
  sectionRef: React.RefObject<HTMLElement>;
  panelRef: React.RefObject<HTMLElement>;
  /** Wrapper around the field canvas; gets the screen shake */
  fieldRef: React.RefObject<HTMLElement>;
  onStep: (step: number) => void;
}

export default function DropIntro({
  controls,
  sectionRef,
  panelRef,
  fieldRef,
  onStep,
}: DropIntroProps) {
  const audioRef = useRef<DropAudio | null>(null);
  const [phase, setPhase] = useState<Phase>("gate");
  const phaseRef = useRef<Phase>("gate");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "failed">("loading");
  const [music, setMusic] = useState<"none" | "playing" | "ended">("none");
  const [muted, setMuted] = useState(false);

  // Timeline clock: the audio clock when there's sound, performance.now() otherwise
  const clock = useRef({
    mode: "perf" as "audio" | "perf" | "frozen",
    perfStart: 0,
    perfOffset: 0,
  });
  const quietRef = useRef(false);
  const stepRef = useRef(0);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const sinceRef = useRef<HTMLSpanElement>(null);
  const meterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const setStep = useCallback((s: number) => {
    if (stepRef.current === s) return;
    stepRef.current = s;
    onStepRef.current(s);
  }, []);

  const perfClock = (from: number) => {
    clock.current = { mode: "perf", perfStart: performance.now(), perfOffset: from };
  };

  useEffect(() => {
    const a = (audioRef.current ??= new DropAudio("/audio/drop.m4a", 0.3));
    a.load().then((ok) => setLoadState(ok ? "ready" : "failed"));
    return () => a.stop();
  }, []);

  const start = useCallback(
    (withSound: boolean) => {
      window.scrollTo(0, 0);
      document.documentElement.dataset.intro = "night";
      setStep(0);
      setMuted(false);
      const a = audioRef.current;
      quietRef.current = !withSound;
      if (withSound && a?.ready) {
        a.play(0, () => setMusic("ended"));
        clock.current.mode = "audio";
        setMusic("playing");
      } else if (withSound) {
        // Audio failed to load — run the whole thing silently
        perfClock(-DROP_AT);
      } else {
        perfClock(QUIET_ENTRY);
      }
      go("intro");
    },
    [go, setStep]
  );

  const timeline = useCallback(() => {
    const c = clock.current;
    if (c.mode === "frozen") return c.perfOffset;
    return c.mode === "audio"
      ? (audioRef.current?.time() ?? 0) - DROP_AT
      : (performance.now() - c.perfStart) / 1000 + c.perfOffset;
  }, []);

  // Dev-only tuning hook: __drop.freeze(-1.1) pins the timeline at that
  // moment (relative to the drop); __drop.seek(d) runs silently from there.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as { __drop?: unknown };
    w.__drop = {
      freeze: (d: number) => {
        document.documentElement.dataset.intro = "night";
        clock.current = { mode: "frozen", perfStart: 0, perfOffset: d };
        go(d >= SETTLE + (LAST_STEP - 1) * BEAT ? "settled" : "intro");
      },
      /** Drop into the panel's water; fx/fy are 0..1 across the panel */
      splash: (fx = 0.5, fy = 0.5, strength = -2.4, radius = 3.2) => {
        const sec = sectionRef.current?.getBoundingClientRect();
        const pr = panelRef.current?.getBoundingClientRect();
        if (!sec || !pr) return;
        controls.current.splashes.push({
          x: pr.left - sec.left + pr.width * fx,
          y: pr.top - sec.top + pr.height * fy,
          strength,
          radius,
        });
      },
      seek: (d: number) => {
        document.documentElement.dataset.intro = "night";
        stepRef.current = 0;
        onStepRef.current(0);
        perfClock(d);
        go("intro");
      },
    };
    return () => {
      delete w.__drop;
    };
  }, [go, controls, sectionRef, panelRef]);

  const skip = useCallback(() => {
    if (phaseRef.current !== "intro") return;
    audioRef.current?.fadeOut(0.35);
    quietRef.current = true;
    perfClock(Math.max(timeline(), QUIET_ENTRY));
  }, [timeline]);

  const toggleMute = () => {
    const next = !muted;
    audioRef.current?.setMuted(next);
    setMuted(next);
  };

  // Keyboard: enter = play, esc = skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      if (e.key === "Enter" && phaseRef.current === "gate" && loadState !== "loading") {
        start(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip, start, loadState]);

  // The driver: one rAF loop that turns timeline position into field
  // controls and screen shake.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = performance.now();
    let bass = 0;
    let bassSoft = 0;
    // Splashes fire once per cue; this remembers the last one fired
    let lastSplash = "";
    const splash = (key: string, x: number, y: number, strength: number, radius: number) => {
      if (key === lastSplash) return;
      lastSplash = key;
      if (!reduced.matches) controls.current.splashes.push({ x, y, strength, radius });
    };
    /** Cue drops are placed relative to the view center, in short-side units */
    const place = (drop: Drop, center: { x: number; y: number }) => {
      const s = Math.min(window.innerWidth, window.innerHeight);
      return { x: center.x + drop.x * s, y: center.y + drop.y * s };
    };
    const splashAll = (key: string, drops: Drop[], center: { x: number; y: number }) => {
      if (key === lastSplash) return;
      lastSplash = key;
      if (reduced.matches) return;
      for (const drop of drops) {
        controls.current.splashes.push({ ...place(drop, center), strength: drop.strength, radius: drop.radius });
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const k = controls.current;
      const sec = sectionRef.current;
      const panel = panelRef.current;
      const wrap = fieldRef.current;
      if (!sec || !panel || !wrap) return;

      const sr = sec.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const panelClip: FieldClip = {
        x: pr.left - sr.left,
        y: pr.top - sr.top,
        w: pr.width,
        h: pr.height,
        r: 8,
      };
      const panelCenter = { x: panelClip.x + pr.width / 2, y: panelClip.y + pr.height / 2 };
      const viewClip: FieldClip = { x: -sr.left, y: -sr.top, w: window.innerWidth, h: window.innerHeight, r: 0 };
      const viewCenter = { x: viewClip.x + viewClip.w / 2, y: viewClip.y + viewClip.h / 2 };

      const a = audioRef.current;
      const lv = a?.levels() ?? { bass: 0, mid: 0, high: 0 };
      bass += (lv.bass - bass) * 0.5;
      bassSoft += (lv.bass - bassSoft) * Math.min(1, dt * 7);

      meterRefs.current.forEach((el, i) => {
        if (!el) return;
        const v = [lv.bass, lv.mid * 1.6, lv.high * 3][i];
        el.style.transform = `scaleY(${0.15 + 0.85 * clamp01(v)})`;
      });

      const phase = phaseRef.current;
      k.shock = 99;
      k.shockPower = 0;
      k.flash = 0;
      k.glitch = 0;
      k.reveal = 1;
      k.coarse = 1;
      k.bead = null;

      if (phase === "gate") {
        k.night = 1;
        k.clip = null;
        k.center = viewCenter;
        k.collapse = 1;
        k.orb = 0; // the play button stands in for the orb
        k.energy = 0;
        k.zoom = 1;
        wrap.style.transform = "";
        return;
      }

      const d = timeline();

      if (phase === "settled") {
        k.night = 0;
        k.clip = panelClip;
        k.center = panelCenter;
        k.collapse = 0;
        k.orb = 0;
        // Everything here is continuous — no cuts, no restarts. The beat
        // only drops splashes into the water and the waves do the rest.
        k.energy = Math.max(0.35, bassSoft * 0.9);
        k.zoom = 1 + bassSoft * 0.03;
        k.hue += dt * 0.015;
        if (a?.playing && clock.current.mode === "audio" && d > 0) {
          const beat = Math.floor(d / BEAT);
          if (beat % 4 === 0) {
            // Downbeat: a big drop dead center
            splash(`b${beat}`, panelCenter.x, panelCenter.y, -2.4, 3.2);
          } else {
            // Other beats: smaller drops scattered around, like rain on the beat
            const rx = Math.sin(beat * 12.9898) * 43758.5453;
            const ry = Math.sin(beat * 78.233) * 43758.5453;
            splash(
              `b${beat}`,
              panelClip.x + panelClip.w * (0.2 + 0.6 * (rx - Math.floor(rx))),
              panelClip.y + panelClip.h * (0.2 + 0.6 * (ry - Math.floor(ry))),
              -1.3,
              2.4
            );
          }
        }
        if (sinceRef.current) {
          sinceRef.current.textContent =
            a?.playing && clock.current.mode === "audio" && !quietRef.current
              ? `the drop was ${Math.max(0, Math.floor(d))}s ago`
              : "";
        }
        return;
      }

      // --- intro ---
      let shake = 0;
      k.night = 1;
      k.clip = null;
      k.center = viewCenter;

      if (d < BASS_CUT) {
        // Build: the field blooms out of the orb and slowly pushes in
        const t = d + DROP_AT;
        const bloom = easeOutExpo(clamp01(t / 1.4));
        k.collapse = 1 - bloom;
        k.orb = 32 * (1 - bloom); // starts at the play button's size
        k.energy = bass;
        k.zoom = 1 + 0.18 * clamp01(t / (BASS_CUT + DROP_AT));
        k.hue = t * 0.03;
      } else if (d < 0) {
        // Bass cut: the field drains into the orb and the orb sinks, leaving
        // still black water. Each stab is a droplet falling into it; the last
        // and heaviest one lands on the drop.
        const c = easeInCubic(clamp01((d - BASS_CUT) / 0.55));
        k.collapse = c;
        k.energy = bass * (1 - c);
        k.orb = c * 12 * clamp01((STABS[0] - FALL - d) / 0.25);
        k.zoom = 1.18;
        LANDINGS.forEach(({ at, drop }) => {
          if (d < at - FALL || d >= at) return;
          const heavy = at === 0;
          const pos = place(drop, viewCenter);
          const t = (d - (at - FALL)) / FALL;
          k.bead = {
            x: pos.x,
            y: lerp(viewClip.y - 40, pos.y, easeInQuad(t)),
            r: heavy ? 9 : 5,
            tail: (heavy ? 160 : 90) * t,
          };
        });
        // The most recent stab has landed: splash it once
        let landed = -1;
        STABS.forEach((at, i) => d >= at && (landed = i));
        let pulse = 0;
        if (landed >= 0) {
          splashAll(`s${landed}`, [STAB_DROPS[landed]], viewCenter);
          pulse = Math.exp(-(d - STABS[landed]) * 12);
        }
        k.glitch = pulse * 0.25;
        shake = pulse * 5;
      } else if (d < DIP) {
        // THE DROP — one hit per beat
        const beat = Math.floor(d / BEAT);
        const age = d - beat * BEAT;
        const first = beat === 0;
        k.collapse = 0;
        k.orb = 0;
        // The water does the work: the first beat also gets the big shockwave
        k.shock = first ? age : 99;
        k.shockPower = first ? 2.4 : 0;
        k.flash = first ? Math.exp(-age * 6) * 0.9 : 0;
        k.glitch = Math.exp(-age * 7) * (first ? 1 : 0.6);
        k.zoom = 1 + (first ? 0.25 : 0.12) * Math.exp(-age * 6);
        k.hue = 0.2 + beat * 0.23;
        k.energy = Math.max(0.55, bass);
        shake = (first ? 28 : 12) * Math.exp(-age * 9);
        const drops = BEAT_DROPS[beat];
        if (drops) splashAll(`d${beat}`, drops, viewCenter);
      } else if (d < SETTLE) {
        // Half-bar gap: the field goes chunky and dissolves back into the orb
        const t = d - DIP;
        const c = quietRef.current ? 1 : easeInCubic(clamp01(t / 0.55));
        k.collapse = c;
        k.orb = c * 16;
        k.glitch = quietRef.current ? 0 : 0.3 * Math.exp(-t * 8);
        k.zoom = 1 + (quietRef.current ? 0 : 0.12 * Math.exp(-t * 6));
        k.energy = bass * (1 - c);
        k.coarse = 1 + 4 * c;
      } else {
        // Re-entry: shockwave, and the field folds down into its panel
        const t = d - SETTLE;
        const p = easeOutExpo(clamp01(t / SETTLE_DURATION));
        if (document.documentElement.dataset.intro) {
          delete document.documentElement.dataset.intro;
        }
        k.collapse = 0;
        k.orb = 0;
        k.shock = t;
        k.shockPower = 1.8;
        splash("settle", viewCenter.x, viewCenter.y, -3.5, 4);
        k.flash = Math.exp(-t * 9) * 0.6;
        k.glitch = 0.8 * Math.exp(-t * 7);
        k.zoom = 1 + 0.1 * Math.exp(-t * 5);
        k.night = 1 - p;
        k.clip = lerpClip(viewClip, panelClip, p);
        k.center = { x: lerp(viewCenter.x, panelCenter.x, p), y: lerp(viewCenter.y, panelCenter.y, p) };
        k.energy = bass;
        setStep(Math.min(LAST_STEP, 1 + Math.floor(t / BEAT)));
        if (t >= (LAST_STEP - 1) * BEAT + 0.05) {
          setStep(LAST_STEP);
          go("settled");
        }
      }

      if (reduced.matches) {
        shake = 0;
        k.flash = 0;
        k.glitch *= 0.3;
      }
      const transform = shake
        ? `translate3d(${(Math.random() * 2 - 1) * shake}px, ${(Math.random() * 2 - 1) * shake}px, 0)`
        : "";
      wrap.style.transform = transform;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [controls, sectionRef, panelRef, fieldRef, timeline, go, setStep]);

  return (
    <>
      {phase === "gate" && (
        <button
          type="button"
          onClick={() => start(true)}
          disabled={loadState === "loading"}
          aria-label="Play"
          className="drop-play fixed left-1/2 top-1/2 z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:opacity-30"
        >
          <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden className="ml-1">
            <path d="M0 0 L20 11 L0 22 Z" fill="currentColor" />
          </svg>
        </button>
      )}

      {phase === "intro" && (
        <button
          type="button"
          onClick={skip}
          className="fixed right-6 top-6 z-40 text-xs text-white/30 transition-colors hover:text-white"
        >
          skip
        </button>
      )}

      {phase === "settled" && (
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
          <span ref={sinceRef} className="hidden tabular-nums md:inline" />
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
              onClick={() => start(true)}
              disabled={loadState !== "ready"}
              className="rounded-full bg-foreground px-2.5 py-1 text-background transition-opacity disabled:opacity-40"
            >
              {music === "ended" ? "↺ replay the drop" : "▶ play the drop"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
