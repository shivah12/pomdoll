"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DebugLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckUser = async () => {
    setIsLoading(true)
    try {
      // Check if user exists in auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setResult({
        authResult: data || error,
        timestamp: new Date().toISOString(),
      })

      // Check session
      const { data: sessionData } = await supabase.auth.getSession()

      setResult((prev) => ({
        ...prev,
        sessionData,
      }))
    } catch (error) {
      setResult({
        error: error,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Debug Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="debug-email">Email</Label>
            <Input id="debug-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="debug-password">Password</Label>
            <Input id="debug-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleCheckUser} className="w-full" disabled={isLoading}>
            {isLoading ? "Checking..." : "Check User"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

