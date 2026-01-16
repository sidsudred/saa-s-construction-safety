"use client"

import { IncidentRecord, InvestigationTimelineEvent } from "@/lib/types/safety-record"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, BookOpen, AlertCircle, CheckCircle2, MoreHorizontal, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvestigationSectionProps {
    incident: IncidentRecord
}

export function InvestigationSection({ incident }: InvestigationSectionProps) {
    return (
        <div className="space-y-8">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/50 bg-muted/20">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                        <Badge variant={incident.investigationStatus === "complete" ? "outline" : "secondary"} className={cn(incident.investigationStatus === "complete" && "border-green-500 text-green-600 bg-green-50")}>
                            {incident.investigationStatus.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-muted/20">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lead Investigator</span>
                        <p className="font-bold text-sm">{incident.investigationLead || "Not Assigned"}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-muted/20">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Witnesses</span>
                        <p className="font-bold text-sm">{incident.witnesses?.length || 0} Recorded</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">Event Timeline</h3>
                    </div>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                        {incident.timeline?.map((event) => (
                            <div key={event.id} className="relative flex items-start pl-8">
                                <div className={cn(
                                    "absolute left-0 mt-1.5 h-5 w-5 rounded-full border-2 border-background ring-2 ring-background z-10",
                                    event.type === "action" ? "bg-blue-500" : event.type === "finding" ? "bg-amber-500" : "bg-slate-400"
                                )} />
                                <div className="flex flex-col gap-1 w-full bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-muted-foreground tabular-nums">
                                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase">{event.type}</Badge>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        ))}
                        {(!incident.timeline || incident.timeline.length === 0) && (
                            <p className="text-sm text-muted-foreground pl-8 py-4">No timeline events recorded yet.</p>
                        )}
                    </div>
                </div>

                {/* Contributing Factors & Root Causes */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <h3 className="font-bold text-lg">Contributing Factors</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {incident.contributingFactors?.map((factor, i) => (
                                <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                                    {factor}
                                </Badge>
                            ))}
                            {(!incident.contributingFactors || incident.contributingFactors.length === 0) && (
                                <p className="text-sm text-muted-foreground italic">No factors identified.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-lg">Root Causes</h3>
                        </div>
                        <ul className="space-y-2">
                            {incident.rootCauses?.map((cause, i) => (
                                <li key={i} className="text-sm flex gap-3 items-start">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                    <span className="font-medium">{cause}</span>
                                </li>
                            ))}
                            {(!incident.rootCauses || incident.rootCauses.length === 0) && (
                                <p className="text-sm text-muted-foreground italic">Root cause analysis pending.</p>
                            )}
                        </ul>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-bold text-lg">Investigator Notes</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic bg-muted/10 p-4 rounded-xl border border-dashed border-border">
                            {incident.investigationNotes || "Initial findings pending detailed interview with site personnel and review of CCTV footage."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
