"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

interface ThemeSwitcherProps {
  activeTheme: "barbie" | "kawaii" | "pookie"
  setActiveTheme: (theme: "barbie" | "kawaii" | "pookie") => void
}

export function ThemeSwitcher({ activeTheme, setActiveTheme }: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${
            activeTheme === "barbie"
              ? "border-pink-200 text-pink-500"
              : activeTheme === "kawaii"
                ? "border-purple-200 text-purple-500"
                : "border-blue-200 text-blue-500"
          }`}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-lg p-2 w-56">
        <DropdownMenuItem
          onClick={() => setActiveTheme("barbie")}
          className={`rounded-lg mb-1 ${activeTheme === "barbie" ? "bg-pink-100 text-pink-700" : ""}`}
        >
          <div className="flex items-center gap-3 py-1 w-full">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
              {activeTheme === "barbie" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 bg-white rounded-full" />
              )}
            </div>
            <div>
              <div className="font-quicksand font-medium">Barbie Theme</div>
              <div className="text-xs text-muted-foreground">Pink and fabulous</div>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setActiveTheme("kawaii")}
          className={`rounded-lg mb-1 ${activeTheme === "kawaii" ? "bg-purple-100 text-purple-700" : ""}`}
        >
          <div className="flex items-center gap-3 py-1 w-full">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              {activeTheme === "kawaii" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 bg-white rounded-full" />
              )}
            </div>
            <div>
              <div className="font-quicksand font-medium">Kawaii Theme</div>
              <div className="text-xs text-muted-foreground">Cute and sweet</div>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setActiveTheme("pookie")}
          className={`rounded-lg ${activeTheme === "pookie" ? "bg-blue-100 text-blue-700" : ""}`}
        >
          <div className="flex items-center gap-3 py-1 w-full">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              {activeTheme === "pookie" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 bg-white rounded-full" />
              )}
            </div>
            <div>
              <div className="font-quicksand font-medium">Pookie Theme</div>
              <div className="text-xs text-muted-foreground">Cozy and calm</div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

