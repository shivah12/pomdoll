"use client"

import type React from "react"

import { useState } from "react"
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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        throw error
      }

      // Try to create profile in profiles table, but don't fail if table doesn't exist
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: data.user.id,
              full_name: name,
              email: email,
            },
          ])

          if (profileError) {
            // If the error is not about missing table, log it
            if (!profileError.message.includes("does not exist")) {
              console.error("Error creating profile:", profileError)
            } else {
              console.log("Profiles table doesn't exist yet, continuing with auth-only signup")
            }
            // We don't throw here, as we want signup to succeed even if profile creation fails
          }
        } catch (profileError) {
          console.log("Error creating profile, continuing with auth-only signup:", profileError)
          // We don't throw here, as we want signup to succeed even if profile creation fails
        }
      }

      toast({
        title: "Account created successfully",
        description: "Please log in to continue",
      })

      router.push("/login")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 p-4 pattern-stars">
      {/* Decorative elements */}
      <div className="fixed top-20 right-10 hidden lg:block">
        <DecorativeElement type="star" color="purple" size="lg" />
      </div>
      <div className="fixed bottom-20 left-10 hidden lg:block">
        <DecorativeElement type="heart" color="pink" size="xl" />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-pink-500" />
        <span className="text-xl font-pacifico text-pink-500">Pomodoll</span>
      </Link>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
        <Card className="w-full md:w-1/2 border-pink-200 rounded-3xl shadow-xl overflow-hidden order-2 md:order-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-tr-full -ml-16 -mb-16"></div>

          <CardHeader className="space-y-1 relative z-10">
            <CardTitle className="text-3xl font-bold text-center text-purple-600 font-pacifico">
              Join the fun!
            </CardTitle>
            <CardDescription className="text-center font-quicksand text-lg">
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-quicksand text-purple-700">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-purple-200 focus-visible:ring-purple-500 rounded-xl h-12 font-quicksand"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-quicksand text-purple-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-purple-200 focus-visible:ring-purple-500 rounded-xl h-12 font-quicksand"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-quicksand text-purple-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-purple-200 focus-visible:ring-purple-500 rounded-xl h-12 font-quicksand"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-quicksand"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col relative z-10">
            <div className="text-center text-muted-foreground mt-4 font-quicksand">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-500 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="w-full md:w-1/2 hidden md:block order-1 md:order-2">
          <div className="relative">
            <div className="absolute -top-6 -left-6">
              <DecorativeElement type="cloud" color="blue" size="md" />
            </div>
            <div className="absolute -bottom-6 -right-6">
              <DecorativeElement type="star" color="purple" size="md" />
            </div>

            <Image
              src="/sanrio.jpg?height=500&width=500"
              alt="Signup illustration"
              width={500}
              height={500}
              className="rounded-3xl border-4 border-white shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

