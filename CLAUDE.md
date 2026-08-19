# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev — local server at http://localhost:3000
npm run build   # next build — production build (also the type/lint gate)
npm run start   # serve the production build
npm run lint    # next lint (eslint-config-next)
```

There is no test framework, no `.env`, and no API layer — this is a purely static single-page site. `npm run build` is the only real CI gate (it surfaces TypeScript errors since `tsconfig` has `strict: true` and `noEmit`).

## Architecture

A single-page Next.js 14 App Router portfolio with a scrapbook / engineering-notebook aesthetic. There are no routes beyond `/`, no server data fetching, and no client state beyond per-component animation state.

- **`app/page.tsx`** stacks the whole site: `NavBar → HeroSection → AboutSection → SnapshotSection → PlaygroundSection → Footer`. Scroll-snap is deliberately avoided (continuous reading experience). To reorder/add a section, edit this file.
- **`app/layout.tsx`** wires three `next/font/google` families to CSS variables: `--font-sans` (Inter, body), `--font-mono` (IBM Plex Mono, terminal/technical), `--font-script` (Caveat, handwritten accents). These map to `theme.fontFamily` in `tailwind.config.ts`.
- **`components/`** holds every section and its sub-pieces; `components/snapshot/` holds the Snapshot widgets (EnergyRing, FuelRadar, JourneyList, DesignNotes, FunFacts). Everything is presentational. 15 of the ~21 components are `'use client'` — anything using Framer Motion must be.

### Design system (edit these two files for global look changes)

- **`tailwind.config.ts`** — the palette (`cream`, `kraft`, `ink`, `accent.{yellow,coral,mint,lilac,sky}`), custom shadows (`sticky`, `card`, `window`), the `dot-grid` background image, and the `blink` keyframe. Change the mood here, not in individual components.
- **`app/globals.css`** — the cream + dot-grid body background and the reusable `@layer utilities`: `.torn-paper` (clip-path polygon), `.ticket-edge` (radial-gradient mask notches), `.notebook-bg` (hero backdrop glows). These are hand-tuned CSS, not images.

### Responsive strategy (important when editing layout components)

The visual sections use a single-render trick rather than separate mobile/desktop trees: cards are `static` (mobile, reflow via `flex-wrap`) and `lg:absolute` with always-applied inline `style={{ top, left, rotate }}` (desktop, hand-placed coords + rotation). On mobile the inline coords are simply ignored because positioning is static. The Snapshot section instead wraps a `min-w-[900px]` grid in `overflow-x-auto` for native horizontal scroll. When touching HeroSection / PlaygroundSection / SnapshotSection, preserve this pattern — don't split into conditional renders.

## Content placeholders

Personal content is templated with `[YOUR_*]` markers. Find unfilled slots with:

```bash
grep -rn "\[YOUR_" app components
```

`README.md` has a full table mapping each placeholder to its component and intended content. Photos live in `public/images/` (see `public/images/README.txt` for expected filenames).

## Notes

- `my-portfolio/` is untracked stale build output (a static `out/` export). It is not part of the app — ignore it; don't edit or reference it.
- Path alias `@/*` maps to the repo root (`@/components/...`).
- Deploy target is Vercel with zero config (auto-detected Next.js).
