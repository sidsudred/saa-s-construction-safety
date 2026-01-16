"use client"

import { AuditLogEntry } from "@/lib/types/safety-record"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface AuditTimelineProps {
    logs: AuditLogEntry[]
}

export function AuditTimeline({ logs }: AuditTimelineProps) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No audit history available
            </div>
        )
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {logs.map((log, index) => (
                <div key={log.id} className="relative flex items-start gap-6 pl-1">
                    <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10 ring-4 ring-background">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {log.user.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex flex-col gap-1 pt-1 pb-4 border-b border-border w-full">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm">{log.user}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-foreground">
                            <span className="font-medium text-primary capitalize">{log.action}</span>
                            {log.details && <span className="text-muted-foreground">: {log.details}</span>}
                        </p>
                        {(log.fromStatus || log.toStatus) && (
                            <div className="flex items-center gap-2 mt-2">
                                {log.fromStatus && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {log.fromStatus}
                                    </span>
                                )}
                                {log.fromStatus && log.toStatus && (
                                    <span className="text-xs text-muted-foreground">→</span>
                                )}
                                {log.toStatus && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                        {log.toStatus}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
