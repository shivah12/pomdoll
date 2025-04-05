"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DecorativeElement } from "@/components/decorative-element"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Log for debugging
      console.log("Attempting login with:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        throw error
      }

      console.log("Login successful:", data)

      toast({
        title: "Login successful",
        description: "Welcome back to Pomodoll!",
      })

      // Force a hard navigation to dashboard
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 p-4 pattern-hearts">
      {/* Decorative elements */}
      <div className="fixed top-20 left-10 hidden lg:block">
        <DecorativeElement type="heart" color="pink" size="lg" />
      </div>
      <div className="fixed bottom-20 right-10 hidden lg:block">
        <DecorativeElement type="star" color="purple" size="xl" />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-pink-500" />
        <span className="text-xl font-pacifico text-pink-500">Pomodoll</span>
      </Link>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 hidden md:block">
          <div className="relative">
            <div className="absolute -top-6 -left-6">
              <DecorativeElement type="star" color="purple" size="md" />
            </div>
            <div className="absolute -bottom-6 -right-6">
              <DecorativeElement type="heart" color="pink" size="md" />
            </div>

            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Login illustration"
              width={500}
              height={500}
              className="rounded-3xl border-4 border-white shadow-xl"
            />
          </div>
        </div>

        <Card className="w-full md:w-1/2 border-pink-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-bl-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-tr-full -ml-16 -mb-16"></div>

          <CardHeader className="space-y-1 relative z-10">
            <CardTitle className="text-3xl font-bold text-center text-pink-600 font-pacifico">Welcome back!</CardTitle>
            <CardDescription className="text-center font-quicksand text-lg">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-quicksand text-pink-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-pink-200 focus-visible:ring-pink-500 rounded-xl h-12 font-quicksand"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-quicksand text-pink-700">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-pink-500 hover:underline font-quicksand">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pink-200 focus-visible:ring-pink-500 rounded-xl h-12 font-quicksand"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-quicksand"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col relative z-10">
            <div className="text-center text-muted-foreground mt-4 font-quicksand">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-pink-500 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

