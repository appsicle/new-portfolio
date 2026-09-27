import { Shape } from "@/components/HalftoneField";

// Cue sheet for /audio/drop.m4a (cut from 11.95s of the source track).
// All cue times below are relative to the drop (d = 0), measured from the
// audio's onsets — change the looks freely, not the numbers.

/** Where the drop lands, in seconds into the clip */
export const DROP_AT = 3.94;
/** ~92 BPM */
export const BEAT = 0.652;

/** Bass cuts out; field starts collapsing into the orb */
export const BASS_CUT = 2.2 - DROP_AT;
/** The three vocal stabs in the silence before the drop */
export const STABS = [2.79, 3.05, 3.47].map((t) => t - DROP_AT);
/** A figure blooms out of the orb on each stab, escalating */
export const STAB_SHAPES = [Shape.ring, Shape.diamond, Shape.spokes];

export type BeatLook = { shape: number; kaleido?: number; coarse?: number };

/** One look per beat after the drop */
export const BEAT_LOOKS: BeatLook[] = [
  { shape: Shape.ring, kaleido: 6 },
  { shape: Shape.tunnel },
  { shape: Shape.bars, kaleido: 8 },
  { shape: Shape.cross },
  { shape: Shape.triangle, kaleido: 3 },
  { shape: Shape.diamond, coarse: 3 },
  { shape: Shape.spokes, kaleido: 12 },
];

/** Bass drops out for half a bar */
export const DIP = 7 * BEAT - 0.02;

/** Bass re-enters: the field folds down into the page */
export const SETTLE = 5.16;
export const SETTLE_DURATION = 0.7;

/** Where the "i'm in a meeting" / skip path joins the timeline (silently) */
export const QUIET_ENTRY = SETTLE - 0.55;
