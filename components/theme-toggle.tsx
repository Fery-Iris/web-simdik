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
      {!mounted ? null : (resolvedTheme ?? theme ?? "light") === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
