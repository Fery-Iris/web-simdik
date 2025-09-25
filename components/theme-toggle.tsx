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
    const current = theme ?? "system"
    const next = current === "light" ? "dark" : current === "dark" ? "system" : "light"
    setTheme(next)
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
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
