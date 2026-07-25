import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, Star, Link2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { learnAPI, type LearnPost } from "@/lib/learn-api"
import { ProtectedRoute } from "@/components/protected-route"

export default function LearnPage() {
  const [posts, setPosts] = useState<LearnPost[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    learnAPI
      .listPosts()
      .then(setPosts)
      .catch((e) => setError(e.message || "Failed to load posts"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ProtectedRoute requiredRole="student">
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
            <Button size="sm" asChild>
              <Link href="/learn/new">New Post</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
            <p className="text-muted-foreground">Tutorials, blogs, and videos posted by students</p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search posts..." className="pl-10 w-[260px]" />
            </div>
            <Button size="sm" variant="outline" className="bg-transparent">Filters</Button>
            <Button size="sm" asChild>
              <Link href="/learn/new">Create</Link>
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading && <p className="text-sm text-muted-foreground">Loading posts...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(posts || []).map((p) => (
              <Card key={p.id} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1 line-clamp-1">{p.title}</CardTitle>
                      <CardDescription className="text-xs">by {p.author_name || p.author_email || 'Student'} • {new Date(p.created_at).toLocaleString()}</CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">{p.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
                      <Link2 className="w-4 h-4 mr-1" />
                      Open Resource
                    </a>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/learn/${p.id}`}>Read</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {posts && posts.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">No posts yet. Be the first to share a great resource!</CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 md:mt-12 text-center">
          <Card className="max-w-md mx-auto border-dashed border-2 border-border">
            <CardContent className="pt-6">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Have a great tutorial, blog, or video?</h3>
              <p className="text-sm text-muted-foreground mb-4">Share it with others in the Learning Hub feed</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" className="flex-1" asChild>
                  <Link href="/learn/new">Create a Post</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
