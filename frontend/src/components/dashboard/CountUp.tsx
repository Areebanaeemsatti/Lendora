'use client';

import React, { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

interface CountUpProps {
  value: number;
  /** Formats the in-flight number (e.g. to "PKR 12,345") */
  format: (n: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Animated numeric counter for balance cards — counts up from 0 (or the
 * previous value) whenever `value` changes, using Framer Motion.
 */
export function CountUp({ value, format, duration = 1.1, className }: CountUpProps) {
  const motionValue = useMotionValue(0);
  const rendered = useTransform(motionValue, (v) => format(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, duration, motionValue]);

  return <motion.span className={className}>{rendered}</motion.span>;
}