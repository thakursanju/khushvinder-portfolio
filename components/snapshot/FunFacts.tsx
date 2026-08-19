'use client';

// FunFacts: image + bullet list, paired so the photo provides a tactile anchor
// while the facts read like jotted margin notes. The framer-motion hover tilts
// the image to reward cursor exploration without distracting from text.

import React from 'react';
import { motion } from 'framer-motion';

const facts = [
  '[YOUR_FUN_FACT_1]',
  '[YOUR_FUN_FACT_2]',
  '[YOUR_FUN_FACT_3]',
  '[YOUR_FUN_FACT_4]',
];

function FunFacts() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4 h-full">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        Fun facts
      </div>
      <div className="flex gap-4 items-start">
        <motion.img
          src="/images/boba.jpg"
          alt="boba"
          className="w-32 h-32 rounded-lg object-cover bg-cream-200 shrink-0"
          whileHover={{ rotate: -3, scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        />
        <ul className="flex-1 space-y-2">
          {facts.map((fact, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-relaxed text-ink-900"
            >
              <span
                aria-hidden
                className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-900/40 shrink-0"
              />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FunFacts;
