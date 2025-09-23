"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe })
  }

  const demoAccounts = [
    {
      type: "Super Admin",
      email: "admin@simdik.com",
      password: "password",
    },
    {
      type: "Regular User",
      email: "user@simdik.com",
      password: "password",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 via-blue-500 to-blue-300 relative overflow-hidden">
      <div className="absolute top-16 left-16 w-40 h-40 bg-white/8 rounded-full blur-3xl"></div>
      <div className="absolute top-32 right-24 w-32 h-32 bg-white/12 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-white/6 rounded-full blur-3xl"></div>
      <div className="absolute bottom-16 right-16 w-36 h-36 bg-white/15 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100">Sign in to SIMDIK</p>
          </div>

          <Card className="bg-white/98 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
            <CardHeader className="pb-4">
              <div className="space-y-1">{/* Form content will go here */}</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500 mb-4">Demo Accounts</p>
                <div className="grid grid-cols-2 gap-3">
                  {demoAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setEmail(account.email)
                        setPassword(account.password)
                      }}
                    >
                      <p className="text-sm font-medium text-gray-700">{account.type}</p>
                      <p className="text-xs text-blue-600">{account.email}</p>
                      <p className="text-xs text-gray-500">{account.password}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-blue-100">© 2025 SIMDIK. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
