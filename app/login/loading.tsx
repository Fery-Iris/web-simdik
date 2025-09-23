import { Shield } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 animate-pulse">
          <Shield className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">SIMDIK</h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <p className="text-blue-100 mt-2">Loading login page...</p>
      </div>
    </div>
  )
}
