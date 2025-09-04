import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  User,
  Building,
} from "lucide-react"
import Link from "next/link"

// Mock data for internship details
const internshipDetails = {
  id: 1,
  title: "E-commerce Website Development",
  company: "TechStart Solutions",
  mentor: "Arjun Mehta",
  mentorYear: "4th Year",
  department: "CSE",
  mentorBio:
    "Full-stack developer with 2+ years of experience in React and Node.js. Previously interned at Microsoft and built 3 production applications.",
  description:
    "Build a responsive e-commerce website with React and Node.js, including payment integration. This project will give you hands-on experience with modern web development technologies and real-world application architecture.",
  detailedDescription: `
    In this micro-internship, you'll work on developing a complete e-commerce platform from scratch. The project involves:
    
    • Frontend development using React.js with modern hooks and state management
    • Backend API development with Node.js and Express
    • Database design and implementation with MongoDB
    • Payment gateway integration (Stripe/Razorpay)
    • User authentication and authorization
    • Responsive design for mobile and desktop
    • Testing and deployment
    
    You'll receive regular mentorship sessions twice a week and have access to code reviews and technical guidance throughout the project.
  `,
  duration: "4 weeks",
  stipend: 5000,
  applicants: 8,
  maxApplicants: 3,
  skills: ["React", "Node.js", "MongoDB", "Payment Gateway", "Express", "JavaScript", "HTML/CSS"],
  difficulty: "Intermediate",
  type: "Remote",
  deadline: "2024-01-15",
  startDate: "2024-01-20",
  status: "open",
  prerequisites: [
    "Basic knowledge of JavaScript and React",
    "Understanding of REST APIs",
    "Familiarity with Git and version control",
    "Basic understanding of databases",
  ],
  deliverables: [
    "Complete e-commerce website with user authentication",
    "Admin panel for product management",
    "Payment integration with test transactions",
    "Responsive design for all screen sizes",
    "Documentation and deployment guide",
    "Final presentation of the project",
  ],
  benefits: [
    "Regular mentorship and code reviews",
    "Completion certificate",
    "Recommendation letter for outstanding performance",
    "Portfolio project for resume",
    "Networking opportunity with industry professionals",
  ],
}

export default function InternshipDetailsPage() {
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/internships" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Internships
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{internshipDetails.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-4 h-4 text-primary" />
                      <span className="text-lg font-medium text-primary">{internshipDetails.company}</span>
                    </div>
                    <CardDescription className="text-base">{internshipDetails.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      internshipDetails.difficulty === "Beginner"
                        ? "secondary"
                        : internshipDetails.difficulty === "Intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {internshipDetails.difficulty}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-muted-foreground">{internshipDetails.detailedDescription}</div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internshipDetails.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internshipDetails.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internshipDetails.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{internshipDetails.duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">₹{internshipDetails.stipend}</p>
                    <p className="text-sm text-muted-foreground">Stipend</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{internshipDetails.type}</p>
                    <p className="text-sm text-muted-foreground">Work Type</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(internshipDetails.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {internshipDetails.applicants}/{internshipDetails.maxApplicants}
                    </p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{internshipDetails.mentor}</p>
                    <p className="text-sm text-muted-foreground">
                      {internshipDetails.mentorYear} • {internshipDetails.department}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{internshipDetails.mentorBio}</p>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {internshipDetails.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full mb-3"
                  disabled={internshipDetails.applicants >= internshipDetails.maxApplicants}
                >
                  {internshipDetails.applicants >= internshipDetails.maxApplicants ? "Applications Full" : "Apply Now"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save for Later
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {internshipDetails.maxApplicants - internshipDetails.applicants} spots remaining
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
