'use client';

// MacWindow: a reusable chrome wrapper that imitates a macOS application window.
// Traffic-light dots show their real macOS glyphs (× − +) on hover. The yellow
// dot is wired up to minimize/restore the body so the window feels alive, not
// just decorative. Optional `toolbar` and `statusBar` slots give the full Finder
// affordance — title bar → toolbar → content → status bar.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MacWindowProps = {
  title: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  statusBar?: React.ReactNode;
  className?: string;
};

const TRAFFIC = {
  red: '#FF5F57',
  yellow: '#FEBC2E',
  green: '#28C840',
} as const;

function CloseGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="w-2 h-2 text-ink-900/70">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function MinGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="w-2 h-2 text-ink-900/70">
      <path d="M2.5 6 L9.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function MaxGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="w-2 h-2 text-ink-900/70">
      <path d="M3.5 6.5 L3.5 3.5 L6.5 3.5 M8.5 5.5 L8.5 8.5 L5.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TrafficLight({
  color,
  hovered,
  glyph,
  onClick,
  label,
}: {
  color: string;
  hovered: boolean;
  glyph: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-3 h-3 rounded-full flex items-center justify-center border border-black/10"
      style={{ backgroundColor: color }}
    >
      <span className={`transition-opacity duration-100 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        {glyph}
      </span>
    </button>
  );
}

export default function MacWindow({
  title,
  children,
  toolbar,
  statusBar,
  className = '',
}: MacWindowProps) {
  const [hoveringLights, setHoveringLights] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-window bg-cream-50 border border-ink-900/10 ${className}`}
    >
      {/* Title bar */}
      <div
        className="bg-cream-200 border-b border-ink-900/10 flex items-center px-3 py-2 gap-2 relative select-none"
        onMouseEnter={() => setHoveringLights(true)}
        onMouseLeave={() => setHoveringLights(false)}
      >
        <div className="flex items-center gap-2">
          <TrafficLight color={TRAFFIC.red}    hovered={hoveringLights} glyph={<CloseGlyph />} label="Close (decorative)" />
          <TrafficLight color={TRAFFIC.yellow} hovered={hoveringLights} glyph={<MinGlyph />}   onClick={() => setMinimized((m) => !m)} label={minimized ? 'Restore window' : 'Minimize window'} />
          <TrafficLight color={TRAFFIC.green}  hovered={hoveringLights} glyph={<MaxGlyph />}   label="Maximize (decorative)" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-ink-700 truncate max-w-[60%] text-center">
          {title}
        </div>
      </div>

      {/* Body — collapses smoothly on minimize */}
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Optional toolbar row (e.g. back/forward buttons + breadcrumb) */}
            {toolbar && (
              <div className="bg-cream-100/80 border-b border-ink-900/10 px-3 py-1.5 flex items-center gap-2 min-h-[34px]">
                {toolbar}
              </div>
            )}
            {children}
            {statusBar && (
              <div className="bg-cream-200/70 border-t border-ink-900/10 px-3 py-1.5 font-mono text-[10px] text-ink-700/70 flex items-center justify-between">
                {statusBar}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
