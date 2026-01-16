"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, CheckCircle, XCircle, UserPlus, Download, Mail } from "lucide-react"
import Link from "next/link"
import type { Training, TrainingAttendance } from "@/lib/types/training"

const mockTraining: Training = {
  id: "1",
  trainingNumber: "TRN-2024-001",
  title: "Site Safety Induction",
  type: "induction",
  status: "in_progress",
  date: "2024-12-20",
  duration: 120,
  location: "Site A - Training Room",
  trainer: "Sarah Williams",
  description: "Mandatory safety induction for all new site workers",
  topics: ["Site Rules", "Emergency Procedures", "PPE Requirements", "Hazard Identification"],
  requiredFor: ["All Workers"],
  maxAttendees: 25,
  createdBy: "Sarah Williams",
  createdAt: "2024-12-10T10:00:00Z",
  updatedAt: "2024-12-20T08:00:00Z",
}

const mockAttendance: TrainingAttendance[] = [
  {
    id: "1",
    trainingId: "1",
    attendeeId: "w1",
    attendeeName: "Mike Johnson",
    role: "Equipment Operator",
    company: "Main Contractor",
    checkInTime: "2024-12-20T08:05:00Z",
    status: "attended",
    quizScore: 95,
    signature: "signed",
    signedAt: "2024-12-20T10:05:00Z",
    certificateIssued: true,
  },
  {
    id: "2",
    trainingId: "1",
    attendeeId: "w2",
    attendeeName: "Tom Anderson",
    role: "Laborer",
    company: "Main Contractor",
    checkInTime: "2024-12-20T08:10:00Z",
    status: "attended",
    quizScore: 88,
    signature: "signed",
    signedAt: "2024-12-20T10:08:00Z",
    certificateIssued: true,
  },
  {
    id: "3",
    trainingId: "1",
    attendeeId: "w3",
    attendeeName: "Chris Davis",
    role: "Carpenter",
    company: "Subcontractor A",
    status: "registered",
  },
  {
    id: "4",
    trainingId: "1",
    attendeeId: "w4",
    attendeeName: "Emily Brown",
    role: "Safety Officer",
    company: "Main Contractor",
    checkInTime: "2024-12-20T08:00:00Z",
    status: "attended",
    quizScore: 100,
    signature: "signed",
    signedAt: "2024-12-20T10:12:00Z",
    certificateIssued: true,
  },
  {
    id: "5",
    trainingId: "1",
    attendeeId: "w5",
    attendeeName: "John Smith",
    role: "Electrician",
    company: "Subcontractor B",
    status: "no_show",
  },
]

interface AttendanceRosterProps {
  trainingId: string
}

export function AttendanceRoster({ trainingId }: AttendanceRosterProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newAttendeeName, setNewAttendeeName] = useState("")
  const [newAttendeeRole, setNewAttendeeRole] = useState("")
  const [newAttendeeCompany, setNewAttendeeCompany] = useState("")

  const attendedCount = mockAttendance.filter((a) => a.status === "attended").length
  const registeredCount = mockAttendance.filter((a) => a.status === "registered").length
  const noShowCount = mockAttendance.filter((a) => a.status === "no_show").length

  const getStatusBadge = (status: TrainingAttendance["status"]) => {
    const config = {
      registered: { label: "Registered", className: "bg-chart-4/10 text-chart-4" },
      attended: { label: "Attended", className: "bg-chart-3/10 text-chart-3" },
      no_show: { label: "No Show", className: "bg-red-500/10 text-red-500" },
      cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
    }
    const { label, className } = config[status]
    return (
      <Badge variant="secondary" className={className}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/training">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Attendance Roster</h1>
            <p className="text-muted-foreground">
              {mockTraining.trainingNumber} - {mockTraining.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Reminders
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Attendee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockAttendance.length}</div>
            <p className="text-xs text-muted-foreground">of {mockTraining.maxAttendees} max capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">{attendedCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((attendedCount / mockAttendance.length) * 100)}% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">{registeredCount}</div>
            <p className="text-xs text-muted-foreground">Not yet checked in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No Show</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{noShowCount}</div>
            <p className="text-xs text-muted-foreground">Did not attend</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
              <p className="text-sm font-semibold">{mockTraining.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold">{mockTraining.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-sm font-semibold">{mockTraining.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>Check-in status and completion records for all registered attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Quiz Score</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendance.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">{attendee.attendeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{attendee.role}</TableCell>
                  <TableCell className="text-muted-foreground">{attendee.company}</TableCell>
                  <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {attendee.checkInTime
                      ? new Date(attendee.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {attendee.quizScore ? (
                      <span className={attendee.quizScore >= 80 ? "text-chart-3" : "text-red-500"}>
                        {attendee.quizScore}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {attendee.signature ? (
                      <CheckCircle className="h-4 w-4 text-chart-3" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    {attendee.certificateIssued ? (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendee</DialogTitle>
            <DialogDescription>Register a new attendee for this training session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                placeholder="Worker name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newAttendeeRole}
                onChange={(e) => setNewAttendeeRole(e.target.value)}
                placeholder="Job role"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newAttendeeCompany}
                onChange={(e) => setNewAttendeeCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddDialog(false)}>Add Attendee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
