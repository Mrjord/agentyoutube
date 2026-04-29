'use client';

import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on fine pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    dot.style.display = 'block';
    ring.style.display = 'block';

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(loop);
    };

    const addHover = () => ring.classList.add('cur-hover');
    const removeHover = () => ring.classList.remove('cur-hover');
    const addClick = () => dot.classList.add('cur-click');
    const removeClick = () => dot.classList.remove('cur-click');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', addClick);
    document.addEventListener('mouseup', removeClick);
    raf = requestAnimationFrame(loop);

    // Attach to all interactive elements dynamically via event delegation
    const onEnter = (e: Event) => {
      const el = e.target as Element;
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) addHover();
    };
    const onLeave = (e: Event) => {
      const el = e.target as Element;
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) removeHover();
    };
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', addClick);
      document.removeEventListener('mouseup', removeClick);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{ display: 'none' }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-[#FFE600] transition-[width,height] duration-150"
      />
      <div
        ref={ringRef}
        style={{ display: 'none' }}
        className="cur-ring pointer-events-none fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border border-[#FFE600]/40"
      />
    </>
  );
}
