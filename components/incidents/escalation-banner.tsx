"use client"

import { IncidentSeverity } from "@/lib/types/safety-record"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ShieldAlert, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface EscalationBannerProps {
    severity: IncidentSeverity
    onEscalate?: () => void
}

export function EscalationBanner({ severity, onEscalate }: EscalationBannerProps) {
    const isHighSeverity = ["serious", "major", "critical", "fatality"].includes(severity)

    if (!isHighSeverity) return null

    const banners: Record<string, { color: string, icon: React.ReactNode, title: string, description: string }> = {
        serious: {
            color: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-900/30 dark:text-orange-400",
            icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
            title: "Immediate Reporting Required",
            description: "This incident is marked as SERIOUS. Site supervisors have been notified."
        },
        major: {
            color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400",
            icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
            title: "Escalated: Major Incident",
            description: "External emergency services and corporate safety team must be engaged immediately."
        },
        critical: {
            color: "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/40 dark:border-red-800 dark:text-red-300 shadow-lg",
            icon: <Zap className="h-6 w-6 text-red-600 animate-pulse" />,
            title: "CRITICAL SAFETY ALERT",
            description: "Total site shutdown initiated. All personnel must muster. Regulatory bodies briefed."
        },
        fatality: {
            color: "bg-slate-900 border-slate-700 text-slate-100 shadow-2xl",
            icon: <Zap className="h-6 w-6 text-red-500 animate-pulse" />,
            title: "CATASTROPHIC EVENT",
            description: "Legal and trauma teams mobilized. Site is a secured investigation scene."
        }
    }

    const config = banners[severity] || banners.serious

    return (
        <Alert className={cn("border-l-4 mb-6 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500", config.color)}>
            <div className="flex items-start gap-4">
                <div className="mt-1">{config.icon}</div>
                <div className="flex-1">
                    <AlertTitle className="font-bold text-lg mb-1">{config.title}</AlertTitle>
                    <AlertDescription className="text-sm font-medium opacity-90">
                        {config.description}
                    </AlertDescription>
                </div>
            </div>
        </Alert>
    )
}
