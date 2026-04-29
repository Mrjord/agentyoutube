"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  density?: number;
  speed?: number;
  color?: string;
  direction?: "top" | "bottom";
  className?: string;
}

export function Sparkles({
  density = 800,
  speed = 1,
  color = "#FFFFFF",
  direction = "bottom",
  className,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const particles: { x: number; y: number; vy: number; alpha: number; size: number }[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const spawn = () => ({
      x: Math.random() * w,
      y: direction === "bottom" ? 0 : h,
      vy: (0.3 + Math.random() * 0.7) * speed * (direction === "bottom" ? 1 : -1),
      alpha: 0.4 + Math.random() * 0.6,
      size: 0.5 + Math.random() * 1.5,
    });

    const count = Math.floor(density / 100);
    for (let i = 0; i < count; i++) particles.push(spawn());

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.y += p.vy;
        p.alpha -= 0.002;
        if (p.alpha <= 0 || p.y > h + 5 || p.y < -5) {
          Object.assign(p, spawn());
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [density, speed, color, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
    />
  );
}
