"use client"

import { useState, useEffect, useRef, RefObject } from "react"

// Opsi untuk kedua hook
interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number // Khusus untuk staggered hook
}

/**
 * Hook untuk mendeteksi kapan sebuah elemen masuk ke dalam viewport.
 * Mengembalikan ref untuk dipasang ke elemen dan status boolean `isVisible`.
 */
// ✨ FIX 1: Jadikan hook "generic" dengan `<T extends HTMLElement>`
// Ini membuatnya bisa menerima tipe elemen spesifik (seperti HTMLDivElement).
export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {},
): [RefObject<T>, boolean] {
  const { triggerOnce = true, threshold = 0.1, rootMargin = "0px" } = options
  const [isVisible, setIsVisible] = useState(false)

  // ✨ FIX 2: Gunakan tipe generic <T> pada useRef, bukan HTMLElement
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      // Pastikan untuk membersihkan observer saat komponen di-unmount
      observer.unobserve(element)
    }
  }, [ref, triggerOnce, threshold, rootMargin])

  return [ref, isVisible]
}


/**
 * Hook untuk animasi staggered pada beberapa elemen.
 * Mengembalikan fungsi untuk mengatur ref dan array boolean `visibleItems`.
 */
// ✨ FIX 3: Terapkan pola generic yang sama pada hook kedua
export function useStaggeredScrollAnimation<T extends HTMLElement>(
  count: number,
  options: ScrollAnimationOptions = {},
): [(index: number) => (el: T | null) => void, boolean[]] {
  const { triggerOnce = true, threshold = 0.1, rootMargin = "0px", delay = 150 } = options
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false))
  
  // ✨ FIX 4: Gunakan tipe generic <T> untuk array refs
  const refs = useRef<(T | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    refs.current.forEach((element, index) => {
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }, delay * index)

            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            setVisibleItems((prev) => {
              const newState = [...prev]
              newState[index] = false
              return newState
            })
          }
        },
        { threshold, rootMargin },
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [count, delay, threshold, rootMargin, triggerOnce])

  // ✨ FIX 5: Gunakan tipe generic <T> pada parameter 'el'
  const setRef = (index: number) => (el: T | null) => {
    refs.current[index] = el
  }

  return [setRef, visibleItems]
}