"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/color-picker"

// 1. PASTIKAN `DropdownMenuPortal` di-import dari sini
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  // Efek ini untuk memastikan komponen hanya dirender di client-side
  // untuk mencegah error pada Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  // Tampilkan tombol placeholder sederhana saat komponen belum siap
  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <ColorPicker />
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    )
  }

  // Tampilkan komponen lengkap setelah siap
  return (
    <div className="flex items-center gap-1">
      <ColorPicker />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            onClick={() => setOpen((v) => !v)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>

        {/* 2. `DropdownMenuPortal` akan "menteleportasi" menu ini ke lapisan atas halaman */}
        <DropdownMenuPortal>
          <DropdownMenuContent align="end" sideOffset={8} className="z-[2147483647] pointer-events-auto">
            <DropdownMenuItem onClick={() => { setTheme("light"); setOpen(false) }}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("dark"); setOpen(false) }}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("system"); setOpen(false) }}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  )
}