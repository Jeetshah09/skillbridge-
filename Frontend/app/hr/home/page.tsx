"use client"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { hrAPI, type HrProfile, type HrStats, type HrPostItem, type HrApplicationItem } from "@/lib/hr-api"
import { notificationsAPI } from "@/lib/notifications-api"

export default function HrHomePage() {
  const [profile, setProfile] = useState<HrProfile | null>(null)
  const [stats, setStats] = useState<HrStats | null>(null)
  const [posts, setPosts] = useState<HrPostItem[]>([])
  const [apps, setApps] = useState<HrApplicationItem[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [p, s, pi, pa, n] = await Promise.all([
          hrAPI.profile().catch(() => null),
          hrAPI.internshipStats().catch(() => null),
          hrAPI.recentInternships(5).catch(() => []),
          hrAPI.recentApplications(5).catch(() => []),
          notificationsAPI.listMy().catch(() => []),
        ])
        if (p) setProfile(p)
        if (s) setStats(s)
        setPosts(pi || [])
        setApps(pa || [])
        setNotes((n || []).slice(0, 3))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 p-4">
        <Navbar />
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Hello, Recruiter{profile?.company_name ? ` from ${profile.company_name}` : ""} 👋</CardTitle>
                <CardDescription>Here is your company activity at a glance</CardDescription>
              </div>
              <Button asChild>
                <a href="/hr/post-internship">+ Post Internship</a>
              </Button>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Internships Posted</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats ? stats.total_posts : "—"}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Applications Received</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats ? stats.applications_received : "—"}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Approved Applications</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats ? stats.approved_applications : "—"}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Active vs Expired</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm"><Badge variant="outline" className="mr-2">Active {stats ? stats.active_posts : "—"}</Badge><Badge variant="secondary">Expired {stats ? stats.expired_posts : "—"}</Badge></div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Internship Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Internship Posts</CardTitle>
              <CardDescription>Your latest {Math.min(posts.length, 5)} postings</CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No posts yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {posts.map(p => (
                    <li key={p.id} className="flex items-center justify-between border rounded p-2">
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.company_name} • {p.posted_date ? new Date(p.posted_date as any).toLocaleDateString() : '-'}</div>
                      </div>
                      <Badge variant="outline" className="capitalize">{p.status || 'active'}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest applications across your postings</CardDescription>
            </CardHeader>
            <CardContent>
              {apps.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 font-medium">Internship</th>
                        <th className="text-left py-2 font-medium">Applicant</th>
                        <th className="text-left py-2 font-medium">Status</th>
                        <th className="text-left py-2 font-medium">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map(a => (
                        <tr key={a.id} className="border-t">
                          <td className="py-2">{a.internship_title || a.internship_id}</td>
                          <td className="py-2">{a.student_name || '-'}</td>
                          <td className="py-2 capitalize">{a.status}</td>
                          <td className="py-2">{a.applied_date ? new Date(a.applied_date as any).toLocaleDateString() : '-'}</td>
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
              <CardDescription>Latest 3 notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {notes.slice(0,3).map((n: any) => (
                    <li key={n.id || n._id} className="border rounded p-2">
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
        </div>
      </div>
    </ProtectedRoute>
  )
}
