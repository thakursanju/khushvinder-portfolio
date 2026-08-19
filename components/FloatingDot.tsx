'use client';

// FloatingDot: an absolutely-positioned ink dot that lazily wanders along a
// looped keyframe path via framer-motion. Used as a subtle "kinetic punctuation"
// motif scattered across hero and section corners — the parent controls the
// anchor point through `className`, the motion timing stays consistent.

import { motion } from 'framer-motion';

type FloatingDotProps = {
  className?: string;
};

export default function FloatingDot({ className = '' }: FloatingDotProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute w-3 h-3 rounded-full bg-ink-900 ${className}`}
      animate={{
        x: [0, 60, -20, 40, 0],
        y: [0, -40, 30, -10, 0],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
