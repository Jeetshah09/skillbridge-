"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { skillMatchingAPI, type SkillMatch } from "@/lib/skill-matching-api"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, MapPin, DollarSign, Clock, Target, TrendingUp, Users } from "lucide-react"

export default function SkillMatchingPage() {
  const { user, isAuthenticated } = useAuth()
  const [matches, setMatches] = useState<SkillMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchSkillMatches()
    }
  }, [isAuthenticated, user])

  const fetchSkillMatches = async () => {
    try {
      setLoading(true)
      const data = await skillMatchingAPI.getStudentMatches(user?.email || '')
      setMatches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="student">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="student">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchSkillMatches} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="student">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            AI Skill Matching
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover internships that match your skills using our AI-powered Jaccard similarity algorithm
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Match (70%+)</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {matches.filter(m => m.match_score >= 70).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Match Score</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.match_score, 0) / matches.length) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Matches */}
        {matches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Skill Matches Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any internships that match your current skills. 
                Try updating your profile with more skills or check back later for new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <Card key={match.internship_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{match.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {match.company_name} • {match.location}
                      </CardDescription>
                    </div>
                    <Badge className={`px-3 py-1 text-sm font-medium ${getMatchScoreColor(match.match_score)}`}>
                      {match.match_score}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {match.description}
                    </p>

                    {/* Skills Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.required_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Preferred Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.preferred_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Your Skills */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Your Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.student_skills.map((skill, idx) => (
                          <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Internship Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{match.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>${match.stipend}/month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{match.work_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Deadline: {formatDate(match.application_deadline)}</span>
                      </div>
                    </div>

                    {/* Difficulty and Benefits */}
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(match.difficulty_level)}>
                        {match.difficulty_level}
                      </Badge>
                      {match.benefits.length > 0 && (
                        <div className="flex gap-2">
                          {match.benefits.slice(0, 2).map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {match.benefits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{match.benefits.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="mt-6 pt-4 border-t">
                      <Button className="w-full" size="lg">
                        Apply for This Internship
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
