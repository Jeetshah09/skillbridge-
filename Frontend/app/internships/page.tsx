"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, DollarSign, MapPin, Briefcase, Loader2 } from "lucide-react"
import Link from "next/link"
import { internshipAPI, Internship, InternshipFilters } from "@/lib/internship-api"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"


export default function InternshipsPage() {
  const { user, isAuthenticated } = useAuth()
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<InternshipFilters>({
    status: 'active',
    limit: 20
  })

  // Load internships
  useEffect(() => {
    loadInternships()
  }, [filters])

  const loadInternships = async () => {
    try {
      setLoading(true)
      const data = await internshipAPI.getInternships(filters)
      setInternships(data)
    } catch (error) {
      console.error('Failed to load internships:', error)
      toast.error('Failed to load internships')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm || undefined }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
    switch (type.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
            <Input
              placeholder="Search internships, companies, or skills..."
              className="pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select onValueChange={(value) => handleFilterChange('difficulty', value)}>
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
            <Select onValueChange={(value) => handleFilterChange('work_type', value)}>
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
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading internships...</span>
          </div>
        )}

        {/* Internships Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {internships.map((internship) => (
              <Card key={internship.id} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">{internship.title}</CardTitle>
                      <p className="text-sm font-medium text-primary mb-2">{internship.company_name}</p>
                      <CardDescription className="text-sm">{internship.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getDifficultyColor(internship.difficulty_level)}>
                        {internship.difficulty_level}
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
                        {internship.mentor_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{internship.mentor_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {internship.mentor_year} • {internship.mentor_department}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{internship.duration_weeks} weeks</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{internship.stipend}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {internship.current_applicants}/{internship.max_applicants} applied
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{getWorkTypeIcon(internship.work_type)} {internship.work_type}</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Deadline: </span>
                    <span className="text-foreground font-medium">
                      {new Date(internship.application_deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {internship.required_skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {internship.required_skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{internship.required_skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/internships/${internship.id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="outline"
                      disabled={internship.current_applicants >= internship.max_applicants}
                      asChild={isAuthenticated && user?.role === 'student'}
                    >
                      {isAuthenticated && user?.role === 'student' ? (
                        <Link href={`/internships/${internship.id}/apply`}>
                          {internship.current_applicants >= internship.max_applicants ? "Full" : "Apply"}
                        </Link>
                      ) : (
                        <Link href="/login">
                          {internship.current_applicants >= internship.max_applicants ? "Full" : "Login to Apply"}
                        </Link>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && internships.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No internships found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        )}

        {/* Call to Action */}
        {!loading && internships.length > 0 && (
          <div className="mt-8 md:mt-12 text-center">
            <Card className="max-w-md mx-auto border-dashed border-2 border-border">
              <CardContent className="pt-6">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Want to offer an internship?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your project and help juniors gain real-world experience
                </p>
                {isAuthenticated && (user?.role === 'hr' || user?.role === 'admin') ? (
                  <Button asChild>
                    <Link href="/internships/post">Post Internship</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/register">Sign Up as HR</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

