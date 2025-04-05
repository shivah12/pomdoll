import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Mona_Sans as FontSans } from "next/font/google"
import { Pacifico } from "next/font/google"
import { Quicksand } from "next/font/google"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/components/auth-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontPacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
})

const fontQuicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pomodoll - Cute Productivity App</title>
        <meta name="description" content="The cutest productivity app with Barbie, Kawaii, and Pookie themes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontPacifico.variable,
          fontQuicksand.variable,
        )}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'Shreeti Mohapatra'
    };
