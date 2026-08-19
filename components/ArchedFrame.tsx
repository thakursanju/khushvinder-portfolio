'use client';

// ArchedFrame.tsx
// A manila-folder accent that, on hover, lifts three "tool" chips up out of the
// folder — the apps I live in (Claude, Spotify, VS Code). The reveal reuses the
// same staggered fan-out pattern as the snapshot Folder's peek items: chips rest
// hidden behind the folder's front face, then spring upward and rotate out.
// Hover-driven on desktop; whileTap mirrors it so a tap reveals them on touch.

import React from 'react';
import { motion } from 'framer-motion';

// --- Brand marks -----------------------------------------------------
// Claude: clay-colored radial burst. Spotify / VS Code use their official paths.
function ClaudeMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <g fill="#D97757">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="11.1" y="2.4" width="1.8" height="9.6" rx="0.9" transform={`rotate(${i * 30} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path
        fill="#1DB954"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  );
}

function VSCodeMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path
        fill="#0098FF"
        d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 19.539V4.461a1.5 1.5 0 00-.85-1.874zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
      />
    </svg>
  );
}

// Each chip rests centered + hidden behind the folder front face, then springs
// up and fans out on hover. `-HALF` keeps the chip horizontally centered (the
// CSS left-1/2 only positions its left edge); fanX adds the spread.
const HALF = 22; // half of the 44px chip
const chipVariant = (fanX: number, liftY: number, rot: number, delay: number) => ({
  rest:  { x: -HALF,        y: 4,     rotate: 0,   opacity: 0, scale: 0.7 },
  hover: {
    x: -HALF + fanX, y: liftY, rotate: rot, opacity: 1, scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 18, delay },
  },
});

const chipCls =
  'absolute left-1/2 top-2 w-11 h-11 z-0 rounded-lg bg-cream-50 shadow-card flex items-center justify-center p-1.5';

export default function ArchedFrame() {
  return (
    <motion.div
      className="inline-block"
      role="img"
      aria-label="Tools I use: Claude, Spotify, and VS Code"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="hover"
    >
      {/* Folder tab */}
      <div className="bg-accent-yellow w-14 h-4 rounded-t-md ml-2 shadow-sm" />

      {/* Folder body — relative box; chips sit behind the front face at rest */}
      <div className="relative w-32 h-20">
        {/* Tool chips — fan up and out on hover */}
        <motion.div variants={chipVariant(-40, -60, -16, 0)} className={chipCls}>
          <ClaudeMark />
        </motion.div>
        <motion.div variants={chipVariant(0, -66, 0, 0.05)} className={chipCls}>
          <SpotifyMark />
        </motion.div>
        <motion.div variants={chipVariant(40, -60, 16, 0.1)} className={chipCls}>
          <VSCodeMark />
        </motion.div>

        {/* Front face — opaque, sits above the chips so they hide at rest */}
        <motion.div
          variants={{ rest: { y: 0 }, hover: { y: -2 } }}
          className="absolute inset-0 z-10 bg-accent-yellow rounded-md rounded-tl-none shadow-card"
        />
      </div>
    </motion.div>
  );
}
