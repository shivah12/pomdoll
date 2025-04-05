"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DecorativeElement } from "@/components/decorative-element"
import { recordFocusSession } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PomodoroTimerProps {
  theme: "barbie" | "kawaii" | "pookie"
  onFocusSessionComplete?: () => Promise<void>
}

interface TimerPreset {
  id: string
  name: string
  workDuration: number
  breakDuration: number
}

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: "15-2", name: "15/2", workDuration: 15, breakDuration: 2 },
  { id: "25-5", name: "25/5", workDuration: 25, breakDuration: 5 },
  { id: "50-10", name: "50/10", workDuration: 50, breakDuration: 10 },
  { id: "custom", name: "Custom", workDuration: 25, breakDuration: 5 },
]

export function PomodoroTimer({ theme, onFocusSessionComplete }: PomodoroTimerProps) {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [mode, setMode] = useState<"work" | "break">("work")
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [initialSeconds, setInitialSeconds] = useState(25 * 60)
  const [selectedPreset, setSelectedPreset] = useState<string>("25-5")
  const [customWorkDuration, setCustomWorkDuration] = useState(25)
  const [customBreakDuration, setCustomBreakDuration] = useState(5)
  const [showCustomDialog, setShowCustomDialog] = useState(false)
  const [showContinueDialog, setShowContinueDialog] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const themeColor = theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"

  // Create notification sound function
  const playNotificationSound = () => {
    if (!soundEnabled) return

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const context = audioContextRef.current
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Set sound properties
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(830, context.currentTime) // Start frequency
      oscillator.frequency.setValueAtTime(600, context.currentTime + 0.2) // End frequency

      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02)
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.4)

      // Play a second beep after a short delay
      setTimeout(() => {
        const oscillator2 = context.createOscillator()
        const gainNode2 = context.createGain()

        oscillator2.connect(gainNode2)
        gainNode2.connect(context.destination)

        oscillator2.type = 'sine'
        oscillator2.frequency.setValueAtTime(830, context.currentTime)
        oscillator2.frequency.setValueAtTime(600, context.currentTime + 0.2)

        gainNode2.gain.setValueAtTime(0, context.currentTime)
        gainNode2.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02)
        gainNode2.gain.linearRampToValueAtTime(0, context.currentTime + 0.4)

        oscillator2.start(context.currentTime)
        oscillator2.stop(context.currentTime + 0.4)
      }, 500)

    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }

  useEffect(() => {
    if (isActive && !isPaused) {
      startTimeRef.current = startTimeRef.current || Date.now()

      intervalRef.current = setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout)
            setIsPaused(true)
            setIsActive(false)

            // Record focus session if work mode is completed
            if (mode === "work") {
              const duration = Math.floor((initialSeconds - 0) / 60)
              console.log('Recording focus session with duration:', duration)
              
              // Record the focus session and wait for it to complete
              recordFocusSession(duration)
                .then(async (result) => {
                  console.log('Focus session recording attempt result:', result)
                  if (result) {
                    // Only show success toast and update if the session was recorded
                    toast({
                      title: "Focus session completed!",
                      description: `${duration} minutes recorded successfully`,
                    })
                    
                    // Call the callback to refresh dashboard data
                    if (onFocusSessionComplete) {
                      try {
                        console.log('Attempting to refresh dashboard data...')
                        await onFocusSessionComplete()
                        console.log('Dashboard data refreshed successfully')
                      } catch (error) {
                        console.error('Error refreshing dashboard:', error)
                        toast({
                          title: "Error updating display",
                          description: "Your session was saved but the display might not be up to date. Please refresh the page.",
                          variant: "destructive",
                        })
                      }
                    }
                  } else {
                    throw new Error('Failed to record focus session - no data returned')
                  }
                })
                .catch(error => {
                  console.error('Error recording focus session:', error)
                  let errorMessage = "Your progress might not be saved."
                  
                  if (error.message?.includes('does not exist')) {
                    errorMessage = "The focus_sessions table does not exist in the database. Please contact support."
                  } else if (error.code === '42P01') {
                    errorMessage = "Database table not found. Please ensure the focus_sessions table exists."
                  } else if (error.code === '23503') {
                    errorMessage = "User authentication error. Please try logging out and back in."
                  }
                  
            toast({
                    title: "Error recording focus session",
                    description: errorMessage,
                    variant: "destructive",
                  })
                })
            }

            // Play notification sound
            playNotificationSound()

            // Show continue dialog
            setShowContinueDialog(true)

            // Reset start time
            startTimeRef.current = null

            return 0
          }
          return seconds - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, mode, soundEnabled, initialSeconds, onFocusSessionComplete, toast])

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const progress = secondsLeft > 0 ? 1 - (secondsLeft / initialSeconds) : 1

  const startTimer = () => {
    setIsActive(true)
    setIsPaused(false)
    startTimeRef.current = Date.now()
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsPaused(true)
    const preset = DEFAULT_PRESETS.find((p) => p.id === selectedPreset)
    const duration = mode === "work" 
      ? (preset?.workDuration || customWorkDuration) * 60 
      : (preset?.breakDuration || customBreakDuration) * 60
    setSecondsLeft(duration)
    setInitialSeconds(duration)
    startTimeRef.current = null
  }

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    const preset = DEFAULT_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      if (presetId === "custom") {
        const newDuration = mode === "work" ? customWorkDuration * 60 : customBreakDuration * 60
        setSecondsLeft(newDuration)
        setInitialSeconds(newDuration)
      } else {
        const newDuration = mode === "work" ? preset.workDuration * 60 : preset.breakDuration * 60
        setSecondsLeft(newDuration)
        setInitialSeconds(newDuration)
      }
      setIsActive(false)
      setIsPaused(true)
      startTimeRef.current = null
    }
  }

  const handleCustomTimerSave = () => {
    const customPresetIndex = DEFAULT_PRESETS.findIndex(p => p.id === "custom");
    if (customPresetIndex !== -1) {
      DEFAULT_PRESETS[customPresetIndex] = {
        ...DEFAULT_PRESETS[customPresetIndex],
        workDuration: customWorkDuration,
        breakDuration: customBreakDuration,
      };
    }

    setSelectedPreset("custom");
    const newDuration = mode === "work" ? customWorkDuration * 60 : customBreakDuration * 60;
    setSecondsLeft(newDuration);
    setInitialSeconds(newDuration);
    setShowCustomDialog(false);
    setIsActive(false);
    setIsPaused(true);
    startTimeRef.current = null;

    toast({
      title: "Custom timer saved!",
      description: `Work: ${customWorkDuration}min, Break: ${customBreakDuration}min`,
    });
  }

  const handleContinueSession = (shouldContinue: boolean) => {
    setShowContinueDialog(false)
    if (shouldContinue) {
      const newMode = mode === "work" ? "break" : "work"
      setMode(newMode)
      const preset = DEFAULT_PRESETS.find((p) => p.id === selectedPreset)
      const newDuration = newMode === "work"
        ? (preset?.workDuration || customWorkDuration) * 60
        : (preset?.breakDuration || customBreakDuration) * 60
      setSecondsLeft(newDuration)
      setInitialSeconds(newDuration)
      setIsActive(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()
    } else {
      // Restart the current mode timer when Maybe Later is clicked
      const preset = DEFAULT_PRESETS.find((p) => p.id === selectedPreset)
      const duration = mode === "work"
        ? (preset?.workDuration || customWorkDuration) * 60
        : (preset?.breakDuration || customBreakDuration) * 60
      setSecondsLeft(duration)
      setInitialSeconds(duration)
      setIsActive(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <Tabs
        defaultValue="25-5"
        value={selectedPreset}
        onValueChange={handlePresetChange}
        className="w-full"
      >
        <TabsList
          className={`grid w-full grid-cols-3 rounded-xl p-1 ${
            theme === "barbie" ? "bg-pink-100" : theme === "kawaii" ? "bg-purple-100" : "bg-blue-100"
          }`}
        >
          {DEFAULT_PRESETS.slice(0, 3).map((preset) => (
          <TabsTrigger
              key={preset.id}
              value={preset.id}
              className={`rounded-lg font-quicksand text-white ${
                selectedPreset === preset.id
                  ? theme === "barbie"
                    ? "bg-pink-500"
                : theme === "kawaii"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  : theme === "barbie"
                    ? "bg-pink-200 hover:bg-pink-300"
                : theme === "kawaii"
                      ? "bg-purple-200 hover:bg-purple-300"
                      : "bg-blue-200 hover:bg-blue-300"
            }`}
          >
              {preset.name}
          </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative w-48 h-48">
        <div className="absolute -top-3 -left-3">
          <DecorativeElement
            type={theme === "barbie" ? "heart" : theme === "kawaii" ? "star" : "cloud"}
            color={theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"}
            size="sm"
          />
        </div>
        <div className="absolute -bottom-3 -right-3">
          <DecorativeElement
            type={theme === "barbie" ? "star" : theme === "kawaii" ? "heart" : "star"}
            color={theme === "barbie" ? "purple" : theme === "kawaii" ? "pink" : "blue"}
            size="sm"
          />
        </div>

        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className={`text-${themeColor}-100`}
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <motion.circle
            className={`text-${themeColor}-500`}
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 * (1 - progress)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            initial={{ strokeDashoffset: 264 }}
            animate={{ strokeDashoffset: 264 * (1 - progress) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-black font-quicksand">{formatTime(secondsLeft)}</div>
            <div className="text-sm text-gray-600 capitalize font-quicksand">
              {mode} {mode === "work" 
                ? DEFAULT_PRESETS.find(p => p.id === selectedPreset)?.workDuration || customWorkDuration
                : DEFAULT_PRESETS.find(p => p.id === selectedPreset)?.breakDuration || customBreakDuration}min
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {isPaused ? (
          <Button
            onClick={startTimer}
            className={`rounded-full bg-gradient-to-r ${
              theme === "barbie"
                ? "from-pink-400 to-pink-600"
                : theme === "kawaii"
                  ? "from-purple-400 to-purple-600"
                  : "from-blue-400 to-blue-600"
            } shadow-md hover:shadow-lg transition-all duration-300 font-quicksand text-white`}
          >
            <Play className="h-4 w-4 mr-1" /> Start
          </Button>
        ) : (
          <Button
            onClick={pauseTimer}
            className={`rounded-full bg-gradient-to-r ${
              theme === "barbie"
                ? "from-pink-400 to-pink-600"
                : theme === "kawaii"
                  ? "from-purple-400 to-purple-600"
                  : "from-blue-400 to-blue-600"
            } shadow-md hover:shadow-lg transition-all duration-300 font-quicksand text-white`}
          >
            <Pause className="h-4 w-4 mr-1" /> Pause
          </Button>
        )}
        <Button
          onClick={resetTimer}
          variant="outline"
          className={`rounded-full border-${themeColor}-200 text-gray-700 hover:bg-${themeColor}-50 font-quicksand`}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`rounded-full border-${themeColor}-200 text-gray-700 hover:bg-${themeColor}-50`}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCustomDialog(true)}
          className={`rounded-full border-${themeColor}-200 text-gray-700 hover:bg-${themeColor}-50 ${
            selectedPreset === "custom" ? `bg-${themeColor}-500 text-white` : ""
          }`}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs font-quicksand">
          <span className="text-gray-700">Focus</span>
          <span className="text-gray-700">Break</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`h-7 w-7 p-0 rounded-full border-${themeColor}-200 text-gray-700 ${
              mode === "work" ? `bg-${themeColor}-500 text-white` : ""
            }`}
            onClick={() => {
              setMode("work")
              resetTimer()
            }}
          >
            F
          </Button>
          <Slider
            value={[mode === "work" ? 0 : 100]}
            min={0}
            max={100}
            step={100}
            className={`flex-1`}
            onValueChange={(value) => {
              const newMode = value[0] === 0 ? "work" : "break"
              setMode(newMode)
              resetTimer()
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className={`h-7 w-7 p-0 rounded-full border-${themeColor}-200 text-gray-700 ${
              mode === "break" ? `bg-${themeColor}-500 text-white` : ""
            }`}
            onClick={() => {
              setMode("break")
              resetTimer()
            }}
          >
            B
          </Button>
        </div>
      </div>

      {/* Continue/Break Dialog */}
      <Dialog open={showContinueDialog} onOpenChange={setShowContinueDialog}>
        <DialogContent className={`text-${themeColor}-500`}>
          <DialogHeader>
            <DialogTitle className={`text-${themeColor}-500`}>
              {mode === "work" ? "Work session completed!" : "Break time is over!"}
            </DialogTitle>
            <DialogDescription className={`text-${themeColor}-400`}>
              {mode === "work" 
                ? "Would you like to take a break?" 
                : "Ready to start another work session?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => handleContinueSession(false)} 
              className={`border-${themeColor}-200 text-${themeColor}-500 hover:bg-${themeColor}-400/20`}>
              Maybe Later
            </Button>
            <Button onClick={() => handleContinueSession(true)} 
              className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`}>
              {mode === "work" ? "Take Break" : "Start Working"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className={`text-${themeColor}-500`}>
          <DialogHeader>
            <DialogTitle className={`text-${themeColor}-500`}>Custom Timer</DialogTitle>
            <DialogDescription className={`text-${themeColor}-400`}>Set your own work and break durations</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workDuration" className={`text-right text-${themeColor}-500`}>
                Work (min)
              </Label>
              <Input
                id="workDuration"
                type="number"
                value={customWorkDuration}
                onChange={(e) => setCustomWorkDuration(Number(e.target.value))}
                className={`col-span-3 text-${themeColor}-500 bg-transparent border-${themeColor}-200 focus:border-${themeColor}-400`}
                min={1}
                max={120}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breakDuration" className={`text-right text-${themeColor}-500`}>
                Break (min)
              </Label>
              <Input
                id="breakDuration"
                type="number"
                value={customBreakDuration}
                onChange={(e) => setCustomBreakDuration(Number(e.target.value))}
                className={`col-span-3 text-${themeColor}-500 bg-transparent border-${themeColor}-200 focus:border-${themeColor}-400`}
                min={1}
                max={30}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCustomTimerSave} className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

