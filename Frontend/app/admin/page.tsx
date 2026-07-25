"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
 
import {
  AlertTriangle,
  Briefcase,
  Edit,
  Eye,
  Filter,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { adminAPI, type AdminStats, type AdminUserItem, type AdminApplicationItem, type AdminInternshipItem } from "@/lib/admin-api"
 
import { Navbar } from "@/components/navbar"

// Mock admin data
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  learningSessionsActive: 156,
  internshipsActive: 43,
  messagesDaily: 2341,
  reportsOpen: 7,
}

const mockRecentUsers = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@university.edu",
    joinDate: "2024-01-15",
    status: "active",
    role: "student",
    avatar: "/student-1.jpg",
  },
  {
    id: 2,
    name: "Dr. Sarah Chen",
    email: "s.chen@techuniv.edu",
    joinDate: "2024-01-14",
    status: "active",
    role: "mentor",
    avatar: "/mentor-1.jpg",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    email: "mike.r@college.edu",
    joinDate: "2024-01-13",
    status: "pending",
    role: "student",
    avatar: "/student-2.jpg",
  },
  {
    id: 4,
    name: "Prof. Kumar",
    email: "kumar@university.edu",
    joinDate: "2024-01-12",
    status: "active",
    role: "mentor",
    avatar: "/mentor-2.jpg",
  },
]

 

 

 

