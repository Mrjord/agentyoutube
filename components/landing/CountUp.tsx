'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: string; // e.g. "10 247" or "98%"
  duration?: number;
}

function parseNum(s: string) {
  return parseInt(s.replace(/\D/g, ''), 10) || 0;
}

function formatNum(n: number, template: string): string {
  const formatted = n.toLocaleString('fr-FR');
  // If template had a non-numeric suffix (%, s) append it
  const suffix = template.replace(/[\d\s]/g, '');
  return formatted + suffix;
}

export function CountUp({ value, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');
  const target = parseNum(value);

  useEffect(() => {
    if (!inView || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatNum(Math.floor(eased * target), value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, value]);

  return <span ref={ref}>{display}</span>;
}
