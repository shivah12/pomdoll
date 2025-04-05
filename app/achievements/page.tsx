"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { getWeeklyStats } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Achievements } from "@/components/achievements"
import { Navbar } from "@/components/ui/navbar"
import { signOut } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Sparkles, Clock, Zap, CheckCircle, Calendar, Timer as TimerIcon } from "lucide-react"
import { MotivationalQuote } from "@/components/motivational-quote"

interface ThemeColors {
  primary: string
  text: string
  dark: string
  light: string
}

const getThemeColors = (theme: string): ThemeColors => {
  switch (theme) {
    case "barbie":
      return { primary: "pink", text: "pink-600", dark: "pink-600", light: "pink" }
    case "kawaii":
      return { primary: "purple", text: "purple-600", dark: "purple-600", light: "purple" }
    case "pookie":
      return { primary: "blue", text: "blue-600", dark: "blue-600", light: "blue" }
    default:
      return { primary: "pink", text: "pink-600", dark: "pink-600", light: "pink" }
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

export default function AchievementsPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    focusTime: 0,
    focusSessions: 0,
    completedTasks: 0,
    dailyCompletions: {} as Record<string, number>
  })
  const [activeTheme, setActiveTheme] = useState<"barbie" | "kawaii" | "pookie">("barbie")
  const [dataLoading, setDataLoading] = useState(true)
  const themeColors = getThemeColors(activeTheme)

  useEffect(() => {
    async function loadStats() {
      if (!user) return

      try {
        const weeklyStats = await getWeeklyStats()
        setStats(weeklyStats)
      } catch (error) {
        console.error("Error loading stats:", error)
        toast({
          title: "Error loading stats",
          description: "Could not load your progress stats. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDataLoading(false)
      }
    }

    loadStats()
  }, [user, toast])

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-sm text-muted-foreground font-quicksand">Just a moment, we're getting your achievements ready...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-quicksand text-lg mb-4">Please log in to view your achievements</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      activeTheme === "barbie" ? "bg-barbie" : activeTheme === "kawaii" ? "bg-kawaii" : "bg-pookie"
    }`}>
      <Navbar user={user} activeTheme={activeTheme} setActiveTheme={setActiveTheme} onLogout={handleLogout} />

      <main className="container mx-auto py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-pacifico text-pink-600 mb-2">Your Achievements</h1>
          <p className="text-gray-600 font-quicksand">Track your progress and celebrate your wins!</p>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MotivationalQuote theme={activeTheme} />
        </motion.div>

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className={`text-2xl font-pacifico text-${themeColors.text} flex items-center gap-2`}>
            <Clock className={`h-6 w-6 text-${themeColors.text}`} />
            Today's Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <TimerIcon className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Focus Time</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {stats.dailyCompletions[new Date().toLocaleDateString('en-US', { weekday: 'short' })] || 0}
                  <span className="text-lg font-normal ml-1">min</span>
                </p>
              </div>
            </div>
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <Zap className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Focus Sessions</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {Math.floor((stats.dailyCompletions[new Date().toLocaleDateString('en-US', { weekday: 'short' })] || 0) / 25)}
                  <span className="text-lg font-normal ml-1">sessions</span>
                </p>
              </div>
            </div>
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Tasks Done</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {stats.completedTasks || 0}
                  <span className="text-lg font-normal ml-1">tasks</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className={`text-2xl font-pacifico text-${themeColors.text} flex items-center gap-2`}>
            <Calendar className={`h-6 w-6 text-${themeColors.text}`} />
            Weekly Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <TimerIcon className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Total Focus Time</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {stats.focusTime || 0}
                  <span className="text-lg font-normal ml-1">min</span>
                </p>
              </div>
            </div>
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <Zap className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Total Sessions</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {stats.focusSessions || 0}
                  <span className="text-lg font-normal ml-1">sessions</span>
                </p>
              </div>
            </div>
            <div className={`p-6 rounded-xl bg-${themeColors.primary}-50/80 backdrop-blur-sm shadow-md border border-${themeColors.primary}-100`}>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className={`h-12 w-12 text-${themeColors.text} mb-3`} />
                <h3 className={`text-lg font-semibold text-${themeColors.text} mb-2`}>Total Tasks</h3>
                <p className={`text-3xl font-bold text-${themeColors.text}`}>
                  {stats.completedTasks || 0}
                  <span className="text-lg font-normal ml-1">tasks</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-800">Your Achievements</h2>
          </div>
          <Achievements />
        </motion.div>
      </main>
    </div>
  )
} 