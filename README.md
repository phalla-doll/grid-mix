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
