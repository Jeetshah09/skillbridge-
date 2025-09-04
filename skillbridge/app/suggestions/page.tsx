"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Brain, TrendingUp, Users, Briefcase, BookOpen, Star, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock AI analysis function
const analyzeResume = (file: File): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        skills: ["JavaScript", "React", "Python", "Data Analysis"],
        experience: "Intermediate",
        interests: ["Web Development", "Machine Learning", "UI/UX Design"],
        recommendations: {
          learning: [
            {
              id: 1,
              title: "Advanced React Patterns",
              instructor: "Sarah Chen",
              match: 95,
              reason: "Perfect match for your React experience",
              duration: "3 weeks",
              level: "Advanced",
            },
            {
              id: 2,
              title: "Machine Learning Fundamentals",
              instructor: "Dr. Kumar",
              match: 88,
              reason: "Great next step from your data analysis background",
              duration: "6 weeks",
              level: "Beginner",
            },
          ],
          internships: [
            {
              id: 1,
              title: "Frontend Development Project",
              company: "TechStart Inc.",
              match: 92,
              reason: "Your React skills are exactly what they need",
              duration: "4 weeks",
              location: "Remote",
            },
            {
              id: 2,
              title: "Data Visualization Dashboard",
              company: "Analytics Pro",
              match: 85,
              reason: "Combines your Python and visualization interests",
              duration: "3 weeks",
              location: "Hybrid",
            },
          ],
          skillGaps: ["TypeScript", "Node.js", "Database Design", "Testing Frameworks"],
        },
      })
    }, 2000)
  })
}

export default function SuggestionsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)
    try {
      const result = await analyzeResume(file)
      setAnalysis(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Career Suggestions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and get personalized learning paths and internship recommendations powered by AI
          </p>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Our AI will analyze your skills and experience to provide personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File (PDF, DOC, DOCX)</Label>
                <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
              </div>

              {file && (
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              <Button onClick={handleAnalyze} disabled={!file || loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Skills Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Current Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Experience Level</h4>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      {analysis.experience}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Skill Gaps to Address</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.recommendations.skillGaps.map((skill: string, index: number) => (
                        <Badge key={index} variant="destructive">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Recommendations */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-emerald-600" />
                Recommended Learning Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.recommendations.learning.map((item: any) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>by {item.instructor}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.match}% match</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{item.reason}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.duration}
                        </div>
                        <Badge variant="outline">{item.level}</Badge>
                      </div>
                      <Button className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Join Learning Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Internship Recommendations */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-emerald-600" />
                Recommended Micro-Internships
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.recommendations.internships.map((item: any) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.company}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.match}% match</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{item.reason}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.location}
                        </div>
                      </div>
                      <Button className="w-full">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysis(null)
                  setFile(null)
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
