"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "@/components/shared/status-pill"
import { EvidenceUploader } from "@/components/shared/evidence-uploader"
import { AuditTimeline } from "@/components/shared/audit-timeline"
import { WorkflowActions } from "@/components/shared/workflow-actions"
import { createAuditLogEntry, type AuditLogEntry } from "@/lib/utils/workflow"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { InspectionRecord, InspectionItem, RecordStatus } from "@/lib/types/inspection"
import { capaStore } from "@/lib/store/capa-store"
import { useRouter } from "next/navigation"

const mockInspection: InspectionRecord = {
  id: "2",
  recordNumber: "INS-2024-046",
  title: "Electrical safety inspection",
  type: "inspection",
  inspectionType: "routine",
  status: "under_review",
  priority: "high",
  owner: "Mike Johnson",
  assignee: "Sarah Williams",
  inspectorName: "Mike Johnson",
  createdAt: "2024-12-10",
  updatedAt: "2024-12-11",
  submittedAt: "2024-12-10",
  inspectionDate: "2024-12-10",
  location: "Site A - Zone 1",
  description: "Monthly electrical systems safety inspection",
  items: [],
  overallResult: "fail",
  failedItemsCount: 3,
  passRate: 87.5,
}

const mockInspectionItems: InspectionItem[] = [
  {
    id: "1",
    section: "Electrical Panels",
    item: "Panel covers secured",
    requirement: "All electrical panel covers must be properly closed and secured",
    result: "pass",
    notes: "All panels properly secured",
  },
  {
    id: "2",
    section: "Electrical Panels",
    item: "Panel labeling",
    requirement: "All panels must have clear circuit labeling",
    result: "fail",
    notes: "Panel 3B missing circuit labels",
    severity: "medium",
    photos: ["photo1.jpg"],
  },
  {
    id: "3",
    section: "Electrical Panels",
    item: "No exposed wiring",
    requirement: "No exposed wiring visible in or around panels",
    result: "fail",
    notes: "Exposed wiring found in Panel 5C - immediate attention required",
    severity: "critical",
    photos: ["photo2.jpg", "photo3.jpg"],
  },
  {
    id: "4",
    section: "Ground Fault Protection",
    item: "GFCI outlets functional",
    requirement: "All GFCI outlets must test functional with test button",
    result: "pass",
    notes: "All 12 GFCI outlets tested successfully",
  },
  {
    id: "5",
    section: "Ground Fault Protection",
    item: "GFCI protection in wet areas",
    requirement: "All outlets in wet areas must have GFCI protection",
    result: "fail",
    notes: "Outlet near water fountain in break room lacks GFCI protection",
    severity: "high",
  },
  {
    id: "6",
    section: "Extension Cords & Cables",
    item: "Cord condition",
    requirement: "No damaged or frayed cords in use",
    result: "pass",
    notes: "All cords inspected, 2 damaged cords removed from service",
  },
  {
    id: "7",
    section: "Extension Cords & Cables",
    item: "Proper cord usage",
    requirement: "Extension cords not used as permanent wiring",
    result: "conditional",
    notes: "One extension cord being used long-term, to be replaced with permanent outlet",
    severity: "low",
  },
  {
    id: "8",
    section: "Lighting",
    item: "Emergency lighting functional",
    requirement: "All emergency lights must be operational",
    result: "pass",
    notes: "All emergency lights tested and functional",
  },
]

interface InspectionDetailProps {
  inspectionId: string
}

