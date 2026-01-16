"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/shared/status-pill"
import { PriorityIndicator } from "@/components/shared/priority-indicator"
import { EvidenceUploader } from "@/components/shared/evidence-uploader"
import { AuditTimeline } from "@/components/shared/audit-timeline"
import { ArrowLeft, CheckCircle2, FileText, LinkIcon, User, Calendar, PlayCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Mock data
const mockCapa = {
  id: "1",
  capaNumber: "CAPA-2024-001",
  title: "Install additional safety signage",
  description: "Install warning signs near crane operation zones",
  type: "corrective" as const,
  priority: "high" as const,
  status: "in_progress" as const,
  owner: "Mike Johnson",
  assignee: "Tom Anderson",
  verifier: "Sarah Williams",
  createdAt: "2024-12-10",
  updatedAt: "2024-12-14",
  submittedAt: "2024-12-10",
  dueDate: "2024-12-18",
  problemDescription: "Insufficient warning signage identified during incident investigation",
  rootCause: "Signage not included in original site setup plan",
  immediateAction: "Verbal warnings issued to all workers",
  verificationMethod: "Post-installation inspection and sign-off",
  actionSteps: [
    {
      id: "1",
      description: "Order warning signs",
      assignee: "Tom Anderson",
      dueDate: "2024-12-12",
      status: "completed" as const,
      completedAt: "2024-12-11",
      notes: "Ordered 15 signs from Safety Supply Co.",
    },
    {
      id: "2",
      description: "Install signs at identified locations",
      assignee: "Tom Anderson",
      dueDate: "2024-12-18",
      status: "in_progress" as const,
    },
    {
      id: "3",
      description: "Document installation with photos",
      assignee: "Tom Anderson",
      dueDate: "2024-12-18",
      status: "pending" as const,
    },
  ],
  sourceRecordId: "INC-2024-001",
  sourceRecordType: "incident",
  linkedRecords: [
    {
      id: "1",
      recordNumber: "INC-2024-001",
      title: "Near miss with crane operation",
      type: "incident" as const,
      status: "closed" as const,
    },
    {
      id: "2",
      recordNumber: "INS-2024-048",
      title: "Signage verification inspection",
      type: "inspection" as const,
      status: "draft" as const,
    },
  ],
  evidenceFiles: [
    { id: "1", name: "purchase_order.pdf", size: "245 KB", uploadedAt: "2024-12-11" },
    { id: "2", name: "site_photos.jpg", size: "1.2 MB", uploadedAt: "2024-12-14" },
  ],
}

export function CapaDetail() {
  const [verificationNotes, setVerificationNotes] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const userRole = "manager" // Mock user role

  const isOverdue = new Date(mockCapa.dueDate) < new Date()
  const isDueSoon =
    new Date(mockCapa.dueDate) >= new Date() &&
    new Date(mockCapa.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const completedSteps = mockCapa.actionSteps.filter((step) => step.status === "completed").length
  const totalSteps = mockCapa.actionSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/capa">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockCapa.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{mockCapa.capaNumber}</span>
              <span>•</span>
              <span>Created {mockCapa.createdAt}</span>
              <span>•</span>
              <span>Updated {mockCapa.updatedAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {mockCapa.status === "submitted" && userRole === "manager" && (
            <>
              <Button variant="outline" size="sm">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button size="sm">
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Action
              </Button>
            </>
          )}
          {mockCapa.status === "in_progress" && (
            <Button size="sm">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit for Verification
            </Button>
          )}
          {mockCapa.status === "pending_verification" && userRole === "manager" && (
            <>
              <Button variant="outline" size="sm">
                <XCircle className="mr-2 h-4 w-4" />
                Return for Revision
              </Button>
              <Button size="sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify & Close
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusPill status={mockCapa.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Priority</p>
              <PriorityIndicator priority={mockCapa.priority} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline" className="capitalize">
                {mockCapa.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Due Date</p>
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-medium", isOverdue && "text-destructive", isDueSoon && "text-chart-4")}>
                  {mockCapa.dueDate}
                </p>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
                {isDueSoon && (
                  <Badge className="bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 text-xs">Due Soon</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="action-steps">Action Steps</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="linked">Linked Records</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{mockCapa.owner}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assignee</p>
                    <p className="font-medium">{mockCapa.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verifier</p>
                    <p className="font-medium">{mockCapa.verifier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Action Steps</span>
                    <span className="font-medium">
                      {completedSteps} of {totalSteps} completed
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                    <p className="font-medium">
                      {Math.ceil((new Date(mockCapa.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Action Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockCapa.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problem Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Problem Description</h4>
                <p className="text-sm text-muted-foreground">{mockCapa.problemDescription}</p>
              </div>
              {mockCapa.rootCause && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Root Cause</h4>
                  <p className="text-sm text-muted-foreground">{mockCapa.rootCause}</p>
                </div>
              )}
              {mockCapa.immediateAction && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Immediate Action Taken</h4>
                  <p className="text-sm text-muted-foreground">{mockCapa.immediateAction}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Steps Tab */}
        <TabsContent value="action-steps" className="space-y-4">
          {mockCapa.actionSteps.map((step, index) => (
            <Card key={step.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        step.status === "completed" && "bg-chart-2/10 text-chart-2",
                        step.status === "in_progress" && "bg-primary/10 text-primary",
                        step.status === "pending" && "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-medium">{step.description}</h4>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {step.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {step.dueDate}
                          </span>
                        </div>
                      </div>
                      {step.notes && (
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground">{step.notes}</p>
                        </div>
                      )}
                      {step.completedAt && (
                        <div className="flex items-center gap-2 text-sm text-chart-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Completed on {step.completedAt}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      step.status === "completed" && "bg-chart-2/10 text-chart-2",
                      step.status === "in_progress" && "bg-primary/10 text-primary",
                      step.status === "pending" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.status === "completed" && "Completed"}
                    {step.status === "in_progress" && "In Progress"}
                    {step.status === "pending" && "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Plan</CardTitle>
              <CardDescription>How effectiveness will be verified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockCapa.verificationMethod}</p>
            </CardContent>
          </Card>

          {mockCapa.status === "pending_verification" && userRole === "manager" && (
            <Card>
              <CardHeader>
                <CardTitle>Verify Action</CardTitle>
                <CardDescription>Review and verify the effectiveness of this action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationNotes">Verification Notes</Label>
                  <Textarea
                    id="verificationNotes"
                    placeholder="Document your verification findings..."
                    rows={4}
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Return for Revision</Button>
                  <Button>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verify & Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(mockCapa.status === "verified" || mockCapa.status === "closed") && (
            <Card>
              <CardHeader>
                <CardTitle>Verification Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-chart-2 bg-chart-2/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-chart-2" />
                  <div>
                    <p className="font-medium text-chart-2">Action Verified</p>
                    <p className="mt-1 text-sm text-muted-foreground">Verified by {mockCapa.verifier} on 2024-12-19</p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Verification Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    All signs have been installed at the designated locations. Visual inspection confirms proper
                    placement and visibility. Workers have been briefed on the new signage.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Evidence</CardTitle>
              <CardDescription>Documentation and photos related to this CAPA</CardDescription>
            </CardHeader>
            <CardContent>
              <EvidenceUploader />
            </CardContent>
          </Card>

          {mockCapa.evidenceFiles && mockCapa.evidenceFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockCapa.evidenceFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • Uploaded {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Linked Records Tab */}
        <TabsContent value="linked" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked Records</CardTitle>
              <CardDescription>Related incidents, inspections, and other records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCapa.linkedRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/records/${record.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-mono text-sm font-medium">{record.recordNumber}</p>
                        <p className="text-sm text-muted-foreground">{record.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {record.type}
                      </Badge>
                      <StatusPill status={record.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete history of all changes and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTimeline />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
