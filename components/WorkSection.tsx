'use client';

// WorkSection ("Case Files"): product work shown as manila folders in an open
// drawer. A row of folder tabs switches the active file; the selected file's
// "document" — a typed case study (Problem → What I did → Outcome) — slides into
// view inside the open folder. Reuses the desk-object metaphor from the hero
// (the yellow folder) and the site's kraft / cream / accent palette + mono labels.
//
// ───────────────────────────────────────────────────────────────────────────
// SAMPLE CONTENT. Replace the `caseFiles` array below with your real work.
// Keep `featured: true` on the one you want recruiters to read first (the
// startup). Each file reads top→bottom: the problem, the calls you made, the
// result. Lead the outcome with a number wherever you have one.
// ───────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CaseFile = {
  name: string;
  tag: string; // category "stamp" on the document
  accent: AccentKey; // colored index sticker on the folder tab
  role: string;
  timeframe: string;
  problem: string;
  approach: string[]; // the product decisions you made
  outcome: string[]; // results — lead each with a number if you have one
  stack: string[];
  stackLabel?: string; // defaults to "Stack"; e.g. "Product" for a process/tools row
  links: { label: string; href: string }[];
  featured?: boolean;
};

// Full class strings so Tailwind doesn't purge them.
type AccentKey = 'coral' | 'sky' | 'mint' | 'lilac';
const ACCENT_DOT: Record<AccentKey, string> = {
  coral: 'bg-accent-coral',
  sky: 'bg-accent-sky',
  mint: 'bg-accent-mint',
  lilac: 'bg-accent-lilac',
};

