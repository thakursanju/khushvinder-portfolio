'use client';

// PlaylistCard: a standalone polaroid-style card that doubles as an audio
// player. Click the vinyl to play/pause; the record spins while playing and
// freezes at its current rotation when paused. The audio source is
// /audio/the-way.mp3 — drop your own file there (component never ships
// audio of its own).

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

function Vinyl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  // Persisted rotation so pausing freezes the record where it is, and resuming
  // continues from that angle instead of snapping back to 0.
  const rotation = useMotionValue(0);

  useEffect(() => {
    if (!playing) return;
    const controls = animate(rotation, rotation.get() + 360, {
      duration: 14,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [playing, rotation]);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pause The Way' : 'Play The Way'}
      className="relative block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-coral group"
    >
      <motion.svg
        viewBox="0 0 100 100"
        width={150}
        height={150}
        aria-hidden="true"
        style={{ rotate: rotation }}
      >
        {/* Circular clip so the cover image fits the round label area */}
        <defs>
          <clipPath id="vinyl-label-clip">
            <circle cx="50" cy="50" r="18" />
          </clipPath>
        </defs>

        {/* Vinyl base + concentric grooves */}
        <circle cx="50" cy="50" r="48" fill="#0d0d0d" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#2a2a2a" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#2a2a2a" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#2a2a2a" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="#2a2a2a" strokeWidth="0.4" />

        {/* Fallback colored label — visible if the cover image is missing */}
        <circle cx="50" cy="50" r="18" fill="#1f9d4d" />

        {/* Album cover as the label. File lives at /public/images/the-way-cover.jpg */}
        <image
          href="/images/the-way-cover.jpg"
          x="32"
          y="32"
          width="36"
          height="36"
          clipPath="url(#vinyl-label-clip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Spindle hole — sits on top of the label so it always punches through */}
        <circle cx="50" cy="50" r="2.6" fill="#f5efe6" />

        {/* Light streak — sells that the record is rotating */}
        <path d="M 50 12 A 38 38 0 0 1 78 28" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </motion.svg>

      {/* Play / pause overlay — appears on hover, or always when paused */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-90'
        }`}
        aria-hidden
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-900/70 backdrop-blur-sm text-cream-50 shadow-lg">
          {playing ? (
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}

export default function PlaylistCard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Sync state if the audio ends or fails — keeps the vinyl UI honest.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener('ended', onEnded);
    a.addEventListener('pause', onPause);
    a.addEventListener('play', onPlay);
    return () => {
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('play', onPlay);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {
        // Autoplay/permission errors — fail silently rather than crash.
        setPlaying(false);
      });
    } else {
      a.pause();
    }
  };

  return (
    <motion.div
      whileHover={{ rotate: -1, y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="bg-cream-50 rounded-xl w-72 px-6 pt-6 pb-5 -rotate-3 relative"
      style={{
        boxShadow:
          '0 1px 0 rgba(0,0,0,0.06), 0 10px 30px -8px rgba(0,0,0,0.28), 0 22px 40px -16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Drop the track file at /public/audio/the-way.mp3 — the component
          ships no audio of its own. */}
      <audio ref={audioRef} src="/audio/the-way.mp3" preload="auto" />

      <div className="flex justify-center">
        <Vinyl playing={playing} onToggle={toggle} />
      </div>

      <div className="text-center mt-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-900/60">
          Now Playing
        </div>
        <div className="font-sans font-semibold text-lg mt-1.5 text-ink-900">
          The Way
        </div>
        <div className="text-xs text-ink-900/55 mt-1">Ariana Grande ft. Mac Miller</div>
        <div className="text-[10px] text-ink-900/35 mt-3 italic font-mono">
          {playing ? '▶ now spinning' : '⏸ tap the record'}
        </div>
      </div>
    </motion.div>
  );
}
