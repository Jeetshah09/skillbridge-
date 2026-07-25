"use client"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { internshipAPI, type Internship } from "@/lib/internship-api"
import { toast } from "sonner"
import { Edit, Trash2, Users, Calendar, DollarSign, MapPin } from "lucide-react"

export default function HrManageInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      setError(null)
      
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
      } else {
        setError('Failed to fetch internships')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (internshipId: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) {
      return
    }

    try {
      await internshipAPI.deleteInternship(internshipId)
      toast.success('Internship deleted successfully')
      fetchInternships() // Refresh the list
    } catch (err) {
      toast.error('Failed to delete internship')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800"
      case "closed": return "bg-red-100 text-red-800"
      case "closing_soon": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="hr">
        <div className="min-h-screen bg-gray-50 p-4">
          <Navbar />
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="hr">
        <div className="min-h-screen bg-gray-50 p-4">
          <Navbar />
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchInternships}>Try Again</Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 p-4">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Manage Internships</CardTitle>
              <CardDescription>Your posted internships</CardDescription>
            </CardHeader>
            <CardContent>
              {internships.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No internships posted</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't posted any internships yet. Start by creating your first internship posting.
                  </p>
                  <Button onClick={() => window.location.href = '/hr/post-internship'}>
                    Post Your First Internship
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Internship Details</TableHead>
                        <TableHead>Duration & Stipend</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internships.map((internship) => (
                        <TableRow key={internship.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{internship.title}</div>
                              <div className="text-sm text-gray-500">{internship.company_name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {internship.location || 'Remote'}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {internship.required_skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {internship.required_skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{internship.required_skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                {internship.duration_weeks} weeks
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <DollarSign className="h-3 w-3" />
                                ${internship.stipend}/month
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3" />
                                {internship.current_applicants}/{internship.max_applicants}
                              </div>
                              <div className="text-xs text-gray-500">
                                {Math.round((internship.current_applicants / internship.max_applicants) * 100)}% full
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(internship.application_deadline)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(internship.status)}>
                              {internship.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `/hr/skill-matches`}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Matches
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `/hr/applications`}
                              >
                                View Apps
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(internship.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
