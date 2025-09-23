"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (options.triggerOnce && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px 0px -50px 0px",
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options.threshold, options.rootMargin, options.triggerOnce])

  return [ref, isVisible] as const
}

// Hook for multiple elements with staggered animations
export function useStaggeredScrollAnimation(count: number, options: UseScrollAnimationOptions = {}) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false))
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => {
                setVisibleItems((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              },
              (options.delay || 100) * index,
            )

            if (options.triggerOnce) {
              observer.unobserve(ref)
            }
          } else if (!options.triggerOnce) {
            setVisibleItems((prev) => {
              const newState = [...prev]
              newState[index] = false
              return newState
            })
          }
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || "0px 0px -50px 0px",
        },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [count, options.delay, options.threshold, options.rootMargin, options.triggerOnce])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }

  return [setRef, visibleItems] as const
}
