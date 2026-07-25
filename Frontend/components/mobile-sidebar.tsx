"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  BookOpen,
  Menu,
  X,
  Home,
  GraduationCap,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  User,
  LogOut,
  Shield,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const currentPath = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

          const navigationItems = [
            { href: "/", label: "Home", icon: Home, public: true },
            // { href: "/learn", label: "Learn", icon: GraduationCap, public: true }, // hidden for now
            // { href: "/teach", label: "Teach", icon: Users, public: true }, // hidden for now
            { href: "/internships", label: "Internships", icon: Briefcase, public: true },
            { href: "/suggestions", label: "AI Suggestions", icon: BarChart3, public: true },
            { href: "/notifications", label: "Notifications", icon: Bell, auth: true },
            { href: "/dashboard", label: "Dashboard", icon: Settings, auth: true },
            { href: "/profile", label: "Profile", icon: User, auth: true },
            { href: "/applications", label: "My Applications", icon: Briefcase, student: true },
            { href: "/hr-dashboard", label: "HR Dashboard", icon: Settings, hr: true },
            { href: "/company-profile", label: "Company Profile", icon: Shield, hr: true },
            { href: "/internships/post", label: "Post Internship", icon: Plus, hr: true },
          ]

  // Filter navigation items based on authentication status
  const getFilteredNavigationItems = () => {
    return navigationItems.filter(item => {
      if (item.public) return true
      if (item.auth) return isAuthenticated
      if (item.student) return isAuthenticated && user?.role === 'student'
      if (item.hr) return isAuthenticated && user?.role === 'hr'
      return false
    })
  }

  return (
    <>
      {/* Mobile Menu Button - Fixed positioning for global access */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-[60] lg:hidden bg-card/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white backdrop-blur-md border-r border-border/50 z-[60] transform transition-transform duration-300 ease-in-out lg:hidden ${
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
          {getFilteredNavigationItems().map((item) => {
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

        {/* Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card/20">
          {isAuthenticated ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Logout Button */}
              <Button 
                variant="outline" 
                className="w-full bg-transparent text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  )
}
