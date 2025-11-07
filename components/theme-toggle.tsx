"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleClick = () => {
    const next = (resolvedTheme ?? theme ?? "light") === "dark" ? "light" : "dark"
    
    // Add transition class for smoother change
    document.documentElement.classList.add('theme-transitioning')
    
    // Change theme immediately
    setTheme(next)
    
    // Remove transition class after 1 second animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 1000)
  }

  const label = !mounted ? "Toggle theme" : `Theme: ${(theme ?? "system").toString()}. Click to switch`

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="h-8 w-8 relative"
      onClick={handleClick}
      disabled={!mounted}
    >
      {/* Show icon based on resolvedTheme so 'system' follows OS */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
