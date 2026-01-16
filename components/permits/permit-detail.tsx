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
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  CheckCircle,
  Ban,
  AlertTriangle,
  PenTool,
  Shield,
  FileText,
  LinkIcon,
  Clock,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import type { Permit } from "@/lib/types/permit"
import { permitTypeLabels, permitTypeColors } from "@/lib/types/permit"
import { AuditTimeline } from "@/components/shared/audit-timeline"

const mockPermit: Permit = {
  id: "1",
  permitNumber: "PER-2024-001",
  title: "Welding Work - Structural Steel",
  type: "hot_work",
  status: "active",
  location: "Site A - Building 3",
  workDescription:
    "Welding structural steel beams for new construction. Work involves cutting, grinding, and welding operations on the third floor structural framework.",
  validFrom: "2024-12-20T08:00:00Z",
  validTo: "2024-12-20T17:00:00Z",
  contractor: "Steel Solutions Inc.",
  supervisor: "Mike Johnson",
  safetyContact: "Sarah Williams",
  emergencyNumber: "911",
  hazards: [
    {
      id: "1",
      category: "Fire/Explosion",
      description: "Hot work operations creating sparks and heat near combustible materials",
      controls: [
        "Remove all combustible materials within 35 feet",
        "Fire watch required during and 30 minutes after work",
        "Fire extinguisher readily available",
        "Hot work blanket for protecting adjacent areas",
      ],
      severity: "high",
    },
    {
      id: "2",
      category: "Fall Hazard",
      description: "Work at elevated platform without proper edge protection",
      controls: [
        "Full body harness with double lanyard required",
        "Guardrails installed where possible",
        "100% tie-off when moving between locations",
        "Competent person inspects fall protection daily",
      ],
      severity: "critical",
    },
    {
      id: "3",
      category: "Electrical",
      description: "Contact with energized welding equipment",
      controls: [
        "Equipment inspected before use",
        "Proper grounding of all equipment",
        "Rubber insulating gloves when changing electrodes",
        "Work area kept dry",
      ],
      severity: "high",
    },
  ],
  additionalPrecautions: [
    "All workers must attend pre-work safety briefing",
    "Atmospheric monitoring required if confined space conditions exist",
    "Welding screens to protect nearby workers from arc flash",
    "No work permitted during adverse weather conditions",
  ],
  ppeRequired: ["Welding Helmet", "Fire-resistant Clothing", "Safety Boots", "Gloves", "Hard Hat"],
  acknowledgments: [
    {
      id: "1",
      workerId: "w1",
      workerName: "Mike Johnson",
      acknowledgedAt: "2024-12-20T07:30:00Z",
      role: "Supervisor",
      comments: "Reviewed all requirements and ready to proceed",
    },
    {
      id: "2",
      workerId: "w2",
      workerName: "Tom Anderson",
      acknowledgedAt: "2024-12-20T07:35:00Z",
      role: "Welder",
      comments: "Understood all safety requirements",
    },
  ],
  linkedJSAIds: ["JSA-2024-001"],
  linkedInspectionIds: ["INS-2024-045"],
  createdBy: "Sarah Williams",
  createdAt: "2024-12-19T10:00:00Z",
  updatedAt: "2024-12-19T14:30:00Z",
  approvedAt: "2024-12-19T14:30:00Z",
  approvedBy: "Robert Martinez",
}

const mockAuditLog = [
  {
    id: "1",
    action: "Permit Activated",
    user: "Mike Johnson",
    timestamp: "2024-12-20T08:00:00Z",
    details: "Permit activated at start of work",
  },
  {
    id: "2",
    action: "Worker Acknowledgment",
    user: "Tom Anderson",
    timestamp: "2024-12-20T07:35:00Z",
    details: "Worker acknowledged permit requirements",
  },
  {
    id: "3",
    action: "Worker Acknowledgment",
    user: "Mike Johnson",
    timestamp: "2024-12-20T07:30:00Z",
    details: "Supervisor acknowledged permit requirements",
  },
  {
    id: "4",
    action: "Permit Approved",
    user: "Robert Martinez",
    timestamp: "2024-12-19T14:30:00Z",
    details: "Permit approved by Safety Manager",
  },
  {
    id: "5",
    action: "Permit Created",
    user: "Sarah Williams",
    timestamp: "2024-12-19T10:00:00Z",
    details: "New permit created and submitted for approval",
  },
]

interface PermitDetailProps {
  permitId: string
}

