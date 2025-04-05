"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Clock, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

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

export function Achievements() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    async function loadAchievements() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .eq("user_id", user.id)

        if (error) throw error
        setAchievements(data || [])
      } catch (error) {
        console.error("Error loading achievements:", error)
        toast({
          title: "Error loading achievements",
          description: "Please try refreshing the page",
          variant: "destructive",
        })
      }
    }

    loadAchievements()
  }, [user, toast])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 rounded-3xl shadow-lg overflow-hidden border-pink-200">
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-4">
              <CardTitle className="flex items-center gap-2 text-white font-pacifico text-xl">
                {achievement.icon === "CheckCircle" && <CheckCircle className="h-5 w-5" />}
                {achievement.icon === "Clock" && <Clock className="h-5 w-5" />}
                {achievement.icon === "Star" && <Star className="h-5 w-5" />}
                {achievement.name}
              </CardTitle>
              <CardDescription className="font-quicksand text-white/80">
                {achievement.description}
              </CardDescription>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <span className="font-quicksand font-medium">Progress</span>
                <span className="font-quicksand font-bold">
                  {achievement.progress}/{achievement.target}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              {achievement.completed && (
                <div className="mt-4 text-center">
                  <span className="text-pink-500 font-quicksand font-medium">
                    Completed on {new Date(achievement.completed_at!).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 