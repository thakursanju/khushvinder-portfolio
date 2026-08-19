# Personal portfolio

A single-page Next.js 14 (App Router) portfolio with a scrapbook / engineering-notebook aesthetic. Built with Tailwind, Framer Motion, and Recharts.

## Stack

- Next.js 14 (App Router) + React 18
- TypeScript
- Tailwind CSS 3 (with custom cream / kraft / ink / accent palette)
- Framer Motion (entrance animations, hover physics, terminal cursor, floating dot)
- Recharts (radar chart in the Snapshot section)
- next/font/google for self-hosted Inter, IBM Plex Mono, and Caveat

## Install & run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project layout

```
app/
  layout.tsx        root layout, fonts (Inter / IBM Plex Mono / Caveat)
  page.tsx          composes the 5 sections + nav + footer
  globals.css       cream background, dot-grid, torn-paper & ticket utilities
components/
  NavBar.tsx
  Footer.tsx
  FloatingDot.tsx
  HeroSection.tsx
  IDBadge.tsx
  TerminalWindow.tsx
  PolaroidCollage.tsx
  TicketCard.tsx
  ArchedFrame.tsx
  PixelDisplay.tsx
  TornCollage.tsx
  AboutSection.tsx
  MacWindow.tsx
  SnapshotSection.tsx
  snapshot/
    DesignNotes.tsx
    EnergyRing.tsx
    FuelRadar.tsx
    JourneyList.tsx
    FunFacts.tsx
  PlaygroundSection.tsx
public/images/        drop your photos here (see README.txt inside)
```

## Swapping in your content

All personal information is marked with `[YOUR_*]` placeholders. Grep them out and replace:

```bash
grep -rn "\[YOUR_" app components
```

The main slots to fill in:

| Placeholder | Where | What to put |
|---|---|---|
| `Jared Beresford` | Hero h1, NavBar, layout metadata, terminal title | Your name |
| `[YOUR_NAME_NATIVE]` | IDBadge | Native-script form of your name (optional) |
| `[YOUR_TAGLINE]` | Hero subtitle | One-line positioning (e.g. "designer / engineer") |
| `[YOUR_TAGLINE_SHORT]` | IDBadge | 3-4 word version |
| `[YOUR_TITLE]`, `[YOUR_YEARS]` | TerminalWindow | Job title + years of experience |
| `[YOUR_INTERESTS_SLASH_SEPARATED]` | TerminalWindow | e.g. `design / code / typography / synths` |
| `[YOUR_PLAYLIST_TITLE]`, `[YOUR_PROJECT_COUNT]` | IDBadge vinyl card | Optional playlist flair |
| `[YOUR_EVENT_DATE]`, `[YOUR_CITY]` | TicketCard | e.g. "May 2026", "Seattle" |
| `[YOUR_PIXEL_MESSAGE]` | PixelDisplay | 1-3 words shown under the LED grid |
| `[YOUR_BIO_SENTENCE_*]` | AboutSection sticky note | 2-3 short bio sentences |
| `[YOUR_DESIGN_TAG_*]` | snapshot/DesignNotes | Chip cloud labels |
| `[YOUR_FUEL_*]` | snapshot/FuelRadar | Radar axis labels |
| `[YOUR_JOURNEY_0X_LABEL]` / `[YOUR_JOURNEY_0X_CATEGORY]` | snapshot/JourneyList | Career steps + category badges |
| `[YOUR_FUN_FACT_*]` | snapshot/FunFacts | 4 short personal facts |
| `[YOUR_PLAYGROUND_TAGLINE]` | PlaygroundSection | Subhead under "playground" |
| `[YOUR_PROJECT_*_NAME]` / `[YOUR_PROJECT_*_BLURB]` | PlaygroundSection | 7 project tiles |
| `[YOUR_EMAIL]` / `[YOUR_GITHUB]` / `[YOUR_LINKEDIN]` / `[YOUR_TWITTER]` / `[YOUR_READCV]` | Footer | Social links |

Photos: drop files matching the names in `public/images/README.txt`.

Colors / fonts live in `tailwind.config.ts` and `app/layout.tsx` — tweak the palette there if you want a different mood.

## Deploy to Vercel (3 steps)

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Vercel auto-detects Next.js — no config needed.
3. Hit Deploy. Done. (Set up a custom domain under Project Settings → Domains afterwards.)

## Notes on the design techniques used

- **Cream + dot-grid background**: `app/globals.css` paints the body with a `radial-gradient` dot tiled at 22px. This is what gives every section a "graph-paper" base.
- **Scrapbook Hero**: on `lg+` the hero is an absolutely-positioned canvas with hand-tuned coords + slight rotations per card; on `<lg` it falls back to a vertical stack.
- **Terminal typewriter**: per-line `setTimeout` schedules + a `setInterval` typing chars every 28ms; a blinking cursor follows the active line.
- **Floating dot**: framer-motion `animate` with keyframe arrays + `repeat: Infinity, ease: 'easeInOut'`.
- **Sticky note**: hover tilt via framer-motion spring + a small `bg-ink-900/10` "tape" strip overhanging the top edge.
- **macOS window**: reusable `MacWindow.tsx` chrome (traffic-light dots + title bar). The Snapshot section wraps its inner grid in `overflow-x-auto` with `min-w-[900px]` so mobile gets native horizontal scroll instead of breaking the layout.
- **Energy ring**: SVG donut with `stroke-dasharray` math — no chart library required.
- **Fuel radar**: Recharts `RadarChart` themed with mono ticks.
- **Playground**: single-render strategy — `static lg:absolute` + always-applied inline `style={{ top, left, rotate }}`. On mobile, static positioning wins (coords ignored) and cards reflow via `flex-wrap`.
