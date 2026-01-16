"use client"

import { InductionRecord } from "@/lib/types/safety-record"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, MapPin, Users, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InductionsListProps {
    inductions: InductionRecord[]
}

export function InductionsList({ inductions }: InductionsListProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inductions.map((ind) => (
                <Card key={ind.id} className="overflow-hidden border-border/60 hover:border-indigo-400 transition-all shadow-sm">
                    <div className="flex h-full">
                        <div className="w-2 bg-indigo-500" />
                        <div className="flex-1 flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest py-0 bg-indigo-50 text-indigo-700 border-indigo-100">
                                        Template Based
                                    </Badge>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">IND-REF: {ind.templateName.slice(0, 4).toUpperCase()}</span>
                                </div>
                                <CardTitle className="text-xl font-bold">{ind.title}</CardTitle>
                                <CardDescription className="flex items-center gap-4 text-xs mt-1">
                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {ind.location}</span>
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Valid for {ind.validityYears} Year</span>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6 flex-1">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Completion Rate</p>
                                        <span className="text-sm font-black text-indigo-600">{ind.completionRate}%</span>
                                    </div>
                                    <Progress value={ind.completionRate} className="h-2 bg-indigo-100" />
                                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tight px-0.5">
                                        <span>42 Completed</span>
                                        <span>8 Pending</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Compliant
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto h-8 text-[10px] uppercase font-bold tracking-widest gap-2 hover:bg-indigo-50 hover:text-indigo-600">
                                        Manage Template
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
