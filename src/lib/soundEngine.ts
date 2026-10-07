// High-Fidelity Procedural Web Audio Engine for ADHDLY
// 100% legal, zero external network requests, zero copyright issues, works completely offline.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private channels: Map<string, { gain: GainNode; nodes: AudioNode[]; stopFn: () => void }> = new Map();
  private timerId: NodeJS.Timeout | null = null;
  public isRunning: boolean = false;

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.ctx) this.initContext();
    return this.analyser;
  }

  // Seamless long noise buffer (12 seconds with cosine crossfade window to ensure zero clicking)
  private createSeamlessBrownNoiseBuffer(duration = 10): AudioBuffer {
    if (!this.ctx) this.initContext();
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Leaky integrator for true 1/f^2 Brown Noise
        lastOut = (lastOut + 0.025 * white) / 1.02;
        data[i] = lastOut * 3.8;
      }

      // Smooth cosine crossfade edge (last 0.5s into first 0.5s) to guarantee zero click
      const fadeSamples = Math.floor(sampleRate * 0.5);
      for (let i = 0; i < fadeSamples; i++) {
        const t = i / fadeSamples;
        const gainIn = 0.5 * (1 - Math.cos(Math.PI * t));
        const gainOut = 1 - gainIn;
        const targetEnd = bufferSize - fadeSamples + i;
        const blended = data[i] * gainIn + data[targetEnd] * gainOut;
        data[i] = blended;
        data[targetEnd] = blended;
      }
    }
    return buffer;
  }

  // Seamless soft rain buffer with random droplet frequency modulation
  private createRainBuffer(duration = 10): AudioBuffer {
    if (!this.ctx) this.initContext();
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.05;
        b1 = 0.985 * b1 + white * 0.12;
        b2 = 0.950 * b2 + white * 0.25;
        // Random soft rain drop envelope spikes
        const drop = (Math.random() > 0.9996) ? (Math.random() * 0.4) : 0;
        data[i] = (b0 + b1 + b2) * 0.25 + drop;
      }
    }
    return buffer;
  }

  public setMasterVolume(vol: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public setChannelVolume(channelId: string, vol: number) {
    this.initContext();
    const ch = this.channels.get(channelId);
    if (ch && this.ctx) {
      ch.gain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public startChannel(type: string, volume: number = 0.5) {
    this.initContext();
    const ctx = this.ctx!;
    if (this.channels.has(type)) {
      this.setChannelVolume(type, volume);
      return;
    }

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(volume, ctx.currentTime);
    channelGain.connect(this.masterGain!);

    const nodes: AudioNode[] = [];
    let stopFn: () => void = () => {};

    if (type === 'brown') {
      // Warm, deep lowpass Butterworth filter (sub-bass grounding)
      const buffer = this.createSeamlessBrownNoiseBuffer(8);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lpFilter1 = ctx.createBiquadFilter();
      lpFilter1.type = 'lowpass';
      lpFilter1.frequency.setValueAtTime(280, ctx.currentTime);
      lpFilter1.Q.setValueAtTime(1.0, ctx.currentTime);

      const lpFilter2 = ctx.createBiquadFilter();
      lpFilter2.type = 'lowpass';
      lpFilter2.frequency.setValueAtTime(200, ctx.currentTime);

      source.connect(lpFilter1);
      lpFilter1.connect(lpFilter2);
      lpFilter2.connect(channelGain);

      source.start();
      nodes.push(source, lpFilter1, lpFilter2);
      stopFn = () => { try { source.stop(); } catch {} };

    } else if (type === 'rain') {
      const buffer = this.createRainBuffer(8);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);

      source.connect(filter);
      filter.connect(channelGain);

      source.start();
      nodes.push(source, filter);
      stopFn = () => { try { source.stop(); } catch {} };

    } else if (type === 'binaural') {
      // 10Hz Alpha Focus Waves (200Hz Left / 210Hz Right)
      const merger = ctx.createChannelMerger(2);

      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(190, ctx.currentTime);

      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(200, ctx.currentTime); // 10Hz Alpha difference

      // Gentle sub warm oscillator
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(95, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.3, ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(channelGain);

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(channelGain);

      oscL.start();
      oscR.start();
      subOsc.start();
      nodes.push(oscL, oscR, subOsc, subGain, merger);
      stopFn = () => {
        try { oscL.stop(); oscR.stop(); subOsc.stop(); } catch {}
      };

    } else if (type === 'drone') {
      // Cozy warm ambient chord drone (F - C - G triad)
      const freqs = [174.61, 261.63, 392.00]; // F3, C4, G4
      const oscs = freqs.map(f => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        return osc;
      });

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Slow 8-second breathing filter

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);
      lfo.connect(lfoGain);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      lfoGain.connect(filter.frequency);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.25, ctx.currentTime);

      oscs.forEach(o => o.connect(filter));
      filter.connect(droneGain);
      droneGain.connect(channelGain);

      oscs.forEach(o => o.start());
      lfo.start();
      nodes.push(...oscs, lfo, lfoGain, filter, droneGain);
      stopFn = () => {
        try { oscs.forEach(o => o.stop()); lfo.stop(); } catch {}
      };

    } else if (type === 'cafe') {
      // Warm atmospheric cafe murmur
      const buffer = this.createSeamlessBrownNoiseBuffer(8);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(480, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

      source.connect(bandpass);
      bandpass.connect(channelGain);
      source.start();
      nodes.push(source, bandpass);
      stopFn = () => { try { source.stop(); } catch {} };

    } else if (type === 'pink') {
      const buffer = this.createRainBuffer(8);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(600, ctx.currentTime);

      source.connect(lp);
      lp.connect(channelGain);
      source.start();
      nodes.push(source, lp);
      stopFn = () => { try { source.stop(); } catch {} };
    }

    this.channels.set(type, { gain: channelGain, nodes, stopFn });
    this.isRunning = true;
  }

  public stopChannel(type: string) {
    const ch = this.channels.get(type);
    if (ch) {
      if (ch.stopFn) ch.stopFn();
      if (this.ctx) {
        ch.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      }
      this.channels.delete(type);
    }
    if (this.channels.size === 0) {
      this.isRunning = false;
    }
  }

  public stopAll() {
    this.channels.forEach((ch) => {
      if (ch.stopFn) ch.stopFn();
    });
    this.channels.clear();
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Harmonic Tibetan Singing Bowl Chime (528Hz Solfeggio Love/Clarity frequency)
  public playBellTone(freq = 528, volume = 0.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Fundamental + 2 harmonics
    const harmonics = [
      { f: freq, gain: 0.5 },
      { f: freq * 2.01, gain: 0.2 },
      { f: freq * 3.02, gain: 0.08 }
    ];

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * h.gain, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 3.3);
    });
  }

  public setTimer(minutes: number, onComplete?: () => void) {
    if (this.timerId) clearTimeout(this.timerId);
    const ms = minutes * 60 * 1000;
    this.timerId = setTimeout(() => {
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 8);
      }
      setTimeout(() => {
        this.stopAll();
        if (onComplete) onComplete();
      }, 8500);
    }, Math.max(1000, ms - 8000));
  }

  public getIsPlaying(): boolean {
    return this.channels.size > 0;
  }

  public hasChannel(type: string): boolean {
    return this.channels.has(type);
  }

  public getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : (null as unknown as SoundEngine);
