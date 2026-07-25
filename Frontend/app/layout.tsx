import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import "./globals.css"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { BookOpen } from "lucide-react"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "SkillBridge - Peer Learning Platform",
  description: "AI-powered peer learning and micro-internship portal for students",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <MobileSidebar />
          {children}
          <footer className="border-t border-border bg-card/50 py-8 px-4 mt-12">
            <div className="container mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">SkillBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students through peer learning and real-world experience.
              </p>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
