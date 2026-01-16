"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { SiteDiaryRecord, WorkflowState, RecordMetadata } from "@/lib/types/safety-record"
import { RecordDetail } from "@/components/records/record-detail"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    CloudSun,
    Users,
    Briefcase,
    MapPin,
    Clock,
    User,
    Thermometer,
    CloudRain,
    Activity,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SiteDiaryDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { records, auditLogs, updateRecord, addAuditLog } = useSafetyRecordStore()

    const currentRecord = records.find((r: RecordMetadata) => r.id === id) as unknown as SiteDiaryRecord

    const handleStatusChange = (newStatus: WorkflowState) => {
        if (!currentRecord) return
        updateRecord(id, { status: newStatus })
    }

    if (!currentRecord) {
        return <div className="p-20 text-center text-muted-foreground">Loading site diary...</div>
    }

    const summaryContent = (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-50/50 border-emerald-100 shadow-none dark:bg-emerald-950/20 dark:border-emerald-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
                            <CloudSun className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Weather</p>
                            <p className="font-bold text-lg">{currentRecord.weatherMain}</p>
                            <p className="text-xs font-semibold text-emerald-600">{currentRecord.temperature}°C</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50/50 border-blue-100 shadow-none dark:bg-blue-950/20 dark:border-blue-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Personnel</p>
                            <p className="font-bold text-lg">{currentRecord.totalWorkers} Staff</p>
                            <p className="text-xs font-semibold text-blue-600">Site-wide Total</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 shadow-none dark:bg-slate-900/40 dark:border-slate-800">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-slate-200 text-slate-600 dark:bg-slate-800">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project Date</p>
                            <p className="font-bold text-lg">{new Date(currentRecord.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Daily Log Feed
                </h3>
                <div className="space-y-4">
                    {currentRecord.entries?.map((entry) => (
                        <div key={entry.id} className="relative pl-8 before:absolute before:left-3 before:top-4 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                            <div className={cn(
                                "absolute left-1 top-4 h-4 w-4 rounded-full border-2 border-background z-10",
                                entry.category === "safety" ? "bg-amber-500" : "bg-emerald-500"
                            )} />
                            <Card className="border-border/50 shadow-none hover:border-border transition-colors">
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4">
                                            {entry.category.replace("_", " ")}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Posted by {entry.author}</span>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="text-sm text-foreground/90 leading-relaxed font-semibold">
                                        {entry.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
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
            moduleName="Site Diaries"
            modulePath="/site-diaries"
            summaryContent={summaryContent}
            findingsContent={
                <div className="p-12 text-center text-muted-foreground bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
                    <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-widest mb-1">Resource & Progress Tracking</p>
                    <p className="text-xs max-w-xs mx-auto">This section tracks plant equipment utilized and subcontractor progress. Coming in Phase 2.</p>
                </div>
            }
            linkedContent={
                <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60 mb-4 px-2">Records issued today</p>
                    <div className="grid gap-3">
                        <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">PRM-1025</p>
                                    <p className="text-sm font-bold">Hot Work Authorization</p>
                                </div>
                            </div>
                            <Badge className="bg-green-500 text-white text-[9px]">APPROVED</Badge>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
