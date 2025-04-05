"use client"
/* Hi so I am writing this as i am making it and I am hoping if you are seeing this mean you have cloned it */
import type React from "react"

import { useState, useEffect, Suspense, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, CheckCircle, Clock, ListTodo, Sparkles, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TaskList } from "@/components/task-list"
import { MotivationalQuote } from "@/components/motivational-quote"
import { DecorativeElement } from "@/components/decorative-element"
import { Navbar } from "@/components/ui/navbar"
import Confetti from "react-confetti"
import { useAuth } from "@/components/auth-provider"
import { signOut, supabase, getWeeklyStats, getUserProfile, getUserTasks } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  target: number
  completed: boolean
  completed_at: string | null
}

interface DashboardStats {
  completedTasks: number
  focusSessions: number
  focusTime: number
  dailyCompletions: Record<string, number>
  dailyTaskTarget: number
  dailyFocusTarget: number
  achievements: Achievement[]
}

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  light: string
  medium: string
  dark: string
  text: string
  gradient: string
  pattern: string
}

const getThemeColors = (theme: "barbie" | "kawaii" | "pookie"): ThemeColors => {
  switch (theme) {
    case "barbie":
      return {
        primary: "pink",
        secondary: "purple",
        accent: "pink",
        light: "pink-50",
        medium: "pink-100",
        dark: "pink-200",
        text: "pink-600",
        gradient: "from-pink-400 to-pink-600",
        pattern: "pattern-hearts",
      }
    case "kawaii":
      return {
        primary: "purple",
        secondary: "pink",
        accent: "purple",
        light: "purple-50",
        medium: "purple-100",
        dark: "purple-200",
        text: "purple-600",
        gradient: "from-purple-400 to-purple-600",
        pattern: "pattern-stars",
      }
    case "pookie":
      return {
        primary: "blue",
        secondary: "green",
        accent: "blue",
        light: "blue-50",
        medium: "blue-100",
        dark: "blue-200",
        text: "blue-600",
        gradient: "from-blue-400 to-blue-600",
        pattern: "pattern-dots",
      }
    default:
      return {
        primary: "pink",
        secondary: "purple",
        accent: "pink",
        light: "pink-50",
        medium: "pink-100",
        dark: "pink-200",
        text: "pink-600",
        gradient: "from-pink-400 to-pink-600",
        pattern: "pattern-hearts",
      }
  }
}

