'use client';

import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatCard({ children, className, amplitude = 10, duration = 4 }: Props) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}
