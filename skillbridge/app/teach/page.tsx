import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Users, Clock, Star, Edit } from "lucide-react"
import Link from "next/link"

// Mock data for user's teaching sessions
const myTeachingSessions = [
  {
    id: 1,
    title: "JavaScript ES6+ Features",
    description: "Modern JavaScript concepts including arrow functions, destructuring, and async/await",
    participants: 8,
    maxParticipants: 12,
    rating: 4.7,
    status: "active",
    schedule: "Tue, Thu - 6:30 PM",
  },
  {
    id: 2,
    title: "Git & GitHub Workflow",
    description: "Version control basics, branching, merging, and collaborative development",
    participants: 15,
    maxParticipants: 15,
    rating: 4.9,
    status: "full",
    schedule: "Mon, Wed - 7:00 PM",
  },
]

export default function TeachPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
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
            <Link href="/teach" className="text-primary font-medium">
              Teach
            </Link>
            <Link href="/internships" className="text-muted-foreground hover:text-foreground transition-colors">
              Internships
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create New Teaching Session */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Knowledge</h1>
              <p className="text-muted-foreground">Create learning sessions and help your peers grow</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Learning Session
                </CardTitle>
                <CardDescription>Share your expertise and help fellow students learn new skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title</Label>
                    <Input id="title" placeholder="e.g., React.js Fundamentals" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Difficulty Level</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this session..."
                    className="min-h-[100px]"
                  />
                </div>

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
                        <SelectItem value="6">6 weeks</SelectItem>
                        <SelectItem value="8">8 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input id="maxParticipants" type="number" placeholder="15" min="1" max="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input id="schedule" placeholder="Mon, Wed - 6:00 PM" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="React, JavaScript, Frontend, Web Development" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites (optional)</Label>
                  <Textarea
                    id="prerequisites"
                    placeholder="What should students know before joining this session?"
                    className="min-h-[80px]"
                  />
                </div>

                <Button className="w-full">Create Learning Session</Button>
              </CardContent>
            </Card>

            {/* My Teaching Sessions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">My Teaching Sessions</h2>
              <div className="space-y-4">
                {myTeachingSessions.map((session) => (
                  <Card key={session.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === "active" ? "secondary" : "default"}>
                            {session.status === "active" ? "Active" : "Full"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {session.participants}/{session.maxParticipants} students
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{session.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.schedule}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Manage Students
                        </Button>
                        <Button size="sm">Send Message</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Teaching Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Teaching Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">23</div>
                  <div className="text-sm text-muted-foreground">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">4.8</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">2</div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Be Clear & Structured</h4>
                  <p className="text-muted-foreground">Break down complex topics into digestible chunks</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Encourage Questions</h4>
                  <p className="text-muted-foreground">Create a safe space for students to ask questions</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-foreground mb-1">Provide Examples</h4>
                  <p className="text-muted-foreground">Use real-world examples to illustrate concepts</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  View All Students
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Management
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/learn">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Learning Sessions
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
