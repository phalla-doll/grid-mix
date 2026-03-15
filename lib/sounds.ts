export const CATEGORY_ORDER = [
  'animals',
  'binaural',
  'nature',
  'noise',
  'places',
  'rain',
  'things',
  'transport',
  'urban',
  'misc',
] as const;

export type SoundCategory = (typeof CATEGORY_ORDER)[number];

export interface SoundDef {
  id: string;
  name: string;
  category: SoundCategory;
  src: string;
  loop: boolean;
}

const SOUND_FILES = [
  '/sounds/alarm.mp3',
  '/sounds/animals/beehive.mp3',
  '/sounds/animals/birds.mp3',
  '/sounds/animals/cat-purring.mp3',
  '/sounds/animals/chickens.mp3',
  '/sounds/animals/cows.mp3',
  '/sounds/animals/crickets.mp3',
  '/sounds/animals/crows.mp3',
  '/sounds/animals/dog-barking.mp3',
  '/sounds/animals/frog.mp3',
  '/sounds/animals/horse-gallop.mp3',
  '/sounds/animals/owl.mp3',
  '/sounds/animals/seagulls.mp3',
  '/sounds/animals/sheep.mp3',
  '/sounds/animals/whale.mp3',
  '/sounds/animals/wolf.mp3',
  '/sounds/animals/woodpecker.mp3',
  '/sounds/binaural/binaural-alpha.wav',
  '/sounds/binaural/binaural-beta.wav',
  '/sounds/binaural/binaural-delta.wav',
  '/sounds/binaural/binaural-gamma.wav',
  '/sounds/binaural/binaural-theta.wav',
  '/sounds/nature/campfire.mp3',
  '/sounds/nature/droplets.mp3',
  '/sounds/nature/howling-wind.mp3',
  '/sounds/nature/jungle.mp3',
  '/sounds/nature/river.mp3',
  '/sounds/nature/walk-in-snow.mp3',
  '/sounds/nature/walk-on-gravel.mp3',
  '/sounds/nature/walk-on-leaves.mp3',
  '/sounds/nature/waterfall.mp3',
  '/sounds/nature/waves.mp3',
  '/sounds/nature/wind-in-trees.mp3',
  '/sounds/nature/wind.mp3',
  '/sounds/noise/brown-noise.wav',
  '/sounds/noise/pink-noise.wav',
  '/sounds/noise/white-noise.wav',
  '/sounds/places/airport.mp3',
  '/sounds/places/cafe.mp3',
  '/sounds/places/carousel.mp3',
  '/sounds/places/church.mp3',
  '/sounds/places/construction-site.mp3',
  '/sounds/places/crowded-bar.mp3',
  '/sounds/places/laboratory.mp3',
  '/sounds/places/laundry-room.mp3',
  '/sounds/places/library.mp3',
  '/sounds/places/night-village.mp3',
  '/sounds/places/office.mp3',
  '/sounds/places/restaurant.mp3',
  '/sounds/places/subway-station.mp3',
  '/sounds/places/supermarket.mp3',
  '/sounds/places/temple.mp3',
  '/sounds/places/underwater.mp3',
  '/sounds/rain/heavy-rain.mp3',
  '/sounds/rain/light-rain.mp3',
  '/sounds/rain/rain-on-car-roof.mp3',
  '/sounds/rain/rain-on-leaves.mp3',
  '/sounds/rain/rain-on-tent.mp3',
  '/sounds/rain/rain-on-umbrella.mp3',
  '/sounds/rain/rain-on-window.mp3',
  '/sounds/rain/thunder.mp3',
  '/sounds/silence.wav',
  '/sounds/things/boiling-water.mp3',
  '/sounds/things/bubbles.mp3',
  '/sounds/things/ceiling-fan.mp3',
  '/sounds/things/clock.mp3',
  '/sounds/things/dryer.mp3',
  '/sounds/things/keyboard.mp3',
  '/sounds/things/morse-code.mp3',
  '/sounds/things/paper.mp3',
  '/sounds/things/singing-bowl.mp3',
  '/sounds/things/slide-projector.mp3',
  '/sounds/things/tuning-radio.mp3',
  '/sounds/things/typewriter.mp3',
  '/sounds/things/vinyl-effect.mp3',
  '/sounds/things/washing-machine.mp3',
  '/sounds/things/wind-chimes.mp3',
  '/sounds/things/windshield-wipers.mp3',
  '/sounds/transport/airplane.mp3',
  '/sounds/transport/inside-a-train.mp3',
  '/sounds/transport/rowing-boat.mp3',
  '/sounds/transport/sailboat.mp3',
  '/sounds/transport/submarine.mp3',
  '/sounds/transport/train.mp3',
  '/sounds/urban/ambulance-siren.mp3',
  '/sounds/urban/busy-street.mp3',
  '/sounds/urban/crowd.mp3',
  '/sounds/urban/fireworks.mp3',
  '/sounds/urban/highway.mp3',
  '/sounds/urban/road.mp3',
  '/sounds/urban/traffic.mp3',
] as const;

const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);

const toTitleCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getCategoryFromPath = (src: string): SoundCategory => {
  const parts = src.split('/');
  const maybeCategory = parts[2];
  if (maybeCategory && CATEGORY_SET.has(maybeCategory)) {
    return maybeCategory as SoundCategory;
  }
  return 'misc';
};

const getIdFromPath = (src: string) =>
  src
    .replace(/^\/sounds\//, '')
    .replace(/\.[a-z0-9]+$/i, '');

const getNameFromPath = (src: string) => {
  const fileName = src.split('/').pop() || src;
  const baseName = fileName.replace(/\.[a-z0-9]+$/i, '');
  return toTitleCase(baseName);
};

export const formatCategoryLabel = (category: SoundCategory) => toTitleCase(category);

export const SOUNDS: SoundDef[] = SOUND_FILES.map((src) => ({
  id: getIdFromPath(src),
  name: getNameFromPath(src),
  category: getCategoryFromPath(src),
  src,
  loop: true,
}));

export const SOUNDS_BY_ID: Record<string, SoundDef> = SOUNDS.reduce(
  (acc, sound) => {
    acc[sound.id] = sound;
    return acc;
  },
  {} as Record<string, SoundDef>
);

const categoryAccumulator: Record<SoundCategory, SoundDef[]> = CATEGORY_ORDER.reduce(
  (acc, category) => {
    acc[category] = [];
    return acc;
  },
  {} as Record<SoundCategory, SoundDef[]>
);

export const SOUNDS_BY_CATEGORY: Record<SoundCategory, SoundDef[]> = SOUNDS.reduce(
  (acc, sound) => {
    acc[sound.category].push(sound);
    return acc;
  },
  categoryAccumulator
);

export const getSoundById = (id: string): SoundDef | undefined => SOUNDS_BY_ID[id];
export const getSoundsByCategory = (category: SoundCategory): SoundDef[] => SOUNDS_BY_CATEGORY[category] || [];
