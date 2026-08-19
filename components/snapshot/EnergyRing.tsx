// EnergyRing: an SVG donut where the progress arc is drawn by manipulating
// stroke-dasharray/offset against the full circumference, giving a precise,
// crisp ring at any size without a charting lib. The accent-coral stroke and
// mono numeric provide a "dashboard widget" feel.

import React from 'react';

type EnergyRingProps = {
  value: number;
  label?: string;
  caption?: string;
};

function EnergyRing({
  value,
  label = 'Energy level',
  caption = "Today's charge",
}: EnergyRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4 flex flex-col items-center">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3 self-start">
        {label}
      </div>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            className="stroke-cream-200"
            strokeWidth={stroke}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            className="stroke-accent-coral"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-2xl text-ink-900">
          {clamped}%
        </div>
      </div>
      <div className="font-mono text-[10px] text-ink-900/50 uppercase mt-3">
        {caption}
      </div>
    </div>
  );
}

export default EnergyRing;
