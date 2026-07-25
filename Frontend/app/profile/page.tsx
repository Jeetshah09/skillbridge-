"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Plus, X, Save, Loader2, Upload, Linkedin, Github, Globe } from "lucide-react"
import { toast } from "sonner"

type StudentProfile = {
  first_name: string
  last_name: string
  email: string
  academic_year?: string
  department?: string
  bio?: string
  skills: string[]
  resume_url?: string
  portfolio_url?: string
  github_url?: string
}

function ProfileContent() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [profile, setProfile] = useState<StudentProfile>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    academic_year: (user as any)?.academic_year || "",
    department: (user as any)?.department || "",
    bio: "",
    skills: [],
    resume_url: "",
    portfolio_url: "",
    github_url: "",
  })

  // Load any saved profile from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('sb:student_profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setProfile(prev => ({ ...prev, ...parsed }))
      } catch {}
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
    setNewSkill("")
  }

  const removeSkill = (i: number) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))
  }

  const save = async () => {
    try {
      setSaving(true)
      // TODO: Hook to backend when student profile endpoint exists
      await new Promise(r => setTimeout(r, 800))
      // Persist locally for applying convenience
      if (typeof window !== 'undefined') {
        localStorage.setItem('sb:student_profile', JSON.stringify(profile))
      }
      toast.success("Profile saved")
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Update your details, skills and resume</p>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Saving...</>) : (<><Save className="w-4 h-4 mr-2"/>Save</>)}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Basic */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" value={profile.first_name} onChange={handleInput} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" value={profile.last_name} onChange={handleInput} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input id="academic_year" name="academic_year" value={profile.academic_year} onChange={handleInput} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" value={profile.department} onChange={handleInput} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={4} placeholder="Tell us about yourself..." value={profile.bio} onChange={handleInput} />
              </div>
            </CardContent>
          </Card>

          {/* Right: Avatar & Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Resume & Links</CardTitle>
              <CardDescription>Share your resume and portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume_url">Resume URL</Label>
                <Input id="resume_url" name="resume_url" placeholder="https://..." value={profile.resume_url} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input id="portfolio_url" name="portfolio_url" placeholder="https://..." value={profile.portfolio_url} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" name="github_url" placeholder="https://github.com/username" value={profile.github_url} onChange={handleInput} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Github className="h-4 w-4 mr-2"/>GitHub</Button>
                <Button variant="outline" size="sm"><Linkedin className="h-4 w-4 mr-2"/>LinkedIn</Button>
                <Button variant="outline" size="sm"><Globe className="h-4 w-4 mr-2"/>Portfolio</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your core skills and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <Badge key={`${s}-${i}`} variant="secondary" className="flex items-center gap-1">
                  {s}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(i)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              <Button type="button" variant="outline" onClick={addSkill}><Plus className="w-4 h-4"/></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requiredRole="student">
      <ProfileContent />
    </ProtectedRoute>
  )
}
