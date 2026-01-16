"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertTriangle, Calendar, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainingKPIStripProps {
    stats: {
        completed30d: number
        upcoming: number
        expiring30d: number
        expiring60d: number
        expiring90d: number
        overdue: number
    }
}

export function TrainingKPIStrip({ stats }: TrainingKPIStripProps) {
    const kpis = [
        {
            label: "Completed (30d)",
            value: stats.completed30d,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
        },
        {
            label: "Upcoming Training",
            value: stats.upcoming,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100",
        },
        {
            label: "Expiring (30/60/90)",
            value: `${stats.expiring30d}/${stats.expiring60d}/${stats.expiring90d}`,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-100",
        },
        {
            label: "Overdue / Expired",
            value: stats.overdue,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-50 border-red-100",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
                <Card key={kpi.label} className={cn("border-2 shadow-none", kpi.bg)}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                                {kpi.label}
                            </p>
                            <p className={cn("text-2xl font-black tabular-nums", kpi.color)}>
                                {kpi.value}
                            </p>
                        </div>
                        <div className={cn("p-2 rounded-xl bg-white/50", kpi.color)}>
                            <kpi.icon className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
