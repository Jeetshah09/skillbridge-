"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminInternshipsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin?section=internships")
  }, [router])
  return null
}
