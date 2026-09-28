// Cue sheet for /audio/drop.m4a (cut from 11.95s of the source track).
// All cue times below are relative to the drop (d = 0), measured from the
// audio's onsets — change the looks freely, not the numbers.

/** Where the drop lands, in seconds into the clip */
export const DROP_AT = 3.94;
/** ~92 BPM */
export const BEAT = 0.652;

/** Bass cuts out; the field drains away and the water goes still */
export const BASS_CUT = 2.2 - DROP_AT;
/** The three vocal stabs in the silence before the drop */
export const STABS = [2.79, 3.05, 3.47].map((t) => t - DROP_AT);

/**
 * A drop into the water. x/y are offsets from the center in units of the
 * viewport's short side; strength is negative (pushes the surface down).
 */
export type Drop = { x: number; y: number; strength: number; radius: number };

/** How long a droplet is visible falling before it hits */
export const FALL = 0.2;

/** One droplet per stab, escalating, landing off-center so the rings cross */
export const STAB_DROPS: Drop[] = [
  { x: -0.2, y: 0.06, strength: -1.8, radius: 2.4 },
  { x: 0.22, y: -0.08, strength: -2.2, radius: 2.8 },
  { x: 0.02, y: 0.16, strength: -2.6, radius: 3 },
];

/** The drop itself: the heaviest droplet, dead center */
export const DROP_DROP: Drop = { x: 0, y: 0, strength: -4.5, radius: 4.5 };

/**
 * One chord of drops per beat after the drop. Their rings interfere, so each
 * beat reads as its own pattern without drawing anything but water.
 */
const ring = (n: number, r: number, strength: number, radius: number, turn = 0): Drop[] =>
  Array.from({ length: n }, (_, i) => {
    const a = turn + (i / n) * Math.PI * 2;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, strength, radius };
  });

export const BEAT_DROPS: Drop[][] = [
  [DROP_DROP],
  ring(2, 0.28, -2.4, 3),
  ring(3, 0.3, -2.2, 3, -Math.PI / 2),
  ring(2, 0.28, -2.4, 3, Math.PI / 2),
  ring(4, 0.34, -2, 2.8, Math.PI / 4),
  [{ x: 0, y: 0, strength: -3, radius: 3.6 }, ...ring(3, 0.4, -1.8, 2.6, Math.PI / 2)],
  [...ring(4, 0.22, -2, 2.8), ...ring(4, 0.44, -1.8, 2.6, Math.PI / 4)],
];

/** Bass drops out for half a bar */
export const DIP = 7 * BEAT - 0.02;

/** Bass re-enters: the field folds down into the page */
export const SETTLE = 5.16;
export const SETTLE_DURATION = 0.7;

/** Where the "i'm in a meeting" / skip path joins the timeline (silently) */
export const QUIET_ENTRY = SETTLE - 0.55;
