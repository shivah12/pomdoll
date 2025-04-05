"use client"

import { Navbar } from "@/components/ui/navbar"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const { user } = useAuth()
  const [activeTheme, setActiveTheme] = useState<"barbie" | "kawaii" | "pookie">("barbie")

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar user={user} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <h1 className="text-3xl font-pacifico text-pink-500">Terms of Service</h1>
        </div>

        <div className="prose prose-pink max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using PookiePlanner, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use PookiePlanner for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">3. User Account</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">4. Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your use of PookiePlanner is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">5. Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              The materials on PookiePlanner are provided on an 'as is' basis. PookiePlanner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">6. Limitations</h2>
            <p className="text-gray-600 mb-4">
              In no event shall PookiePlanner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PookiePlanner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">7. Revisions</h2>
            <p className="text-gray-600 mb-4">
              PookiePlanner may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">8. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at support@pookieplanner.com
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 