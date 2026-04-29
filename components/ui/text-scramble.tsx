"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"

interface TextScrambleProps {
  text: string
  className?: string
  /** className applied to the inner text <span> — overrides default font/size/case */
  textClassName?: string
  /** className for a char that is actively scrambling (default: text-primary scale-110) */
  scrambleCharClassName?: string
  /** className for a char at rest / already revealed (default: text-foreground) */
  restCharClassName?: string
  /** fire the scramble automatically once after this delay (ms) */
  autoScrambleDelay?: number
}

export function TextScramble({
  text,
  className = "",
  textClassName,
  scrambleCharClassName = "text-primary scale-110",
  restCharClassName = "text-foreground",
  autoScrambleDelay,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    setIsScrambling(true)
    frameRef.current = 0
    const duration = text.length * 3

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealedLength) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplayText(newText)

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text])

  const handleMouseEnter = () => {
    setIsHovering(true)
    scramble()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  useEffect(() => {
    if (autoScrambleDelay !== undefined) {
      const t = setTimeout(() => scramble(), autoScrambleDelay)
      return () => clearTimeout(t)
    }
  }, [autoScrambleDelay, scramble])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div
      className={cn("group relative inline-flex flex-col cursor-pointer select-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={cn("relative", textClassName ?? "font-mono text-lg tracking-widest uppercase")}>
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={cn(
              "inline-block transition-all duration-150",
              isScrambling && char !== text[i] ? scrambleCharClassName : restCharClassName,
            )}
            style={{ transitionDelay: `${i * 10}ms` }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* animated underline */}
      <span className="relative h-px w-full mt-1 overflow-hidden">
        <span
          className={cn(
            "absolute inset-0 transition-transform duration-500 ease-out origin-left",
            isHovering ? "scale-x-100" : "scale-x-0",
            restCharClassName.includes("text-[#") ? `bg-current` : "bg-foreground",
          )}
        />
        <span className="absolute inset-0 bg-border" />
      </span>

      {/* subtle glow */}
      <span
        className={cn(
          "absolute -inset-4 rounded-lg bg-primary/5 transition-opacity duration-300 -z-10",
          isHovering ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  )
}
