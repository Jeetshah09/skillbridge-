"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Menu,
  X,
  Home,
  GraduationCap,
  Users,
  Briefcase,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react"
import Link from "next/link"

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const currentPath = usePathname()

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/learn", label: "Learn", icon: GraduationCap },
    { href: "/teach", label: "Teach", icon: Users },
    { href: "/internships", label: "Internships", icon: Briefcase },
    { href: "/suggestions", label: "AI Suggestions", icon: BarChart3 },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard", label: "Dashboard", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Button - Fixed positioning for global access */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 md:hidden bg-card/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-transparent backdrop-blur-md border-r border-border/50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SkillBridge</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 bg-card/10">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card/20">
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
