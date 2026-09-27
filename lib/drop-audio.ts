// Sample-accurate playback for the intro track. Visuals read `time()` every
// frame, which is derived from the AudioContext clock (not <audio>.currentTime,
// which updates in coarse steps), and corrected for output latency so cues
// land when you *hear* them — including on Bluetooth headphones.

export type Levels = { bass: number; mid: number; high: number };

export class DropAudio {
  private ctx: AudioContext | null = null;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private bins = new Uint8Array(0);
  private startAt = 0;
  private loading: Promise<boolean> | null = null;
  playing = false;

  /** @param volume default output level, 0..1 */
  constructor(private url: string, private volume = 1) {}

  /** Fetch + decode. Safe to call before a user gesture (context starts suspended). */
  load(): Promise<boolean> {
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctor();
        const res = await fetch(this.url);
        const data = await res.arrayBuffer();
        this.buffer = await ctx.decodeAudioData(data);
        this.ctx = ctx;

        this.gain = ctx.createGain();
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.55;
        this.bins = new Uint8Array(this.analyser.frequencyBinCount);
        // Analyser sits before the gain so visuals don't depend on volume
        this.analyser.connect(this.gain);
        this.gain.connect(ctx.destination);
        return true;
      } catch {
        return false;
      }
    })();
    return this.loading;
  }

  get ready() {
    return !!this.buffer;
  }

  get duration() {
    return this.buffer?.duration ?? 0;
  }

  /** Must be called from a user gesture the first time. */
  play(offset = 0, onEnded?: () => void) {
    const { ctx, buffer, gain } = this;
    if (!ctx || !buffer || !gain) return;
    this.stop();
    void ctx.resume();
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(this.volume, ctx.currentTime);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.analyser!);
    const when = ctx.currentTime + 0.06;
    src.start(when, offset);
    src.onended = () => {
      if (this.source === src) {
        this.playing = false;
        onEnded?.();
      }
    };
    this.source = src;
    this.startAt = when - offset;
    this.playing = true;
  }

  fadeOut(seconds = 0.6) {
    const { ctx, gain, source } = this;
    if (!ctx || !gain || !source) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    source.stop(now + seconds + 0.05);
  }

  stop() {
    if (this.source) {
      this.source.onended = null;
      try {
        this.source.stop();
      } catch {}
      this.source.disconnect();
      this.source = null;
    }
    this.playing = false;
  }

  setMuted(muted: boolean) {
    const { ctx, gain } = this;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(muted ? 0 : this.volume, ctx.currentTime, 0.04);
  }

  /** Seconds into the clip, as heard. */
  time() {
    const ctx = this.ctx;
    if (!ctx) return 0;
    const latency = ctx.outputLatency || ctx.baseLatency || 0;
    return ctx.currentTime - this.startAt - latency;
  }

  /** Rough 0..1 band energies from the live signal. */
  levels(): Levels {
    const a = this.analyser;
    if (!a || !this.playing) return { bass: 0, mid: 0, high: 0 };
    a.getByteFrequencyData(this.bins);
    // 1024 fft @ 44.1/48k → ~45Hz per bin
    const avg = (from: number, to: number) => {
      let s = 0;
      for (let i = from; i < to; i++) s += this.bins[i];
      return s / ((to - from) * 255);
    };
    return { bass: avg(1, 4), mid: avg(4, 48), high: avg(48, 200) };
  }
}
