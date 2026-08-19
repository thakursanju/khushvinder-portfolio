// PolaroidCollage.tsx
// Technique: a kraft-paper backdrop hosts absolutely-positioned polaroid prints
// at small random rotations to feel hand-placed, each pinned down with a strip of
// washi tape. Inline leaf SVGs and a script caption add organic warmth.

import React from 'react';

// Drop /public/images/polaroid-1.jpg ... polaroid-4.jpg to fill the frames.

type Polaroid = { src: string; alt: string; top: string; left: string; rotate: number; z?: number; tapeRotate: number };

const polaroids: Polaroid[] = [
  { src: '/images/polaroid-1.jpg', alt: '', top: '12px', left: '6px', rotate: -8, tapeRotate: -5 },
  // Party photo pulled to the front of the stack.
  { src: '/images/polaroid-2.jpg', alt: '', top: '30px', left: '124px', rotate: 5, z: 10, tapeRotate: 7 },
  { src: '/images/polaroid-3.jpg', alt: '', top: '124px', left: '22px', rotate: -4, tapeRotate: 4 },
  { src: '/images/polaroid-4.jpg', alt: '', top: '112px', left: '154px', rotate: 9, tapeRotate: -6 },
];

function Leaf({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M5 35 C 5 15, 25 5, 35 5 C 35 25, 25 35, 5 35 Z"
        fill="#7a9b6e"
      />
      <path
        d="M5 35 C 15 25, 25 15, 35 5"
        stroke="#3f5a39"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export default function PolaroidCollage() {
  return (
    <div className="relative bg-kraft-200 rounded-2xl p-4 shadow-card overflow-hidden w-[290px] h-[240px] scale-110">
      {polaroids.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)`, zIndex: p.z }}
        >
          {/* Washi tape pinning the print to the page */}
          <span
            aria-hidden="true"
            className="absolute -top-2 left-1/2 h-4 w-12 bg-cream-50/55 shadow-sm"
            style={{ transform: `translateX(-50%) rotate(${p.tapeRotate}deg)` }}
          />
          <img
            src={p.src}
            alt={p.alt}
            className="block w-28 h-28 bg-cream-50 p-1.5 pb-5 shadow-md object-cover"
          />
        </div>
      ))}

      {/* Leaf accents */}
      <Leaf className="absolute -top-2 -left-2 opacity-80" />
      <Leaf className="absolute -bottom-3 -right-1 opacity-70" flip />

      {/* Script caption */}
      <div className="absolute bottom-2 right-3 font-script text-2xl text-ink-900/70 pointer-events-none">
        capture moments
      </div>
    </div>
  );
}
