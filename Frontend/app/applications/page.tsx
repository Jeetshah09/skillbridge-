"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users,
  Eye,
  FileText,
  Github,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, Application } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"

function ApplicationsPageContent() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await internshipAPI.getMyApplications()
      setApplications(data)
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      case 'selected':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Under Review'
      case 'reviewed':
        return 'Being Reviewed'
      case 'selected':
        return 'Selected'
      case 'rejected':
        return 'Not Selected'
      default:
        return status
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const pendingApplications = applications.filter(app => app.status === 'pending')
  const reviewedApplications = applications.filter(app => app.status === 'reviewed')
  const selectedApplications = applications.filter(app => app.status === 'selected')
  const rejectedApplications = applications.filter(app => app.status === 'rejected')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your applications...</span>
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your internship applications</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying for internships to see your application status here
              </p>
              <Button asChild>
                <Link href="/internships">
                  Browse Internships
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            {/* Tabs */}
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed ({reviewedApplications.length})</TabsTrigger>
              <TabsTrigger value="selected">Selected ({selectedApplications.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
            </TabsList>

            {/* All Applications */}
            <TabsContent value="all" className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </TabsContent>

            {/* Pending Applications */}
            <TabsContent value="pending" className="space-y-4">
              {pendingApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending applications</p>
                  </CardContent>
                </Card>
              ) : (
                pendingApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            {/* Reviewed Applications */}
            <TabsContent value="reviewed" className="space-y-4">
              {reviewedApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications under review</p>
                  </CardContent>
                </Card>
              ) : (
                reviewedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            {/* Selected Applications */}
            <TabsContent value="selected" className="space-y-4">
              {selectedApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No selected applications yet</p>
                  </CardContent>
                </Card>
              ) : (
                selectedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            {/* Rejected Applications */}
            <TabsContent value="rejected" className="space-y-4">
              {rejectedApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rejected applications</p>
                  </CardContent>
                </Card>
              ) : (
                rejectedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

function ApplicationCard({ application }: { application: Application }) {
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      case 'selected':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Under Review'
      case 'reviewed':
        return 'Being Reviewed'
      case 'selected':
        return 'Selected'
      case 'rejected':
        return 'Not Selected'
      default:
        return status
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{application.internship_title}</CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getStatusColor(application.status)} className="flex items-center gap-1">
                {getStatusIcon(application.status)}
                {getStatusText(application.status)}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Applied: {formatDate(application.applied_date)}</p>
            {application.reviewed_date && (
              <p>Reviewed: {formatDate(application.reviewed_date)}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Application Details */}
        {application.cover_letter && (
          <div>
            <h4 className="font-medium mb-2">Cover Letter</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {application.cover_letter}
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {application.resume_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-1" />
                Resume
              </a>
            </Button>
          )}
          {application.portfolio_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Portfolio
              </a>
            </Button>
          )}
          {application.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={application.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            </Button>
          )}
        </div>

        {/* Review Notes */}
        {application.review_notes && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="font-medium mb-1">Review Notes</h4>
            <p className="text-sm text-muted-foreground">{application.review_notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/internships/${application.internship_id}`}>
              View Internship
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <ApplicationsPageContent />
    </ProtectedRoute>
  )
}
