"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusPill } from "@/components/shared/status-pill"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { WorkflowActions } from "@/components/shared/workflow-actions"
import { createAuditLogEntry, type AuditLogEntry } from "@/lib/utils/workflow"
import type { RecordStatus } from "@/lib/types/safety-record"
import type { JSA } from "@/lib/types/jsa"
import { controlTypeLabels, riskLevelColors } from "@/lib/types/jsa"
import Link from "next/link"
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  CheckCircle,
  XCircle,
  PenTool,
  Shield,
  FileText,
  LinkIcon,
  AlertTriangle,
} from "lucide-react"

const mockJSA: JSA = {
  id: "1",
  jsaNumber: "JSA-2024-001",
  title: "Excavation Work - Utility Trench",
  projectName: "Site A Development",
  location: "Site A - Zone 2",
  date: "2024-12-15",
  duration: "Full Day",
  crew: ["Mike Johnson", "Tom Anderson", "Chris Davis"],
  equipmentRequired: ["Excavator", "Shoring Equipment", "Water Pump", "Ladder", "Hand Tools"],
  status: "approved",
  tasks: [
    {
      id: "1",
      stepNumber: 1,
      taskDescription: "Set up work zone with barriers and signage",
      hazards: [
        {
          id: "h1",
          description: "Vehicle traffic in work area",
          severity: "high",
          likelihood: "likely",
          riskLevel: "high",
        },
        {
          id: "h2",
          description: "Pedestrian access to hazard zone",
          severity: "medium",
          likelihood: "possible",
          riskLevel: "medium",
        },
      ],
      controls: [
        {
          id: "c1",
          description: "Install traffic cones and barricades around perimeter",
          type: "engineering",
          residualRisk: "low",
        },
        {
          id: "c2",
          description: "Post warning signs at all access points",
          type: "administrative",
          residualRisk: "low",
        },
        {
          id: "c3",
          description: "High-visibility vests for all workers",
          type: "ppe",
          residualRisk: "low",
        },
      ],
    },
    {
      id: "2",
      stepNumber: 2,
      taskDescription: "Locate and mark underground utilities",
      hazards: [
        {
          id: "h3",
          description: "Strike underground electrical lines",
          severity: "critical",
          likelihood: "unlikely",
          riskLevel: "high",
        },
        {
          id: "h4",
          description: "Gas line rupture",
          severity: "critical",
          likelihood: "rare",
          riskLevel: "medium",
        },
      ],
      controls: [
        {
          id: "c4",
          description: "Call 811 for utility location service 48 hours in advance",
          type: "administrative",
          residualRisk: "low",
        },
        {
          id: "c5",
          description: "Use hand digging within 2 feet of marked utilities",
          type: "administrative",
          residualRisk: "low",
        },
        {
          id: "c6",
          description: "Gas detection equipment on site",
          type: "engineering",
          residualRisk: "low",
        },
      ],
    },
    {
      id: "3",
      stepNumber: 3,
      taskDescription: "Excavate trench with equipment",
      hazards: [
        {
          id: "h5",
          description: "Cave-in or trench collapse",
          severity: "critical",
          likelihood: "possible",
          riskLevel: "critical",
        },
        {
          id: "h6",
          description: "Equipment rollover",
          severity: "high",
          likelihood: "unlikely",
          riskLevel: "medium",
        },
      ],
      controls: [
        {
          id: "c7",
          description: "Install trench shoring for depths over 5 feet",
          type: "engineering",
          residualRisk: "low",
        },
        {
          id: "c8",
          description: "Competent person inspects trench daily",
          type: "administrative",
          residualRisk: "low",
        },
        {
          id: "c9",
          description: "Keep excavated material 2+ feet from trench edge",
          type: "administrative",
          residualRisk: "low",
        },
      ],
    },
  ],
  acknowledgments: [
    {
      id: "1",
      workerId: "w1",
      workerName: "Mike Johnson",
      acknowledgedAt: "2024-12-15T07:00:00Z",
      role: "Equipment Operator",
      comments: "Reviewed and understood all hazards and controls",
    },
    {
      id: "2",
      workerId: "w2",
      workerName: "Tom Anderson",
      acknowledgedAt: "2024-12-15T07:05:00Z",
      role: "Laborer",
      comments: "Ready to proceed safely",
    },
  ],
  approvals: [
    {
      id: "1",
      approverId: "a1",
      approverName: "Sarah Williams",
      approvedAt: "2024-12-14T16:30:00Z",
      role: "supervisor",
      status: "approved",
      comments: "All hazards properly identified and controlled",
    },
    {
      id: "2",
      approverId: "a2",
      approverName: "Robert Martinez",
      approvedAt: "2024-12-14T17:00:00Z",
      role: "safety_manager",
      status: "approved",
      comments: "JSA meets safety requirements",
    },
  ],
  createdBy: "Mike Johnson",
  createdAt: "2024-12-14T10:00:00Z",
  updatedAt: "2024-12-14T17:00:00Z",
  approvedAt: "2024-12-14T17:00:00Z",
  linkedPermitIds: ["PER-2024-023"],
  linkedInspectionIds: ["INS-2024-045"],
}

