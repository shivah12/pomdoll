"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, Heart, ListTodo, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { DecorativeElement } from "@/components/decorative-element"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-20 left-10 hidden lg:block">
        <DecorativeElement type="heart" color="pink" size="lg" />
      </div>
      <div className="fixed bottom-20 right-10 hidden lg:block">
        <DecorativeElement type="star" color="purple" size="xl" />
      </div>
      <div className="fixed top-40 right-20 hidden lg:block">
        <DecorativeElement type="cloud" color="blue" size="md" />
      </div>

      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-pink-200">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-pacifico text-pink-500">Pomodoll</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-pink-500 transition-colors">
              Features
            </Link>
            <Link href="#themes" className="text-sm font-medium hover:text-pink-500 transition-colors">
              Themes
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-pink-500 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 pattern-hearts">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 font-pacifico">
                  Plan Your Day in Kawaii Style
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-quicksand">
                  The cutest productivity app with Barbie, Kawaii, and Pookie themes to make your tasks more fun!
                </p>
              </div>
              <div className="space-x-4 mt-8">
                <Link href="/signup">
                  <Button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-quicksand">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-12 relative w-full max-w-4xl">
                <div className="absolute -top-6 -left-6 w-12 h-12 text-pink-500">
                  <DecorativeElement type="heart" color="pink" size="md" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 text-purple-500">
                  <DecorativeElement type="star" color="purple" size="md" />
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/hero.jpeg?height=600&width=1200"
                    alt="Pomodoll Dashboard Preview"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm text-pink-600 font-medium">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-pink-600 font-pacifico">
                  Everything You Need
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-quicksand">
                  Boost your productivity with our cute and functional tools
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-3xl border-2 border-pink-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100 rounded-bl-full -mr-12 -mt-12 group-hover:bg-pink-200 transition-colors duration-300"></div>
                <div className="relative">
                  <div className="bg-pink-100 rounded-2xl p-4 w-16 h-16 flex items-center justify-center">
                    <ListTodo className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-600 mt-4">Task Lists</h3>
                  <p className="text-muted-foreground mt-2">
                    Create and organize your tasks with cute tags and priority levels
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4 rounded-3xl border-2 border-purple-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -mr-12 -mt-12 group-hover:bg-purple-200 transition-colors duration-300"></div>
                <div className="relative">
                  <div className="bg-purple-100 rounded-2xl p-4 w-16 h-16 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-600 mt-4">Pomodoro Timer</h3>
                  <p className="text-muted-foreground mt-2">Stay focused with customizable work and break timers</p>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4 rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-200 transition-colors duration-300"></div>
                <div className="relative">
                  <div className="bg-blue-100 rounded-2xl p-4 w-16 h-16 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-600 mt-4">Cute Themes</h3>
                  <p className="text-muted-foreground mt-2">Switch between Barbie, Kawaii Sanrio, and Pookie themes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="themes" className="py-12 md:py-24 lg:py-32 pattern-stars">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm text-purple-600 font-medium">
                  Themes
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-600 font-pacifico">
                  Express Your Style
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-quicksand">
                  Choose from three adorable themes to match your mood
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3">
              <div className="group">
                <div className="overflow-hidden rounded-3xl border-4 border-pink-300 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
                  <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 text-center text-white">
                    <h3 className="text-2xl font-bold font-pacifico">Barbie Theme</h3>
                  </div>
                  <div className="p-1">
                    <div className="aspect-[4/3] bg-pink-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/barbie.jpg?height=300&width=400"
                        alt="Barbie Theme Preview"
                        width={400}
                        height={300}
                        className="rounded-xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-center text-pink-600 font-medium">Perfect for the Barbie lover in you!</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="overflow-hidden rounded-3xl border-4 border-purple-300 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 text-center text-white">
                    <h3 className="text-2xl font-bold font-pacifico">Kawaii Sanrio Theme</h3>
                  </div>
                  <div className="p-1">
                    <div className="aspect-[4/3] bg-purple-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/kawaii.jpg?height=300&width=400"
                        alt="Kawaii Theme Preview"
                        width={400}
                        height={300}
                        className="rounded-xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-center text-purple-600 font-medium">Adorable and sweet kawaii style!</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="overflow-hidden rounded-3xl border-4 border-blue-300 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 text-center text-white">
                    <h3 className="text-2xl font-bold font-pacifico">Pookie Theme</h3>
                  </div>
                  <div className="p-1">
                    <div className="aspect-[4/3] bg-blue-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/sanrio.jpg?height=300&width=400"
                        alt="Pookie Theme Preview"
                        width={400}
                        height={300}
                        className="rounded-xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-center text-blue-600 font-medium">Cute and cozy pookie bear style!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-pink-100 to-purple-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm text-pink-600 font-medium">
                  Motivation
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 font-pacifico">
                  Stay Inspired
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed font-quicksand">
                  Get motivational Barbie quotes to keep you going through your tasks
                </p>
                <div className="rounded-3xl border-2 border-pink-200 bg-white p-8 shadow-lg italic relative">
                  <div className="absolute -top-3 -left-3">
                    <DecorativeElement type="heart" color="pink" size="sm" />
                  </div>
                  <div className="absolute -bottom-3 -right-3">
                    <DecorativeElement type="heart" color="pink" size="sm" />
                  </div>
                  <p className="text-xl text-pink-600 font-medium font-quicksand">
                    "You can be anything you want to be!"
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[400px] w-[400px] animate-float">
                  <Image
                    src="/motivation.jpg?height=400&width=400"
                    alt="Motivation Illustration"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute -top-6 -right-6">
                    <DecorativeElement type="star" color="purple" size="md" />
                  </div>
                  <div className="absolute -bottom-6 -left-6">
                    <DecorativeElement type="cloud" color="blue" size="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-12 md:py-24 lg:py-32 pattern-dots">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-pink-600 font-pacifico">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-quicksand">
                  Join thousands of users who are making productivity cute and fun!
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-w-5xl">
                <div className="flex flex-col items-center space-y-2 rounded-3xl border-2 border-pink-200 bg-white p-8 shadow-lg">
                  <div className="rounded-full bg-pink-100 p-3">
                    <Heart className="h-6 w-6 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-600">Cute Design</h3>
                  <p className="text-center text-muted-foreground">Adorable themes that make productivity fun</p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-3xl border-2 border-purple-200 bg-white p-8 shadow-lg">
                  <div className="rounded-full bg-purple-100 p-3">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-600">Task Management</h3>
                  <p className="text-center text-muted-foreground">Organize your tasks with tags and priorities</p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-lg">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Star className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-600">Motivation</h3>
                  <p className="text-center text-muted-foreground">Inspiring quotes to keep you going</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 min-[400px]:flex-row mt-8">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-quicksand"
                  >
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg font-quicksand"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 border-t border-pink-200 bg-gradient-to-b from-white to-pink-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm text-pink-600 font-medium">
                  Testimonials
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 font-pacifico">
                  What Our Users Say
                </h2>

                <div className="space-y-4">
                  <div className="rounded-3xl border-2 border-pink-200 bg-white p-6 shadow-md">
                    <p className="italic text-muted-foreground mb-4">
                      "Pomodoll has completely transformed how I organize my day! The cute themes make me excited
                      to check off my tasks."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="font-medium text-pink-600">SJ</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Student</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border-2 border-purple-200 bg-white p-6 shadow-md">
                    <p className="italic text-muted-foreground mb-4">
                      "The Pomodoro timer with the Barbie theme is everything! I've never been so productive and happy
                      at the same time."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="font-medium text-purple-600">AT</span>
                      </div>
                      <div>
                        <p className="font-medium">Alex Thompson</p>
                        <p className="text-sm text-muted-foreground">Designer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-pink-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-4"
                >
                  Join Them Today
                </Link>
              </div>

              <div className="relative">
                <div className="absolute -top-6 -left-6">
                  <DecorativeElement type="star" color="purple" size="md" />
                </div>
                <div className="absolute -bottom-6 -right-6">
                  <DecorativeElement type="heart" color="pink" size="md" />
                </div>

                <Image
                  src="/testimonial.jpg?height=600&width=600"
                  alt="Happy users"
                  width={600}
                  height={600}
                  className="rounded-3xl border-4 border-white shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-pink-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-pink-500 mb-4 md:mb-0">
              © 2025 Pookie Planner. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-pink-500 hover:text-pink-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

