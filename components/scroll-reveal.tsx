"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "rotate"
  delay?: number
  duration?: number
  className?: string
  triggerOnce?: boolean
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  triggerOnce = true,
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnce })

  const getAnimationClass = () => {
    const baseClass = "transition-all ease-out"
    
    // Use predefined Tailwind duration classes
    const getDurationClass = (ms: number) => {
      if (ms <= 150) return "duration-150"
      if (ms <= 200) return "duration-200"
      if (ms <= 300) return "duration-300"
      if (ms <= 500) return "duration-500"
      if (ms <= 700) return "duration-700"
      if (ms <= 1000) return "duration-1000"
      return "duration-1000"
    }
    
    const getDelayClass = (ms: number) => {
      if (ms <= 75) return "delay-75"
      if (ms <= 100) return "delay-100"
      if (ms <= 150) return "delay-150"
      if (ms <= 200) return "delay-200"
      if (ms <= 300) return "delay-300"
      if (ms <= 500) return "delay-500"
      if (ms <= 700) return "delay-700"
      if (ms <= 1000) return "delay-1000"
      return ""
    }

    const durationClass = getDurationClass(duration)
    const delayClass = delay > 0 ? getDelayClass(delay) : ""

    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-y-8`
        case "fade-down":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -translate-y-8`
        case "fade-left":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-x-8`
        case "fade-right":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -translate-x-8`
        case "scale":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 scale-95`
        case "rotate":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 rotate-3 scale-95`
        default:
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-y-8`
      }
    }

    return `${baseClass} ${durationClass} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0`
  }

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
}
