// DesignNotes: a wrapping cloud of "toolkit" chips — the tools a recruiter
// keyword-scans for — rotating through the accent palette. The fixed cream
// chrome matches sibling snapshot cards so they read as one set.
//
// SAMPLE TOOLKIT. Swap in the tools you actually use.

import React from 'react';

const tools = [
  'Figma',
  'Notion',
  'SQL',
  'Amplitude',
  'Mixpanel',
  'Linear',
  'Jira',
  'Looker',
  'Miro',
  'User research',
  'A/B testing',
  'Roadmapping',
];

const accentBgs = [
  'bg-accent-yellow',
  'bg-accent-mint',
  'bg-accent-coral',
  'bg-accent-lilac',
  'bg-accent-sky',
];

function DesignNotes() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        Toolkit
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool, i) => (
          <div
            key={tool}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border border-ink-900/10 text-ink-900 ${accentBgs[i % accentBgs.length]}`}
          >
            {tool}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignNotes;