export default function DashboardPage() {
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [activeTheme, setActiveTheme] = useState<"barbie" | "kawaii" | "pookie">(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as "barbie" | "kawaii" | "pookie" || "barbie"
    }
    return "barbie"
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [showTargetsDialog, setShowTargetsDialog] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    completedTasks: 0,
    focusSessions: 0,
    focusTime: 0,
    dailyCompletions: {},
    dailyTaskTarget: 3,
    dailyFocusTarget: 60,
    achievements: []
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [dailyFocusTarget, setDailyFocusTarget] = useState(60) // in minutes
  const [profile, setProfile] = useState<any>(null)

  // Memoize theme colors to prevent unnecessary recalculations
  const themeColors = useMemo(() => getThemeColors(activeTheme), [activeTheme])

  // Load daily targets from localStorage on mount
  useEffect(() => {
    const savedTargets = localStorage.getItem('dailyTargets')
    if (savedTargets) {
      const { taskTarget, focusTarget } = JSON.parse(savedTargets)
      setStats(prev => ({
        ...prev,
        dailyTaskTarget: taskTarget,
        dailyFocusTarget: focusTarget
      }))
    }
  }, [])

  // Load theme and focus target from localStorage on mount
  useEffect(() => {
    const savedFocusTarget = localStorage.getItem('dailyFocusTarget')
    if (savedFocusTarget) {
      setDailyFocusTarget(Number(savedFocusTarget))
    }
  }, [])

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      
      try {
        // Create a default profile object first
        const defaultProfile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          updated_at: new Date().toISOString()
        }

        // Try to get existing profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([defaultProfile])
              .select()
              .single()

            if (createError) {
              console.log('Could not create profile, using default:', createError)
              setProfile(defaultProfile)
              return
            }
            setProfile(newProfile)
          } else {
            console.log('Error loading profile, using default:', error)
            setProfile(defaultProfile)
            return
          }
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.log('Error in profile operation, using default:', error)
        // Create a default profile object
        setProfile({
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          updated_at: new Date().toISOString()
        })
      }
    }
    loadProfile()
  }, [user])

  const handleSaveTargets = (taskTarget: number, focusTarget: number) => {
    setStats(prev => ({
      ...prev,
      dailyTaskTarget: taskTarget,
      dailyFocusTarget: focusTarget
    }))
    localStorage.setItem('dailyTargets', JSON.stringify({
      taskTarget,
      focusTarget
    }))
    setShowTargetsDialog(false)
    toast({
      title: "Daily targets updated",
      description: `Tasks: ${taskTarget}, Focus time: ${focusTarget} minutes`,
    })
  }

  // Load user data when user changes
  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!user) return

      try {
        setDataLoading(true)
        console.log('Loading user data...')

        // Load all data in parallel
        const [tasksData, weeklyStats, userProfile] = await Promise.all([
          getUserTasks(),
          getWeeklyStats(),
          getUserProfile()
        ])

        if (!mounted) return

        // Update all state at once
        setTasks(tasksData)
        setStats(prev => ({
          ...prev,
          completedTasks: weeklyStats.completedTasks,
          focusSessions: weeklyStats.focusSessions,
          focusTime: weeklyStats.focusTime,
          dailyCompletions: weeklyStats.dailyCompletions
        }))
        setProfile(userProfile)

        // Load saved targets from localStorage
        const savedTargets = localStorage.getItem('dailyTargets')
        if (savedTargets) {
          const { taskTarget, focusTarget } = JSON.parse(savedTargets)
          setStats(prev => ({
            ...prev,
            dailyTaskTarget: taskTarget,
            dailyFocusTarget: focusTarget
          }))
        }

      } catch (error) {
        console.error("Error loading user data:", error)
        if (mounted) {
          toast({
            title: "Error loading your data",
            description: "Please try refreshing the page",
            variant: "destructive",
          })
        }
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [user, toast])

  // Welcome toast only on initial mount
  useEffect(() => {
    if (user && !authLoading && !dataLoading) {
      toast({
        title: `Welcome back, ${user.full_name || "there"}!`,
        description: "Ready to be productive today?",
      })
    }
  }, [user, authLoading, dataLoading, toast])

  // Add a function to handle focus session completion
  const handleFocusSessionComplete = async () => {
    console.log('Focus session completed, refreshing data...')
    const [tasksData, weeklyStats] = await Promise.all([
      getUserTasks(),
      getWeeklyStats()
    ])
    
    setTasks(tasksData)
    setStats(prev => ({
      ...prev,
      completedTasks: weeklyStats.completedTasks,
      focusSessions: weeklyStats.focusSessions,
      focusTime: weeklyStats.focusTime,
      dailyCompletions: weeklyStats.dailyCompletions
    }))
    console.log('Data refreshed after focus session')
  }

  // Handle scroll to section when redirected from achievements page
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [])

  // Helper function to calculate streak
  const calculateStreak = (tasks: any[]) => {
    const completedTasks = tasks.filter(t => t.completed)
    if (completedTasks.length === 0) return 0

    let streak = 1
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    while (true) {
      const hasTaskForDay = completedTasks.some(task => {
        const taskDate = new Date(task.created_at)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === currentDate.getTime()
      })

      if (!hasTaskForDay) break

      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  const handleTaskComplete = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    // Update stats when a task is completed
    setStats((prev) => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
    }))
  }

  const getThemeImage = () => {
    switch (activeTheme) {
      case "barbie":
        return "/barbie.jpg?height=200&width=200&text=Barbie"
      case "kawaii":
        return "/kawaii.jpg?height=200&width=200&text=Kawaii"
      case "pookie":
        return "/sanrio.jpg?height=200&width=200&text=Pookie"
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      })
      // Force a hard navigation to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFocusTarget = (target: number) => {
    setDailyFocusTarget(target)
    localStorage.setItem('dailyFocusTarget', target.toString())
  }

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-quicksand text-lg mb-4">Please log in to access your dashboard</p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        activeTheme === "barbie" ? "bg-barbie" : activeTheme === "kawaii" ? "bg-kawaii" : "bg-pookie"
      } ${themeColors.pattern}`}
    >
      <Navbar user={user} activeTheme={activeTheme} setActiveTheme={setActiveTheme} onLogout={handleLogout} />

      <main className="container py-6">
        {/* Decorative elements */}
        <div className="fixed top-20 right-10 hidden lg:block">
          <DecorativeElement
            type={activeTheme === "barbie" ? "heart" : activeTheme === "kawaii" ? "star" : "cloud"}
            color={activeTheme === "barbie" ? "pink" : activeTheme === "kawaii" ? "purple" : "blue"}
            size="lg"
          />
        </div>
        <div className="fixed bottom-20 left-10 hidden lg:block">
          <DecorativeElement
            type={activeTheme === "barbie" ? "star" : activeTheme === "kawaii" ? "heart" : "cloud"}
            color={activeTheme === "barbie" ? "purple" : activeTheme === "kawaii" ? "pink" : "blue"}
            size="xl"
          />
        </div>

        {/* Header section with welcome */}
        <div className="mb-2">
          <h1 className={`text-2xl md:text-3xl font-pacifico text-${themeColors.text}`}>
            Welcome back, {user?.full_name || user?.email?.split("@")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground font-quicksand">
            Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MotivationalQuote theme={activeTheme} />
        </motion.div>

        {/* Theme showcase */}
        <div className={`mt-8 p-6 rounded-3xl border-2 border-${themeColors.dark} bg-white/80 backdrop-blur-sm shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src={getThemeImage() || "/placeholder.svg"}
                alt={`${activeTheme} theme`}
                fill
                className="object-contain animate-float"
              />
            </div>

            <div className="flex-1">
              <h2 className={`text-2xl font-pacifico text-${themeColors.text} mb-2`}>
                {activeTheme === "barbie"
                  ? "Barbie Theme"
                  : activeTheme === "kawaii"
                    ? "Kawaii Sanrio Theme"
                    : "Pookie Theme"}
              </h2>
              <p className="text-muted-foreground font-quicksand mb-4">
                {activeTheme === "barbie"
                  ? "Embrace your inner Barbie with this pink and fabulous theme! Perfect for those who love all things glamorous and fun."
                  : activeTheme === "kawaii"
                    ? "Adorable and sweet kawaii style inspired by Sanrio characters. Cute pastel colors to brighten your day!"
                    : "Cozy and playful pookie bear theme with soft blues and greens. Perfect for a calm and productive day!"}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className={`rounded-full border-${themeColors.dark} bg-${themeColors.light} text-${themeColors.text} hover:bg-${themeColors.medium}`}
                  onClick={() => setActiveTheme("barbie")}
                >
                  <div className="h-3 w-3 rounded-full bg-pink-500 mr-2"></div>
                  Barbie
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-full border-${themeColors.dark} bg-${themeColors.light} text-${themeColors.text} hover:bg-${themeColors.medium}`}
                  onClick={() => setActiveTheme("kawaii")}
                >
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                  Kawaii
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-full border-${themeColors.dark} bg-${themeColors.light} text-${themeColors.text} hover:bg-${themeColors.medium}`}
                  onClick={() => setActiveTheme("pookie")}
                >
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  Pookie
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            id="tasks-section"
          >
            <Card className={`border-2 rounded-3xl shadow-lg overflow-hidden ${`border-${themeColors.dark}`}`}>
              <div className={`bg-gradient-to-r ${themeColors.gradient} p-4`}>
                <CardTitle className={`flex items-center gap-2 text-white font-pacifico text-2xl`}>
                  <ListTodo className="h-5 w-5" />
                  Task List
                </CardTitle>
                <CardDescription className="font-quicksand text-white/80">
                  Manage your tasks and stay organized
                </CardDescription>
              </div>
              <CardContent className="p-6">
                <Suspense fallback={<div>Loading tasks...</div>}>
                  <TaskList theme={activeTheme} onTaskComplete={handleTaskComplete} tasks={tasks} setTasks={setTasks} />
                </Suspense>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            id="pomodoro-section"
          >
            <Card className={`border-2 rounded-3xl shadow-lg overflow-hidden ${`border-${themeColors.dark}`}`}>
              <div className={`bg-gradient-to-r ${themeColors.gradient} p-4`}>
                <CardTitle className={`flex items-center gap-2 text-white font-pacifico text-2xl`}>
                  <Clock className="h-5 w-5" />
                  Pomodoro Timer
                </CardTitle>
                <CardDescription className="font-quicksand text-white/80">
                  Stay focused with timed work sessions
                </CardDescription>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <PomodoroTimer theme={activeTheme} onFocusSessionComplete={handleFocusSessionComplete} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Confetti effect when task is completed */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              colors={[
                activeTheme === "barbie" ? "#ec4899" : activeTheme === "kawaii" ? "#a855f7" : "#3b82f6",
                "#ffffff",
                activeTheme === "barbie" ? "#fbcfe8" : activeTheme === "kawaii" ? "#e9d5ff" : "#bfdbfe",
              ]}
            />
          </div>
        )}

        {/* Daily Targets Dialog */}
        <Dialog open={showTargetsDialog} onOpenChange={setShowTargetsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Daily Targets</DialogTitle>
              <DialogDescription>
                Set your daily goals for tasks and focus time
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskTarget" className="text-right">
                  Daily Tasks
                </Label>
                <Input
                  id="taskTarget"
                  type="number"
                  defaultValue={stats.dailyTaskTarget}
                  className="col-span-3"
                  min={1}
                  max={20}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="focusTarget" className="text-right">
                  Focus Minutes
                </Label>
                <Input
                  id="focusTarget"
                  type="number"
                  defaultValue={stats.dailyFocusTarget}
                  className="col-span-3"
                  min={15}
                  max={480}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                const taskInput = document.getElementById('taskTarget') as HTMLInputElement
                const focusInput = document.getElementById('focusTarget') as HTMLInputElement
                const taskTarget = Number(taskInput?.value || stats.dailyTaskTarget)
                const focusTarget = Number(focusInput?.value || stats.dailyFocusTarget)
                handleSaveTargets(taskTarget, focusTarget)
              }}>
                Save Targets
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

// Helper component
function MoreHorizontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}

