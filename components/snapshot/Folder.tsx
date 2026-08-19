'use client';

// Folder: a tactile macOS-style folder icon. Three "peek items" sit behind the
// folder body at rest — invisible. On hover they animate upward + fade in with
// a staggered spring, like documents being lifted out of the folder. Click
// opens the folder (handled by parent). The lift effect on the wrapper uses
// `whileHover` with `variants`, which lets the children read the hover state
// off the parent for free — no per-child onHover plumbing.

import React from 'react';
import { motion } from 'framer-motion';

export type FolderColor = 'sky' | 'kraft' | 'mint' | 'coral' | 'lilac' | 'yellow';

type FolderProps = {
  name: string;
  color: FolderColor;
  icon: React.ReactNode;
  onOpen: () => void;
};

const palette: Record<FolderColor, { back: string; front: string; icon: string; peek: string }> = {
  sky:    { back: '#9BC9DE', front: '#BDE0F0', icon: '#3F6F87', peek: '#7AB0CA' },
  kraft:  { back: '#C8AE7D', front: '#E0CCA5', icon: '#7A6135', peek: '#B89868' },
  mint:   { back: '#8BCEA6', front: '#B8E6C9', icon: '#3F7553', peek: '#73BD90' },
  coral:  { back: '#E07565', front: '#FF9D8C', icon: '#8A3528', peek: '#D0604F' },
  lilac:  { back: '#B8A8DC', front: '#D6C9F0', icon: '#5E4A8A', peek: '#9C8AC4' },
  yellow: { back: '#E6C540', front: '#FFE066', icon: '#7A6510', peek: '#D4B330' },
};

// Each peek item: starts hidden behind the folder front face, ends raised above
// the folder with a fan-out rotation. Stagger handled by `transition.delay`.
const peekVariant = (offsetX: number, lift: number, rotate: number, delay: number) => ({
  rest:  { x: offsetX, y: 0,    rotate: 0,      opacity: 0,   scale: 0.85 },
  hover: { x: offsetX, y: lift, rotate: rotate, opacity: 1,   scale: 1,
           transition: { type: 'spring' as const, stiffness: 320, damping: 18, delay } },
});

export default function Folder({ name, color, icon, onOpen }: FolderProps) {
  const c = palette[color];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onDoubleClick={onOpen}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="group flex flex-col items-center gap-2 p-3 rounded-lg outline-none focus-visible:bg-accent-sky/30 focus-visible:ring-2 focus-visible:ring-accent-sky/70"
    >
      {/* Lift the whole folder a touch on hover */}
      <motion.div
        variants={{
          rest:  { y: 0 },
          hover: { y: -4, transition: { type: 'spring', stiffness: 320, damping: 20 } },
        }}
        className="relative w-24 h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]"
      >
        {/* Peek items — absolutely positioned, behind the folder front face at rest.
            On hover they translate up and fan out, like docs being lifted out. */}
        <motion.div
          variants={peekVariant(-12, -22, -14, 0)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-8 rounded-sm shadow-md"
          style={{ backgroundColor: c.peek, zIndex: 1 }}
          aria-hidden
        />
        <motion.div
          variants={peekVariant(10, -28, 10, 0.04)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-8 rounded-sm shadow-md"
          style={{ backgroundColor: '#F5EFE3', border: `1px solid ${c.back}`, zIndex: 1 }}
          aria-hidden
        />
        <motion.div
          variants={peekVariant(0, -34, -3, 0.08)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-8 rounded-sm shadow-md"
          style={{ backgroundColor: c.front, border: `1px solid ${c.peek}`, zIndex: 1 }}
          aria-hidden
        />

        {/* Back tab — peeks out the top of the front face */}
        <div
          className="absolute top-0 left-0 w-14 h-4 rounded-t-md"
          style={{ backgroundColor: c.back, zIndex: 2 }}
        />
        {/* Front face — holds the icon, sits on top of peek items so they hide at rest */}
        <div
          className="absolute top-3 left-0 w-full h-16 rounded-md rounded-tl-none flex items-center justify-center"
          style={{ backgroundColor: c.front, color: c.icon, zIndex: 3 }}
        >
          <div className="w-7 h-7 opacity-80">{icon}</div>
        </div>
      </motion.div>

      <span className="text-xs text-ink-800 font-medium max-w-[120px] text-center leading-tight">
        {name}
      </span>
    </motion.button>
  );
}
