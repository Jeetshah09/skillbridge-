import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Briefcase, Brain, MessageSquare, Trophy } from "lucide-react"
import Link from "next/link"
// import { MobileSidebar } from "@/components/mobile-sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SkillBridge</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
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
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" className="hidden sm:flex" asChild>
              <Link href="/register" className="text-sm">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Learning Platform
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 md:mb-6 text-balance">
            Bridge the Gap Between
            <span className="text-primary"> Learning</span> and
            <span className="text-secondary"> Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 text-pretty max-w-2xl mx-auto">
            Connect with peers, gain real-world experience through micro-internships, and build your portfolio with
            AI-guided learning paths.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Learning Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/learn">Explore Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Everything You Need to Grow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Peer Learning</CardTitle>
                <CardDescription>Learn from seniors and teach juniors in a collaborative environment</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Micro-Internships</CardTitle>
                <CardDescription>Gain hands-on experience with real projects from senior students</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>AI Suggestions</CardTitle>
                <CardDescription>Get personalized learning paths and project recommendations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>In-App Messaging</CardTitle>
                <CardDescription>Collaborate seamlessly with built-in communication tools</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Portfolio & Badges</CardTitle>
                <CardDescription>Showcase your achievements and build a compelling portfolio</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>Join a vibrant community of learners and mentors</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground text-balance">
            Ready to Bridge Your Skills Gap?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty">
            Join thousands of students already growing their careers through peer learning and real-world experience.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">SkillBridge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering students through peer learning and real-world experience.
          </p>
        </div>
      </footer>
    </div>
  )
}
