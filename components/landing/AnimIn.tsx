'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.65, 0, 0.35, 1] as const;

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function FadeUp({ children, delay = 0, className }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function Stagger({ children, className, stagger = 0.08, delay = 0 }: StaggerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export const fadeUpChild = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
