"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  ExternalLink,
  Github,
  Globe,
  Check,
  X,
  Clock,
  Loader2,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, Application } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function ApplicationReviewContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [reviewNotes, setReviewNotes] = useState("")

  const applicationId = params.id as string

  useEffect(() => {
    loadApplication()
  }, [applicationId])

  const loadApplication = async () => {
    try {
      setLoading(true)
      // For now, we'll get all applications and find the specific one
      // In a real app, you'd have a getApplicationById endpoint
      const applications = await internshipAPI.getMyApplications()
      const foundApplication = applications.find(app => app.id === applicationId)
      
      if (!foundApplication) {
        toast.error('Application not found')
        router.push('/hr-dashboard')
        return
      }
      
      setApplication(foundApplication)
      setNewStatus(foundApplication.status)
      setReviewNotes(foundApplication.review_notes || "")
    } catch (error) {
      console.error('Failed to load application:', error)
      toast.error('Failed to load application')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!application) return

    try {
      setSubmitting(true)
      await internshipAPI.updateApplication(application.id, {
        status: newStatus as any,
        review_notes: reviewNotes
      })
      
      toast.success('Application status updated successfully')
      router.push('/hr-dashboard')
    } catch (error) {
      console.error('Failed to update application:', error)
      toast.error('Failed to update application status')
    } finally {
      setSubmitting(false)
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
        return <MessageSquare className="w-4 h-4" />
      case 'selected':
        return <Check className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading application...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">Application not found</h3>
              <p className="text-muted-foreground mb-4">
                The application you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/hr-dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link href="/hr-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            <Badge variant={getStatusColor(application.status)}>
              {application.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
                <CardDescription>Student details and application information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {application.student_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{application.student_name}</h3>
                    <p className="text-muted-foreground">{application.internship_title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {formatDate(application.applied_date)}</span>
                      </div>
                      {application.reviewed_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Reviewed: {formatDate(application.reviewed_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Student Email</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{application.student_email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Application Status</Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <Badge variant={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {application.cover_letter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                  <CardDescription>The student's motivation and interest in this internship</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {application.cover_letter}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {(application.motivation || application.relevant_experience) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Student's motivation and relevant experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.motivation && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Motivation</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.motivation}
                      </p>
                    </div>
                  )}
                  {application.relevant_experience && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Relevant Experience</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.relevant_experience}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Documents & Portfolio</CardTitle>
                <CardDescription>Student's resume, portfolio, and other relevant links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.resume_url && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Resume</h4>
                        <p className="text-xs text-muted-foreground">Student's CV and qualifications</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {application.portfolio_url && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Globe className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Portfolio</h4>
                        <p className="text-xs text-muted-foreground">Student's work showcase</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {application.github_url && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Github className="w-8 h-8 text-gray-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">GitHub</h4>
                        <p className="text-xs text-muted-foreground">Student's code repository</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={application.github_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>

                {!application.resume_url && !application.portfolio_url && !application.github_url && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No documents or links provided by the student
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Review Actions */}
          <div className="space-y-6">
            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Review Application</CardTitle>
                <CardDescription>Update status and add review notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="reviewed">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Reviewed
                        </div>
                      </SelectItem>
                      <SelectItem value="selected">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review_notes">Review Notes</Label>
                  <Textarea
                    id="review_notes"
                    placeholder="Add your feedback and notes about this application..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes will be visible to the student and help them understand your decision.
                  </p>
                </div>

                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={submitting || newStatus === application.status}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Applied</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(application.applied_date)}
                    </span>
                  </div>
                  {application.reviewed_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reviewed</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(application.reviewed_date)}
                      </span>
                    </div>
                  )}
                  {application.reviewed_by && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reviewed By</span>
                      <span className="text-sm text-muted-foreground">
                        {application.reviewed_by}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Previous Review Notes */}
            {application.review_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Review Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {application.review_notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/internships/${application.internship_id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Internship Details
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr-dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ApplicationReviewPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <ApplicationReviewContent />
    </ProtectedRoute>
  )
}
