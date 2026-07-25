"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { notificationsAPI } from "@/lib/notifications-api"

export function Navbar() {
  const currentPath = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const role = (user?.role || '').toLowerCase()
  const homeHref = isAuthenticated
    ? role === 'admin' ? '/admin/dashboard' : role === 'hr' ? '/hr/home' : '/dashboard'
    : '/'

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (!isAuthenticated) {
          setUnreadCount(0)
          return
        }
        const items = await notificationsAPI.listMy()
        const count = items.filter((n) => !n.read).length
        setUnreadCount(count)
      } catch (e) {
        // ignore errors for header badge
      }
    }
    loadNotifications()
  }, [isAuthenticated])

  const navigationItems = [
    { href: "/", label: "Home", public: true },
    // { href: "/learn", label: "Learn", public: true }, // hidden for now
    // { href: "/teach", label: "Teach", public: true }, // hidden for now
    { href: "/internships", label: "Internships", public: true },
    { href: "/skill-matching", label: "Skill Match", public: true, hideForHR: true },
  ]

          const authNavigationItems = [
            { href: "/dashboard", label: "Dashboard", hideForHR: true },
            { href: "/profile", label: "Profile", hideForHR: true },
          ]

          const studentNavigationItems = [
            { href: "/applications", label: "My Applications", hideForHR: false },
          ]

          const hrNavigationItems = [
            { href: "/hr-dashboard", label: "HR Dashboard" },
            { href: "/company-profile", label: "Company Profile" },
          ]

  // Filter navigation items based on authentication status and role
  const getFilteredNavigationItems = () => {
    // Admin and HR should not see public nav items like Home/Internships
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'hr')) return []
    const items = navigationItems.filter(item => item.public)
    return items
  }

          const getAuthNavigationItems = () => {
            if (!isAuthenticated) return []
            // Admin and HR: hide auth nav like Messages/Dashboard/Profile in top row
            if (user?.role === 'admin' || user?.role === 'hr') return []
            const items = [...authNavigationItems]
            // Add role-specific navigation
            if (user?.role === 'student') {
              items.push(...studentNavigationItems)
            }
            return items
          }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between w-full">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">SkillBridge</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {getFilteredNavigationItems().map((item) => {
            const href = item.href === '/' ? homeHref : item.href
            return (
            <Link
              key={item.href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                currentPath === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          )})}
          {/* Admin quick links as top-level */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              {[
                { href: "/admin/dashboard", label: "🖥️ Dashboard" },
                { href: "/admin/users", label: "👥 Users" },
                { href: "/admin/internships", label: "💼 Internships" },
                { href: "/admin/applications", label: "📝 Applications" },
                { href: "/admin/notifications", label: "🔔 Notifications" },
                { href: "/admin/reports", label: "📊 Reports" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    currentPath === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
          {isAuthenticated && user?.role === 'hr' && (
            <>
              {[
                { href: "/hr/home", label: "🏠 Home" },
                { href: "/hr/post-internship", label: "➕ Post Internship" },
                { href: "/hr/manage-internships", label: "🧾 Manage Internships" },
                { href: "/hr/applications", label: "📥 Applications" },
                { href: "/hr/skill-matches", label: "🎯 Skill Matches" },
                { href: "/hr/profile", label: "👤 Profile" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    currentPath === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
          {/* Auth-only navigation items */}
          {getAuthNavigationItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                currentPath === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2 md:gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications Button */}
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" asChild>
                <Link href="/notifications" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 min-w-[16px] px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {/* For admin, hide extra dropdown links (only show Logout) */}
                  {user?.role !== 'admin' && (
                    <>
                      {user?.role !== 'hr' && (
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Direct Logout button next to name (desktop) */}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login/Signup Buttons */}
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="hidden sm:flex" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link href="/profile">Test Auth</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
