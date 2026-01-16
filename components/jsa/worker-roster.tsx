"use client"

import { WorkerAcknowledgment } from "@/lib/types/safety-record"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCheck, Signature, CheckCircle2, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkerRosterProps {
    roster: WorkerAcknowledgment[]
    onSign?: (workerId: string) => void
}

export function WorkerRoster({ roster, onSign }: WorkerRosterProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Worker Acknowledgments
                </h3>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {roster.filter(w => w.signed).length} / {roster.length} Signed
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roster.map((worker) => (
                    <Card key={worker.id} className={cn("border-border shadow-none transition-colors", worker.signed ? "bg-green-50/30 border-green-100" : "bg-muted/10")}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-full", worker.signed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground opacity-50")}>
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-none mb-1">{worker.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{worker.role}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                                {worker.signed ? (
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-green-600 uppercase block tracking-widest">Signed</span>
                                        <span className="text-[10px] text-muted-foreground tabular-nums">
                                            {new Date(worker.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1.5 border-dashed hover:bg-primary/5 hover:border-primary"
                                        onClick={() => onSign?.(worker.id)}
                                    >
                                        <Signature className="h-3.5 w-3.5" />
                                        Sign Now
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 dark:bg-blue-900/10 dark:border-blue-900/20">
                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700/80 dark:text-blue-400 leading-relaxed">
                    By signing this document, workers acknowledge they have been briefed on the hazards and controls identified in this JSA and agree to adhere to all safety protocols while performing the task.
                </p>
            </div>
        </div>
    )
}
