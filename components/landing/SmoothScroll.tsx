'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // anchor links
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href^="#"]');
      if (!anchor) return;
      e.preventDefault();
      const id = (anchor as HTMLAnchorElement).getAttribute('href')!.slice(1);
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
