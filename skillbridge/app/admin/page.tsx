"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"

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

const mockLearningSessions = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Chen",
    students: 12,
    status: "active",
    startDate: "2024-01-10",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Dr. Kumar",
    students: 8,
    status: "active",
    startDate: "2024-01-08",
    category: "AI/ML",
  },
  {
    id: 3,
    title: "Database Design",
    instructor: "Alex Johnson",
    students: 15,
    status: "completed",
    startDate: "2024-01-05",
    category: "Backend",
  },
]

const mockInternships = [
  {
    id: 1,
    title: "Frontend Development Project",
    company: "TechStart Inc.",
    applicants: 23,
    status: "active",
    deadline: "2024-02-15",
    mentor: "Sarah Chen",
  },
  {
    id: 2,
    title: "Data Analysis Dashboard",
    company: "Analytics Pro",
    applicants: 18,
    status: "active",
    deadline: "2024-02-20",
    mentor: "Dr. Kumar",
  },
  {
    id: 3,
    title: "Mobile App Development",
    company: "AppCorp",
    applicants: 31,
    status: "closed",
    deadline: "2024-01-30",
    mentor: "Mike Johnson",
  },
]

const mockReports = [
  {
    id: 1,
    type: "inappropriate_content",
    reporter: "Emma Wilson",
    reported: "John Doe",
    description: "Inappropriate language in learning session chat",
    status: "open",
    priority: "medium",
    date: "2024-01-15",
  },
  {
    id: 2,
    type: "spam",
    reporter: "Alex Johnson",
    reported: "Spam Account",
    description: "Multiple spam messages in internship applications",
    status: "investigating",
    priority: "high",
    date: "2024-01-14",
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      case "investigating":
        return <Badge className="bg-orange-100 text-orange-800">Investigating</Badge>
      case "open":
        return <Badge className="bg-red-100 text-red-800">Open</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">{mockStats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +8% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Sessions</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.learningSessionsActive}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                  <Briefcase className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.internshipsActive}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.messagesDaily.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    -3% from yesterday
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
                    {mockRecentUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Uptime</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Performance</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Optimal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">145ms</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">67%</span>
                    </div>
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
                    {mockRecentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
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

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Sessions</CardTitle>
                  <CardDescription>Manage active and completed learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLearningSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-sm text-gray-500">by {session.instructor}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">{session.students} students</span>
                            <Badge variant="outline">{session.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(session.status)}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Micro-Internships</CardTitle>
                  <CardDescription>Oversee internship opportunities and applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInternships.map((internship) => (
                      <div key={internship.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{internship.title}</h4>
                          <p className="text-sm text-gray-500">{internship.company}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">{internship.applicants} applicants</span>
                            <span className="text-xs text-gray-500">Due: {internship.deadline}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(internship.status)}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                <CardDescription>Review and manage user reports and content moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline">{report.type.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reported}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getPriorityColor(report.priority)}`}>{report.priority}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <XCircle className="h-4 w-4" />
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>Detailed insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">89%</div>
                    <p className="text-sm text-gray-600">User Satisfaction</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">76%</div>
                    <p className="text-sm text-gray-600">Session Completion</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.2</div>
                    <p className="text-sm text-gray-600">Avg. Session Rating</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">68%</div>
                    <p className="text-sm text-gray-600">Internship Success</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