function AdminPageInner() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [applications, setApplications] = useState<AdminApplicationItem[]>([])
  const [internships, setInternships] = useState<AdminInternshipItem[]>([])
  const [intStatus, setIntStatus] = useState<string>("")
  const [intSearch, setIntSearch] = useState<string>("")
  const [appStatus, setAppStatus] = useState<string>("")
  const [appSearch, setAppSearch] = useState<string>("")
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<(AdminInternshipItem & { description?: string }) | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    company_name: "",
    location: "",
    duration: "",
    stipend: "",
    skills: "",
    deadline: "",
    status: "",
  })
  
  const params = useSearchParams()

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, a, ints] = await Promise.all([
          adminAPI.getStats().catch(() => null),
          adminAPI.listUsers().catch(() => []),
          adminAPI.listApplications().catch(() => []),
          adminAPI.listInternships().catch(() => []),
        ])
        if (s) setStats(s)
        setUsers(u)
        setApplications(a)
        setInternships(ints)
      } catch {}
    }
    load()
  }, [])

  // Sync tab with section param
  useEffect(() => {
    const section = (params.get('section') || '').toLowerCase()
    const map: Record<string, string> = {
      dashboard: 'dashboard',
      users: 'users',
      internships: 'internships',
      applications: 'applications',
      notifications: 'notifications',
      reports: 'reports',
    }
    const next = map[section] || 'dashboard'
    if (next !== activeTab) {
      setActiveTab(next)
    }
  }, [params, activeTab])

  // Load internships when filters change and internships tab is active
  useEffect(() => {
    const run = async () => {
      if (activeTab !== 'internships') return
      try {
        const apiStatus = intStatus === 'approved' ? 'active' : intStatus || undefined
        const list = await adminAPI.listInternships(apiStatus as any)
        setInternships(list)
      } catch (e) { /* ignore */ }
    }
    run()
  }, [activeTab, intStatus])

  // Load applications when filters change and applications tab is active
  useEffect(() => {
    const run = async () => {
      if (activeTab !== 'applications') return
      try {
        const list = await adminAPI.listApplications(appStatus || undefined)
        setApplications(list)
      } catch {}
    }
    run()
  }, [activeTab, appStatus])

  const displayName = (u: any) => {
    const name = (u?.name as string) || `${u?.first_name ?? ""} ${u?.last_name ?? ""}`.trim()
    return name || (u?.email as string) || "User"
  }

  const initials = (u: any) => {
    const name = displayName(u)
    const parts = name.split(" ").filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Student
          </Badge>
        )
      case "mentor":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Mentor
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Admin
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and monitor the SkillBridge platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Intl.NumberFormat().format(stats?.total_users ?? mockStats.totalUsers)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Intl.NumberFormat().format(users?.length || mockStats.activeUsers)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +8% from last week
                  </p>
                </CardContent>
              </Card>

              

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                  <Briefcase className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Intl.NumberFormat().format(stats?.active_internships ?? mockStats.internshipsActive)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.reportsOpen}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(users.length ? users : []).map((user: any) => (
                      <div key={user.email || user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {initials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{displayName(user)}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users and their permissions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(users.length ? users : mockRecentUsers).map((user: any) => (
                      <TableRow key={user.email || user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {initials(user)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{displayName(user)}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="destructive" size="sm" onClick={async () => {
                              if (user.email && confirm(`Delete user ${user.email}?`)) {
                                await adminAPI.deleteUser(user.email)
                                setUsers(prev => prev.filter(u => u.email !== user.email))
                              }
                            }}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Internships</CardTitle>
                    <CardDescription>Approve, edit, reject or delete internships</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search title/company..."
                        value={intSearch}
                        onChange={(e) => setIntSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={intStatus}
                      onChange={(e) => setIntStatus(e.target.value)}
                      className="h-9 border rounded-md px-2 text-sm bg-background"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="active">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Recruiter</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Posted On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internships
                      .filter(i => {
                        const q = intSearch.trim().toLowerCase()
                        if (!q) return true
                        return (i.title || '').toLowerCase().includes(q) || (i.company_name || '').toLowerCase().includes(q)
                      })
                      .map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.id}</TableCell>
                        <TableCell className="font-medium">{i.title}</TableCell>
                        <TableCell>{i.mentor_email || '-'}</TableCell>
                        <TableCell>{i.company_name || '-'}</TableCell>
                        <TableCell>{i.posted_date ? new Date(i.posted_date).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{i.status || 'pending'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={async () => {
                              setDetailLoading(true);
                              try {
                                const d = await adminAPI.getInternship(i.id)
                                setSelected(d)
                                setViewOpen(true)
                              } finally {
                                setDetailLoading(false)
                              }
                            }}>View</Button>
                            <Button size="sm" variant="outline" onClick={async () => {
                              try { await adminAPI.approveInternship(i.id); setInternships(prev => prev.map(p => p.id === i.id ? { ...p, status: 'active' } : p)); toast.success('Internship approved') } catch (e) { toast.error('Failed to approve') }
                            }}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={async () => {
                              try { await adminAPI.rejectInternship(i.id); setInternships(prev => prev.map(p => p.id === i.id ? { ...p, status: 'rejected' } : p)); toast.success('Internship rejected') } catch (e) { toast.error('Failed to reject') }
                            }}>Reject</Button>
                            <Button size="sm" variant="secondary" onClick={async () => {
                              setDetailLoading(true);
                              try {
                                const d = await adminAPI.getInternship(i.id)
                                setSelected(d)
                                setEditForm({
                                  title: d.title || "",
                                  company_name: d.company_name || "",
                                  location: d.location || "",
                                  duration: d.duration || "",
                                  stipend: d.stipend || "",
                                  skills: (d.skills as any) || "",
                                  deadline: d.deadline || "",
                                  status: d.status || "",
                                })
                                setEditOpen(true)
                              } finally {
                                setDetailLoading(false)
                              }
                            }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (!confirm('Delete this internship?')) return
                              try { await adminAPI.removeInternship(i.id); setInternships(prev => prev.filter(p => p.id !== i.id)); toast.success('Internship deleted') } catch (e) { toast.error('Failed to delete') }
                            }}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* View Modal */}
            {viewOpen && selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Internship Details</h3>
                    <Button variant="ghost" onClick={() => setViewOpen(false)}>Close</Button>
                  </div>
                  {detailLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">ID:</span> {selected.id}</div>
                      <div><span className="font-medium">Title:</span> {selected.title}</div>
                      <div><span className="font-medium">Company:</span> {selected.company_name}</div>
                      <div><span className="font-medium">Recruiter:</span> {selected.mentor_email || '-'}</div>
                      <div><span className="font-medium">Location:</span> {selected.location || '-'}</div>
                      <div><span className="font-medium">Duration:</span> {selected.duration || '-'}</div>
                      <div><span className="font-medium">Stipend:</span> {selected.stipend || '-'}</div>
                      <div><span className="font-medium">Skills:</span> {(selected.skills as any) || '-'}</div>
                      <div><span className="font-medium">Posted On:</span> {selected.posted_date ? new Date(selected.posted_date as any).toLocaleString() : '-'}</div>
                      <div><span className="font-medium">Deadline:</span> {selected.deadline || '-'}</div>
                      <div className="md:col-span-2"><span className="font-medium">Status:</span> {selected.status}</div>
                      <div className="md:col-span-2"><span className="font-medium">Description:</span> {selected.description || '-'}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Edit Modal */}
            {editOpen && selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Edit Internship</h3>
                    <Button variant="ghost" onClick={() => setEditOpen(false)}>Close</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs">Title</label>
                      <Input value={editForm.title} onChange={(e) => setEditForm(f => ({...f, title: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Company</label>
                      <Input value={editForm.company_name} onChange={(e) => setEditForm(f => ({...f, company_name: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Location</label>
                      <Input value={editForm.location} onChange={(e) => setEditForm(f => ({...f, location: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Duration</label>
                      <Input value={editForm.duration} onChange={(e) => setEditForm(f => ({...f, duration: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Stipend</label>
                      <Input value={editForm.stipend} onChange={(e) => setEditForm(f => ({...f, stipend: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Skills</label>
                      <Input value={editForm.skills} onChange={(e) => setEditForm(f => ({...f, skills: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Deadline</label>
                      <Input value={editForm.deadline} onChange={(e) => setEditForm(f => ({...f, deadline: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs">Status</label>
                      <Input value={editForm.status} onChange={(e) => setEditForm(f => ({...f, status: e.target.value}))} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={async () => {
                      if (!selected) return
                      try {
                        await adminAPI.updateInternship(selected.id, editForm)
                        setInternships(prev => prev.map(p => p.id === selected.id ? { ...p, ...editForm } as any : p))
                        setEditOpen(false)
                      } catch {}
                    }}>Save</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Monitor and manage student applications</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search student/internship..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={appStatus}
                      onChange={(e) => setAppStatus(e.target.value)}
                      className="h-9 border rounded-md px-2 text-sm bg-background"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Internship</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications
                      .filter(a => {
                        const q = appSearch.trim().toLowerCase()
                        if (!q) return true
                        return (a.student_name || '').toLowerCase().includes(q) || (a.internship_id || '').toLowerCase().includes(q)
                      })
                      .map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.student_name}</TableCell>
                        <TableCell>{app.internship_id}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{app.status}</Badge></TableCell>
                        <TableCell>{app.applied_date || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={async () => {
                              try { await adminAPI.updateApplicationStatus(app.id, 'approved'); setApplications(prev => prev.map(p => p.id === app.id ? { ...p, status: 'approved' } : p)) } catch {}
                            }}>Approve</Button>
                            <Button size="sm" variant="secondary" onClick={async () => {
                              try { await adminAPI.updateApplicationStatus(app.id, 'rejected'); setApplications(prev => prev.map(p => p.id === app.id ? { ...p, status: 'rejected' } : p)) } catch {}
                            }}>Reject</Button>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (!confirm('Delete this application?')) return
                              try { await adminAPI.deleteApplication(app.id); setApplications(prev => prev.filter(p => p.id !== app.id)) } catch {}
                            }}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Broadcast Notification</CardTitle>
                <CardDescription>Send system-wide or targeted alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-w-xl">
                  <div>
                    <label className="block text-sm mb-1">Title</label>
                    <Input placeholder="Announcement title" id="notif-title" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Message</label>
                    <Input placeholder="Write your message" id="notif-msg" />
                  </div>
                  <Button onClick={async () => {
                    const title = (document.getElementById('notif-title') as HTMLInputElement)?.value || ''
                    const message = (document.getElementById('notif-msg') as HTMLInputElement)?.value || ''
                    if (!title || !message) return
                    try { await adminAPI.broadcastNotification({ title, message, target: 'all' }); (document.getElementById('notif-title') as HTMLInputElement).value = ''; (document.getElementById('notif-msg') as HTMLInputElement).value = '' } catch {}
                  }}>Send Notification</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>All roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_users ?? '-'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Internships</CardTitle>
                  <CardDescription>All posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_internships ?? '-'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Internships</CardTitle>
                  <CardDescription>Approved and active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.active_internships ?? '-'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Applications</CardTitle>
                  <CardDescription>All submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_applications ?? '-'}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageInner />
    </ProtectedRoute>
  )
}
