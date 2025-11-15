import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

// Force dynamic rendering for all admin routes
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return <div className="admin-layout">{children}</div>
}



