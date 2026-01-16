"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/shared/status-pill"
import { RiskBadge } from "@/components/shared/risk-badge"
import { EvidenceUploader } from "@/components/shared/evidence-uploader"
import { AuditTimeline } from "@/components/shared/audit-timeline"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RoleGuard } from "@/components/role-simulator/role-guard"
import { WorkflowActions } from "@/components/shared/workflow-actions"
import { createAuditLogEntry, type AuditLogEntry } from "@/lib/utils/workflow"
import type { Incident, RecordStatus } from "@/lib/types/incident"
import { PriorityIndicator } from "@/components/shared/priority-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  CheckCircle,
  LinkIcon,
  FileText,
  ClipboardList,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { incidentTypeLabels, injurySeverityLabels } from "@/lib/types/incident"
import { capaStore } from "@/lib/store/capa-store"
import { useRouter } from "next/navigation"
import { LinkedRecords } from "@/components/shared/linked-records"

const mockIncident: Incident = {
  id: "1",
  recordNumber: "INC-2024-001",
  title: "Near miss with crane operation",
  incidentType: "near_miss",
  severity: "serious",
  status: "under_investigation",
  priority: "high",
  reportedBy: "Mike Johnson",
  assignedTo: "Sarah Williams",
  affectedPersons: ["John Crane Operator"],
  witnesses: ["Tom Anderson", "Emily Brown"],
  incidentDate: "2024-12-10T14:30:00Z",
  reportedDate: "2024-12-10T15:00:00Z",
  location: "Site A - Zone 3",
  description:
    "Crane load swung unexpectedly during high winds, nearly striking worker below. The load was a steel beam weighing approximately 2 tons. Weather conditions deteriorated during the lift with wind speeds increasing from 15 mph to 25 mph gusts. The worker below was approximately 3 meters from the swing path when the load moved.",
  immediateActions:
    "Work stopped immediately. Area cleared and barricaded. Weather conditions assessed. All personnel accounted for. Site supervisor notified. Crane operation suspended pending investigation.",
  linkedPermitId: "PER-2024-023",
  linkedJSAId: "JSA-2024-012",
  linkedInspectionIds: ["INS-2024-045"],
  investigation: {
    investigator: "Sarah Williams",
    startDate: "2024-12-10",
    findings:
      "Preliminary investigation indicates that wind conditions exceeded safe operating limits for the crane configuration and load weight. Pre-lift weather assessment was conducted but conditions changed rapidly. Communication delays between spotter and operator contributed to delayed response.",
    recommendations: [
      "Implement real-time weather monitoring system",
      "Update lift plan procedures to include abort criteria",
      "Enhance communication protocols between crane crew",
      "Conduct additional training on weather-related hazards",
    ],
  },
  createdAt: "2024-12-10T15:05:00Z",
  updatedAt: "2024-12-12T14:20:00Z",
}

const mockLinkedRecords = [
  {
    id: "jsa-1",
    recordNumber: "JSA-2024-012",
    title: "Crane Lifting Operations",
    type: "Job Safety Analysis",
    icon: ClipboardList,
  },
  {
    id: "permit-1",
    recordNumber: "PER-2024-023",
    title: "Crane Operation Permit",
    type: "Work Permit",
    icon: FileText,
  },
  {
    id: "ins-1",
    recordNumber: "INS-2024-045",
    title: "Pre-incident Crane Inspection",
    type: "Inspection",
    icon: ShieldCheck,
  },
]

interface IncidentDetailProps {
  incidentId: string
}

