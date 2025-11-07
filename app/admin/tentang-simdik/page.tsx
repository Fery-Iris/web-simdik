"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { School, Menu, X, LogOut, Bell, ChevronDown, Home, Newspaper, Calendar, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminTentangSimdikPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/login')
      } else {
        alert('Gagal logout. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Terjadi kesalahan saat logout.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard", active: false },
    { icon: School, label: "Manajemen Sekolah", href: "/admin/schools", active: false },
    { icon: Newspaper, label: "Manajemen Berita", href: "/admin/news", active: false },
    { icon: Calendar, label: "Manajemen Agenda", href: "/admin/agenda", active: false },
    { icon: Calendar, label: "Laporan Reservasi", href: "/admin/reservations", active: false },
    { icon: FileText, label: "Manajemen Tentang SIMDIK", href: "/admin/tentang-simdik", active: true },
  ]

  return (
    <div className="flex h-screen bg-background">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } flex flex-col fixed lg:relative z-50 h-full ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold">SIMDIK Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      if (item.active) return
                      router.push(item.href)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-accent hover:scale-105 transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-foreground">Manajemen Tentang SIMDIK</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">Halaman ini akan diisi nanti</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:scale-105 transition-all duration-200">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:scale-105 transition-all duration-200">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs lg:text-sm font-medium text-white">A</span>
                </div>
                <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
              </Button>
            </div>
          </div>
        </header>

        {/* Placeholder content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Konten Manajemen Tentang SIMDIK akan ditambahkan di sini.
          </div>
        </main>
      </div>
    </div>
  )
}


