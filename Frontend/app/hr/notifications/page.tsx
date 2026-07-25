"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HrNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 p-4">
        <Navbar />
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your updates and system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              Coming soon
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
