"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { School, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollReveal } from "@/components/scroll-reveal"

type NavItem = {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Reservasi", href: "/reservasi" },
  { label: "Tentang SIMDIK", href: "/tentang-simdik" },
  { label: "Direktori Sekolah", href: "/direktori-sekolah" },
  { label: "Berita", href: "/#berita" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Kontak", href: "/#kontak" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [currentHash, setCurrentHash] = useState<string>("")

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash)
    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [])

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/"
    if (item.href.startsWith("/#")) {
      // Only active when on home AND the URL hash matches the section
      if (pathname !== "/") return false
      const sectionHash = item.href.replace("/", "") // "/#berita" -> "#berita"
      return currentHash === sectionHash
    }
    return pathname?.startsWith(item.href)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <ScrollReveal animation="fade-right" delay={0} triggerOnce={false}>
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground transition-colors duration-300 hover:text-primary">
                SIMDIK Kota Banjarmasin
              </span>
            </Link>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100} triggerOnce={false}>
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "font-medium transition-all duration-300 relative group",
                    isActive(item) ? "text-primary" : "text-muted-foreground hover:text-primary",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300",
                      isActive(item) ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              ))}
            </nav>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={200} triggerOnce={false}>
            <div className="flex items-center space-x-2">
              <button className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-accent">
                <Menu className="w-6 h-6 text-foreground" />
              </button>
              <ThemeToggle />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader


