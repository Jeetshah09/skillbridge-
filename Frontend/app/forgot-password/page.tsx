"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { toast } from "sonner"
import { authAPI } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const urlToken = params.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [tokenInput, setTokenInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [fetchedForEmail, setFetchedForEmail] = useState("")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // No blocking toast; allow manual token entry
  }, [urlToken])

  // Auto-fetch token when a valid email is entered (debounced)
  useEffect(() => {
    if (urlToken) return
    const emailTrim = email.trim()
    const isValid = /.+@.+\..+/.test(emailTrim)
    if (!isValid || !emailTrim || emailTrim === fetchedForEmail) return
    const t = setTimeout(async () => {
      try {
        const res = await authAPI.forgotPassword(emailTrim)
        if (res.token) {
          setTokenInput(res.token)
          setFetchedForEmail(emailTrim)
          toast.success("Reset token generated and filled automatically")
        } else {
          toast.message("If the email exists, a token has been generated.")
          setFetchedForEmail(emailTrim)
        }
      } catch (err) {
        // Non-blocking error
      }
    }, 600)
    return () => clearTimeout(t)
  }, [email, urlToken, fetchedForEmail])

  async function handleGenerateToken() {
    if (urlToken) return
    const emailTrim = email.trim()
    if (!/.+@.+\..+/.test(emailTrim)) {
      toast.error("Enter a valid email")
      return
    }
    setGenerating(true)
    try {
      const res = await authAPI.forgotPassword(emailTrim)
      if (res.token) {
        setTokenInput(res.token)
        setFetchedForEmail(emailTrim)
        toast.success("Reset token generated")
      } else {
        toast.message("If the email exists, a token has been generated.")
        setFetchedForEmail(emailTrim)
      }
    } catch (e) {
      toast.error("Failed to generate token")
    } finally {
      setGenerating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = urlToken || tokenInput.trim()
    if (!token) {
      toast.error("Reset token is required")
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await authAPI.resetPassword(token, password)
      toast.success("Password reset successful. Please login.")
      router.push("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SkillBridge</h1>
          </Link>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!urlToken && (
              <div className="space-y-2">
                <Label htmlFor="email">Account Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="button" variant="secondary" onClick={handleGenerateToken} disabled={generating}>
                  {generating ? "Generating..." : "Generate Token"}
                </Button>
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Token will appear here"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  required
                />
                {!!tokenInput && (
                  <p className="text-xs text-muted-foreground break-all">Token: {tokenInput}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <Link href="/login" className="text-primary hover:underline">Back to login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
