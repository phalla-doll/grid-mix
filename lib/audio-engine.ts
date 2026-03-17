import { SoundDef } from '@/lib/sounds';

interface ActiveNode {
    audio: HTMLAudioElement;
    baseVolume: number;
    fadeFrame: number | null;
    sourceNode: MediaElementAudioSourceNode | null;
    gainNode: GainNode | null;
}

type PlaybackMode = 'web-audio-graph' | 'media-element-only';

class AudioEngine {
    private masterVolume = 0.9;
    private activeNodes: Map<string, ActiveNode> = new Map();
    private trackedNodes: Set<ActiveNode> = new Set();
    private audioContext: AudioContext | null = null;
    private playbackMode: PlaybackMode = 'web-audio-graph';
    private didResolvePlaybackMode = false;
    private webAudioResumeFailures = 0;
    private readonly maxWebAudioResumeFailures = 2;

    init() {
        if (typeof window === 'undefined') return;
        this.resolvePlaybackMode();
        if (this.playbackMode === 'media-element-only') return;

        const AudioContextCtor =
            window.AudioContext ||
            (
                window as Window &
                    typeof globalThis & {
                        webkitAudioContext?: typeof AudioContext;
                    }
            ).webkitAudioContext;
        if (!AudioContextCtor) return;

        if (!this.audioContext) {
            this.audioContext = new AudioContextCtor();
        }

        if (this.audioContext.state === 'suspended') {
            void this.audioContext.resume().catch(() => {
                this.onWebAudioResumeFailure();
            });
        }
    }

    setMasterVolume(volume: number) {
        this.masterVolume = this.clamp(volume);
        this.activeNodes.forEach((node) => {
            if (node.fadeFrame !== null) {
                cancelAnimationFrame(node.fadeFrame);
                node.fadeFrame = null;
            }
            const targetVolume = this.effectiveVolume(node.baseVolume);

            if (node.gainNode && this.audioContext) {
                const now = this.audioContext.currentTime;
                const gain = node.gainNode.gain;
                gain.cancelScheduledValues(now);
                gain.setValueAtTime(gain.value, now);
                gain.linearRampToValueAtTime(targetVolume, now + 0.04);
                return;
            }

            this.fadeVolume(
                node,
                this.getCurrentOutputVolume(node),
                targetVolume,
                80
            );
        });
    }

    playSound(sound: SoundDef, volume: number) {
        this.init();
        const safeVolume = this.clamp(volume);
        if (this.activeNodes.has(sound.id)) {
            this.stopSound(sound.id);
        }

        const audio = new Audio(sound.src);
        audio.loop = sound.loop;
        audio.preload = 'auto';
        audio.setAttribute('playsinline', 'true');
        const { sourceNode, gainNode } = this.createVolumeGraph(audio);
        audio.volume = gainNode ? 1 : 0;

        const node: ActiveNode = {
            audio,
            baseVolume: safeVolume,
            fadeFrame: null,
            sourceNode,
            gainNode,
        };
        this.activeNodes.set(sound.id, node);
        this.trackedNodes.add(node);

        const playPromise = audio.play();
        if (playPromise) {
            playPromise.catch(() => {
                this.activeNodes.delete(sound.id);
                this.trackedNodes.delete(node);
                this.hardStopNode(node);
            });
        }

        this.fadeVolume(node, 0, this.effectiveVolume(safeVolume), 1000);
    }

    setVolume(id: string, volume: number) {
        const node = this.activeNodes.get(id);
        if (node) {
            node.baseVolume = this.clamp(volume);
            this.fadeVolume(
                node,
                this.getCurrentOutputVolume(node),
                this.effectiveVolume(node.baseVolume),
                200
            );
        }
    }

    stopSound(id: string) {
        const node = this.activeNodes.get(id);
        if (node) {
            this.activeNodes.delete(id);
            const fallbackStop = setTimeout(() => {
                this.hardStopNode(node);
                this.trackedNodes.delete(node);
            }, 1100);
            this.fadeVolume(
                node,
                this.getCurrentOutputVolume(node),
                0,
                1000,
                () => {
                    clearTimeout(fallbackStop);
                    this.hardStopNode(node);
                    this.trackedNodes.delete(node);
                }
            );
        }
    }

    stopAll() {
        this.activeNodes.clear();
        this.trackedNodes.forEach((node) => this.hardStopNode(node));
        this.trackedNodes.clear();
    }

