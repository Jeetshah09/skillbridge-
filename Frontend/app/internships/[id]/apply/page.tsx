"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  Star,
  FileText,
  Github,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, Internship, ApplyInternshipData } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"

function ApplyPageContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApplyInternshipData>({
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    github_url: '',
    motivation: '',
    relevant_experience: ''
  })

  useEffect(() => {
    if (params.id) {
      loadInternship(params.id as string)
    }
    // Pre-fill from saved student profile
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb:student_profile')
        if (saved) {
          const p = JSON.parse(saved)
          setFormData(prev => ({
            ...prev,
            resume_url: p.resume_url || prev.resume_url,
            portfolio_url: p.portfolio_url || prev.portfolio_url,
            github_url: p.github_url || prev.github_url,
            relevant_experience: prev.relevant_experience || (Array.isArray(p.skills) ? `Skills: ${p.skills.join(', ')}` : prev.relevant_experience)
          }))
        }
      } catch {}
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!internship || !user) return

    try {
      setSubmitting(true)
      await internshipAPI.applyForInternship(internship.id, formData)
      toast.success('Application submitted successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to submit application:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit application')
    } finally {
      setSubmitting(false)
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

  if (isDeadlinePassed || isApplicationFull) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {isDeadlinePassed ? 'Application Deadline Passed' : 'Applications Full'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isDeadlinePassed 
                ? 'The application deadline for this internship has passed.'
                : 'This internship has reached the maximum number of applications.'
              }
            </p>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/internships/${internship.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internship Details
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Internship</CardTitle>
                <CardDescription>
                  Fill out the application form to apply for this internship opportunity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="cover_letter">Cover Letter *</Label>
                    <Textarea
                      id="cover_letter"
                      name="cover_letter"
                      placeholder="Write a cover letter explaining why you're interested in this internship and what you can contribute..."
                      value={formData.cover_letter}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <Label htmlFor="motivation">What motivates you to apply for this internship?</Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      placeholder="Share your motivation and interest in this specific internship..."
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  {/* Relevant Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="relevant_experience">Relevant Experience</Label>
                    <Textarea
                      id="relevant_experience"
                      name="relevant_experience"
                      placeholder="Describe any relevant projects, coursework, or experience that makes you a good fit..."
                      value={formData.relevant_experience}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  {/* Links Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Portfolio & Links</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resume_url">Resume URL</Label>
                      <Input
                        id="resume_url"
                        name="resume_url"
                        type="url"
                        placeholder="https://drive.google.com/file/..."
                        value={formData.resume_url}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        name="portfolio_url"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolio_url}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        name="github_url"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={formData.github_url}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={`/internships/${internship.id}`}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Internship Summary */}
          <div className="space-y-6">
            {/* Internship Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{internship.title}</CardTitle>
                <CardDescription>{internship.company_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getDifficultyColor(internship.difficulty_level)}>
                    {internship.difficulty_level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getWorkTypeIcon(internship.work_type)} {internship.work_type}
                  </span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{internship.duration_weeks} weeks</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">₹{internship.stipend}</p>
                      <p className="text-xs text-muted-foreground">Stipend</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{internship.current_applicants}/{internship.max_applicants}</p>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">
                        {new Date(internship.application_deadline).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Mentor Info */}
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 bg-secondary/10 rounded-full p-2" />
                  <div>
                    <p className="font-medium text-sm">{internship.mentor_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {internship.mentor_year && `${internship.mentor_year} • `}
                      {internship.mentor_department}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5" />
                  Skills Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {internship.required_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Required</h4>
                      <div className="flex flex-wrap gap-1">
                        {internship.required_skills.map((skill) => (
                          <Badge key={skill} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {internship.preferred_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Preferred</h4>
                      <div className="flex flex-wrap gap-1">
                        {internship.preferred_skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Be specific about your relevant experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Highlight projects that match the required skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Show enthusiasm for the role and company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Include links to your portfolio and GitHub</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <ApplyPageContent />
    </ProtectedRoute>
  )
}
