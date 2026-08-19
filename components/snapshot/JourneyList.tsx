// JourneyList: an ordered list styled like a timeline log. Each row pairs a
// colored dot + mono index on the left with a category pill on the right,
// borrowing the visual language of a release-notes / changelog table.

import React from 'react';

const dotColors = [
  'bg-accent-yellow',
  'bg-accent-coral',
  'bg-accent-mint',
  'bg-accent-lilac',
  'bg-accent-sky',
  'bg-accent-yellow',
  'bg-accent-coral',
  'bg-accent-mint',
];

const items = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    index: n,
    label: `[YOUR_JOURNEY_${n}_LABEL]`,
    category: `[YOUR_JOURNEY_${n}_CATEGORY]`,
  };
});

function JourneyList() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4 h-full">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        My journey
      </div>
      <ol>
        {items.map((item, i) => (
          <li
            key={item.index}
            className="flex items-center gap-3 py-2 border-b border-ink-900/5 last:border-0"
          >
            <span
              aria-hidden
              className={`w-1.5 h-1.5 rounded-full ${dotColors[i % dotColors.length]}`}
            />
            <span className="font-mono text-xs text-ink-900/40 w-6">
              {item.index}
            </span>
            <span className="text-sm text-ink-900">{item.label}</span>
            <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border border-ink-900/10 text-ink-700">
              {item.category}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default JourneyList;
