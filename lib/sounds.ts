export type SoundCategory = 'Nature' | 'Urban' | 'Noise' | 'Synth';

export interface SoundDef {
  id: string;
  name: string;
  category: SoundCategory;
  type: 'noise' | 'oscillator';
  noiseType?: 'white' | 'pink' | 'brown';
  oscType?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  filterType?: BiquadFilterType;
  filterFreq?: number;
  lfoRate?: number;
  lfoDepth?: number;
}

export const SOUNDS: SoundDef[] = [
  { id: 'rain', name: 'Rain', category: 'Nature', type: 'noise', noiseType: 'pink', filterType: 'lowpass', filterFreq: 400 },
  { id: 'waves', name: 'Waves', category: 'Nature', type: 'noise', noiseType: 'brown', filterType: 'lowpass', filterFreq: 300, lfoRate: 0.1, lfoDepth: 200 },
  { id: 'wind', name: 'Wind', category: 'Nature', type: 'noise', noiseType: 'pink', filterType: 'bandpass', filterFreq: 600, lfoRate: 0.2, lfoDepth: 400 },
  { id: 'thunder', name: 'Thunder', category: 'Nature', type: 'noise', noiseType: 'brown', filterType: 'lowpass', filterFreq: 100 },
  { id: 'stream', name: 'Stream', category: 'Nature', type: 'noise', noiseType: 'pink', filterType: 'highpass', filterFreq: 800 },
  { id: 'fire', name: 'Campfire', category: 'Nature', type: 'noise', noiseType: 'brown', filterType: 'bandpass', filterFreq: 500, lfoRate: 5, lfoDepth: 200 },
  { id: 'city', name: 'City Hum', category: 'Urban', type: 'noise', noiseType: 'brown', filterType: 'lowpass', filterFreq: 200 },
  { id: 'traffic', name: 'Distant Traffic', category: 'Urban', type: 'noise', noiseType: 'pink', filterType: 'lowpass', filterFreq: 300, lfoRate: 0.05, lfoDepth: 100 },
  { id: 'train', name: 'Train Rumble', category: 'Urban', type: 'noise', noiseType: 'brown', filterType: 'lowpass', filterFreq: 80, lfoRate: 2, lfoDepth: 20 },
  { id: 'white-noise', name: 'White Noise', category: 'Noise', type: 'noise', noiseType: 'white' },
  { id: 'pink-noise', name: 'Pink Noise', category: 'Noise', type: 'noise', noiseType: 'pink' },
  { id: 'brown-noise', name: 'Brown Noise', category: 'Noise', type: 'noise', noiseType: 'brown' },
  { id: 'drone-sine', name: 'Sine Drone', category: 'Synth', type: 'oscillator', oscType: 'sine', filterType: 'lowpass', filterFreq: 200, lfoRate: 0.05, lfoDepth: 50 },
  { id: 'drone-square', name: 'Square Drone', category: 'Synth', type: 'oscillator', oscType: 'square', filterType: 'lowpass', filterFreq: 150, lfoRate: 0.1, lfoDepth: 100 },
  { id: 'drone-saw', name: 'Saw Drone', category: 'Synth', type: 'oscillator', oscType: 'sawtooth', filterType: 'lowpass', filterFreq: 100, lfoRate: 0.02, lfoDepth: 40 },
  { id: 'drone-tri', name: 'Triangle Drone', category: 'Synth', type: 'oscillator', oscType: 'triangle', filterType: 'lowpass', filterFreq: 300, lfoRate: 0.08, lfoDepth: 80 },
];
