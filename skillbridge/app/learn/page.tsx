import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, Star } from "lucide-react"
import Link from "next/link"

// Mock data for learning opportunities
const learningOpportunities = [
  {
    id: 1,
    title: "React.js Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks",
    teacher: "Sarah Chen",
    teacherYear: "4th Year",
    department: "CSE",
    duration: "2 weeks",
    participants: 12,
    maxParticipants: 15,
    rating: 4.8,
    tags: ["React", "JavaScript", "Frontend"],
    level: "Beginner",
    schedule: "Mon, Wed, Fri - 6:00 PM",
  },
  {
    id: 2,
    title: "Python Data Analysis",
    description: "Master pandas, numpy, and matplotlib for data analysis and visualization",
    teacher: "Alex Kumar",
    teacherYear: "3rd Year",
    department: "IT",
    duration: "3 weeks",
    participants: 8,
    maxParticipants: 12,
    rating: 4.9,
    tags: ["Python", "Data Science", "Analytics"],
    level: "Intermediate",
    schedule: "Tue, Thu - 7:00 PM",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description: "Learn design thinking, wireframing, and prototyping using Figma",
    teacher: "Priya Sharma",
    teacherYear: "4th Year",
    department: "CSE",
    duration: "4 weeks",
    participants: 15,
    maxParticipants: 20,
    rating: 4.7,
    tags: ["Design", "Figma", "UX"],
    level: "Beginner",
    schedule: "Sat, Sun - 4:00 PM",
  },
  {
    id: 4,
    title: "Machine Learning Basics",
    description: "Introduction to ML algorithms, supervised learning, and model evaluation",
    teacher: "Rahul Patel",
    teacherYear: "Graduate",
    department: "CSE",
    duration: "6 weeks",
    participants: 5,
    maxParticipants: 10,
    rating: 4.6,
    tags: ["Machine Learning", "Python", "AI"],
    level: "Advanced",
    schedule: "Mon, Wed - 8:00 PM",
  },
]

export default function LearnPage() {
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
            <Link href="/learn" className="text-primary font-medium">
              Learn
            </Link>
            <Link href="/teach" className="text-muted-foreground hover:text-foreground transition-colors">
              Teach
            </Link>
            <Link href="/internships" className="text-muted-foreground hover:text-foreground transition-colors">
              Internships
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Discover Learning Opportunities</h1>
          <p className="text-muted-foreground">Learn new skills from your peers and expand your knowledge</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search for skills, topics, or technologies..." className="pl-10" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cse">CSE</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="ece">ECE</SelectItem>
                <SelectItem value="me">ME</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Learning Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {learningOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
                    <CardDescription className="text-sm">{opportunity.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      opportunity.level === "Beginner"
                        ? "secondary"
                        : opportunity.level === "Intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {opportunity.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Teacher Info */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {opportunity.teacher
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{opportunity.teacher}</p>
                    <p className="text-xs text-muted-foreground">
                      {opportunity.teacherYear} • {opportunity.department}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {opportunity.participants}/{opportunity.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{opportunity.rating}</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Schedule: </span>
                  <span className="text-foreground">{opportunity.schedule}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button className="w-full" disabled={opportunity.participants >= opportunity.maxParticipants}>
                  {opportunity.participants >= opportunity.maxParticipants ? "Full" : "Join Learning Session"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 md:mt-12 text-center">
          <Card className="max-w-md mx-auto border-dashed border-2 border-border">
            <CardContent className="pt-6">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Don't see what you're looking for?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Request a learning session or start teaching others yourself
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Request Topic
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href="/teach">Start Teaching</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
