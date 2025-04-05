"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Clock, Database, Home, ListTodo, LogOut, Menu, Settings, Sparkles, Star, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useAuth } from "@/components/auth-provider"
import { useState } from "react"

interface NavbarProps {
  user: any
  activeTheme: "barbie" | "kawaii" | "pookie"
  setActiveTheme: (theme: "barbie" | "kawaii" | "pookie") => void
  onLogout?: () => void
  className?: string
}

export function Navbar({ className, user, activeTheme, setActiveTheme, onLogout, ...props }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAchievementsPage = typeof window !== 'undefined' && window.location.pathname === '/achievements'

  const handleNavigation = (sectionId?: string) => {
    if (isAchievementsPage) {
      // If on achievements page, redirect to dashboard with section hash
      window.location.href = sectionId ? `/#${sectionId}` : '/'
    } else {
      // If on dashboard, scroll to section
      if (sectionId) {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: "smooth" })
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const getThemeColors = () => {
    switch (activeTheme) {
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
    }
  }

  const theme = getThemeColors()

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm", className)} {...props}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Star className={`h-6 w-6 text-${theme.primary}-500`} />
            <span className={`text-xl font-pacifico text-${theme.primary}-500`}>
              PomoDoll
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-2">
            <Button
              variant="ghost"
              className="rounded-xl font-quicksand"
              asChild
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl font-quicksand"
              onClick={() => handleNavigation('tasks-section')}
            >
              <ListTodo className="mr-2 h-4 w-4" /> Tasks
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl font-quicksand"
              onClick={() => handleNavigation('pomodoro-section')}
            >
              <Clock className="mr-2 h-4 w-4" /> Pomodoro
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl font-quicksand"
              asChild
            >
              <Link href="/achievements">
                <Sparkles className="mr-2 h-4 w-4" /> Achievements
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full",
                activeTheme === "barbie" && "ring-2 ring-pink-500"
              )}
              onClick={() => setActiveTheme("barbie")}
            >
              <div className="h-3 w-3 rounded-full bg-pink-500"></div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full",
                activeTheme === "kawaii" && "ring-2 ring-purple-500"
              )}
              onClick={() => setActiveTheme("kawaii")}
            >
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full",
                activeTheme === "pookie" && "ring-2 ring-blue-500"
              )}
              onClick={() => setActiveTheme("pookie")}
            >
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            </Button>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="container py-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl font-quicksand"
              asChild
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl font-quicksand"
              onClick={() => handleNavigation('tasks-section')}
            >
              <ListTodo className="mr-2 h-4 w-4" /> Tasks
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl font-quicksand"
              onClick={() => handleNavigation('pomodoro-section')}
            >
              <Clock className="mr-2 h-4 w-4" /> Pomodoro
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl font-quicksand"
              asChild
            >
              <Link href="/achievements" onClick={() => setIsMobileMenuOpen(false)}>
                <Sparkles className="mr-2 h-4 w-4" /> Achievements
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

