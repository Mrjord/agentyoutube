'use client';

import { useEffect, useRef } from 'react';

interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number; red: boolean }

export function PageParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = window.innerWidth, H = window.innerHeight;
    let particles: P[] = [];
    let mx = -999, my = -999;
    let raf = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const init = () => {
      particles = Array.from({ length: 160 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.3 + 0.05),
        size: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.28 + 0.06,
        red: Math.random() > 0.65,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.7;
          p.vx += (dx / dist) * force * 0.12;
          p.vy += (dy / dist) * force * 0.12;
        }
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 - 0.08;
        if (p.vy < -0.5) p.vy = -0.5;

        p.x = ((p.x + p.vx) % W + W) % W;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(196,48,43,${p.alpha})`
          : `rgba(245,240,232,${p.alpha * 0.5})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    resize();
    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  );
}
