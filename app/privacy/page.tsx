"use client"

import { Navbar } from "@/components/ui/navbar"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const { user } = useAuth()
  const [activeTheme, setActiveTheme] = useState<"barbie" | "kawaii" | "pookie">("barbie")

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar user={user} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <h1 className="text-3xl font-pacifico text-pink-500">Privacy Policy</h1>
        </div>

        <div className="prose prose-pink max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, including your name, email address, and any other information you choose to provide when you create an account or use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not share your personal information with third parties except as described in this policy. We may share your information with service providers who assist us in operating our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">5. Your Choices</h2>
            <p className="text-gray-600 mb-4">
              You may update, correct, or delete your account information at any time by logging into your account or contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">6. Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">9. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@pookieplanner.com
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 