"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminApplicationsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin?section=applications")
  }, [router])
  return null
}
