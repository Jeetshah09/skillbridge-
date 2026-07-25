"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Loader2,
  Upload,
  Star,
  Award,
  Target
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"

interface CompanyProfile {
  company_name: string
  company_email: string
  company_phone: string
  company_address: string
  company_website: string
  company_size: string
  industry: string
  founded_year: string
  description: string
  company_logo: string
  benefits: string[]
  company_culture: string
  mission_statement: string
  vision_statement: string
  social_links: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  locations: string[]
  specializations: string[]
}

function CompanyProfileContent() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newBenefit, setNewBenefit] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")
  
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: user?.role === "hr" ? "Your Company" : "SkillBridge",
    company_email: user?.email || "",
    company_phone: "",
    company_address: "",
    company_website: "",
    company_size: "",
    industry: "",
    founded_year: "",
    description: "",
    company_logo: "",
    benefits: [],
    company_culture: "",
    mission_statement: "",
    vision_statement: "",
    social_links: {},
    locations: [],
    specializations: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setProfile(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setProfile(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const addLocation = () => {
    if (newLocation.trim()) {
      setProfile(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()]
      }))
      setNewLocation("")
    }
  }

  const removeLocation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }))
  }

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setProfile(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }))
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (index: number) => {
    setProfile(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Here you would save to your backend
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Company profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data here if needed
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Company Profile</h1>
            <p className="text-muted-foreground">Manage your company information and branding</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Overview
                </CardTitle>
                <CardDescription>Basic information about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.company_logo} alt="Company Logo" />
                    <AvatarFallback>
                      <Building2 className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="company_logo">Company Logo URL</Label>
                        <Input
                          id="company_logo"
                          name="company_logo"
                          placeholder="https://example.com/logo.png"
                          value={profile.company_logo}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold">{profile.company_name}</h3>
                        <p className="text-muted-foreground">{profile.industry}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={profile.company_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      value={profile.industry}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_size">Company Size</Label>
                    <Input
                      id="company_size"
                      name="company_size"
                      placeholder="e.g., 1-10, 11-50, 51-200, 201-500, 500+"
                      value={profile.company_size}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded_year">Founded Year</Label>
                    <Input
                      id="founded_year"
                      name="founded_year"
                      placeholder="e.g., 2020"
                      value={profile.founded_year}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your company, what you do, and what makes you unique..."
                    value={profile.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>How students and candidates can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Company Email *</Label>
                    <Input
                      id="company_email"
                      name="company_email"
                      type="email"
                      value={profile.company_email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone Number</Label>
                    <Input
                      id="company_phone"
                      name="company_phone"
                      placeholder="+91 9876543210"
                      value={profile.company_phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_website">Website</Label>
                  <Input
                    id="company_website"
                    name="company_website"
                    placeholder="https://www.yourcompany.com"
                    value={profile.company_website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_address">Address</Label>
                  <Textarea
                    id="company_address"
                    name="company_address"
                    placeholder="Your company's physical address..."
                    value={profile.company_address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mission & Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Mission & Vision
                </CardTitle>
                <CardDescription>Your company's purpose and future goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission_statement">Mission Statement</Label>
                  <Textarea
                    id="mission_statement"
                    name="mission_statement"
                    placeholder="What is your company's mission? What do you aim to achieve?"
                    value={profile.mission_statement}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vision_statement">Vision Statement</Label>
                  <Textarea
                    id="vision_statement"
                    name="vision_statement"
                    placeholder="What is your company's vision for the future?"
                    value={profile.vision_statement}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_culture">Company Culture</Label>
                  <Textarea
                    id="company_culture"
                    name="company_culture"
                    placeholder="Describe your company culture, values, and work environment..."
                    value={profile.company_culture}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Locations & Specializations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Locations
                  </CardTitle>
                  <CardDescription>Where your company operates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.locations.map((location, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {location}
                        {isEditing && (
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeLocation(index)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add location"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                      />
                      <Button size="sm" onClick={addLocation}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Specializations
                  </CardTitle>
                  <CardDescription>What your company specializes in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((specialization, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {specialization}
                        {isEditing && (
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeSpecialization(index)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add specialization"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                      />
                      <Button size="sm" variant="outline" onClick={addSpecialization}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Benefits & Perks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Benefits & Perks
                </CardTitle>
                <CardDescription>What you offer to your employees and interns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.benefits.map((benefit, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {benefit}
                      {isEditing && (
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeBenefit(index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add benefit (e.g., Health Insurance, Flexible Hours)"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    />
                    <Button size="sm" variant="outline" onClick={addBenefit}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Media & Links
                </CardTitle>
                <CardDescription>Your company's social media presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={profile.social_links.linkedin || ""}
                      onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourcompany"
                      value={profile.social_links.twitter || ""}
                      onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/yourcompany"
                      value={profile.social_links.facebook || ""}
                      onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/yourcompany"
                      value={profile.social_links.instagram || ""}
                      onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Founded</span>
                    <span className="font-medium">{profile.founded_year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Size</span>
                    <span className="font-medium">{profile.company_size || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Industry</span>
                    <span className="font-medium">{profile.industry || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Locations</span>
                    <span className="font-medium">{profile.locations.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete your profile to attract more students
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Add a compelling company description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Upload a professional company logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Highlight your company culture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>List attractive benefits and perks</span>
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

export default function CompanyProfilePage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <CompanyProfileContent />
    </ProtectedRoute>
  )
}
