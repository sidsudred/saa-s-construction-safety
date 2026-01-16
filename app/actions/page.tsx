"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { CAPARecord, RecordMetadata, WorkflowState } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    Plus,
    CheckCircle2,
    Clock,
    MapPin,
    AlertCircle,
    ChevronRight,
    ClipboardList,
    User,
    ExternalLink,
    ShieldCheck,
    AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function ActionsListPage() {
    const { records } = useSafetyRecordStore()
    const [searchTerm, setSearchTerm] = useState("")

    const capaRecords = records.filter((r: RecordMetadata) => r.type === "capa") as unknown as CAPARecord[]
    const filtered = capaRecords.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.actionRequired.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusConfig = (status: WorkflowState) => {
        switch (status) {
            case "open": return { color: "bg-blue-50 text-blue-700 border-blue-100", label: "Open" }
            case "in_progress": return { color: "bg-amber-50 text-amber-700 border-amber-100", label: "In Progress" }
            case "completed": return { color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Completed" }
            case "verified": return { color: "bg-indigo-50 text-indigo-700 border-indigo-100", label: "Verified" }
            case "closed": return { color: "bg-muted text-muted-foreground", label: "Closed" }
            default: return { color: "bg-muted", label: status }
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Corrective Actions (CAPA)</h1>
                    <p className="text-muted-foreground mt-1">Track and verify safety actions triggered by inspections or observations.</p>
                </div>
                <Link href="/actions/new">
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                        <Plus className="h-4 w-4" />
                        New Action
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search actions, records, or owners..."
                        className="pl-9 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 h-11">
                        <Filter className="h-4 w-4" />
                        Priority
                    </Button>
                    <Button variant="outline" className="gap-2 h-11">
                        Status
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filtered.length === 0 ? (
                    <Card className="border-dashed py-24 bg-muted/5">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-50 rounded-full p-4 mb-4 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                                <ClipboardList className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-lg">No corrective actions found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                All safety actions have been cleared. New actions appear here when inspections fail or unsafe observations are reported.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map((record) => {
                        const isOverdue = record.dueDate && new Date(record.dueDate) < new Date() && record.status !== "closed"
                        const statusCfg = getStatusConfig(record.status)

                        return (
                            <Link key={record.id} href={`/actions/${record.id}`}>
                                <Card className={cn(
                                    "hover:border-slate-400 transition-all cursor-pointer group shadow-sm bg-card overflow-hidden",
                                    isOverdue ? "border-l-4 border-l-red-500" : "border-l-4 border-l-slate-300"
                                )}>
                                    <CardContent className="p-0">
                                        <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{record.recordNumber}</span>
                                                    <Badge variant="outline" className={cn("text-[9px] uppercase font-bold py-0 h-5", statusCfg.color)}>
                                                        {statusCfg.label}
                                                    </Badge>
                                                    {isOverdue && (
                                                        <Badge className="bg-red-500 hover:bg-red-600 text-white h-5 text-[9px] uppercase gap-1">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <ExternalLink className="h-2.5 w-2.5" />
                                                        From: {record.originatingRecordNumber}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-lg group-hover:text-slate-900 transition-colors">{record.title}</h3>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5" /> {record.assignee}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" /> {record.location}
                                                    </span>
                                                    <span className={cn(
                                                        "flex items-center gap-1.5",
                                                        isOverdue ? "text-red-600 font-bold" : ""
                                                    )}>
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Due: {record.dueDate ? new Date(record.dueDate).toLocaleDateString() : "No Date"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 lg:border-l lg:pl-6 border-border shrink-0">
                                                {record.evidenceRequired && record.status === "completed" && (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 gap-1.5 text-[9px] uppercase font-bold px-3">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                        Verification Ready
                                                    </Badge>
                                                )}
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-slate-900 transition-colors" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}
