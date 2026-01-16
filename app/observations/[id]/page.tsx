"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { ObservationRecord, WorkflowState, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Eye,
    MapPin,
    Clock,
    User,
    Tag,
    CheckCircle2,
    AlertTriangle,
    Zap,
    ShieldCheck,
    MessageSquare,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ObservationDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

    const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as ObservationRecord

    const handleStatusChange = (newStatus: WorkflowState) => {
        if (!currentRecord) return

        updateRecord(id, { status: newStatus })

        addAuditLog(id, {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: "Safety Inspector",
            action: "status_change",
            fromStatus: currentRecord.status,
            toStatus: newStatus,
            details: `Observation ${newStatus}`
        })
    }

    if (!currentRecord) {
        return <div className="p-20 text-center text-muted-foreground">Loading observation...</div>
    }

    const getTypeConfig = (type: string) => {
        switch (type) {
            case "positive": return { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-600 bg-green-50 border-green-100", label: "Positive" }
            case "unsafe_act": return { icon: <Zap className="h-5 w-5" />, color: "text-amber-600 bg-amber-50 border-amber-100", label: "Unsafe Act" }
            case "unsafe_condition": return { icon: <AlertTriangle className="h-5 w-5" />, color: "text-red-600 bg-red-50 border-red-100", label: "Unsafe Condition" }
            case "near_miss": return { icon: <Eye className="h-5 w-5" />, color: "text-indigo-600 bg-indigo-50 border-indigo-100", label: "Near Miss" }
            default: return { icon: <Tag className="h-5 w-5" />, color: "bg-muted", label: type }
        }
    }

    const config = getTypeConfig(currentRecord.observationType)

    const summaryContent = (
        <div className="space-y-8">
            <div className={cn("p-6 rounded-2xl border-2 border-l-8 transition-all", config.color)}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {config.icon}
                        <span className="font-black uppercase tracking-widest text-sm">{config.label} Observation</span>
                    </div>
                    <Badge variant="outline" className="border-current opacity-60">
                        {currentRecord.category}
                    </Badge>
                </div>
                <p className="text-xl font-bold leading-tight mb-2">{currentRecord.title}</p>
                <div className="flex items-center gap-4 text-xs font-bold opacity-70">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {currentRecord.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(currentRecord.createdAt).toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Description & Context
                </h3>
                <Card className="border-border/50 shadow-none bg-muted/5">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {currentRecord.description}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {currentRecord.actionTaken && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-green-700">
                        <ShieldCheck className="h-5 w-5" />
                        Immediate Action Taken
                    </h3>
                    <div className="p-5 rounded-2xl bg-green-50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400 italic">
                            "{currentRecord.actionTaken}"
                        </p>
                    </div>
                </div>
            )}

            {currentRecord.capaCreated && (
                <div className="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Formal Corrective Action Produced</p>
                            <p className="font-bold">Follow up on CAPA #{currentRecord.capaId?.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
            moduleName="Observations"
            modulePath="/observations"
            summaryContent={summaryContent}
            findingsContent={
                <div className="p-12 text-center text-muted-foreground space-y-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto opacity-50">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium max-w-xs mx-auto">This observation is being reviewed by the site safety team for impact analysis.</p>
                </div>
            }
            linkedContent={
                <div className="space-y-4">
                    {currentRecord.capaCreated ? (
                        <Link href={`/actions/${currentRecord.capaId}`}>
                            <Card className="border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-none">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-700">Linked Corrective Action</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{currentRecord.capaId}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white text-[9px]">ACTIVE</Badge>
                                </CardContent>
                            </Card>
                        </Link>
                    ) : (
                        <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground bg-muted/5">
                            <p className="text-sm">No linked actions found.</p>
                            <Button variant="outline" size="sm" className="mt-4 border-dashed">Start Action (CAPA)</Button>
                        </div>
                    )}
                </div>
            }
        />
    )
}
