"use client"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { internshipAPI, type Application } from "@/lib/internship-api"

export default function HrApplicationsPage() {
  const [items, setItems] = useState<Application[]>([])
  const [filtered, setFiltered] = useState<Application[]>([])
  const [status, setStatus] = useState<string>("")
  const [q, setQ] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const apps = await internshipAPI.getMyApplications()
        setItems(apps)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let list = [...items]
    if (status) list = list.filter(a => a.status?.toLowerCase() === status)
    const query = q.trim().toLowerCase()
    if (query) {
      list = list.filter(a => (a.internship_title || a.internship_id || '').toLowerCase().includes(query) || (a.student_name || '').toLowerCase().includes(query))
    }
    setFiltered(list)
  }, [items, status, q])

  async function setAppStatus(id: string, next: 'approved' | 'rejected') {
    try {
      await internshipAPI.updateApplication(id, { status: next })
      setItems(prev => prev.map(p => p.id === id ? { ...p, status: next } : p))
    } catch {}
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 p-4">
        <Navbar />
        <div className="max-w-7xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Applications</CardTitle>
                  <CardDescription>Review, approve or reject applications for your postings</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search by internship/applicant" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
                  <select value={status} onChange={(e)=>setStatus(e.target.value)} className="h-9 border rounded-md px-2 text-sm bg-background">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.internship_title || a.internship_id}</TableCell>
                        <TableCell>{a.student_name || '-'}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{a.status}</Badge></TableCell>
                        <TableCell>{a.applied_date ? new Date(a.applied_date).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={()=>setAppStatus(a.id, 'approved')}>Approve</Button>
                            <Button size="sm" variant="secondary" onClick={()=>setAppStatus(a.id, 'rejected')}>Reject</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
