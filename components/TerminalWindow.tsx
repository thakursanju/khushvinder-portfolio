'use client';

// TerminalWindow.tsx
// Technique: macOS-style terminal chrome (traffic-light dots + title) wrapping
// a typewriter that reveals scripted lines one char at a time via setInterval,
// then parks a blinking cursor on a fresh prompt — feels like a live shell.

import React, { useEffect, useState } from 'react';

type Line = { prompt?: string; text?: string; delay: number };

const lines: Line[] = [
  { prompt: '~ $ whoami', delay: 0 },
  { text: 'Backend/Android dev & ECE undergrad at NIT Hamirpur', delay: 800 },
  { prompt: '~ $ ls interests/', delay: 1600 },
  { text: 'robotics/  travel/  cricket/  hackathons/  entrepreneurship/', delay: 2400 },
];

const CHAR_MS = 28;

export default function TerminalWindow() {
  // typed[i] = the currently revealed substring for line i
  const [typed, setTyped] = useState<string[]>(() => lines.map(() => ''));
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    lines.forEach((line, i) => {
      const full = line.prompt ?? line.text ?? '';
      const startAt = line.delay;
      const t = setTimeout(() => {
        setActiveIndex(i);
        let pos = 0;
        const id = setInterval(() => {
          pos += 1;
          setTyped((prev) => {
            const next = prev.slice();
            next[i] = full.slice(0, pos);
            return next;
          });
          if (pos >= full.length) {
            clearInterval(id);
            if (i === lines.length - 1) {
              setDone(true);
              setActiveIndex(-1);
            }
          }
        }, CHAR_MS);
        intervals.push(id);
      }, startAt);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  return (
    <div className="bg-neutral-900 text-accent-coral rounded-lg p-5 shadow-2xl font-mono text-base w-[360px]">
      {/* Header */}
      <div className="flex items-center mb-3 relative">
        <div className="flex items-center gap-2">
          <span className="block w-3.5 h-3.5 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="block w-3.5 h-3.5 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="block w-3.5 h-3.5 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <div className="absolute left-0 right-0 text-center text-sm text-cream-100/60 pointer-events-none">
          ~/khushvinder/about
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1 min-h-[135px]">
        {lines.map((line, i) => {
          const isPrompt = line.prompt !== undefined;
          const colorClass = isPrompt ? 'text-cream-100/80' : 'text-accent-coral';
          const isActive = activeIndex === i;
          return (
            <div key={i} className={colorClass}>
              <span>{typed[i]}</span>
              {isActive && <span className="animate-blink">█</span>}
            </div>
          );
        })}

        {done && (
          <div className="text-cream-100/80">
            <span>~ $ </span>
            <span className="animate-blink">█</span>
          </div>
        )}
      </div>
    </div>
  );
}
