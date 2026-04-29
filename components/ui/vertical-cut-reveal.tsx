"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "chars";
  staggerDuration?: number;
  staggerFrom?: "first" | "last";
  reverse?: boolean;
  containerClassName?: string;
  transition?: object;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.15,
  staggerFrom = "first",
  reverse = false,
  containerClassName,
  transition = { type: "spring", stiffness: 250, damping: 40 },
}: VerticalCutRevealProps) {
  const units = splitBy === "words" ? children.split(" ") : children.split("");
  const total = units.length;

  return (
    <span className={cn("flex flex-wrap gap-x-2", containerClassName)}>
      {units.map((unit, i) => {
        const idx = staggerFrom === "last" ? total - 1 - i : i;
        return (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: reverse ? "-100%" : "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: (transition as any).delay ?? 0 + idx * staggerDuration }}
            >
              {unit}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
