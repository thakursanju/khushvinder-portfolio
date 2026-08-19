// TicketCard.tsx
// Technique: a coral admission ticket split into a main body + a tear-off stub by a
// dashed perforation line with two punched notches (background-colored circles that
// straddle the top/bottom edges). The stub carries a faux barcode + serial number so
// the whole thing reads as a real event ticket rather than a plain coral card.

import React from 'react';

// Bar widths (in px) for the faux barcode — irregular on purpose so it scans as real.
const BARCODE = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 2];

export default function TicketCard() {
  return (
    <div className="relative inline-flex items-stretch bg-accent-coral text-cream-50 rounded-md shadow-card font-mono uppercase">
      {/* --- Main body --- */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-cream-50/80">
          <span className="border border-cream-50/70 px-1.5 py-[2px]">Admit One</span>
          <span>General Admission</span>
        </div>

        <div className="font-sans font-bold text-2xl tracking-wide leading-none mt-3">
          HACKSECURE&rsquo;26
        </div>

        <div className="text-[10px] tracking-[0.3em] mt-2 text-cream-50/90">
          Mar 2026 &middot; NIT Hamirpur
        </div>

        <div className="flex items-center gap-4 text-[9px] tracking-[0.2em] mt-3 text-cream-50/70">
          <span>Role&nbsp;·&nbsp;Ext.&nbsp;Affairs</span>
          <span>Team&nbsp;·&nbsp;CSEC</span>
          <span>Scale&nbsp;·&nbsp;500+</span>
        </div>
      </div>

      {/* --- Perforation: dashed line + two punched notches --- */}
      <div className="relative w-0 self-stretch">
        <span className="absolute inset-y-2 left-0 border-l-2 border-dashed border-cream-50/50" />
        <span className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream-50" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-cream-50" />
      </div>

      {/* --- Tear-off stub --- */}
      <div className="px-4 py-5 flex flex-col items-center justify-center gap-2">
        <div className="flex items-stretch gap-[2px] h-10">
          {BARCODE.map((w, i) => (
            <span key={i} className="block bg-cream-50" style={{ width: `${w}px` }} />
          ))}
        </div>
        <div className="text-[8px] tracking-[0.25em] text-cream-50/80">№ 0042</div>
      </div>
    </div>
  );
}
