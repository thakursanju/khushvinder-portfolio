// StatCards: the "by the numbers" headline row of the snapshot dashboard — a
// grid of single-metric cards in the same cream chrome as the other widgets.
// Each big number is the proof; the mono label underneath is the context.
//
// SAMPLE NUMBERS. Replace `stats` with your real ones — lead with the metric.

import React from 'react';

type Stat = { value: string; label: string; dot: string };

// Full class strings so Tailwind keeps them.
const stats: Stat[] = [
  { value: '600+', label: 'Users reached', dot: 'bg-accent-coral' },
  { value: '+18%', label: 'Activation lift', dot: 'bg-accent-sky' },
  { value: '3', label: 'Products shipped', dot: 'bg-accent-mint' },
  { value: '30', label: 'PMs led', dot: 'bg-accent-lilac' },
];

function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-cream-50 border border-ink-900/10 rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="font-sans font-bold text-3xl leading-none text-ink-900">
            {s.value}
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-900/60">
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;