export function InspectionDetail({ inspectionId }: InspectionDetailProps) {
  const [currentTab, setCurrentTab] = useState("findings")
  const [status, setStatus] = useState<RecordStatus>(mockInspection.status)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: "1",
      timestamp: mockInspection.createdAt,
      user: mockInspection.owner,
      action: "Created inspection",
      toStatus: "draft",
    },
    {
      id: "2",
      timestamp: mockInspection.submittedAt || mockInspection.createdAt,
      user: mockInspection.owner,
      action: "Submitted for review",
      fromStatus: "draft",
      toStatus: "submitted",
    },
    {
      id: "3",
      timestamp: mockInspection.updatedAt,
      user: mockInspection.assignee,
      action: "Started review",
      fromStatus: "submitted",
      toStatus: "under_review",
    },
  ])

  const router = useRouter()
  const [linkedCapas, setLinkedCapas] = useState<any[]>([])

  const userRole = "safety_officer"

  useState(() => {
    const updateLinkedCapas = () => {
      setLinkedCapas(capaStore.getBySourceRecord(mockInspection.recordNumber))
    }
    updateLinkedCapas()
    const unsubscribe = capaStore.subscribe(updateLinkedCapas)
    return unsubscribe
  }, [])

  const handleTransition = (newStatus: RecordStatus, comment?: string) => {
    const currentUser = "Current User"
    const entry = createAuditLogEntry(currentUser, `Changed status to ${newStatus}`, status, newStatus, comment)
    setStatus(newStatus)
    setAuditLog([...auditLog, entry])
  }

  const handleCreateCapaFromItem = (item: InspectionItem) => {
    const newCapa = {
      id: String(Date.now()),
      capaNumber: `CAPA-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      title: `Address inspection finding: ${item.item}`,
      description: `Corrective action required for failed inspection item in ${item.section}`,
      type: "corrective" as const,
      priority: item.severity === "critical" ? "critical" : item.severity === "high" ? "high" : "medium",
      status: "draft" as const,
      owner: "Current User",
      assignee: "Current User",
      verifier: "Safety Manager",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      problemDescription: `${item.requirement}\n\nInspection Notes: ${item.notes}`,
      rootCause: "To be determined during investigation",
      actionSteps: [],
      sourceRecordId: mockInspection.recordNumber,
      sourceRecordType: "inspection",
    }

    capaStore.add(newCapa)
    router.push(`/capa/${newCapa.id}`)
  }

  const canEdit = ["draft", "submitted"].includes(status)
  const canSubmit = status === "draft"
  const canApprove = status === "under_review" && ["manager", "admin"].includes(userRole)

  const getResultBadge = (result: InspectionItem["result"]) => {
    switch (result) {
      case "pass":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            {/* Pass icon */}
            Pass
          </Badge>
        )
      case "fail":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
            {/* Fail icon */}
            Fail
          </Badge>
        )
      case "conditional":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            {/* Conditional icon */}
            Conditional
          </Badge>
        )
      case "na":
        return <Badge variant="outline">N/A</Badge>
    }
  }

  const getSeverityBadge = (severity?: InspectionItem["severity"]) => {
    if (!severity) return null
    const colors = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-warning/10 text-warning",
      high: "bg-orange-500/10 text-orange-500",
      critical: "bg-destructive/10 text-destructive",
    }
    return <Badge className={colors[severity]}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</Badge>
  }

  const failedItems = mockInspectionItems.filter((item) => item.result === "fail")
  const conditionalItems = mockInspectionItems.filter((item) => item.result === "conditional")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inspections">{/* ArrowLeft icon */}</Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockInspection.recordNumber}</h1>
              <StatusPill status={status} />
            </div>
            <p className="text-muted-foreground">{mockInspection.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline">
              {/* Edit icon */}
              Edit
            </Button>
          )}
          <WorkflowActions
            currentStatus={status}
            userRole={userRole}
            onTransition={handleTransition}
            auditLog={auditLog}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {/* MoreVertical icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Print Inspection</DropdownMenuItem>
              <DropdownMenuItem>Export PDF</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Result</p>
                <div className="mt-2">
                  {mockInspection.overallResult === "pass" && (
                    <Badge className="bg-success/10 text-success">
                      {/* CheckCircle icon */}
                      Pass
                    </Badge>
                  )}
                  {mockInspection.overallResult === "fail" && (
                    <Badge className="bg-destructive/10 text-destructive">
                      {/* XCircle icon */}
                      Fail
                    </Badge>
                  )}
                  {mockInspection.overallResult === "conditional" && (
                    <Badge className="bg-warning/10 text-warning">
                      {/* AlertTriangle icon */}
                      Conditional
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="mt-2 text-3xl font-bold">{mockInspection.passRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Failed Items</p>
            <p className="mt-2 text-3xl font-bold text-destructive">{mockInspection.failedItemsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="mt-2 text-3xl font-bold">{mockInspectionItems.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="findings">
            Findings
            {failedItems.length > 0 && (
              <Badge className="ml-2 bg-destructive/20 text-destructive">{failedItems.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="linked">
            Linked Records
            {linkedCapas.length > 0 && <Badge className="ml-2">{linkedCapas.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="space-y-6">
          {failedItems.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  {/* AlertTriangle icon */}
                  Failed Items Require Attention
                </CardTitle>
                <CardDescription>
                  {failedItems.length} item{failedItems.length !== 1 && "s"} failed inspection - create CAPA actions to
                  address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {failedItems.map((item) => (
                    <div key={item.id} className="rounded-lg border border-destructive/20 bg-card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.item}</p>
                            {getSeverityBadge(item.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.requirement}</p>
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                          {item.photos && item.photos.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {/* Camera icon */}
                              {item.photos.length} photo{item.photos.length !== 1 && "s"} attached
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleCreateCapaFromItem(item)}>
                          {/* Plus icon */}
                          Create CAPA
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {conditionalItems.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  {/* AlertTriangle icon */}
                  Conditional Items
                </CardTitle>
                <CardDescription>
                  {conditionalItems.length} item{conditionalItems.length !== 1 && "s"} passed with conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conditionalItems.map((item) => (
                    <div key={item.id} className="rounded-lg border border-warning/20 bg-card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.item}</p>
                            {getSeverityBadge(item.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.requirement}</p>
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          {/* Plus icon */}
                          Create CAPA
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Inspection Items</CardTitle>
              <CardDescription>Complete inspection checklist results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Photos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInspectionItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={
                        item.result === "fail"
                          ? "bg-destructive/5 hover:bg-destructive/10"
                          : item.result === "conditional"
                            ? "bg-warning/5 hover:bg-warning/10"
                            : ""
                      }
                    >
                      <TableCell className="font-medium">{item.section}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{getResultBadge(item.result)}</TableCell>
                      <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.notes || "-"}</TableCell>
                      <TableCell>
                        {item.photos && item.photos.length > 0 ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {/* Camera icon */}
                            {item.photos.length}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>Basic information about this inspection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inspection Type</p>
                  <p className="text-sm font-semibold capitalize">{mockInspection.inspectionType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inspector</p>
                  <p className="text-sm font-semibold">{mockInspection.inspectorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold">{mockInspection.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inspection Date</p>
                  <p className="text-sm font-semibold">{mockInspection.inspectionDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner</p>
                  <p className="text-sm font-semibold">{mockInspection.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignee</p>
                  <p className="text-sm font-semibold">{mockInspection.assignee}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm leading-relaxed">{mockInspection.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <EvidenceUploader />
        </TabsContent>

        <TabsContent value="linked" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked CAPA Actions</CardTitle>
              <CardDescription>Corrective actions created from inspection findings</CardDescription>
            </CardHeader>
            <CardContent>
              {linkedCapas.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No linked CAPA actions yet</p>
                  <p className="text-xs">Create CAPA actions from failed inspection items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {linkedCapas.map((capa) => (
                    <div
                      key={capa.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/capa/${capa.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          {/* ClipboardCheck icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5 text-primary"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium">{capa.capaNumber}</p>
                          <p className="text-sm font-medium">{capa.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <StatusPill status={capa.status} />
                            <Badge variant="outline" className="text-xs">
                              {capa.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditTimeline entries={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
