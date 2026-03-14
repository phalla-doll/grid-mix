import { SoundDef } from './sounds';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: Map<string, { source: AudioNode, gain: GainNode, lfo?: OscillatorNode }> = new Map();

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5; // Default master volume
    }
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  playSound(sound: SoundDef, volume: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.activeNodes.has(sound.id)) {
      this.stopSound(sound.id);
    }

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.masterGain);

    let source: AudioNode;
    let lfo: OscillatorNode | undefined;

    if (sound.type === 'noise') {
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (sound.noiseType === 'brown') {
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // compensate gain
        } else if (sound.noiseType === 'pink') {
          // Simplistic pink noise approximation
          data[i] = (lastOut * 0.99) + (white * 0.05);
          lastOut = data[i];
          data[i] *= 2;
        } else {
          data[i] = white;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      source = noiseSource;
    } else {
      const osc = this.ctx.createOscillator();
      osc.type = sound.oscType || 'sine';
      osc.frequency.value = 100; // Base frequency
      source = osc;
    }

    let finalSource = source;

    if (sound.filterType) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = sound.filterType;
      filter.frequency.value = sound.filterFreq || 1000;
      
      if (sound.lfoRate && sound.lfoDepth) {
        lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = sound.lfoRate;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = sound.lfoDepth;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      }

      source.connect(filter);
      filter.connect(gainNode);
    } else {
      source.connect(gainNode);
    }

    if (source instanceof AudioBufferSourceNode || source instanceof OscillatorNode) {
      source.start();
    }

    this.activeNodes.set(sound.id, { source, gain: gainNode, lfo });
  }

  setVolume(id: string, volume: number) {
    const node = this.activeNodes.get(id);
    if (node) {
      // Smooth volume transition
      if (this.ctx) {
         node.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
      } else {
         node.gain.gain.value = volume;
      }
    }
  }

  stopSound(id: string) {
    const node = this.activeNodes.get(id);
    if (node) {
      if (node.source instanceof AudioBufferSourceNode || node.source instanceof OscillatorNode) {
        node.source.stop();
      }
      if (node.lfo) {
        node.lfo.stop();
      }
      node.source.disconnect();
      node.gain.disconnect();
      this.activeNodes.delete(id);
    }
  }

  stopAll() {
    this.activeNodes.forEach((_, id) => this.stopSound(id));
  }
}

export const engine = new AudioEngine();
