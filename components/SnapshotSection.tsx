'use client';

// SnapshotSection — "field manual." A lab-notebook spread split down the
// middle: the left page is operating principles (how I work), the right is a
// dated status log (what I'm doing right now). Both are content that lives
// nowhere else on the site — unlike self-rated skill bars, this can't be
// contradicted by the case studies and tickets elsewhere on the page. Keeps
// the graph-paper sheet, washi tape, margin rule and draw-in-on-scroll
// animation from the original spread.
//
// ───────────────────────────────────────────────────────────────────────────
// SAMPLE CONTENT. `principles` are fairly durable — revisit occasionally.
// `nowItems` is meant to be a living log — update it every few weeks so the
// section keeps earning the "field notes" framing.
// ───────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Principle = { number: string; title: string; body: string };

type NowTag = 'Building' | 'Leading' | 'Learning' | 'Incoming';
type NowItem = { tag: NowTag; accent: string; label: string; detail: string };

const principles: Principle[] = [
  {
    number: '01',
    title: 'Correctness first, then speed',
    body: "A fast solution that's wrong isn't a solution. Prove it works, then optimize.",
  },
  {
    number: '02',
    title: 'Read the constraints twice',
    body: 'Half of debugging is realizing you solved a different problem than the one asked.',
  },
  {
    number: '03',
    title: 'Ship the API, then the polish',
    body: "A working endpoint beats a perfectly designed one that isn't deployed yet.",
  },
  {
    number: '04',
    title: 'Practice like it counts',
    body: 'Every problem solved is reps toward the next contest, not just a solved checkbox.',
  },
  {
    number: '05',
    title: 'Leave a trail',
    body: 'The person after me should be able to know exactly where I left off.',
  },
];

const nowItems: NowItem[] = [
  {
    tag: 'Building',
    accent: 'bg-accent-sky',
    label: 'NewsFlow',
    detail: 'Kotlin + Spring Boot news app, polishing the caching layer.',
  },
  {
    tag: 'Leading',
    accent: 'bg-accent-mint',
    label: 'CSEC Competitive Programming',
    detail: 'Mentoring 30+ members, running weekly practice rounds.',
  },
  {
    tag: 'Learning',
    accent: 'bg-accent-lilac',
    label: 'System Design',
    detail: 'Scaling patterns, caching, and distributed systems fundamentals.',
  },
{
  tag: 'Incoming',
  accent: 'bg-accent-coral',
  label: 'Hack 6.0',
  detail: 'External Affairs Lead — sponsorships & partnerships.',
},
];

const nowTags = [
  'C/C++',
  'Kotlin',
  'Java',
  'Python',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'Android SDK',
  'Git',
  'Data Structures',
  'Algorithms',
];

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-900/45 mb-3">
      {children}
    </div>
  );
}

function PageHeader({ index, title, tagline }: { index: string; title: string; tagline: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-ink-900/35">{index}</span>
        <h3 className="font-script text-5xl sm:text-6xl text-ink-900 leading-none">{title}</h3>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/45 mt-3 pl-9">
        {tagline}
      </p>
    </div>
  );
}

function PrinciplesPage({ live, side }: { live: boolean; side: number }) {
  return (
    <div className="flex flex-col gap-9">
      <PageHeader index="01" title="How I Work" tagline="operating principles" />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 12 }}
        animate={live ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: side * 0.1 + 0.05 }}
      >
        {principles.map((p) => (
          <div key={p.number} className="flex gap-4">
            <span className="font-mono text-xs text-ink-900/35 mt-1 shrink-0">{p.number}</span>
            <div>
              <div className="font-sans font-bold text-ink-900 leading-snug">{p.title}</div>
              <p className="font-sans text-sm leading-relaxed text-ink-900/70 mt-1">{p.body}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function RightNowPage({ live, side }: { live: boolean; side: number }) {
  return (
    <div className="flex flex-col gap-9">
      <PageHeader index="02" title="Right Now" tagline="what's on the bench" />

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={live ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: side * 0.1 + 0.05 }}
      >
        {nowItems.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.2em] text-ink-900 py-1 rounded-sm shrink-0 w-[78px] text-center ${item.accent}`}
            >
              {item.tag}
            </span>
            <div>
              <div className="font-sans font-bold text-ink-900 leading-snug">{item.label}</div>
              <p className="font-sans text-sm leading-relaxed text-ink-900/70 mt-1">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <div>
        <FieldLabel>on the bench right now</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {nowTags.map((t) => (
            <span
              key={t}
              className="font-mono text-xs text-ink-900 px-2.5 py-1 rounded-sm bg-accent-yellow"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SnapshotSection() {
  const { ref, inView: live } = useInView<HTMLDivElement>(0.15);

  return (
    <section id="work" className="relative py-28 sm:py-36 px-4 sm:px-8">
      <div className="font-script text-6xl text-ink-900/80 mb-4 text-center">field manual</div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-14">
        field notes · principles &amp; right now
      </p>

      <div className="mx-auto max-w-6xl [perspective:1600px]">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, rotate: -0.8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.4 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-sm bg-cream-50 shadow-window px-7 py-10 sm:px-14 sm:py-16"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(60,80,110,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,80,110,0.09) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* washi tape */}
          <span
            aria-hidden
            className="absolute -top-3 left-12 w-28 h-7 bg-accent-mint/60 rotate-[-7deg] shadow-sm"
          />
          <span
            aria-hidden
            className="absolute -top-3 right-14 w-24 h-7 bg-accent-yellow/60 rotate-[5deg] shadow-sm"
          />

          {/* page header */}
          <div className="flex items-end justify-between mb-12">
            <div className="font-script text-3xl text-ink-900 leading-none">field notes</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-900/45">
              updated · 08 / 2026
            </div>
          </div>

          {/* two-page spread */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <div className="lg:pr-14">
              <PrinciplesPage live={live} side={0} />
            </div>

            {/* center binding / fold */}
            <div className="relative lg:pl-14">
              <span
                aria-hidden
                className="hidden lg:block absolute left-0 inset-y-0 w-px border-l border-dashed border-ink-900/20"
              />
              <RightNowPage live={live} side={1} />
            </div>
          </div>
        </motion.div>
      </div>

      <p className="font-script text-lg text-ink-900/45 text-center mt-7">
        The notebook&rsquo;s never really finished.
      </p>
    </section>
  );
}
