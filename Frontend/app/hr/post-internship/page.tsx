"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { internshipAPI } from "@/lib/internship-api"
import { toast } from "sonner"

type FormState = {
  title: string
  description: string
  company_name: string
  mentor_name: string
  mentor_year: string
  mentor_department: string
  duration_weeks: string
  stipend: string
  max_applicants: string
  required_skills: string
  preferred_skills: string
  difficulty_level: string
  work_type: string
  location: string
  application_deadline: string
  start_date: string
  additional_info: string
  benefits: string
}

export default function HrPostInternshipPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    company_name: "",
    mentor_name: "",
    mentor_year: "",
    mentor_department: "",
    duration_weeks: "4",
    stipend: "0",
    max_applicants: "10",
    required_skills: "",
    preferred_skills: "",
    difficulty_level: "beginner",
    work_type: "remote",
    location: "",
    application_deadline: "",
    start_date: "",
    additional_info: "",
    benefits: "",
  })

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.company_name || !form.description || !form.application_deadline || !form.mentor_name) {
      toast.error("Please fill required fields (title, company, description, mentor name, deadline)")
      return
    }
    // Validate numbers
    if ((Number(form.duration_weeks) || 0) <= 0) {
      toast.error("Duration must be at least 1 week")
      return
    }
    if ((Number(form.max_applicants) || 0) < 1) {
      toast.error("Max applicants must be at least 1")
      return
    }
    // Validate dates: deadline >= today; start_date >= deadline (if provided)
    const today = new Date()
    today.setHours(0,0,0,0)
    const deadline = new Date(form.application_deadline)
    if (isNaN(deadline.getTime()) || deadline < today) {
      toast.error("Application deadline cannot be in the past")
      return
    }
    if (form.start_date) {
      const start = new Date(form.start_date)
      if (isNaN(start.getTime()) || start < deadline) {
        toast.error("Start date should be on or after the deadline")
        return
      }
    }
    // Validate skills
    const reqSkills = form.required_skills.split(",").map(s=>s.trim()).filter(Boolean)
    if (reqSkills.length === 0) {
      toast.error("Please provide at least one required skill")
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        company_name: form.company_name,
        mentor_name: form.mentor_name,
        mentor_year: form.mentor_year || undefined,
        mentor_department: form.mentor_department || undefined,
        duration_weeks: Number(form.duration_weeks) || 0,
        stipend: Number(form.stipend) || 0,
        max_applicants: Number(form.max_applicants) || 0,
        required_skills: reqSkills,
        preferred_skills: form.preferred_skills.split(",").map(s=>s.trim()).filter(Boolean),
        difficulty_level: form.difficulty_level,
        work_type: form.work_type,
        location: form.location || undefined,
        application_deadline: form.application_deadline,
        start_date: form.start_date || undefined,
        additional_info: form.additional_info || undefined,
        benefits: form.benefits.split(",").map(s=>s.trim()).filter(Boolean),
      }
      const res = await internshipAPI.createInternship(payload as any)
      toast.success("Internship posted")
      router.push("/hr/manage-internships")
    } catch (err: any) {
      toast.error(err?.message || "Failed to create internship")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 p-4">
        <Navbar />
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Post Internship</CardTitle>
              <CardDescription>Create a new internship or job posting</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="md:col-span-2">
                  <label className="text-xs">Title</label>
                  <Input value={form.title} onChange={update("title")} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Company</label>
                  <Input value={form.company_name} onChange={update("company_name")} required />
                </div>
                <div>
                  <label className="text-xs">Mentor Name</label>
                  <Input value={form.mentor_name} onChange={update("mentor_name")} required />
                </div>
                <div>
                  <label className="text-xs">Mentor Year (optional)</label>
                  <Input value={form.mentor_year} onChange={update("mentor_year")} />
                </div>
                <div>
                  <label className="text-xs">Mentor Department (optional)</label>
                  <Input value={form.mentor_department} onChange={update("mentor_department")} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Description</label>
                  <Textarea value={form.description} onChange={update("description")} rows={5} required />
                </div>
                <div>
                  <label className="text-xs">Duration (weeks)</label>
                  <Input type="number" min={1} value={form.duration_weeks} onChange={update("duration_weeks")} />
                </div>
                <div>
                  <label className="text-xs">Stipend</label>
                  <Input type="number" min={0} value={form.stipend} onChange={update("stipend")} />
                </div>
                <div>
                  <label className="text-xs">Max Applicants</label>
                  <Input type="number" min={1} value={form.max_applicants} onChange={update("max_applicants")} />
                </div>
                <div>
                  <label className="text-xs">Work Type</label>
                  <select value={form.work_type} onChange={update("work_type")} className="h-9 w-full border rounded px-2 text-sm bg-background">
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs">Difficulty</label>
                  <select value={form.difficulty_level} onChange={update("difficulty_level")} className="h-9 w-full border rounded px-2 text-sm bg-background">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs">Location (optional)</label>
                  <Input value={form.location} onChange={update("location")} />
                </div>
                <div>
                  <label className="text-xs">Application Deadline</label>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} value={form.application_deadline} onChange={update("application_deadline")} required />
                </div>
                <div>
                  <label className="text-xs">Start Date (optional)</label>
                  <Input type="date" min={form.application_deadline || undefined} value={form.start_date} onChange={update("start_date")} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Required Skills (comma separated)</label>
                  <Input value={form.required_skills} onChange={update("required_skills")} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Preferred Skills (comma separated)</label>
                  <Input value={form.preferred_skills} onChange={update("preferred_skills")} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Benefits (comma separated)</label>
                  <Input value={form.benefits} onChange={update("benefits")} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs">Additional Info</label>
                  <Textarea value={form.additional_info} onChange={update("additional_info")} rows={3} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={()=>router.push('/hr/manage-internships')}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Create'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
