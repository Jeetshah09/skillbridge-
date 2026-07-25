"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminNotificationsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin?section=notifications")
  }, [router])
  return null
}
