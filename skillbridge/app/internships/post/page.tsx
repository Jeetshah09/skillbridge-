import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PostInternshipPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">SkillBridge</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
              Learn
            </Link>
            <Link href="/teach" className="text-muted-foreground hover:text-foreground transition-colors">
              Teach
            </Link>
            <Link href="/internships" className="text-primary font-medium">
              Internships
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/internships" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Internships
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Post Micro-Internship</h1>
          <p className="text-muted-foreground">Create an opportunity for juniors to gain hands-on experience</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Internship Details
                </CardTitle>
                <CardDescription>
                  Provide comprehensive information about your micro-internship opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" placeholder="e.g., E-commerce Website Development" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input id="company" placeholder="e.g., TechStart Solutions" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the project, what the intern will work on, and expected deliverables..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Project Details</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 week</SelectItem>
                          <SelectItem value="2">2 weeks</SelectItem>
                          <SelectItem value="3">3 weeks</SelectItem>
                          <SelectItem value="4">4 weeks</SelectItem>
                          <SelectItem value="5">5 weeks</SelectItem>
                          <SelectItem value="6">6 weeks</SelectItem>
                          <SelectItem value="8">8 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Work Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stipend">Stipend (₹)</Label>
                      <Input id="stipend" type="number" placeholder="5000" min="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxApplicants">Max Applicants</Label>
                      <Input id="maxApplicants" type="number" placeholder="3" min="1" max="10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input id="deadline" type="date" />
                  </div>
                </div>

                {/* Skills and Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Skills & Requirements</h3>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (comma separated)</Label>
                    <Input id="skills" placeholder="React, Node.js, MongoDB, Payment Gateway" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Textarea
                      id="prerequisites"
                      placeholder="What should applicants know or have before applying?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliverables">Expected Deliverables</Label>
                    <Textarea
                      id="deliverables"
                      placeholder="What should the intern deliver at the end of the project?"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Additional Options</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mentorship" />
                      <Label htmlFor="mentorship" className="text-sm">
                        Provide regular mentorship and feedback
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="certificate" />
                      <Label htmlFor="certificate" className="text-sm">
                        Provide completion certificate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recommendation" />
                      <Label htmlFor="recommendation" className="text-sm">
                        Willing to provide recommendation letter
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">Post Internship</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Posting Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Be Specific</h4>
                  <p className="text-muted-foreground">Clearly define project scope and expectations</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Set Realistic Timeline</h4>
                  <p className="text-muted-foreground">Consider the complexity and intern's skill level</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Provide Support</h4>
                  <p className="text-muted-foreground">Offer guidance and regular check-ins</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How your internship will appear to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Fill out the form to see a preview of your internship posting
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
