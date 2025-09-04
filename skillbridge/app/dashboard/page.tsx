"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  MapPin,
  MessageCircle,
  Plus,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react"

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  avatar: "/student-profile.jpg",
  year: "3rd Year",
  major: "Computer Science",
  university: "Tech University",
  location: "San Francisco, CA",
  bio: "Passionate full-stack developer with a love for creating innovative solutions. Currently exploring machine learning and its applications in web development.",
  skills: ["JavaScript", "React", "Python", "Node.js", "SQL", "Git"],
  socialLinks: {
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    portfolio: "https://alexjohnson.dev",
  },
  stats: {
    learningSessionsCompleted: 12,
    skillsTaught: 8,
    internshipsCompleted: 3,
    portfolioViews: 247,
    connectionsMode: 45,
  },
}

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: "learning",
    title: "Completed Advanced React Patterns",
    description: "Finished learning session with Sarah Chen",
    timestamp: "2 hours ago",
    icon: BookOpen,
  },
  {
    id: 2,
    type: "internship",
    title: "Submitted Frontend Project",
    description: "Delivered final deliverables for TechStart Inc.",
    timestamp: "1 day ago",
    icon: Briefcase,
  },
  {
    id: 3,
    type: "teaching",
    title: "Taught JavaScript Fundamentals",
    description: "Helped 3 students understand closures and scope",
    timestamp: "2 days ago",
    icon: Users,
  },
  {
    id: 4,
    type: "achievement",
    title: "Earned React Expert Badge",
    description: "Completed 5 React-related learning sessions",
    timestamp: "3 days ago",
    icon: Trophy,
  },
]

// Mock portfolio projects
const mockProjects = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description:
      "A comprehensive admin dashboard for managing online stores with real-time analytics and inventory management.",
    image: "/ecommerce-dashboard.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Chart.js"],
    liveUrl: "https://dashboard-demo.vercel.app",
    githubUrl: "https://github.com/alexjohnson/ecommerce-dashboard",
    featured: true,
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
    image: "/task-app.jpg",
    technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
    liveUrl: "https://taskapp-demo.vercel.app",
    githubUrl: "https://github.com/alexjohnson/task-manager",
    featured: false,
  },
  {
    id: 3,
    title: "Weather Forecast API",
    description: "RESTful API service providing accurate weather forecasts with caching and rate limiting.",
    image: "/weather-api.jpg",
    technologies: ["Python", "FastAPI", "Redis", "PostgreSQL"],
    githubUrl: "https://github.com/alexjohnson/weather-api",
    featured: false,
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "learning":
        return BookOpen
      case "internship":
        return Briefcase
      case "teaching":
        return Users
      case "achievement":
        return Trophy
      default:
        return Calendar
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "learning":
        return "text-blue-600 bg-blue-100"
      case "internship":
        return "text-purple-600 bg-purple-100"
      case "teaching":
        return "text-green-600 bg-green-100"
      case "achievement":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mockUser.name}!</p>
          </div>
          <Button className="self-start sm:self-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto sm:max-w-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Sessions</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.stats.learningSessionsCompleted}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills Taught</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.stats.skillsTaught}</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Internships</CardTitle>
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.stats.internshipsCompleted}</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.stats.portfolioViews}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.map((activity) => {
                      const Icon = getActivityIcon(activity.type)
                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Find Learning Session
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Offer to Teach
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Internships
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Check Messages
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>React Mastery</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Python Development</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Database Design</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Machine Learning</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>DevOps & Deployment</span>
                        <span>55%</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>UI/UX Design</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">My Portfolio</h2>
                <p className="text-gray-600">Showcase your best work and achievements</p>
              </div>
              <Button className="self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mockProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={project.image || "/placeholder.svg?height=200&width=300"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                    <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{mockUser.name}</h3>
                    <p className="text-gray-600">{mockUser.email}</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {mockUser.year} - {mockUser.major}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockUser.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio and Skills */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-gray-600">{mockUser.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockUser.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="font-medium mb-2">Social Links</h4>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
