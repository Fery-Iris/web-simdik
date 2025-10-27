"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Agenda {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
}

interface ScrollingAgendaCarouselProps {
  agendas: Agenda[]
}

export function ScrollingAgendaCarousel({ agendas }: ScrollingAgendaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()
  const resumeTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && agendas.length > 3) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, agendas.length - 2))
      }, 4000) // Change slide every 4 seconds
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
        autoScrollRef.current = undefined
      }
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
        autoScrollRef.current = undefined
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = undefined
      }
    }
  }, [isAutoScrolling, agendas.length])

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoScrolling(false)
    
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = undefined
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true)
    }, 10000)
  }

  const goToPrevious = () => {
    const maxIndex = Math.max(0, agendas.length - 3)
    const newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, agendas.length - 3)
    const newIndex = (currentIndex + 1) % (maxIndex + 1)
    goToSlide(newIndex)
  }

  // Handle mouse events for auto-scroll control
  const handleMouseEnter = () => {
    setIsAutoScrolling(false)
  }

  const handleMouseLeave = () => {
    setIsAutoScrolling(true)
  }

  // Don't show carousel if there are 3 or fewer agendas
  if (agendas.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agendas.map((agenda) => (
          <div key={agenda.id}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-blue-400 h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-blue-600">
                  {agenda.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  <span className="font-semibold">Tanggal:</span> {new Date(agenda.date).toLocaleDateString('id-ID')}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  <span className="font-semibold">Lokasi:</span> {agenda.location}
                </p>
                <p className="text-muted-foreground mb-4 line-clamp-3">{agenda.description}</p>
                <Link
                  href={`/agenda/${agenda.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group-hover:translate-x-2 inline-flex items-center"
                >
                  Lihat Detail
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  // Show carousel if there are more than 3 agendas
  return (
    <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="flex transition-transform duration-700 ease-in-out will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          width: `${(agendas.length * 100) / 3}%`,
        }}
      >
        {agendas.map((agenda, index) => (
          <div key={agenda.id} className="w-1/3 px-3 flex-shrink-0">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-blue-400 h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-blue-600">
                  {agenda.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  <span className="font-semibold">Tanggal:</span> {new Date(agenda.date).toLocaleDateString('id-ID')}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  <span className="font-semibold">Lokasi:</span> {agenda.location}
                </p>
                <p className="text-muted-foreground mb-4 line-clamp-3">{agenda.description}</p>
                <Link
                  href={`/agenda/${agenda.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group-hover:translate-x-2 inline-flex items-center"
                >
                  Lihat Detail
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={goToNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: Math.max(1, agendas.length - 2) }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-scroll indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isAutoScrolling ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`}
        />
      </div>
    </div>
  )
}

