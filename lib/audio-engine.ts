import { SoundDef } from './sounds';

class AudioEngine {
  private masterVolume = 0.9;
  private activeNodes: Map<string, { audio: HTMLAudioElement; baseVolume: number; fadeFrame: number | null }> = new Map();

  init() {
    // HTMLAudioElement does not require explicit initialization.
  }

  setMasterVolume(volume: number) {
    this.masterVolume = this.clamp(volume);
    this.activeNodes.forEach((node) => {
      this.applyVolume(node, node.baseVolume);
    });
  }

  playSound(sound: SoundDef, volume: number) {
    const safeVolume = this.clamp(volume);
    if (this.activeNodes.has(sound.id)) {
      this.stopSound(sound.id);
    }

    const audio = new Audio(sound.src);
    audio.loop = sound.loop;
    audio.preload = 'auto';
    audio.volume = 0;

    const node = { audio, baseVolume: safeVolume, fadeFrame: null };
    this.activeNodes.set(sound.id, node);

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        this.activeNodes.delete(sound.id);
      });
    }

    this.fadeVolume(node, 0, this.effectiveVolume(safeVolume), 1000);
  }

  setVolume(id: string, volume: number) {
    const node = this.activeNodes.get(id);
    if (node) {
      node.baseVolume = this.clamp(volume);
      this.fadeVolume(node, node.audio.volume, this.effectiveVolume(node.baseVolume), 200);
    }
  }

  stopSound(id: string) {
    const node = this.activeNodes.get(id);
    if (node) {
      this.activeNodes.delete(id);
      this.fadeVolume(node, node.audio.volume, 0, 1000, () => {
        node.audio.pause();
        node.audio.currentTime = 0;
      });
    }
  }

  stopAll() {
    this.activeNodes.forEach((_, id) => this.stopSound(id));
  }

  private clamp(value: number) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  private effectiveVolume(baseVolume: number) {
    return this.clamp(baseVolume * this.masterVolume);
  }

  private applyVolume(
    node: { audio: HTMLAudioElement; baseVolume: number; fadeFrame: number | null },
    baseVolume: number
  ) {
    node.audio.volume = this.effectiveVolume(baseVolume);
  }

  private fadeVolume(
    node: { audio: HTMLAudioElement; baseVolume: number; fadeFrame: number | null },
    from: number,
    to: number,
    durationMs: number,
    onDone?: () => void
  ) {
    if (node.fadeFrame !== null) {
      cancelAnimationFrame(node.fadeFrame);
      node.fadeFrame = null;
    }

    const start = performance.now();
    const delta = to - from;

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      node.audio.volume = this.clamp(from + delta * progress);

      if (progress < 1) {
        node.fadeFrame = requestAnimationFrame(step);
      } else {
        node.fadeFrame = null;
        onDone?.();
      }
    };

    node.fadeFrame = requestAnimationFrame(step);
  }
}

export const engine = new AudioEngine();
