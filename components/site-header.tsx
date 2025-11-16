"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { School, Menu, X } from "lucide-react"
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
  { label: "Tentang SIREDI", href: "/tentang-simdik" },
  { label: "Direktori Sekolah", href: "/direktori-sekolah" },
  { label: "Berita", href: "/#berita" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Kontak", href: "/#kontak" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [currentHash, setCurrentHash] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash)
    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

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
                SIREDI Kota Banjarmasin
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
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-accent"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
              <ThemeToggle />
            </div>
          </ScrollReveal>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="px-4 py-6 space-y-4 bg-background">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-medium transition-all duration-300",
                    isActive(item)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default SiteHeader


