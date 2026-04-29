"use client";

import { useEffect, useRef, useState } from "react";

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  className?: string;
  height?: number;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS = [
  "La Clé des Marchés",
  "Marketing Flow",
  "Mindset Business",
  "Code & Café",
  "Léa Creates",
  "Finance Réelle",
  "L'Atelier Vidéo",
  "Startup Stories",
];

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 32,
  color = "#3A3A44",
  fontWeight = 700,
  pixelsPerFrame = 1.2,
  rotateY = -22,
  rotateX = 6,
  perspective = 1000,
  fadeColor = "#0D0D10",
  background = "transparent",
  className,
  height = 80,
}: PerspectiveMarqueeProps) {
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [offset, setOffset] = useState(0);

  const itemPadding = fontSize * 1.4;
  const approxItemWidth = items.reduce(
    (acc, item) => acc + item.length * fontSize * 0.55 + itemPadding,
    0,
  );

  useEffect(() => {
    const animate = () => {
      frameRef.current += 1;
      const newOffset = -((frameRef.current * pixelsPerFrame) % approxItemWidth);
      setOffset(newOffset);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pixelsPerFrame, approxItemWidth]);

  const rendered = [...items, ...items, ...items];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height,
        background,
        overflow: "hidden",
        perspective: `${perspective}px`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            transform: `translateX(${offset}px)`,
          }}
        >
          {rendered.map((item, i) => {
            const viewportWidth = 1280;
            const itemCenter =
              i * (approxItemWidth / items.length) +
              approxItemWidth / items.length / 2 +
              offset;
            const norm = (itemCenter - viewportWidth / 2) / (viewportWidth / 2);
            const distance = Math.min(1, Math.abs(norm));
            const blurPx = distance * 4;
            const opacity = 1 - distance * 0.5;

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILY,
                  fontSize,
                  fontWeight,
                  color,
                  letterSpacing: "-0.02em",
                  paddingRight: itemPadding,
                  filter: `blur(${blurPx}px)`,
                  opacity,
                  userSelect: "none",
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 20%, transparent 80%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  );
}
