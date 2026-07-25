"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Loader2,
  MoreHorizontal,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, Internship, Application } from "@/lib/internship-api"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function HRDashboardContent() {
  const { user } = useAuth()
  const [internships, setInternships] = useState<Internship[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (user?.email) {
      loadData()
    }
  }, [user?.email])

  const loadData = async () => {
    try {
      setLoading(true)
      // Fetch internships and then gather applications for those internships owned by this HR
      const internshipsData = await internshipAPI.getInternships({ limit: 50 }).catch(() => [])

      // Filter internships created by current HR user using mentor_email
      const myEmail = (user?.email || '').toLowerCase()
      const myInternships = (internshipsData as any[]).filter((internship) =>
        (internship?.mentor_email || '').toLowerCase() === myEmail
      )

      setInternships(myInternships as any)

      // Load applications for each of HR's internships
      const appsByInternship = await Promise.all(
        (myInternships as any[]).map((i) =>
          internshipAPI.getInternshipApplications(i.id).catch(() => [])
        )
      )
      const mergedApps = appsByInternship.flat().map((app: any) => ({
        ...app,
        internship_title:
          app.internship_title ||
          (myInternships as any[]).find((i) => i.id === app.internship_id)?.title,
      }))

      setApplications(mergedApps as any)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInternship = async (internshipId: string) => {
    if (!confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      return
    }

    try {
      await internshipAPI.deleteInternship(internshipId)
      toast.success('Internship deleted successfully')
      loadData() // Reload data
    } catch (error) {
      console.error('Failed to delete internship:', error)
      toast.error('Failed to delete internship')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'secondary'
      case 'intermediate':
        return 'default'
      case 'advanced':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getWorkTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'remote':
        return '🏠'
      case 'hybrid':
        return '🏢'
      case 'onsite':
        return '🏢'
      default:
        return '📍'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default'
      case 'reviewed':
        return 'secondary'
      case 'selected':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  // Calculate stats
  const totalInternships = internships.length
  const activeInternships = internships.filter(i => i.status === 'active').length
  const totalApplications = applications.length
  const pendingApplications = applications.filter(a => a.status === 'pending').length
  const selectedApplications = applications.filter(a => a.status === 'selected').length

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">HR Dashboard</h1>
            <p className="text-muted-foreground">Manage your internships and applications</p>
          </div>
          <Button asChild>
            <Link href="/internships/post">
              <Plus className="w-4 h-4 mr-2" />
              Post New Internship
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="internships">My Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInternships}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeInternships} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingApplications} pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Selected Candidates</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully hired
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeInternships}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently accepting applications
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Internships */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Internships</CardTitle>
                  <CardDescription>Your latest internship postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {internships.slice(0, 3).map((internship) => (
                      <div key={internship.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{internship.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {internship.current_applicants}/{internship.max_applicants} applicants
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getDifficultyColor(internship.difficulty_level)}>
                            {internship.difficulty_level}
                          </Badge>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/internships/${internship.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {internships.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No internships posted yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest applications to review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {application.student_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{application.student_name}</h4>
                            <p className="text-xs text-muted-foreground">{application.internship_title}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No applications yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Internships Tab */}
          <TabsContent value="internships" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Internships</h2>
              <Button asChild>
                <Link href="/internships/post">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Internship
                </Link>
              </Button>
            </div>

            {internships.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No internships posted</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by posting your first internship to attract talented students
                  </p>
                  <Button asChild>
                    <Link href="/internships/post">
                      Post Your First Internship
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {internships.map((internship) => (
                  <Card key={internship.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{internship.title}</CardTitle>
                          <CardDescription className="mb-3">{internship.description}</CardDescription>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{internship.duration_weeks} weeks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>₹{internship.stipend}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{internship.current_applicants}/{internship.max_applicants}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{getWorkTypeIcon(internship.work_type)} {internship.work_type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getDifficultyColor(internship.difficulty_level)}>
                            {internship.difficulty_level}
                          </Badge>
                          <Badge variant="outline">
                            {internship.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/internships/${internship.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/internships/${internship.id}/applications`}>
                                  <Users className="w-4 h-4 mr-2" />
                                  View Applications
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/internships/${internship.id}/edit`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteInternship(internship.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Posted: {formatDate(internship.posted_date)}</span>
                          <span>Deadline: {formatDate(internship.application_deadline)}</span>
                          <span>Start: {formatDate(internship.start_date)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/internships/${internship.id}`}>
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/internships/${internship.id}/applications`}>
                              <Users className="w-4 h-4 mr-1" />
                              Applications ({internship.current_applicants})
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Applications</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Total: {totalApplications}</Badge>
                <Badge variant="default">Pending: {pendingApplications}</Badge>
              </div>
            </div>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Applications will appear here once students start applying to your internships
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {application.student_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{application.student_name}</h3>
                            <p className="text-sm text-muted-foreground">{application.internship_title}</p>
                            <p className="text-xs text-muted-foreground">
                              Applied: {formatDate(application.applied_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/applications/${application.id}/review`}>
                              Review
                            </Link>
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => {
                            toast.info("Messaging feature has been removed")
                          }}>
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {application.cover_letter && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Cover Letter</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.cover_letter}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {application.resume_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                                Resume
                              </a>
                            </Button>
                          )}
                          {application.portfolio_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                                Portfolio
                              </a>
                            </Button>
                          )}
                          {application.github_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.github_url} target="_blank" rel="noopener noreferrer">
                                GitHub
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending</span>
                      <Badge variant="default">{pendingApplications}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Selected</span>
                      <Badge variant="default">{selectedApplications}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rejected</span>
                      <Badge variant="destructive">{applications.filter(a => a.status === 'rejected').length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internship Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Internships</span>
                      <Badge variant="outline">{totalInternships}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Internships</span>
                      <Badge variant="default">{activeInternships}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Applications</span>
                      <Badge variant="secondary">
                        {totalInternships > 0 ? Math.round(totalApplications / totalInternships) : 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function HRDashboardPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <HRDashboardContent />
    </ProtectedRoute>
  )
}
