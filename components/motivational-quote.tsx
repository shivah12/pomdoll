"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { DecorativeElement } from "@/components/decorative-element"

interface MotivationalQuoteProps {
  theme: "barbie" | "kawaii" | "pookie"
}

export function MotivationalQuote({ theme }: MotivationalQuoteProps) {
  const [quote, setQuote] = useState("")

  const barbieQuotes = [
    "You can be anything you want to be!",
    "The only limit is your imagination.",
    "Be the sparkle you want to see in the world!",
    "Dreams aren't just for sleeping.",
    "Life is too short to wear boring clothes!",
    "You're the driver of your own life, so take the wheel and enjoy the ride!",
    "When you stumble, make it part of the dance.",
    "The word 'impossible' isn't in my vocabulary.",
    "Believe in yourself and anything is possible!",
    "Every day is a fashion show and the world is your runway.",
  ]

  const kawaiiiQuotes = [
    "Small steps lead to big achievements!",
    "Sprinkle kindness everywhere you go!",
    "Every cloud has a silver lining.",
    "Your smile is your best accessory!",
    "Today is going to be a wonderful day.",
    "Happiness is a journey, not a destination.",
    "Be a rainbow in someone else's cloud.",
    "Keep your face always toward the sunshine.",
    "The best is yet to come!",
    "You're cuter than you think!",
  ]

  const pookieQuotes = [
    "You got this, pookie!",
    "One step at a time, pookie bear!",
    "Believe in yourself, little pookie!",
    "You're doing amazing, pookie!",
    "Keep shining, pookie bear!",
    "Today is your day, pookie!",
    "Stay pawsitive, pookie bear!",
    "You're stronger than you think, pookie!",
    "Never give up, little pookie!",
    "You're a superstar, pookie bear!",
  ]

  useEffect(() => {
    // Choose a random quote based on the theme
    const quotes = theme === "barbie" ? barbieQuotes : theme === "kawaii" ? kawaiiiQuotes : pookieQuotes

    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [theme])

  const themeColor = theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card
        className={`border-2 ${
          theme === "barbie"
            ? "border-pink-200 bg-pink-50/50"
            : theme === "kawaii"
              ? "border-purple-200 bg-purple-50/50"
              : "border-blue-200 bg-blue-50/50"
        } rounded-3xl shadow-md relative overflow-hidden`}
      >
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/50 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/50 rounded-full"></div>

        <CardContent className="p-6 flex items-center gap-3 relative">
          <div className="absolute -top-1 -left-1">
            <DecorativeElement
              type={theme === "barbie" ? "heart" : theme === "kawaii" ? "star" : "cloud"}
              color={theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"}
              size="xs"
            />
          </div>
          <Sparkles className={`h-6 w-6 text-${themeColor}-500`} />
          <p className={`text-${themeColor}-700 font-medium italic font-quicksand text-lg`}>{quote}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

