import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"

interface ProgressCardProps {
  theme: "barbie" | "kawaii" | "pookie"
  completedTasks: number
  totalTasks: number
  focusTime: number
  dailyFocusTarget: number
  onUpdateFocusTarget: (target: number) => void
}

export function ProgressCard({ 
  theme, 
  completedTasks, 
  totalTasks, 
  focusTime,
  dailyFocusTarget,
  onUpdateFocusTarget 
}: ProgressCardProps) {
  const { toast } = useToast()
  const [showTargetsDialog, setShowTargetsDialog] = useState(false)

  const handleSaveTargets = (focusTarget: number) => {
    onUpdateFocusTarget(focusTarget)
    setShowTargetsDialog(false)
    toast({
      title: "Daily target updated",
      description: `Focus time: ${focusTarget} minutes`,
    })
  }

  const themeColors = {
    barbie: {
      gradient: "from-pink-400 to-pink-600",
      primary: "pink",
      dark: "pink-200"
    },
    kawaii: {
      gradient: "from-purple-400 to-purple-600",
      primary: "purple",
      dark: "purple-200"
    },
    pookie: {
      gradient: "from-blue-400 to-blue-600",
      primary: "blue",
      dark: "blue-200"
    }
  }

  const colors = themeColors[theme]

  return (
    <Card className={`border-2 rounded-3xl shadow-lg overflow-hidden border-${colors.dark}`}>
      <div className={`bg-gradient-to-r ${colors.gradient} p-4 relative`}>
        <CardTitle className="flex items-center gap-2 text-white font-pacifico text-xl">
          <Star className="h-5 w-5" />
          Your Progress
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTargetsDialog(true)}
          className="absolute right-4 top-4 text-white hover:bg-white/20"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between mb-2">
          <span className="font-quicksand font-medium">Tasks Completed</span>
          <span className="font-quicksand font-bold">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-${colors.primary}-500`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((completedTasks / (totalTasks || 1)) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.8 }}
          ></motion.div>
        </div>

        <div className="mt-4 flex justify-between mb-2">
          <span className="font-quicksand font-medium">Focus Time</span>
          <span className="font-quicksand font-bold">{Math.floor(focusTime / 60)}/{dailyFocusTarget} min</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-${colors.primary}-500`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((focusTime / 60 / dailyFocusTarget) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 1 }}
          ></motion.div>
        </div>
      </CardContent>

      {/* Daily Targets Dialog */}
      <Dialog open={showTargetsDialog} onOpenChange={setShowTargetsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Daily Focus Target</DialogTitle>
            <DialogDescription>
              Set your daily goal for focus time
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="focusTarget" className="text-right">
                Focus Minutes
              </Label>
              <Input
                id="focusTarget"
                type="number"
                defaultValue={dailyFocusTarget}
                className="col-span-3"
                min={15}
                max={480}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              const focusInput = document.getElementById('focusTarget') as HTMLInputElement
              const focusTarget = Number(focusInput?.value || dailyFocusTarget)
              handleSaveTargets(focusTarget)
            }}>
              Save Target
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 