export function PermitDetail({ permitId }: PermitDetailProps) {
  const [currentTab, setCurrentTab] = useState("summary")
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [acknowledgmentComments, setAcknowledgmentComments] = useState("")
  const [suspensionReason, setSuspensionReason] = useState("")
  const [revocationReason, setRevocationReason] = useState("")

  const userRole = "manager" // Mock user role
  const currentUser = "Current User" // Mock current user

  const canEdit = mockPermit.status === "draft"
  const canApprove = mockPermit.status === "pending_approval" && ["manager", "admin"].includes(userRole)
  const canAcknowledge = ["approved", "active"].includes(mockPermit.status)
  const canSuspend = mockPermit.status === "active" && ["supervisor", "manager", "admin"].includes(userRole)
  const canRevoke =
    ["approved", "active", "suspended"].includes(mockPermit.status) && ["manager", "admin"].includes(userRole)
  const canComplete = mockPermit.status === "active" && ["supervisor", "manager", "admin"].includes(userRole)
  const canReactivate = mockPermit.status === "suspended" && ["manager", "admin"].includes(userRole)

  const userHasAcknowledged = mockPermit.acknowledgments.some((ack) => ack.workerName === currentUser)

  const getValidityStatus = () => {
    const now = new Date()
    const validFrom = new Date(mockPermit.validFrom)
    const validTo = new Date(mockPermit.validTo)

    if (now < validFrom) {
      return { label: "Not yet valid", color: "text-muted-foreground", icon: Clock }
    } else if (now > validTo) {
      return { label: "Expired", color: "text-red-500", icon: XCircle }
    } else {
      const hoursRemaining = (validTo.getTime() - now.getTime()) / (1000 * 60 * 60)
      if (hoursRemaining < 2) {
        return {
          label: `Expires in ${Math.floor(hoursRemaining * 60)}m`,
          color: "text-orange-500",
          icon: AlertTriangle,
        }
      } else if (hoursRemaining < 8) {
        return { label: `Expires in ${Math.floor(hoursRemaining)}h`, color: "text-amber-500", icon: Clock }
      }
      return { label: "Valid", color: "text-green-500", icon: CheckCircle }
    }
  }

  const validityStatus = getValidityStatus()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/permits">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockPermit.permitNumber}</h1>
              <StatusPill status={mockPermit.status} />
              <Badge className={permitTypeColors[mockPermit.type]}>{permitTypeLabels[mockPermit.type]}</Badge>
            </div>
            <p className="text-muted-foreground">{mockPermit.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" asChild>
              <Link href={`/permits/edit/${permitId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
          {canApprove && (
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Permit
            </Button>
          )}
          {canAcknowledge && !userHasAcknowledged && (
            <Button onClick={() => setShowAcknowledgeDialog(true)}>
              <PenTool className="mr-2 h-4 w-4" />
              Acknowledge
            </Button>
          )}
          {canSuspend && (
            <Button variant="outline" onClick={() => setShowSuspendDialog(true)}>
              <Ban className="mr-2 h-4 w-4" />
              Suspend Permit
            </Button>
          )}
          {canComplete && (
            <Button onClick={() => setShowCompleteDialog(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Work
            </Button>
          )}
          {canReactivate && (
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Reactivate Permit
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
              <DropdownMenuItem>Print Permit</DropdownMenuItem>
              <DropdownMenuItem>Export PDF</DropdownMenuItem>
              <DropdownMenuItem>Duplicate Permit</DropdownMenuItem>
              {canRevoke && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowRevokeDialog(true)} className="text-red-500">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Revoke Permit
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mockPermit.status === "active" && (
        <Card
          className={`border-l-4 ${
            validityStatus.color === "text-red-500"
              ? "border-l-red-500 bg-red-500/10"
              : validityStatus.color === "text-orange-500"
                ? "border-l-orange-500 bg-orange-500/10"
                : validityStatus.color === "text-amber-500"
                  ? "border-l-amber-500 bg-amber-500/10"
                  : "border-l-green-500 bg-green-500/10"
          }`}
        >
          <CardContent className="flex items-center gap-3 py-4">
            <validityStatus.icon className={`h-5 w-5 ${validityStatus.color}`} />
            <div>
              <p className={`font-semibold ${validityStatus.color}`}>{validityStatus.label}</p>
              <p className="text-sm text-muted-foreground">
                Valid from {new Date(mockPermit.validFrom).toLocaleString()} to{" "}
                {new Date(mockPermit.validTo).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {mockPermit.status === "suspended" && mockPermit.suspensionReason && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Ban className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-500">Permit Suspended</p>
                <p className="text-sm text-muted-foreground">
                  Suspended by {mockPermit.suspendedBy} on{" "}
                  {mockPermit.suspendedAt && new Date(mockPermit.suspendedAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm italic">Reason: {mockPermit.suspensionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mockPermit.status === "revoked" && mockPermit.revocationReason && (
        <Card className="border-l-4 border-l-red-500 bg-red-500/10">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold text-red-500">Permit Revoked</p>
                <p className="text-sm text-muted-foreground">
                  Revoked by {mockPermit.revokedBy} on{" "}
                  {mockPermit.revokedAt && new Date(mockPermit.revokedAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm italic">Reason: {mockPermit.revocationReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="hazards">Hazards & Controls</TabsTrigger>
          <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
          <TabsTrigger value="linked">Linked Records</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permit Details</CardTitle>
              <CardDescription>Basic information about this work permit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Work Description</p>
                <p className="text-sm">{mockPermit.workDescription}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold">{mockPermit.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contractor</p>
                  <p className="text-sm font-semibold">{mockPermit.contractor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supervisor</p>
                  <p className="text-sm font-semibold">{mockPermit.supervisor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Safety Contact</p>
                  <p className="text-sm font-semibold">{mockPermit.safetyContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Emergency Number</p>
                  <p className="text-sm font-semibold">{mockPermit.emergencyNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created By</p>
                  <p className="text-sm font-semibold">{mockPermit.createdBy}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Required PPE</p>
                <div className="flex flex-wrap gap-2">
                  {mockPermit.ppeRequired.map((ppe) => (
                    <Badge key={ppe} variant="secondary">
                      <Shield className="mr-1 h-3 w-3" />
                      {ppe}
                    </Badge>
                  ))}
                </div>
              </div>

              {mockPermit.additionalPrecautions.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Additional Precautions</p>
                  <ul className="space-y-1 text-sm">
                    {mockPermit.additionalPrecautions.map((precaution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hazards" className="space-y-6">
          {mockPermit.hazards.map((hazard) => (
            <Card key={hazard.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          hazard.severity === "critical"
                            ? "text-red-500"
                            : hazard.severity === "high"
                              ? "text-orange-500"
                              : hazard.severity === "medium"
                                ? "text-amber-500"
                                : "text-green-500"
                        }`}
                      />
                      {hazard.category}
                    </CardTitle>
                    <CardDescription>{hazard.description}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      hazard.severity === "critical"
                        ? "border-red-500 text-red-500"
                        : hazard.severity === "high"
                          ? "border-orange-500 text-orange-500"
                          : hazard.severity === "medium"
                            ? "border-amber-500 text-amber-500"
                            : "border-green-500 text-green-500"
                    }
                  >
                    {hazard.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Control Measures</h3>
                  </div>
                  <ul className="space-y-2">
                    {hazard.controls.map((control, index) => (
                      <li key={index} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{control}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="acknowledgments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Worker Acknowledgments</CardTitle>
                  <CardDescription>
                    All workers must acknowledge they have reviewed and understood this permit
                  </CardDescription>
                </div>
                <Badge variant="secondary">{mockPermit.acknowledgments.length} Acknowledged</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPermit.acknowledgments.map((acknowledgment) => (
                <div key={acknowledgment.id} className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{acknowledgment.workerName}</p>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">{acknowledgment.role}</p>
                      <p className="text-xs text-muted-foreground">
                        Acknowledged: {new Date(acknowledgment.acknowledgedAt).toLocaleString()}
                      </p>
                      {acknowledgment.comments && <p className="mt-2 text-sm italic">"{acknowledgment.comments}"</p>}
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
              <CardDescription>Related JSAs, inspections, and incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPermit.linkedJSAIds && mockPermit.linkedJSAIds.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Job Safety Analyses</p>
                  <div className="space-y-2">
                    {mockPermit.linkedJSAIds.map((jsaId) => (
                      <Link
                        key={jsaId}
                        href={`/jsa/${jsaId}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{jsaId}</p>
                            <p className="text-xs text-muted-foreground">Excavation Work - Utility Trench</p>
                          </div>
                        </div>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {mockPermit.linkedInspectionIds && mockPermit.linkedInspectionIds.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Inspections</p>
                  <div className="space-y-2">
                    {mockPermit.linkedInspectionIds.map((inspectionId) => (
                      <Link
                        key={inspectionId}
                        href={`/inspections/${inspectionId}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{inspectionId}</p>
                            <p className="text-xs text-muted-foreground">Pre-work Site Inspection</p>
                          </div>
                        </div>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Complete history of changes and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTimeline events={mockAuditLog} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showAcknowledgeDialog} onOpenChange={setShowAcknowledgeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Acknowledge Permit</AlertDialogTitle>
            <AlertDialogDescription>
              By acknowledging this permit, you confirm that you have reviewed and understood all hazards, controls, and
              safety requirements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ack-comments">Comments (optional)</Label>
            <Textarea
              id="ack-comments"
              value={acknowledgmentComments}
              onChange={(e) => setAcknowledgmentComments(e.target.value)}
              placeholder="Any additional comments..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>I Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Permit</AlertDialogTitle>
            <AlertDialogDescription>
              Suspending this permit will temporarily halt all authorized work. The permit can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason for Suspension *</Label>
            <Textarea
              id="suspend-reason"
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              placeholder="Explain why the permit is being suspended..."
              rows={3}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Suspend Permit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Permit</AlertDialogTitle>
            <AlertDialogDescription>
              Revoking this permit will permanently cancel authorization. This action cannot be undone and a new permit
              will be required.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="revoke-reason">Reason for Revocation *</Label>
            <Textarea
              id="revoke-reason"
              value={revocationReason}
              onChange={(e) => setRevocationReason(e.target.value)}
              placeholder="Explain why the permit is being revoked..."
              rows={3}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600">Revoke Permit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Work</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this permit as completed when all authorized work is finished and the site has been made safe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Complete Permit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
