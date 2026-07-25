"use client"

 import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  MapPin,
  MessageCircle,
  Plus,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react"
import { internshipAPI, type Application } from "@/lib/internship-api"
import { notificationsAPI } from "@/lib/notifications-api"
import { suggestionsAPI, type ScoredInternship } from "@/lib/suggestions-api"
import { Navbar } from "@/components/navbar"

// Removed mock heavy content; dashboard now focused on student actions

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationCount, setApplicationCount] = useState<number>(0)
  const [approvedCount, setApprovedCount] = useState<number>(0)
  const [rejectedCount, setRejectedCount] = useState<number>(0)
  const [ongoingCount, setOngoingCount] = useState<number>(0)
  const [recentApps, setRecentApps] = useState<Application[]>([])
  const [recommended, setRecommended] = useState<ScoredInternship[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)
  const [latestNotifications, setLatestNotifications] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState<boolean>(true)

  // If HR lands on /dashboard, redirect to /hr-dashboard to avoid duplicate dashboards
  useEffect(() => {
    if ((user?.role || "").toLowerCase() === "hr") {
      router.replace("/hr-dashboard")
    }
  }, [user?.role, router])

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingStats(true)
        const [apps, notes] = await Promise.all([
          internshipAPI.getMyApplications().catch(() => []),
          notificationsAPI.listMy().catch(() => []),
        ])
        const appsArr = Array.isArray(apps) ? apps : []
        setApplicationCount(appsArr.length)
        setApprovedCount(appsArr.filter(a => a.status?.toLowerCase() === 'approved').length)
        setRejectedCount(appsArr.filter(a => a.status?.toLowerCase() === 'rejected').length)
        setOngoingCount(appsArr.filter(a => a.status?.toLowerCase() === 'approved').length)
        setRecentApps(appsArr.slice(0, 3))

        const noteArr = Array.isArray(notes) ? notes : []
        setUnreadNotifications(noteArr.filter((n: any) => !n.read).length)
        setLatestNotifications(noteArr.slice(0, 3))

        // Recommended internships based on skills if available
        const skills: string[] = Array.isArray((user as any)?.skills) ? (user as any).skills : []
        if (skills.length) {
          const rec = await suggestionsAPI.suggestInternships({ skills, limit: 5 })
          setRecommended(rec)
        } else {
          setRecommended([])
        }
      } finally {
        setLoadingStats(false)
      }
    }
    load()
  }, [user])

  // simplified cards and quick links

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Hi, {user?.first_name} {user?.last_name} 👋</CardTitle>
                <CardDescription>Welcome back to SkillBridge!</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <a href="/profile"><Edit className="h-4 w-4 mr-2" />Edit Profile</a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:max-w-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loadingStats ? '—' : applicationCount}</div>
                  <p className="text-xs text-muted-foreground">Submitted overall</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loadingStats ? '—' : approvedCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loadingStats ? '—' : rejectedCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ongoing Internships</CardTitle>
                  <Clock className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loadingStats ? '—' : ongoingCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" asChild className="justify-start bg-transparent"><a href="/internships"><Briefcase className="h-4 w-4 mr-2"/>Browse Internships</a></Button>
                <Button variant="outline" asChild className="justify-start bg-transparent"><a href="/applications"><Clock className="h-4 w-4 mr-2"/>My Applications</a></Button>
                <Button variant="outline" asChild className="justify-start bg-transparent"><a href="/notifications"><BarChart3 className="h-4 w-4 mr-2"/>Notifications</a></Button>
                <Button variant="outline" asChild className="justify-start bg-transparent"><a href="/profile"><Edit className="h-4 w-4 mr-2"/>Edit Profile</a></Button>
              </CardContent>
            </Card>

            {/* Recommended Internships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-purple-600" />Recommended Internships</CardTitle>
                <CardDescription>Based on your skills</CardDescription>
              </CardHeader>
              <CardContent>
                {recommended.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recommendations yet. Add skills in your profile to get personalized suggestions.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommended.slice(0,5).map((r) => (
                      <Card key={r.id} className="border-dashed">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{r.title}</CardTitle>
                              <CardDescription>{r.company_name}</CardDescription>
                            </div>
                            <Badge variant="outline">{r.match}% match</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">{r.reason}</div>
                          <div className="text-xs text-muted-foreground mt-2">{r.duration_weeks} weeks • {r.work_type} • {r.difficulty_level}</div>
                          <Button size="sm" className="mt-3" asChild><a href={`/internships`}>View</a></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your last 3 applications</CardDescription>
              </CardHeader>
              <CardContent>
                {recentApps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">You haven't applied to any internships yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-muted-foreground">
                        <tr>
                          <th className="text-left font-medium py-2">Internship</th>
                          <th className="text-left font-medium py-2">Status</th>
                          <th className="text-left font-medium py-2">Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentApps.map((a) => (
                          <tr key={a.id} className="border-t">
                            <td className="py-2">{a.internship_title || a.internship_id}</td>
                            <td className="py-2 capitalize">{a.status}</td>
                            <td className="py-2">{a.applied_date ? new Date(a.applied_date).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                {latestNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notifications yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {latestNotifications.map((n: any) => (
                      <li key={n.id || n._id} className="border rounded-md p-2">
                        <div className="flex items-center justify-between">
                          <span>{n.title || n.message || 'Notification'}</span>
                          {!n.read && <Badge variant="secondary">New</Badge>}
                        </div>
                        {n.created_at && <div className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion (optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Fill in your details to improve matches</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const checks = [
                    Boolean(user?.first_name),
                    Boolean(user?.last_name),
                    Array.isArray((user as any)?.skills) && (user as any).skills.length > 0,
                  ]
                  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100)
                  return (
                    <div>
                      <div className="flex justify-between text-sm mb-2"><span>{pct}% complete</span><a href="/profile" className="text-primary">Complete profile</a></div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Removed Portfolio tab to declutter */}

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                    <AvatarFallback className="text-lg">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {((user as any)?.academic_year) || '—'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {((user as any)?.department) || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio and Skills */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-gray-600">Update your bio in profile</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="text-sm text-gray-600">Manage your skills in profile</div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="font-medium mb-2">Social Links</h4>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