interface JSADetailProps {
  jsaId: string
}

export function JSADetail({ jsaId }: JSADetailProps) {
  const [currentTab, setCurrentTab] = useState("tasks")
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [acknowledgmentComments, setAcknowledgmentComments] = useState("")
  const [approvalComments, setApprovalComments] = useState("")
  const [status, setStatus] = useState<RecordStatus>(mockJSA.status as RecordStatus)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: "1",
      timestamp: mockJSA.createdAt,
      user: mockJSA.createdBy,
      action: "Created JSA",
      toStatus: "draft",
    },
    {
      id: "2",
      timestamp: mockJSA.updatedAt,
      user: mockJSA.createdBy,
      action: "Submitted for approval",
      fromStatus: "draft",
      toStatus: "submitted",
    },
    {
      id: "3",
      timestamp: mockJSA.approvedAt || mockJSA.updatedAt,
      user: mockJSA.approvals[0].approverName,
      action: "Approved JSA",
      fromStatus: "under_review",
      toStatus: "approved",
    },
  ])

  const userRole = "safety_officer"
  const currentUser = "Current User"

  const handleTransition = (newStatus: RecordStatus, comment?: string) => {
    const entry = createAuditLogEntry(currentUser, `Changed status to ${newStatus}`, status, newStatus, comment)
    setStatus(newStatus)
    setAuditLog([...auditLog, entry])
  }

  const canEdit = ["draft"].includes(status)
  const canSubmit = status === "draft"
  const canApprove = status === "pending_approval" && ["supervisor", "manager", "admin"].includes(userRole)
  const canAcknowledge = status === "approved" || status === "active"
  const userHasAcknowledged = mockJSA.acknowledgments.some((ack) => ack.workerName === currentUser)

  const allCrewAcknowledged = mockJSA.acknowledgments.length >= mockJSA.crew.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jsa">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockJSA.jsaNumber}</h1>
              <StatusPill status={status} />
            </div>
            <p className="text-muted-foreground">{mockJSA.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "draft" && (
            <Button variant="outline" asChild>
              <Link href={`/jsa/edit/${jsaId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
          <WorkflowActions
            currentStatus={status}
            userRole={userRole}
            onTransition={handleTransition}
            auditLog={auditLog}
          />
          {canAcknowledge && !userHasAcknowledged && (
            <Button onClick={() => setShowAcknowledgeDialog(true)}>
              <PenTool className="mr-2 h-4 w-4" />
              Acknowledge
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Print JSA</DropdownMenuItem>
              <DropdownMenuItem>Export PDF</DropdownMenuItem>
              <DropdownMenuItem>Duplicate JSA</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="tasks">Tasks & Hazards</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="linked">Linked Records</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {mockJSA.tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {task.stepNumber}
                  </span>
                  {task.taskDescription}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold">Hazards Identified</h3>
                  </div>
                  <div className="space-y-2">
                    {task.hazards.map((hazard) => (
                      <div key={hazard.id} className={`rounded-lg border p-3 ${riskLevelColors[hazard.riskLevel]}`}>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm font-medium">{hazard.description}</p>
                          <Badge variant="outline" className="shrink-0">
                            {hazard.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>Severity: {hazard.severity}</span>
                          <span>Likelihood: {hazard.likelihood}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Control Measures</h3>
                  </div>
                  <div className="space-y-2">
                    {task.controls.map((control) => (
                      <div key={control.id} className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm">{control.description}</p>
                          <Badge variant="secondary" className="shrink-0">
                            {controlTypeLabels[control.type]}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Residual Risk: <span className="font-medium capitalize">{control.residualRisk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JSA Details</CardTitle>
              <CardDescription>Basic information about this Job Safety Analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project</p>
                  <p className="text-sm font-semibold">{mockJSA.projectName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold">{mockJSA.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">{mockJSA.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{mockJSA.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created By</p>
                  <p className="text-sm font-semibold">{mockJSA.createdBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-semibold">{new Date(mockJSA.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Crew Members</p>
                <div className="flex flex-wrap gap-2">
                  {mockJSA.crew.map((member) => (
                    <Badge key={member} variant="secondary">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Equipment Required</p>
                <div className="flex flex-wrap gap-2">
                  {mockJSA.equipmentRequired.map((equipment) => (
                    <Badge key={equipment} variant="outline">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledgments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Worker Acknowledgments</CardTitle>
                  <CardDescription>
                    All crew members must acknowledge they have reviewed and understood this JSA
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {allCrewAcknowledged ? (
                    <Badge className="bg-green-500/20 text-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {mockJSA.acknowledgments.length}/{mockJSA.crew.length} Acknowledged
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJSA.crew.map((member) => {
                const acknowledgment = mockJSA.acknowledgments.find((ack) => ack.workerName === member)
                return (
                  <div
                    key={member}
                    className={`rounded-lg border p-4 ${acknowledgment ? "border-green-500/30 bg-green-500/10" : "border-border bg-card"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{member}</p>
                          {acknowledgment ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Pending
                            </Badge>
                          )}
                        </div>
                        {acknowledgment && (
                          <>
                            <p className="text-xs text-muted-foreground">{acknowledgment.role}</p>
                            <p className="text-xs text-muted-foreground">
                              Acknowledged: {new Date(acknowledgment.acknowledgedAt).toLocaleString()}
                            </p>
                            {acknowledgment.comments && (
                              <p className="mt-2 text-sm italic">"{acknowledgment.comments}"</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Supervisors and safety managers must approve this JSA before use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJSA.approvals.map((approval) => (
                <div
                  key={approval.id}
                  className={`rounded-lg border p-4 ${
                    approval.status === "approved"
                      ? "border-green-500/30 bg-green-500/10"
                      : approval.status === "rejected"
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{approval.approverName}</p>
                        {approval.status === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : approval.status === "rejected" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                      <p className="text-xs capitalize text-muted-foreground">{approval.role.replace("_", " ")}</p>
                      {approval.approvedAt && (
                        <p className="text-xs text-muted-foreground">
                          {approval.status === "approved" ? "Approved" : "Rejected"}:{" "}
                          {new Date(approval.approvedAt).toLocaleString()}
                        </p>
                      )}
                      {approval.comments && <p className="mt-2 text-sm italic">"{approval.comments}"</p>}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linked" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked Records</CardTitle>
              <CardDescription>Permits, inspections, and other records related to this JSA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJSA.linkedPermitIds && mockJSA.linkedPermitIds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Work Permits</h3>
                  {mockJSA.linkedPermitIds.map((permitId) => (
                    <Link
                      key={permitId}
                      href={`/permits/${permitId}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-mono text-sm font-medium">{permitId}</p>
                          <p className="text-xs text-muted-foreground">Hot Work Permit</p>
                        </div>
                      </div>
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}

              {mockJSA.linkedInspectionIds && mockJSA.linkedInspectionIds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Related Inspections</h3>
                  {mockJSA.linkedInspectionIds.map((inspectionId) => (
                    <Link
                      key={inspectionId}
                      href={`/inspections/${inspectionId}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-mono text-sm font-medium">{inspectionId}</p>
                          <p className="text-xs text-muted-foreground">Equipment Inspection</p>
                        </div>
                      </div>
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}

              {(!mockJSA.linkedPermitIds || mockJSA.linkedPermitIds.length === 0) &&
                (!mockJSA.linkedInspectionIds || mockJSA.linkedInspectionIds.length === 0) && (
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground">No linked records</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Acknowledgment Dialog */}
      <AlertDialog open={showAcknowledgeDialog} onOpenChange={setShowAcknowledgeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Acknowledge JSA</AlertDialogTitle>
            <AlertDialogDescription>
              By acknowledging this JSA, you confirm that you have reviewed and understood all tasks, hazards, and
              control measures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ack-comments">Comments (Optional)</Label>
            <Textarea
              id="ack-comments"
              placeholder="Add any comments or concerns..."
              value={acknowledgmentComments}
              onChange={(e) => setAcknowledgmentComments(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <PenTool className="mr-2 h-4 w-4" />
              Sign & Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve JSA</AlertDialogTitle>
            <AlertDialogDescription>
              Review all tasks, hazards, and controls before approving this JSA for use.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approval-comments">Approval Comments</Label>
            <Textarea
              id="approval-comments"
              placeholder="Add your approval comments..."
              value={approvalComments}
              onChange={(e) => setApprovalComments(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve JSA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
