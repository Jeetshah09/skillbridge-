"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HrProfilePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/company-profile")
  }, [router])
  return null
}
