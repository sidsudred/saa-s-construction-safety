"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { JSARecord, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { TaskBreakdownTable } from "@/components/jsa/task-breakdown-table"
import { WorkerRoster } from "@/components/jsa/worker-roster"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, LayoutGrid, CheckCircle2, ShieldCheck, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function JSADetailPage() {
  const params = useParams()
  const id = params.id as string

  const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

  const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as JSARecord

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
      details: `Changed JSA status to ${newStatus}`
    })
  }

  const handleSign = (workerId: string) => {
    if (!currentRecord) return

    const updatedRoster = currentRecord.roster.map(w =>
      w.id === workerId ? { ...w, signed: true, timestamp: new Date().toISOString() } : w
    )

    updateRecord(id, { roster: updatedRoster } as any)

    const worker = currentRecord.roster.find(w => w.id === workerId)
    addAuditLog(id, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: worker?.name || "Worker",
      action: "signed_roster",
      details: `${worker?.name} signed the JSA acknowledgment.`
    })
  }

  if (!currentRecord) {
    return <div className="p-20 text-center text-muted-foreground">Loading JSA record...</div>
  }

  const summaryContent = (
    <div className="space-y-8">
      {/* Approval Banner if submitted */}
      {currentRecord.status === "submitted" && (
        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-none rounded-xl overflow-hidden mb-8">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg dark:bg-indigo-900/30">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Awaiting Manager Approval</h4>
                <p className="text-sm text-indigo-700/80 dark:text-indigo-400 mt-1">
                  This JSA has been submitted for review. Work cannot commence until it is approved.
                </p>
              </div>
            </div>
            <Button onClick={() => handleStatusChange("approved")} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
              Approve JSA
            </Button>
          </CardContent>
        </Card>
      )}

      {currentRecord.status === "approved" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-xl mb-8 dark:bg-green-950/20 dark:border-green-900/40">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm font-bold text-green-800 dark:text-green-400">
            JSA APPROVED. Task is safe to proceed following specified controls.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Job Scope & Project
        </h3>
        <Card className="border-border/50 shadow-none rounded-xl">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Name</span>
              <p className="font-bold">{currentRecord.projectName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Task Duration</span>
              <p className="font-bold">{currentRecord.dueDate ? `Until ${new Date(currentRecord.dueDate).toLocaleDateString()}` : "Not Specified"}</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Work Description</span>
              <p className="text-sm leading-relaxed text-muted-foreground">{currentRecord.workDescription}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Task Hazard Analysis
          </h3>
          <Badge variant="outline" className="h-5 text-[10px]">OSHA 1910 COMPLIANT</Badge>
        </div>
        <TaskBreakdownTable steps={currentRecord.taskSteps || []} />
      </div>
    </div>
  )

  const linkedContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Associated Permits</h3>
        <Button variant="outline" size="sm">Add Permit Link</Button>
      </div>
      <div className="grid gap-4">
        <Card className="border-border/40 bg-muted/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">HOT-2026-052</p>
                <p className="text-sm font-semibold">Hot Work Permit - Welding</p>
              </div>
            </div>
            <Badge variant="outline" className="h-5 text-[9px] border-green-500 text-green-600 bg-green-50">ACTIVE</Badge>
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
      moduleName="Job Safety Analysis"
      modulePath="/jsa"
      summaryContent={summaryContent}
      findingsContent={<WorkerRoster roster={currentRecord.roster || []} onSign={handleSign} />}
      linkedContent={linkedContent}
    />
  )
}
