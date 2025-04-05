"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"

type AuthContextType = {
  user: UserProfile | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      // Get user directly from auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Create a basic profile from auth data
        const basicProfile: UserProfile = {
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: user.created_at || new Date().toISOString(),
        }

        setUser(basicProfile)
        console.log("Set basic user profile from auth data:", basicProfile)

        // Try to get profile from profiles table, but don't fail if it doesn't exist
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError) {
            if (!profileError.message.includes("does not exist")) {
              console.error("Error fetching profile:", profileError)
            }
            // Continue with basic profile if there's an error
          } else if (profileData) {
            // If we successfully got profile data, use it
            setUser(profileData as UserProfile)
            console.log("Updated user profile from database:", profileData)
          }
        } catch (error) {
          console.log("Error fetching profile, continuing with basic profile:", error)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      // Still try to get basic user info even if there was an error
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const basicProfile: UserProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            created_at: user.created_at || new Date().toISOString(),
          }
          setUser(basicProfile)
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error("Failed to get basic user info:", e)
        setUser(null)
      }
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true)

      try {
        console.log("Checking auth status...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("Session check result:", session ? "Session exists" : "No session")

        if (!session) {
          // Only redirect to login if we're on a protected page
          if (window.location.pathname.includes("/dashboard")) {
            router.push("/login")
          }
          setLoading(false)
          return
        }

        await refreshUser()
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session")

      if (event === "SIGNED_IN") {
        await refreshUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return <AuthContext.Provider value={{ user, loading, refreshUser }}>{children}</AuthContext.Provider>
}

