"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { CAPARecord, WorkflowState, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ClipboardList,
    User,
    Calendar,
    Clock,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    ExternalLink,
    MessageSquare,
    FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ActionDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

    const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as CAPARecord

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
            details: `Action transitioned to ${newStatus}`
        })
    }

    if (!currentRecord) {
        return <div className="p-20 text-center text-muted-foreground">Loading action details...</div>
    }

    const isOverdue = currentRecord.dueDate && new Date(currentRecord.dueDate) < new Date() && currentRecord.status !== "closed"

    const summaryContent = (
        <div className="space-y-8">
            {isOverdue && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl dark:bg-red-950/20 dark:border-red-900/40">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <p className="text-sm font-bold text-red-800 dark:text-red-400">
                        ACTION OVERDUE. This corrective action requires immediate attention as the target completion date has passed.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Action Details
                    </h3>
                    <Badge variant="outline" className="h-5 text-[9px] font-bold uppercase tracking-widest bg-muted/20">
                        Linked to {currentRecord.originatingRecordNumber}
                    </Badge>
                </div>

                <Card className="border-border/50 shadow-none rounded-2xl bg-muted/5">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Required Corrective Action</span>
                            <p className="text-lg font-bold leading-relaxed">{currentRecord.actionRequired}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-border/50">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assignee</span>
                                <div className="flex items-center gap-2 font-bold">
                                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                                        {currentRecord.assignee.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    {currentRecord.assignee}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-red-500">Target Date</span>
                                <div className="flex items-center gap-2 font-bold text-red-600">
                                    <Calendar className="h-4 w-4" />
                                    {currentRecord.dueDate ? new Date(currentRecord.dueDate).toLocaleDateString() : "Not set"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</span>
                                <div className="flex items-center gap-2 font-bold">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {currentRecord.location}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Compliance & Evidence
                    </h4>
                    <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Evidence Required</span>
                            <Badge variant={currentRecord.evidenceRequired ? "default" : "secondary"}>
                                {currentRecord.evidenceRequired ? "YES" : "NO"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Escalated Status</span>
                            <Badge variant={currentRecord.isEscalated ? "destructive" : "secondary"} className="h-5">
                                {currentRecord.isEscalated ? "ESCALATED" : "NORMAL"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Source Record
                    </h4>
                    <Link href={`/${currentRecord.originatingRecordType}s/${currentRecord.originatingRecordId}`}>
                        <Card className="border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors shadow-none cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-tight">{currentRecord.originatingRecordNumber}</p>
                                        <p className="text-sm font-bold text-indigo-900 group-hover:underline">Originating {currentRecord.originatingRecordType.charAt(0).toUpperCase() + currentRecord.originatingRecordType.slice(1)}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-indigo-300" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )

    const outcomesContent = (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Completion & Verification
                </h3>
                <Card className="border-border/50 shadow-none">
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action Taken Summary</span>
                            <p className="text-sm mt-1 whitespace-pre-wrap">{currentRecord.completionNotes || "No completion notes submitted yet."}</p>
                        </div>
                        {currentRecord.verificationNotes && (
                            <div className="pt-4 border-t border-border/50">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Verification Outcome</span>
                                <p className="text-sm mt-1 whitespace-pre-wrap font-medium">{currentRecord.verificationNotes}</p>
                                <div className="mt-4 flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Verified by {currentRecord.verifiedBy}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {currentRecord.verifiedAt ? new Date(currentRecord.verifiedAt).toLocaleString() : ""}</span>
                                </div>
                            </div>
                        )}
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
            moduleName="Actions"
            modulePath="/actions"
            summaryContent={summaryContent}
            findingsContent={outcomesContent}
            linkedContent={<div className="p-8 text-center text-muted-foreground italic">No related attachments or evidence uploaded for this action yet.</div>}
        />
    )
}
