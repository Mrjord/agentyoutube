"use client";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ElementType, type RefObject } from "react";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  as?: ElementType;
  animationNum?: number;
  timelineRef?: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children: React.ReactNode;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export function TimelineContent({
  as: Tag = "div",
  animationNum = 0,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const variants = customVariants ?? defaultVariants;

  return (
    <motion.div
      ref={ref}
      custom={animationNum}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {/* @ts-ignore */}
      {Tag === "div" ? children : <Tag>{children}</Tag>}
    </motion.div>
  );
}
