"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { PermitRecord, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { PermitValidityBanner } from "@/components/permits/permit-validity-banner"
import { PermitActions } from "@/components/permits/permit-actions"
import { WorkerRoster } from "@/components/jsa/worker-roster"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldAlert,
  MapPin,
  Clock,
  User,
  FileText,
  LayoutGrid,
  AlertCircle,
  CheckCircle2,
  HardHat,
  Construction
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PermitDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

  const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as PermitRecord

  const handleStatusChange = (newStatus: WorkflowState) => {
    if (!currentRecord) return

    updateRecord(id, { status: newStatus })

    addAuditLog(id, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Safety Officer",
      action: "status_change",
      fromStatus: currentRecord.status,
      toStatus: newStatus,
      details: `Changed permit status to ${newStatus}`
    })
  }

  const handlePermitAction = (action: "suspend" | "revoke" | "reinstate", reason?: string) => {
    if (!currentRecord) return

    let newStatus: WorkflowState = currentRecord.status
    let logAction = ""
    let logDetail = ""

    if (action === "suspend") {
      newStatus = "suspended"
      logAction = "permit_suspended"
      logDetail = `Permit suspended. Reason: ${reason}`
      updateRecord(id, { status: newStatus, suspensionReason: reason })
    } else if (action === "revoke") {
      newStatus = "revoked"
      logAction = "permit_revoked"
      logDetail = `Permit revoked. Reason: ${reason}`
      updateRecord(id, { status: newStatus, revocationReason: reason })
    } else if (action === "reinstate") {
      newStatus = "approved"
      logAction = "permit_reinstated"
      logDetail = "Permit reinstated after suspension review."
      updateRecord(id, { status: newStatus, suspensionReason: undefined })
    }

    addAuditLog(id, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Safety Officer",
      action: logAction,
      fromStatus: currentRecord.status,
      toStatus: newStatus,
      details: logDetail
    })
  }

  const handleSign = (workerId: string) => {
    if (!currentRecord) return

    const updatedRoster = currentRecord.workerAcknowledgments.map(w =>
      w.id === workerId ? { ...w, signed: true, timestamp: new Date().toISOString() } : w
    )

    updateRecord(id, { workerAcknowledgments: updatedRoster } as any)

    const worker = currentRecord.workerAcknowledgments.find(w => w.id === workerId)
    addAuditLog(id, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: worker?.name || "Worker",
      action: "signed_permit",
      details: `${worker?.name} acknowledged the permit controls and hazards.`
    })
  }

  if (!currentRecord) {
    return <div className="p-20 text-center text-muted-foreground">Loading permit record...</div>
  }

  const summaryContent = (
    <div className="space-y-8">
      {/* Validity Banner */}
      <PermitValidityBanner permit={currentRecord} />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Permit Scope
        </h3>
        <PermitActions permit={currentRecord} onAction={handlePermitAction} />
      </div>

      <p className="text-muted-foreground leading-relaxed italic bg-muted/10 p-4 rounded-xl border border-dashed border-border/50">
        {currentRecord.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-none bg-background">
          <CardHeader className="pb-2 border-b border-border/50 bg-muted/5">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5" />
              Hazards & Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {currentRecord.hazards?.map((hazard, i) => (
              <div key={i} className="flex gap-2 items-center text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                {hazard}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-none bg-background">
          <CardHeader className="pb-2 border-b border-border/50 bg-muted/5">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Safety Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {currentRecord.controls?.map((control, i) => (
              <div key={i} className="flex gap-2 items-center text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                {control}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
          <HardHat className="h-4 w-4" />
          PPE Requirements
        </h4>
        <div className="flex flex-wrap gap-2">
          {currentRecord.ppeRequirements?.map((ppe, i) => (
            <Badge key={i} variant="secondary" className="bg-muted/30 border-border text-foreground py-1 px-3">
              {ppe}
            </Badge>
          ))}
        </div>
      </div>

      {currentRecord.isolationRequired && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-4 dark:bg-orange-900/10 dark:border-orange-900/30">
          <Construction className="h-6 w-6 text-orange-600 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wide">Isolation Isolation Required</p>
            <p className="text-xs text-orange-700/80 dark:text-orange-500 font-medium leading-relaxed">
              {currentRecord.isolationDetails || "Contact electrical team for LOTO procedure before work starts."}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <RecordDetail
      record={currentRecord}
      auditLogs={auditLogs[id] || []}
      evidence={[]}
      linkedRecords={[]}
      onStatusChange={handleStatusChange}
      moduleName="Permits"
      modulePath="/permits"
      summaryContent={summaryContent}
      findingsContent={
        <WorkerRoster
          roster={currentRecord.workerAcknowledgments || []}
          onSign={handleSign}
        />
      }
      linkedContent={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Related Incident History</h3>
            <Badge variant="outline">Site Zone: {currentRecord.location}</Badge>
          </div>
          <Card className="border-border/40 bg-muted/5 border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground italic">No related incidents found within this permit's work zone in the last 30 days.</p>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}
