'use client';

// PixelDisplay: a mini "ON AIR" desk radio. Each EQ bar runs its own
// randomized scaleY keyframe loop so the column reads like a real audio
// spectrum without piping any actual audio in. A coral LED pulses next to the
// label, and the whole device tilts in 3D on hover for tactility.
// Bar parameters are derived from `i` (no Math.random) so SSR and CSR agree.

import { motion } from 'framer-motion';

const NUM_BARS = 22;

// Each bar's "song" — duration + keyframes seeded from its index. Computed
// once at module load so React never re-creates the arrays on render.
const bars = Array.from({ length: NUM_BARS }, (_, i) => {
  const dur = 0.55 + ((i * 37) % 80) / 100;
  const delay = ((i * 13) % 17) / 22;
  return {
    dur,
    delay,
    keyframes: [
      0.25 + ((i * 17) % 55) / 100,
      0.85 + ((i * 23) % 15) / 100,
      0.35 + ((i * 41) % 45) / 100,
      1.0,
      0.4 + ((i * 11) % 30) / 100,
    ],
  };
});

export default function PixelDisplay() {
  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        whileHover={{ rotateY: 8, rotateX: -4, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="bg-ink-900 rounded-2xl p-3 w-[220px] relative"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.07),' +
            ' inset 0 -1px 0 rgba(0,0,0,0.7),' +
            ' 0 2px 0 rgba(0,0,0,0.5),' +
            ' 0 4px 0 #050505,' +
            ' 0 12px 24px -6px rgba(0,0,0,0.55)',
        }}
      >
        {/* Top status bar — pulsing LED + ON AIR label + signal bars */}
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5">
            <motion.span
              className="block w-2 h-2 rounded-full bg-accent-coral"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 6px 1px rgba(255,140,122,0.85)' }}
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent-coral/90">
              On Air
            </span>
          </div>
          {/* Tiny signal-strength bars (decorative) */}
          <div className="flex items-end gap-[1.5px] h-2.5">
            {[2, 4, 6, 8].map((h, i) => (
              <span
                key={i}
                className="w-[2px] bg-cream-100/40 rounded-[1px]"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>

        {/* EQ visualizer — main display surface */}
        <div
          className="rounded-md p-2 flex items-end gap-[2px] h-16 overflow-hidden relative"
          style={{
            background: 'radial-gradient(circle at 50% 100%, #1a0a0a 0%, #050000 70%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Faint scanline overlay — CRT feel */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,255,255,0.06) 2px 3px)',
            }}
          />

          {bars.map((b, i) => (
            <motion.div
              key={i}
              animate={{ scaleY: b.keyframes }}
              transition={{
                duration: b.dur,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay,
                repeatType: 'mirror',
              }}
              className="flex-1 rounded-sm origin-bottom"
              style={{
                background:
                  'linear-gradient(to top, #FFE066 0%, #FF8C7A 45%, #FF5C5C 100%)',
                height: '100%',
                minHeight: '3px',
                boxShadow: '0 0 4px rgba(255,140,122,0.4)',
              }}
            />
          ))}
        </div>

        {/* Bottom marquee strip — channel label */}
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream-100/55 mt-2.5 text-center">
          khushvinder.dev · ch 01
        </div>
      </motion.div>
    </div>
  );
}
