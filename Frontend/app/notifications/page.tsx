"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { notificationsAPI, NotificationItem } from "@/lib/notifications-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2, Bell, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"

function NotificationsContent() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [markingAll, setMarkingAll] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await notificationsAPI.listMy()
      setItems(data)
    } catch (e: any) {
      toast.error(e.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markAll = async () => {
    try {
      setMarkingAll(true)
      await notificationsAPI.markAllRead()
      await load()
      toast.success('All notifications marked as read')
    } catch (e: any) {
      toast.error(e.message || 'Failed to mark as read')
    } finally {
      setMarkingAll(false)
    }
  }

  const markOne = async (id: string) => {
    try {
      await notificationsAPI.markOneRead(id)
      setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (e: any) {
      toast.error(e.message || 'Failed to update')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Stay up to date with your activity</p>
          </div>
          <Button onClick={markAll} disabled={markingAll || items.length === 0} variant="outline">
            {markingAll ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Marking...</>) : (<><Check className="w-4 h-4 mr-2"/>Mark all read</>)}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading notifications...</span>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map(n => (
              <Card key={n.id} className={n.read ? 'opacity-80' : ''}>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{n.title}</CardTitle>
                    <CardDescription>{n.message}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={n.read ? 'secondary' : 'default'}>{n.read ? 'Read' : 'New'}</Badge>
                    {!n.read && (
                      <Button size="sm" variant="outline" onClick={() => markOne(n.id)}>Mark read</Button>
                    )}
                  </div>
                </CardHeader>
                {n.href && (
                  <CardContent>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={n.href}>
                        <ExternalLink className="w-4 h-4 mr-2"/> Open
                      </Link>
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  )
}


