"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordRedirect() {
  const router = useRouter()
  const params = useSearchParams()
  useEffect(() => {
    const token = params.get("token")
    const target = token ? `/forgot-password?token=${encodeURIComponent(token)}` : "/forgot-password"
    router.replace(target)
  }, [params, router])
  return null
}
