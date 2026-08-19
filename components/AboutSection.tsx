'use client';

// AboutSection: combines a tactile "sticky note" object with a large typographic
// statement. The sticky note tilts on hover via framer-motion to reinforce the
// physical metaphor, while pill-highlighted keywords in mono type create a
// scannable, editorial rhythm beneath it.

import React from 'react';
import { motion } from 'framer-motion';

const pillBase =
  'inline-block px-3 py-0.5 rounded-full border-2 border-ink-900';

function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-8"
    >
      <motion.div
        whileHover={{ rotate: -1, y: -4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative bg-accent-yellow text-ink-900 shadow-sticky p-8 max-w-xl mx-auto font-sans text-lg leading-relaxed -rotate-2"
      >
        <span
          aria-hidden
          className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[60px] h-5 bg-ink-900/10"
          style={{ transform: 'translateX(-50%) rotate(4deg)' }}
        />
        <p>
          I'm an ECE undergrad at NIT Hamirpur (top 25 of 800), building backend
          systems and Android apps in my off hours. I lead the competitive
          programming track at CSEC and have solved 900+ DSA problems along the
          way. When I'm not shipping APIs, I'm probably grinding a Codeforces round.
        </p>
      </motion.div>

      <p className="font-mono text-2xl sm:text-4xl leading-relaxed max-w-3xl mx-auto mt-20 text-center text-ink-900">
        I build{' '}
        <span
          className={`${pillBase} bg-accent-yellow`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          backends
        </span>{' '}
        that feel like{' '}
        <span
          className={`${pillBase} bg-accent-mint`}
          style={{ transform: 'rotate(2deg)' }}
        >
          clockwork
        </span>
        , not{' '}
        <span
          className={`${pillBase} bg-accent-coral`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          duct tape
        </span>
        . I sweat{' '}
        <span
          className={`${pillBase} bg-accent-lilac`}
          style={{ transform: 'rotate(1deg)' }}
        >
          algorithms
        </span>
        , obsess over{' '}
        <span
          className={`${pillBase} bg-accent-sky`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          latency
        </span>
        , and ship.
      </p>
    </section>
  );
}

export default AboutSection;
