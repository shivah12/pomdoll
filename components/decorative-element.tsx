"use client"

import { motion } from "framer-motion"
import { Heart, Star, Cloud } from "lucide-react"

interface DecorativeElementProps {
  type: "heart" | "star" | "cloud"
  color: "pink" | "purple" | "blue"
  size: "xs" | "sm" | "md" | "lg" | "xl"
}

export function DecorativeElement({ type, color, size }: DecorativeElementProps) {
  const sizeMap = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const colorMap = {
    pink: "text-pink-400",
    purple: "text-purple-400",
    blue: "text-blue-400",
  }

  const animationVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
    rotate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
  }

  const getAnimation = () => {
    switch (type) {
      case "heart":
        return "pulse"
      case "star":
        return "rotate"
      case "cloud":
        return "float"
      default:
        return "pulse"
    }
  }

  const renderElement = () => {
    switch (type) {
      case "heart":
        return <Heart className={`${sizeMap[size]} ${colorMap[color]} fill-current`} />
      case "star":
        return <Star className={`${sizeMap[size]} ${colorMap[color]} fill-current`} />
      case "cloud":
        return <Cloud className={`${sizeMap[size]} ${colorMap[color]} fill-current`} />
      default:
        return null
    }
  }

  return (
    <motion.div variants={animationVariants} animate={getAnimation()}>
      {renderElement()}
    </motion.div>
  )
}