    getPlaybackMode() {
        return this.playbackMode;
    }

    async recoverPlayback() {
        this.init();
        if (!this.audioContext || this.playbackMode !== 'web-audio-graph') {
            return true;
        }

        if (this.audioContext.state === 'running') {
            return true;
        }

        try {
            await Promise.race([
                this.audioContext.resume(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('resume-timeout')), 1500)
                ),
            ]);
            this.webAudioResumeFailures = 0;
            return true;
        } catch {
            this.onWebAudioResumeFailure();
            return false;
        }
    }

    private clamp(value: number) {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }

    private effectiveVolume(baseVolume: number) {
        return this.clamp(baseVolume * this.masterVolume);
    }

    private applyVolume(node: ActiveNode, baseVolume: number) {
        this.setOutputVolume(node, this.effectiveVolume(baseVolume));
    }

    private hardStopNode(node: ActiveNode) {
        if (node.fadeFrame !== null) {
            cancelAnimationFrame(node.fadeFrame);
            node.fadeFrame = null;
        }

        this.setOutputVolume(node, 0);
        node.audio.pause();
        node.audio.currentTime = 0;

        if (node.sourceNode) {
            try {
                node.sourceNode.disconnect();
            } catch {}
            node.sourceNode = null;
        }
        if (node.gainNode) {
            try {
                node.gainNode.disconnect();
            } catch {}
            node.gainNode = null;
        }
    }

    private fadeVolume(
        node: ActiveNode,
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
            this.setOutputVolume(node, from + delta * progress);

            if (progress < 1) {
                node.fadeFrame = requestAnimationFrame(step);
            } else {
                node.fadeFrame = null;
                onDone?.();
            }
        };

        node.fadeFrame = requestAnimationFrame(step);
    }

    private createVolumeGraph(audio: HTMLAudioElement): {
        sourceNode: MediaElementAudioSourceNode | null;
        gainNode: GainNode | null;
    } {
        if (this.playbackMode === 'media-element-only') {
            return { sourceNode: null, gainNode: null };
        }

        if (!this.audioContext) {
            return { sourceNode: null, gainNode: null };
        }

        try {
            const sourceNode =
                this.audioContext.createMediaElementSource(audio);
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0;
            sourceNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            return { sourceNode, gainNode };
        } catch {
            return { sourceNode: null, gainNode: null };
        }
    }

    private getCurrentOutputVolume(node: ActiveNode) {
        if (node.gainNode) return node.gainNode.gain.value;
        return node.audio.volume;
    }

    private setOutputVolume(node: ActiveNode, volume: number) {
        const safeVolume = this.clamp(volume);
        if (node.gainNode) {
            node.gainNode.gain.value = safeVolume;
            return;
        }
        node.audio.volume = safeVolume;
    }

    private resolvePlaybackMode() {
        if (this.didResolvePlaybackMode || typeof navigator === 'undefined') {
            return;
        }
        this.playbackMode = this.shouldUseMediaElementFallback()
            ? 'media-element-only'
            : 'web-audio-graph';
        this.didResolvePlaybackMode = true;
    }

    private shouldUseMediaElementFallback() {
        const ua = navigator.userAgent;
        const isiOSDevice = /iPad|iPhone|iPod/.test(ua);
        const isIpadOSDesktopUA =
            navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        const isWebKitEngine =
            /WebKit/.test(ua) &&
            !/CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser|DuckDuckGo/.test(ua);
        return (isiOSDevice || isIpadOSDesktopUA) && isWebKitEngine;
    }

    private onWebAudioResumeFailure() {
        this.webAudioResumeFailures += 1;
        if (this.webAudioResumeFailures < this.maxWebAudioResumeFailures) {
            return;
        }
        this.switchToMediaElementOnly();
    }

    private switchToMediaElementOnly() {
        if (this.playbackMode === 'media-element-only') return;
        this.playbackMode = 'media-element-only';
        this.activeNodes.forEach((node) => {
            const currentVolume = this.getCurrentOutputVolume(node);
            if (node.sourceNode) {
                try {
                    node.sourceNode.disconnect();
                } catch {}
                node.sourceNode = null;
            }
            if (node.gainNode) {
                try {
                    node.gainNode.disconnect();
                } catch {}
                node.gainNode = null;
            }
            node.audio.volume = this.clamp(currentVolume);
        });
    }
}

export const engine = new AudioEngine();
