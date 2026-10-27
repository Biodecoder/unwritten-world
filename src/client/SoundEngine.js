// Procedural WebAudio Synthesizer for Unwritten World

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true;
  }

  ensureContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.ensureContext();
      this.playChime(523.25, 0.12);
    }
    return this.muted;
  }

  playChime(freq = 440, duration = 0.15, type = 'triangle') {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playSlash() {
    this.playChime(280, 0.09, 'sawtooth');
  }

  playLevelUp() {
    this.playChime(587.33, 0.22, 'triangle');
  }
}
