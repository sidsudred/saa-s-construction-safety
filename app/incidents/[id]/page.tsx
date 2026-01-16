"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { IncidentRecord, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { EscalationBanner } from "@/components/incidents/escalation-banner"
import { InvestigationSection } from "@/components/incidents/investigation-section"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShieldAlert, History, Link as LinkIcon, FileText, LayoutGrid, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function IncidentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

  const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as IncidentRecord

  const handleStatusChange = (newStatus: WorkflowState) => {
    if (!currentRecord) return

    updateRecord(id, { status: newStatus })

    addAuditLog(id, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "John Doe",
      action: "status_change",
      fromStatus: currentRecord.status,
      toStatus: newStatus,
      details: `Changed status to ${newStatus}`
    })
  }

  if (!currentRecord) {
    return <div className="p-20 text-center text-muted-foreground">Loading incident record...</div>
  }

  const summaryContent = (
    <div className="space-y-8">
      {/* Escalation Banner */}
      <EscalationBanner severity={currentRecord.severity} />

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Incident Details
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {currentRecord.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline" className="font-bold hover:bg-transparent capitalize">{currentRecord.incidentType.replace("_", " ")}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-bold">{currentRecord.dateOfOccurrence} @ {currentRecord.timeOfOccurrence}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Severity</span>
              <span className="font-bold capitalize">{currentRecord.severity}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Immediate Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <Info className="h-3.5 w-3.5 mt-0.5 text-blue-500" />
              <p>Area secured and taped off immediately after incident.</p>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <Info className="h-3.5 w-3.5 mt-0.5 text-blue-500" />
              <p>First aid administered to all involved personnel.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const linkedContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Linked Records</h3>
        <Button variant="outline" size="sm">Link Existing</Button>
      </div>

      <div className="grid gap-4">
        <Card className="border-border/40 hover:bg-muted/10 transition-colors pointer-cursor">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">JSA-2026-102</p>
                <p className="text-sm font-semibold">Crane Lifting Operations - Sector B</p>
              </div>
            </div>
            <Badge>ACTIVE</Badge>
          </CardContent>
        </Card>
        <Card className="border-border/40 hover:bg-muted/10 transition-colors pointer-cursor">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">INS-2026-942</p>
                <p className="text-sm font-semibold">Weekly Site Walkthrough - Quarter 1</p>
              </div>
            </div>
            <Badge variant="outline">COMPLETED</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <RecordDetail
      record={currentRecord}
      auditLogs={auditLogs[id] || []}
      evidence={[]}
      linkedRecords={[]}
      onStatusChange={handleStatusChange}
      moduleName="Incidents"
      modulePath="/incidents"
      summaryContent={summaryContent}
      findingsContent={<InvestigationSection incident={currentRecord} />}
      linkedContent={linkedContent}
    />
  )
}
