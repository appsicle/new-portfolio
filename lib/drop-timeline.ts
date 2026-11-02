// Cue sheet for /audio/drop.m4a (cut from 11.95s of the source track).
// All cue times below are relative to the drop (d = 0), measured from the
// audio's onsets.

/** Where the drop lands, in seconds into the clip */
export const DROP_AT = 3.94;
/** ~92 BPM */
export const BEAT = 0.652;

/** The three vocal stabs in the silence before the drop */
export const STABS = [2.79, 3.05, 3.47].map((t) => t - DROP_AT);
