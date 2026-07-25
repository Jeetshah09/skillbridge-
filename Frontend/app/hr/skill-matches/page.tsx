"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { skillMatchingAPI, type CandidateMatch } from "@/lib/skill-matching-api"
import { useAuth } from "@/contexts/auth-context"
import { Target, Users, ExternalLink, Calendar, GraduationCap, Briefcase } from "lucide-react"

export default function HRSkillMatchesPage() {
  const { user, isAuthenticated } = useAuth()
  const [internships, setInternships] = useState<any[]>([])
  const [candidates, setCandidates] = useState<CandidateMatch[]>([])
  const [selectedInternship, setSelectedInternship] = useState<string>('')
  const [loadingInternships, setLoadingInternships] = useState(true)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user?.role === 'hr') {
      fetchInternships()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (selectedInternship) {
      fetchCandidateMatches()
    }
  }, [selectedInternship])

  const fetchInternships = async () => {
    try {
      setLoadingInternships(true)
      // Get internships posted by this HR user
      const response = await fetch('http://localhost:8000/internships/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sb:access_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setInternships(data)
        if (data.length > 0) {
          setSelectedInternship(data[0].id)  // Use 'id' instead of '_id'
        }
      } else {
        setError('No internships found. Please post an internship first.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingInternships(false)
    }
  }

  const fetchCandidateMatches = async () => {
    if (!selectedInternship) return

    try {
      setLoadingCandidates(true)
      setError(null)
      const data = await skillMatchingAPI.getInternshipCandidateMatches(selectedInternship)
      setCandidates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingCandidates(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "selected": return "bg-green-100 text-green-800"
      case "reviewed": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  if (loadingInternships) {
    return (
      <ProtectedRoute requiredRole="hr">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            AI Skill Matching
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the best candidates for your internships using AI-powered skill matching
          </p>
        </div>

        {/* Internship Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Internship</CardTitle>
            <CardDescription>
              Choose an internship to view matched candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {internships.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No internships found. Please post an internship first to see skill matches.
                </p>
                <Button onClick={() => window.location.href = '/hr/post-internship'}>
                  Post New Internship
                </Button>
              </div>
            ) : (
              <Select value={selectedInternship} onValueChange={setSelectedInternship}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an internship" />
                </SelectTrigger>
                <SelectContent>
                  {internships.map((internship) => (
                    <SelectItem key={internship.id} value={internship.id}>
                      {internship.title} - {internship.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="text-center py-4">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchCandidateMatches} className="mt-2" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Candidates Loading */}
        {loadingCandidates && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Candidates List */}
        {selectedInternship && !loadingCandidates && candidates.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Matched Candidates
            </h2>

            {candidates.map((candidate, index) => (
              <Card key={candidate.application_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {candidate.student_name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {candidate.student_email} • {candidate.department}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`px-3 py-1 text-sm font-medium ${getMatchScoreColor(candidate.match_score)}`}>
                        {candidate.match_score}% Match
                      </Badge>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Skills Match */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Candidate Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.student_skills.map((skill, idx) => (
                            <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.internship_required_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Preferred Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.internship_preferred_skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span>{candidate.academic_year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{candidate.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Applied: {formatDate(candidate.applied_date)}</span>
                      </div>
                    </div>

                    {/* Motivation & Experience */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Motivation</h4>
                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded">
                          {candidate.motivation}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Relevant Experience</h4>
                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded">
                          {candidate.relevant_experience}
                        </p>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {candidate.resume_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Resume
                          </a>
                        </Button>
                      )}
                      {candidate.github_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.github_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {candidate.portfolio_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Candidates */}
        {selectedInternship && !loadingCandidates && candidates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Candidates Found</h3>
              <p className="text-gray-600 mb-4">
                No applications have been received for this internship yet, or none of the applicants have skills that match your requirements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
