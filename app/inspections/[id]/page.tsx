"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { InspectionRecord, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { RiskScoring } from "@/components/inspections/risk-scoring"
import { InspectionFindings } from "@/components/inspections/inspection-findings"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle, FileText, LayoutGrid } from "lucide-react"

export default function InspectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

  // Find record (mocking for now if not in store)
  const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as InspectionRecord

  const handleStatusChange = (newStatus: WorkflowState) => {
    if (!currentRecord) return

    updateRecord(id, { status: newStatus })

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "John Doe", // Mock current user
      action: "status_change",
      fromStatus: currentRecord.status,
      toStatus: newStatus,
      details: `Changed status from ${currentRecord.status} to ${newStatus}`
    }

    addAuditLog(id, log)
  }

  const handleCreateCapa = (findingId: string) => {
    alert(`Creating CAPA for finding ${findingId}`)
    // In a real app, this would create a new CAPA record and link it
  }

  if (!currentRecord) {
    return <div className="p-20 text-center">Loading inspection record...</div>
  }

  const summaryContent = (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Inspection Overview
        </h3>
        <p className="text-muted-foreground">
          {currentRecord.description || "Comprehensive safety audit covering site operations, equipment safety, and PPE compliance."}
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
              <span className="font-bold">{currentRecord.inspectionType || "Site Safety"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inspector</span>
              <span className="font-bold">{currentRecord.inspector || currentRecord.owner}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority</span>
              <span className="font-bold capitalize">{currentRecord.priority}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Compliance Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <span className="text-lg font-black">{currentRecord.passRate || 0}%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Safe Workspace</p>
              <p className="text-xs text-muted-foreground">8 of 10 checks passed items without major failure.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <RiskScoring
        score={currentRecord.riskScore || 0}
        passRate={currentRecord.passRate || 0}
      />
    </div>
  )

  return (
    <RecordDetail
      record={currentRecord}
      auditLogs={auditLogs[id] || []}
      evidence={[]}
      linkedRecords={[]}
      onStatusChange={handleStatusChange}
      moduleName="Inspections"
      modulePath="/inspections"
      summaryContent={summaryContent}
      findingsContent={
        <InspectionFindings
          findings={currentRecord.findings || []}
          onCreateCapa={handleCreateCapa}
        />
      }
    />
  )
}
