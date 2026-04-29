'use client';

import { useEffect, useRef } from 'react';

interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number; yellow: boolean }

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    let particles: P[] = [];
    let mx = -999, my = -999;
    let raf = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const init = () => {
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.1),
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.35 + 0.08,
        yellow: Math.random() > 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.8;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }
        // Dampen velocity
        p.vx *= 0.98;
        p.vy = p.vy * 0.98 - 0.12; // keep upward bias
        if (p.vy < -0.6) p.vy = -0.6;

        p.x = ((p.x + p.vx) % W + W) % W;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.yellow
          ? `rgba(255,230,0,${p.alpha})`
          : `rgba(245,240,232,${p.alpha * 0.6})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas.parentElement!);

    resize();
    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