export function IncidentDetail({ incidentId }: IncidentDetailProps) {
  const [currentTab, setCurrentTab] = useState("summary")
  const [investigationFindings, setInvestigationFindings] = useState(mockIncident.investigation?.findings || "")
  const [status, setStatus] = useState<RecordStatus>(mockIncident.status as RecordStatus)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: "1",
      timestamp: mockIncident.createdAt,
      user: mockIncident.reportedBy,
      action: "Created incident report",
      toStatus: "submitted",
    },
    {
      id: "2",
      timestamp: mockIncident.updatedAt,
      user: mockIncident.assignedTo,
      action: "Started investigation",
      fromStatus: "submitted",
      toStatus: "under_review",
    },
  ])

  const userRole = "safety_officer"
  const router = useRouter()
  const [linkedCapas, setLinkedCapas] = useState<any[]>([])

  useEffect(() => {
    const updateLinkedCapas = (): void => {
      setLinkedCapas(capaStore.getBySourceRecord(mockIncident.recordNumber))
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

  const handleCreateCapaFromRecommendation = (recommendation: string, index: number) => {
    const newCapa = {
      id: String(Date.now()),
      capaNumber: `CAPA-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      title: `Incident recommendation ${index + 1}: ${recommendation.substring(0, 50)}...`,
      description: recommendation,
      type: "preventive" as const,
      priority: mockIncident.severity === "critical" ? "critical" : "high",
      status: "draft" as const,
      owner: "Current User",
      assignee: "Current User",
      verifier: "Safety Manager",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      problemDescription: mockIncident.description,
      rootCause: mockIncident.investigation?.findings || "See incident investigation",
      actionSteps: [],
      sourceRecordId: mockIncident.recordNumber,
      sourceRecordType: "incident",
    }

    capaStore.add(newCapa)
    router.push(`/capa/${newCapa.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/incidents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockIncident.recordNumber}</h1>
              <StatusPill status={status} />
              <RiskBadge level={mockIncident.severity} />
            </div>
            <p className="text-muted-foreground">{mockIncident.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RoleGuard allowedRoles={["admin", "safety_officer", "supervisor"]} action="edit" module="Incidents">
            {status === "draft" && (
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </RoleGuard>

          <RoleGuard allowedRoles={["admin", "safety_officer", "supervisor"]} action="edit" module="Incidents">
            <WorkflowActions
              currentStatus={status}
              userRole={userRole}
              onTransition={handleTransition}
              auditLog={auditLog}
            />
          </RoleGuard>

          <RoleGuard allowedRoles={["admin", "safety_officer", "supervisor"]}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <RoleGuard action="export" module="Incidents">
                  <DropdownMenuItem>Print Report</DropdownMenuItem>
                  <DropdownMenuItem>Export PDF</DropdownMenuItem>
                </RoleGuard>
                <RoleGuard allowedRoles={["admin", "safety_officer"]} action="create" module="CAPA">
                  <DropdownMenuItem>Create CAPA from Findings</DropdownMenuItem>
                </RoleGuard>
                <RoleGuard allowedRoles={["admin"]} action="delete" module="Incidents">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Report</DropdownMenuItem>
                </RoleGuard>
              </DropdownMenuContent>
            </DropdownMenu>
          </RoleGuard>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <RoleGuard allowedRoles={["admin", "safety_officer", "supervisor"]} action="view" module="Incidents">
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
          </RoleGuard>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="actions">
            CAPA Actions
            {linkedCapas.length > 0 && <Badge className="ml-2">{linkedCapas.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="linked">Linked Records</TabsTrigger>
          <RoleGuard allowedRoles={["admin", "safety_officer"]}>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </RoleGuard>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Incident Type</p>
                      <Badge variant="secondary" className="mt-1">
                        {incidentTypeLabels[mockIncident.incidentType]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Severity</p>
                      <div className="mt-1">
                        <RiskBadge level={mockIncident.severity} />
                      </div>
                    </div>
                    {mockIncident.injurySeverity && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Injury Severity</p>
                        <Badge variant="destructive" className="mt-1">
                          {injurySeverityLabels[mockIncident.injurySeverity]}
                        </Badge>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold">{mockIncident.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Incident Date</p>
                      <p className="text-sm font-semibold">{new Date(mockIncident.incidentDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reported Date</p>
                      <p className="text-sm font-semibold">{new Date(mockIncident.reportedDate).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm leading-relaxed">{mockIncident.description}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Immediate Actions Taken</p>
                    <p className="text-sm leading-relaxed">{mockIncident.immediateActions}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>People Involved</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affected Person(s)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mockIncident.affectedPersons.map((person, index) => (
                        <Badge key={index} variant="secondary">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Witnesses</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mockIncident.witnesses.map((person, index) => (
                        <Badge key={index} variant="outline">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reported By</p>
                    <p className="text-sm font-semibold">{mockIncident.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                    <p className="text-sm font-semibold">{mockIncident.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <Badge variant="secondary" className="capitalize">
                      {mockIncident.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {mockIncident.investigation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Investigation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Investigator</p>
                      <p className="text-sm font-semibold">{mockIncident.investigation.investigator}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                      <p className="text-sm font-semibold">{mockIncident.investigation.startDate}</p>
                    </div>
                    {mockIncident.investigation.completedDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed Date</p>
                        <p className="text-sm font-semibold">{mockIncident.investigation.completedDate}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="investigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investigation Findings</CardTitle>
              <CardDescription>Document root cause analysis and contributing factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="findings">Investigation Findings</Label>
                <Textarea
                  id="findings"
                  value={investigationFindings}
                  onChange={(e) => setInvestigationFindings(e.target.value)}
                  rows={6}
                  placeholder="Describe the findings from the investigation, including root cause analysis and contributing factors..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="root-cause">Root Cause</Label>
                <Textarea id="root-cause" rows={3} placeholder="Identify the primary root cause of the incident..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributing-factors">Contributing Factors</Label>
                <Textarea
                  id="contributing-factors"
                  rows={3}
                  placeholder="List any contributing factors that led to the incident..."
                />
              </div>

              <Button className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Investigation Findings
              </Button>
            </CardContent>
          </Card>

          {mockIncident.investigation && mockIncident.investigation.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Actions recommended to prevent recurrence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockIncident.investigation.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm leading-relaxed">{recommendation}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateCapaFromRecommendation(recommendation, index)}
                        >
                          Create CAPA Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <EvidenceUploader />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CAPA Actions</CardTitle>
                  <CardDescription>Corrective and preventive actions for this incident</CardDescription>
                </div>
                <Button size="sm" onClick={() => handleCreateCapaFromRecommendation("Manual CAPA creation", 0)}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Create CAPA
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {linkedCapas.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No CAPA actions created yet</p>
                  <p className="text-xs">Create actions from investigation recommendations</p>
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
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium">{capa.capaNumber}</p>
                          <p className="text-sm font-medium">{capa.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <StatusPill status={capa.status} />
                            <PriorityIndicator priority={capa.priority} />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {capa.dueDate}</p>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linked" className="space-y-6">
          <LinkedRecords recordId={mockIncident.id} recordType="incident" />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditTimeline auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
