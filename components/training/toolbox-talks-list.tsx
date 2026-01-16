"use client"

import { ToolboxTalkRecord } from "@/lib/types/safety-record"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, User, ChevronRight, MessageSquare, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolboxTalksListProps {
    talks: ToolboxTalkRecord[]
}

export function ToolboxTalksList({ talks }: ToolboxTalksListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talks.map((talk) => (
                <Card key={talk.id} className="group hover:border-blue-400 transition-all shadow-sm flex flex-col">
                    <CardHeader className="pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest gap-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-100">
                                <MessageSquare className="h-3.5 w-3.5" />
                                {talk.topic}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{talk.recordNumber}</span>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">{talk.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="flex items-center justify-between py-3 border-y border-border/50">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Facilitator</span>
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    {talk.facilitator}
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Date</span>
                                <div className="flex items-center gap-1.5 text-xs font-semibold justify-end">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    {new Date(talk.sessionDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/40">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-xs font-bold text-slate-700">{talk.attendanceCount} Attendees</span>
                            </div>
                            <div className="flex -space-x-2">
                                {talk.roster.slice(0, 3).map((r, i) => (
                                    <div key={r.id} className="h-6 w-6 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[8px] font-bold">
                                        {r.name[0]}
                                    </div>
                                ))}
                                {talk.attendanceCount > 3 && (
                                    <div className="h-6 w-6 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                        +{talk.attendanceCount - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <div className="px-6 py-4 bg-muted/5 border-t border-border/50 flex items-center justify-end group-hover:bg-blue-50/20 transition-colors">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest hover:text-blue-600 gap-2">
                            View Roster
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
