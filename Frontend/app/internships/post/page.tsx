"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Briefcase,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Calendar,
  Star,
  Loader2,
  Save,
  Eye
} from "lucide-react"
import Link from "next/link"
import { internshipAPI, CreateInternshipData } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"

function PostInternshipContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateInternshipData>({
    title: "",
    description: "",
    company_name: user?.role === "hr" ? "" : "",
    mentor_name: user ? `${user.first_name} ${user.last_name}` : "",
    mentor_year: "",
    mentor_department: "",
    duration_weeks: 4,
    stipend: 0,
    max_applicants: 5,
    required_skills: [],
    preferred_skills: [],
    difficulty_level: "beginner",
    work_type: "remote",
    location: "",
    application_deadline: "",
    start_date: "",
    additional_info: "",
    benefits: []
  })

  const [newSkill, setNewSkill] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value) || 0
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }))
  }

  const addSkill = (type: "required_skills" | "preferred_skills") => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (type: "required_skills" | "preferred_skills", index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      setSubmitting(true)
      
      // Set company name if not provided
      const submissionData = {
        ...formData,
        company_name: formData.company_name || (user.role === "hr" ? "Your Company" : "SkillBridge")
      }

      await internshipAPI.createInternship(submissionData)
      toast.success("Internship posted successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error('Failed to post internship:', error)
      toast.error(error instanceof Error ? error.message : "Failed to post internship")
    } finally {
      setSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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
    switch (type) {
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

  if (previewMode) {
  return (
    <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setPreviewMode(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                Edit
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Post Internship
                  </>
                )}
            </Button>
            </div>
          </div>

          {/* Preview */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{formData.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-primary border-primary">
                      {formData.company_name}
                    </Badge>
                    <Badge variant={getDifficultyColor(formData.difficulty_level)}>
                      {formData.difficulty_level}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {formData.description}
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
                    <p className="text-sm font-medium">{formData.duration_weeks} weeks</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">₹{formData.stipend}</p>
                    <p className="text-xs text-muted-foreground">Stipend</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">0/{formData.max_applicants}</p>
                    <p className="text-xs text-muted-foreground">Applicants</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{getWorkTypeIcon(formData.work_type)} {formData.work_type}</p>
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
                    Application Deadline: {formData.application_deadline ? new Date(formData.application_deadline).toLocaleDateString() : 'Not set'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start Date: {formData.start_date ? new Date(formData.start_date).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {(formData.required_skills.length > 0 || formData.preferred_skills.length > 0) && (
                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="space-y-2">
                    {formData.required_skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.required_skills.map((skill, index) => (
                            <Badge key={index} variant="default">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.preferred_skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Preferred Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.preferred_skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {formData.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {formData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              {formData.additional_info && (
                <div>
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {formData.additional_info}
                  </p>
                </div>
              )}
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
            <Link href="/internships">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Post Internship
                </>
              )}
          </Button>
        </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
            <Card>
              <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details about your internship</CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Internship Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Full-Stack Web Development Internship"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        placeholder="Your company name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the internship role, responsibilities, and what students will learn..."
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration_weeks">Duration (weeks) *</Label>
                      <Input
                        id="duration_weeks"
                        name="duration_weeks"
                        type="number"
                        min="1"
                        max="52"
                        value={formData.duration_weeks}
                        onChange={(e) => handleNumberChange("duration_weeks", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stipend">Stipend (₹) *</Label>
                      <Input
                        id="stipend"
                        name="stipend"
                        type="number"
                        min="0"
                        value={formData.stipend}
                        onChange={(e) => handleNumberChange("stipend", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_applicants">Max Applicants *</Label>
                      <Input
                        id="max_applicants"
                        name="max_applicants"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.max_applicants}
                        onChange={(e) => handleNumberChange("max_applicants", e.target.value)}
                        required
                    />
                  </div>
                </div>
                </CardContent>
              </Card>

              {/* Mentor Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Information</CardTitle>
                  <CardDescription>Details about the mentor/guide for this internship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mentor_name">Mentor Name *</Label>
                      <Input
                        id="mentor_name"
                        name="mentor_name"
                        placeholder="Mentor's full name"
                        value={formData.mentor_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mentor_year">Mentor Year/Level</Label>
                      <Select value={formData.mentor_year} onValueChange={(value) => handleSelectChange("mentor_year", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mentor_department">Department</Label>
                      <Input
                        id="mentor_department"
                        name="mentor_department"
                        placeholder="e.g., Computer Science"
                        value={formData.mentor_department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Requirements</CardTitle>
                  <CardDescription>Specify the skills required and preferred for this internship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Required Skills */}
                    <div className="space-y-3">
                      <Label>Required Skills *</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.required_skills.map((skill, index) => (
                          <Badge key={index} variant="default" className="flex items-center gap-1">
                            {skill}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => removeSkill("required_skills", index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add required skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill("required_skills"))}
                        />
                        <Button type="button" size="sm" onClick={() => addSkill("required_skills")}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    <div className="space-y-3">
                      <Label>Preferred Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.preferred_skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {skill}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => removeSkill("preferred_skills", index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add preferred skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill("preferred_skills"))}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={() => addSkill("preferred_skills")}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty_level">Difficulty Level *</Label>
                      <Select value={formData.difficulty_level} onValueChange={(value) => handleSelectChange("difficulty_level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work_type">Work Type *</Label>
                      <Select value={formData.work_type} onValueChange={(value) => handleSelectChange("work_type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Location & Important Dates</CardTitle>
                  <CardDescription>Specify the location and key dates for the internship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Bangalore, India or Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="application_deadline">Application Deadline *</Label>
                      <Input
                        id="application_deadline"
                        name="application_deadline"
                        type="datetime-local"
                        value={formData.application_deadline}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Provide any additional details, benefits, or requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="additional_info">Additional Information</Label>
                    <Textarea
                      id="additional_info"
                      name="additional_info"
                      placeholder="Any additional details, requirements, or information about the internship..."
                      rows={4}
                      value={formData.additional_info}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <Label>Benefits & Perks</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {benefit}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeBenefit(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add benefit (e.g., Certificate, Letter of recommendation)"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={addBenefit}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Quick Stats */}
            <Card>
              <CardHeader>
                  <CardTitle>Internship Summary</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formData.duration_weeks} weeks</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">₹{formData.stipend}</p>
                        <p className="text-xs text-muted-foreground">Stipend</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formData.max_applicants}</p>
                        <p className="text-xs text-muted-foreground">Max Applicants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium capitalize">{formData.work_type}</p>
                        <p className="text-xs text-muted-foreground">Type</p>
                </div>
                </div>
                </div>
              </CardContent>
            </Card>

              {/* Tips */}
            <Card>
              <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Be specific about required skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Provide clear project descriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Set realistic deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Highlight unique benefits</span>
                    </li>
                  </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        </form>
      </div>
    </div>
  )
}

export default function PostInternshipPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <PostInternshipContent />
    </ProtectedRoute>
  )
}