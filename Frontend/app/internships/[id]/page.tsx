"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Loader2,
  ExternalLink,
  Github,
  FileText,
  Star
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, Internship } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"

export default function InternshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadInternship(params.id as string)
    }
  }, [params.id])

  const loadInternship = async (id: string) => {
    try {
      setLoading(true)
      const data = await internshipAPI.getInternship(id)
      setInternship(data)
    } catch (error) {
      console.error('Failed to load internship:', error)
      toast.error('Failed to load internship details')
      router.push('/internships')
    } finally {
      setLoading(false)
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

  if (loading) {
  return (
    <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading internship details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Internship not found</h1>
            <p className="text-muted-foreground mb-6">The internship you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/internships">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Internships
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isApplicationFull = internship.current_applicants >= internship.max_applicants
  const isDeadlinePassed = new Date(internship.application_deadline) < new Date()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/internships">
            <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </Link>
          </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl mb-2">{internship.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-primary border-primary">
                        {internship.company_name}
                      </Badge>
                      <Badge variant={getDifficultyColor(internship.difficulty_level)}>
                        {internship.difficulty_level}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {internship.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{internship.duration_weeks} weeks</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">₹{internship.stipend}</p>
                      <p className="text-xs text-muted-foreground">Stipend</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{internship.current_applicants}/{internship.max_applicants}</p>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{getWorkTypeIcon(internship.work_type)} {internship.work_type}</p>
                      <p className="text-xs text-muted-foreground">Type</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Deadline */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Application Deadline: {new Date(internship.application_deadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isDeadlinePassed ? "Deadline has passed" : "Apply before this date"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skills Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {internship.required_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.required_skills.map((skill) => (
                          <Badge key={skill} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {internship.preferred_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Preferred Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.preferred_skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {internship.additional_info && (
            <Card>
              <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {internship.additional_info}
                  </p>
              </CardContent>
            </Card>
            )}

            {/* Benefits */}
            {internship.benefits.length > 0 && (
            <Card>
              <CardHeader>
                  <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                    {internship.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {internship.mentor_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{internship.mentor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {internship.mentor_year && `${internship.mentor_year} • `}
                      {internship.mentor_department}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Apply Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDeadlinePassed ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Application deadline has passed
                    </p>
                    <Button variant="outline" disabled className="w-full">
                      Deadline Passed
                    </Button>
                  </div>
                ) : isApplicationFull ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Maximum applications reached
                    </p>
                    <Button variant="outline" disabled className="w-full">
                      Applications Full
                    </Button>
                  </div>
                ) : isAuthenticated && user?.role === 'student' ? (
                  <Button asChild className="w-full">
                    <Link href={`/internships/${internship.id}/apply`}>
                      Apply for this Internship
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Login as a student to apply for this internship
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/login">
                        Login to Apply
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/register">
                        Sign Up as Student
                      </Link>
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posted:</span>
                    <span>{internship.posted_date ? new Date(internship.posted_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{internship.start_date ? new Date(internship.start_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {internship.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle>Share this Internship</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied to clipboard!')
                }}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}