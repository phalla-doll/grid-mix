![Soro OG preview](https://github.com/phalla-doll/grid-mix/blob/main/public/sono-og-image-main.png)

# Soro - Ambient Sound Mixer

A beautiful ambient sound mixer for focus, relaxation, and sleep. Blend multiple nature sounds, white noise, urban ambiance, and binaural beats to create your perfect soundscape.

## Features

### Sound Library

100+ ambient sounds across 10 categories:

| Category      | Description                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Animals**   | Bees, birds, cats, cows, crickets, dogs, frogs, horses, owls, seagulls, sheep, whales, wolves                        |
| **Binaural**  | Alpha, Beta, Delta, Gamma, Theta brainwave beats                                                                     |
| **Nature**    | Campfire, droplets, jungle, river, waterfall, waves, wind                                                            |
| **Noise**     | Brown, Pink, White noise                                                                                             |
| **Places**    | Airport, cafe, carousel, church, construction, crowded bar, library, office, restaurant, subway, supermarket, temple |
| **Rain**      | Heavy, light, thunder, rain on car roof/leaves/tent/umbrella/window                                                  |
| **Things**    | Clock, keyboard, typewriter, washing machine, wind chimes, etc.                                                      |
| **Transport** | Airplane, train, submarine, boat                                                                                     |
| **Urban**     | Ambulance, busy street, crowd, fireworks, highway, traffic                                                           |
| **Misc**      | Alarm, silence                                                                                                       |

### Mixer Controls

- **Toggle sounds** - Click any sound tile to activate/deactivate
- **Volume control** - Adjust individual sound volumes (0-100%)
- **Master play/pause** - Control all active sounds at once
- **Clear all** - Instantly stop and reset all sounds
- **Category clear** - Clear all sounds in a specific category

### Presets & Sharing

- **Save presets** - Store your favorite mixes with custom names
- **Load presets** - Quick access to saved mixes
- **URL sharing** - Share your mix via URL (mix parameter encoded in URL)
- **Session persistence** - Your current mix is auto-saved to localStorage

### Media Integration

- **Media Session API** - Control playback from browser media keys or notifications
- **Now Playing** - Shows in system media controls
- **Background playback hardening** - Uses iOS-safe media element fallback when Web Audio reliability is degraded

### Background Playback Notes

- `MediaSession` improves lock-screen controls, but browsers still enforce platform-specific background policies.
- iOS Safari may suspend Web Audio graphs while backgrounded. The app now falls back to direct `HTMLAudioElement` volume control on iOS WebKit to improve continuity.
- When supported, the app sets `navigator.audioSession.type = "playback"` after a user gesture to hint media-style playback behavior.
- On resume from lock/background (`visibilitychange`, `pageshow`, `focus`), the app attempts playback recovery automatically.
- PWA metadata is included, but install status alone does not guarantee unrestricted background audio on all iOS versions.

### Background Playback Verification Matrix

Run these scenarios manually after `npm run dev`:

1. **iOS Safari**: Start 2-3 sounds, lock screen for 30-60s, unlock, confirm audio continuity and lock-screen play/pause behavior.
2. **iOS Home Screen app (PWA)**: Install app, repeat lock/unlock flow, confirm playback resume and media controls.
3. **Android Chrome**: Start sounds, switch apps and lock screen, validate background playback and notification media controls.
4. **Desktop (Chrome/Safari/Edge)**: Switch tabs/windows, use keyboard media keys, confirm metadata and play/pause stay in sync.
5. **Stress**: Rapidly toggle multiple sounds and master volume before/after lock cycle to ensure no stuck audio nodes.

Current verification status:

- `npm run lint`: pass
- `npm run build`: pass
- Device lock-screen tests: pending manual verification on physical iOS/Android devices

## Tech Stack

- **Framework**: Next.js 15.4 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Animation**: Motion (Framer Motion)
- **Audio**: Web Audio API
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/phalla-doll/grid-mix.git
cd grid-mix

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file only if you need to override environment settings.

See `.env.example` for available environment variables.

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
| `npm run clean` | Clean Next.js cache      |

## Project Structure

```
grid-mix/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Main app page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ClientApp.tsx       # Main client component
│   ├── SoundGrid.tsx       # Sound tile grid
│   ├── SoundTile.tsx       # Individual sound tile
│   ├── MixerPanel.tsx      # Bottom mixer controls
│   ├── TopNav.tsx          # Navigation/header
│   ├── Waveform.tsx        # Audio visualization
│   └── Dialog.tsx          # Modal dialog
├── lib/                    # Core utilities
│   ├── sounds.ts           # Sound definitions & categories
│   ├── mixer-context.tsx  # State management
│   └── audio-engine.ts     # Web Audio API engine
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
│   └── sounds/            # Audio files
└── package.json            # Dependencies
```

## License

MIT
