import { School } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center animate-pulse">
            <School className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground animate-pulse">SIMDIK</span>
        </div>

        {/* Loading spinner */}
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

        <p className="text-muted-foreground animate-pulse">Memuat berita...</p>
      </div>
    </div>
  )
}
