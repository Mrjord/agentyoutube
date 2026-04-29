'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

export function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(true);
    };

    const onLeave = () => setActive(false);

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed z-[9999] -translate-x-1 -translate-y-1"
          style={{ top: y, left: x }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <MousePointer2
            size={22}
            className="text-[#FFE600] drop-shadow-[0_0_6px_rgba(255,230,0,0.5)]"
            fill="#FFE600"
            strokeWidth={1.5}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
