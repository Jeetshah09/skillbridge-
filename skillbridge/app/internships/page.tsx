import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, DollarSign, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

// Mock data for micro-internships
const microInternships = [
  {
    id: 1,
    title: "E-commerce Website Development",
    company: "TechStart Solutions",
    mentor: "Arjun Mehta",
    mentorYear: "4th Year",
    department: "CSE",
    description: "Build a responsive e-commerce website with React and Node.js, including payment integration",
    duration: "4 weeks",
    stipend: 5000,
    applicants: 8,
    maxApplicants: 3,
    skills: ["React", "Node.js", "MongoDB", "Payment Gateway"],
    difficulty: "Intermediate",
    type: "Remote",
    deadline: "2024-01-15",
    status: "open",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    company: "Design Studio Pro",
    mentor: "Sneha Gupta",
    mentorYear: "Graduate",
    department: "CSE",
    description:
      "Design user interfaces for a fitness tracking mobile app using Figma and create interactive prototypes",
    duration: "3 weeks",
    stipend: 3500,
    applicants: 12,
    maxApplicants: 2,
    skills: ["Figma", "UI/UX", "Prototyping", "Mobile Design"],
    difficulty: "Beginner",
    type: "Hybrid",
    deadline: "2024-01-20",
    status: "open",
  },
  {
    id: 3,
    title: "Data Analysis Dashboard",
    company: "Analytics Hub",
    mentor: "Karan Singh",
    mentorYear: "4th Year",
    department: "IT",
    description: "Create interactive dashboards using Python, Pandas, and Streamlit for sales data visualization",
    duration: "5 weeks",
    stipend: 6000,
    applicants: 15,
    maxApplicants: 4,
    skills: ["Python", "Pandas", "Streamlit", "Data Visualization"],
    difficulty: "Intermediate",
    type: "Remote",
    deadline: "2024-01-10",
    status: "closing_soon",
  },
  {
    id: 4,
    title: "IoT Smart Home System",
    company: "Innovation Labs",
    mentor: "Priya Sharma",
    mentorYear: "Graduate",
    department: "ECE",
    description: "Develop a smart home automation system using Arduino, sensors, and mobile app integration",
    duration: "6 weeks",
    stipend: 7500,
    applicants: 6,
    maxApplicants: 2,
    skills: ["Arduino", "IoT", "Mobile Development", "Hardware"],
    difficulty: "Advanced",
    type: "On-site",
    deadline: "2024-01-25",
    status: "open",
  },
  {
    id: 5,
    title: "Social Media Content Strategy",
    company: "Digital Marketing Co",
    mentor: "Rahul Patel",
    mentorYear: "3rd Year",
    department: "MBA",
    description: "Develop content strategy and create engaging posts for social media platforms",
    duration: "2 weeks",
    stipend: 2500,
    applicants: 20,
    maxApplicants: 5,
    skills: ["Content Creation", "Social Media", "Marketing", "Canva"],
    difficulty: "Beginner",
    type: "Remote",
    deadline: "2024-01-18",
    status: "open",
  },
]

export default function InternshipsPage() {
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
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/internships/post">Post Internship</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Micro-Internship Opportunities</h1>
          <p className="text-muted-foreground">Gain real-world experience through short-term projects</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search internships, companies, or skills..." className="pl-10" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
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
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="1-2">1-2 weeks</SelectItem>
                <SelectItem value="3-4">3-4 weeks</SelectItem>
                <SelectItem value="5+">5+ weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {microInternships.map((internship) => (
            <Card key={internship.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{internship.title}</CardTitle>
                    <p className="text-sm font-medium text-primary mb-2">{internship.company}</p>
                    <CardDescription className="text-sm">{internship.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={
                        internship.difficulty === "Beginner"
                          ? "secondary"
                          : internship.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {internship.difficulty}
                    </Badge>
                    {internship.status === "closing_soon" && (
                      <Badge variant="destructive" className="text-xs">
                        Closing Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mentor Info */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary">
                      {internship.mentor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{internship.mentor}</p>
                    <p className="text-xs text-muted-foreground">
                      {internship.mentorYear} • {internship.department}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{internship.stipend}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {internship.applicants}/{internship.maxApplicants} applied
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{internship.type}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Deadline: </span>
                  <span className="text-foreground font-medium">
                    {new Date(internship.deadline).toLocaleDateString()}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {internship.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {internship.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{internship.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/internships/${internship.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" disabled={internship.applicants >= internship.maxApplicants}>
                    {internship.applicants >= internship.maxApplicants ? "Full" : "Apply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 md:mt-12 text-center">
          <Card className="max-w-md mx-auto border-dashed border-2 border-border">
            <CardContent className="pt-6">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Want to offer an internship?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your project and help juniors gain real-world experience
              </p>
              <Button asChild>
                <Link href="/internships/post">Post Internship</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
