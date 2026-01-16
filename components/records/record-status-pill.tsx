"use client"

import { WorkflowState } from "@/lib/types/safety-record"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RecordStatusPillProps {
    status: WorkflowState
    className?: string
}

const statusConfig: Record<WorkflowState, { label: string, className: string }> = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
    submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
    under_review: { label: "Under Review", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
    approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" },
    closed: { label: "Closed", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
    archived: { label: "Archived", className: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800" },
    open: { label: "Open", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
    in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
    completed: { label: "Completed", className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
    verified: { label: "Verified", className: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800" },
    suspended: { label: "Suspended", className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" },
    revoked: { label: "Revoked", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
}

export function RecordStatusPill({ status, className }: RecordStatusPillProps) {
    const config = statusConfig[status] || statusConfig.draft

    return (
        <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium rounded-full border shadow-none", config.className, className)}>
            {config.label}
        </Badge>
    )
}
