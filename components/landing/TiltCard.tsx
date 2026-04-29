'use client';

import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className, intensity = 8 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(6px)`;
    el.style.transition = 'transform 0.08s ease-out';
    // Glow follows cursor
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    const el = cardRef.current!;
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* cursor glow */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle 120px at var(--gx, 50%) var(--gy, 50%), rgba(255,230,0,0.06), transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