const caseFiles: CaseFile[] = [
  {
    name: 'NewsFlow',
    tag: 'Android + Backend',
    accent: 'coral',
    role: 'Solo, full-stack build',
    timeframe: '2026',
    featured: true,
    problem:
      'Reading news on mobile usually means slow loads, no offline access, and a backend that can\u2019t keep up. NewsFlow is a full-stack news platform built to fix all three.',
    approach: [
      'Built a Kotlin + Jetpack Compose Android client on top of a Spring Boot REST backend, applying MVVM + Clean Architecture across 6+ screens.',
      'Wired up Firebase Authentication with secure JWT-based sessions so the client and backend trust each other without re-auth friction.',
      'Deployed 5 REST endpoints on Render.com via Docker, and used Room Database caching so favorites and reads sync back to PostgreSQL.',
    ],
    outcome: [
      'Delivers 1,000+ articles via Retrofit + Paging 3 with smooth infinite scroll.',
      '60% faster loads through Room Database caching.',
    ],
    stack: ['Kotlin', 'Spring Boot', 'Jetpack Compose', 'Firebase', 'PostgreSQL', 'Docker'],
    links: [
      { label: 'Android', href: 'https://github.com/thakursanju/NewsFlow-AI' },
      { label: 'Backend', href: 'https://github.com/thakursanju/NewsFlow-Backend' }
    ],
  },
  {
    name: 'ResuMatch-AI',
    tag: 'ML + Web',
    accent: 'sky',
    role: 'Solo, design & build',
    timeframe: '2026',
    problem:
      'Matching a resume to a job description by eye is slow and inconsistent. ResuMatch-AI scores the match and surfaces the gaps automatically.',
    approach: [
      'Combined TF-IDF cosine similarity, named-entity recognition (spaCy), and custom regex to extract skills and compute real-time match scores.',
      'Processed 1,000+ words per resume with 95%+ skill-extraction accuracy while keeping response time under 2000ms.',
      'Shipped a secure, responsive Streamlit app surfacing match scores, keyword insights, and skill gaps across 10+ sections.',
    ],
    outcome: [
      'Used by 100+ users on Streamlit Cloud.',
      'Sub-2-second real-time similarity scoring at 95%+ extraction accuracy.',
    ],
    stack: ['Python', 'spaCy', 'scikit-learn', 'Streamlit Cloud'],
    links: [{ label: 'GitHub', href: 'https://github.com/thakursanju/resumeMatchAI' }],
  },
  {
    name: 'CODEARENA',
    tag: 'Contest Ops',
    accent: 'mint',
    role: 'Competitive Programming Lead, CSEC',
    timeframe: 'May 2025 - Present',
    problem:
      'CSEC wanted a flagship competitive-programming contest to grow the club\u2019s CP culture at NIT Hamirpur \u2014 but that meant building the mentoring pipeline and the event from scratch.',
    approach: [
      'Lead the Competitive Programming division of CSEC, mentoring 30+ members on DSA and contest strategy.',
      'Designed and organized CODEARENA end to end: problem selection, logistics, and judging.',
      'Built a repeatable mentorship structure so the division keeps running contests beyond a single event.',
    ],
    outcome: [
      '100+ participants at CODEARENA.',
      '30+ members actively mentored in competitive programming.',
    ],
    stack: ['Codeforces', 'Mentorship', 'Contest Design'],
    stackLabel: 'Ops',
    links: [],
  },
];

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-900/45 mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function WorkSection() {
  const [active, setActive] = useState(0);
  const file = caseFiles[active];

  return (
    <section id="casefiles" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <p className="font-script text-6xl text-ink-900/80 mb-4 text-center">
        case files
      </p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-10">
        selected product work · tap a folder
      </p>

      <div className="mx-auto max-w-5xl">
        {/* Folder tabs */}
        <div className="flex flex-wrap gap-1.5 px-2 relative z-10">
          {caseFiles.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`relative rounded-t-lg border border-b-0 border-ink-900/10 px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-kraft-300 text-ink-900'
                    : 'bg-kraft-200/70 text-ink-700/60 hover:bg-kraft-200 hover:text-ink-700'
                }`}
                style={{ transform: isActive ? 'translateY(1px)' : 'translateY(3px)' }}
              >
                <span
                  aria-hidden
                  className={`inline-block w-2 h-2 rounded-[2px] mr-2 align-middle ${ACCENT_DOT[f.accent]}`}
                />
                {f.name}
                {f.featured && (
                  <span className="ml-1.5 text-accent-coral" aria-hidden>
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Open manila folder */}
        <div className="relative rounded-b-2xl rounded-tr-2xl bg-kraft-300 shadow-card p-2.5 sm:p-4">
          {/* faint folder seam */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-4 h-px bg-ink-900/10"
          />

          {/* Document sheet */}
          <AnimatePresence mode="wait">
            <motion.article
              key={file.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="bg-cream-50 paper-texture rounded-lg shadow-card p-6 sm:p-10"
            >
              {/* Header: title + role, stamped category */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-900/10 pb-5">
                <div>
                  <h3 className="font-sans font-bold text-2xl sm:text-3xl text-ink-900 leading-none">
                    {file.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-700/70 mt-2.5">
                    {file.role} · {file.timeframe}
                  </p>
                </div>
                <span
                  className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] border-2 border-accent-coral text-accent-coral rounded px-2.5 py-1 shrink-0"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  {file.tag}
                </span>
              </div>

              {/* Body */}
              <div className="mt-6 grid gap-7 sm:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                  <FieldBlock label="Problem">
                    <p className="text-ink-900/85 leading-relaxed text-[15px]">
                      {file.problem}
                    </p>
                  </FieldBlock>

                  <FieldBlock label="What I did">
                    <ul className="space-y-2.5">
                      {file.approach.map((a, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-ink-900/85 leading-relaxed text-[15px]"
                        >
                          <span className="font-mono text-ink-900/35 text-xs mt-1 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </FieldBlock>
                </div>

                <div className="space-y-6">
                  <FieldBlock label="Outcome">
                    <ul className="space-y-2.5">
                      {file.outcome.map((o, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-ink-900/90 leading-relaxed text-[15px]"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-coral"
                          />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </FieldBlock>

                  <FieldBlock label={file.stackLabel ?? 'Stack'}>
                    <div className="flex flex-wrap gap-2">
                      {file.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[11px] text-ink-700 bg-cream-200 border border-ink-900/10 rounded-full px-2.5 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </FieldBlock>
                </div>
              </div>

              {/* Links */}
              {file.links.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3 border-t border-ink-900/10 pt-5">
                  {file.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded hover:bg-ink-800 transition-colors"
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
