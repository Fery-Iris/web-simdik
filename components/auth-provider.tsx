"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if current path is admin route
    const isAdminRoute = pathname?.startsWith("/admin")
    
    if (isAdminRoute) {
      // Check session
      fetch("/api/auth/session")
        .then((res) => {
          if (!res.ok) {
            // Not authenticated, redirect to login
            router.push("/login")
          }
        })
        .catch(() => {
          // Error checking session, redirect to login
          router.push("/login")
        })
    }
  }, [pathname, router])

  return <>{children}</>
}



