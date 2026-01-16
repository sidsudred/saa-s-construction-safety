"use client"

import { PermitRecord } from "@/lib/types/safety-record"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface PermitValidityBannerProps {
    permit: PermitRecord
}

export function PermitValidityBanner({ permit }: PermitValidityBannerProps) {
    const [timeRemaining, setTimeRemaining] = useState<string>("")
    const [status, setStatus] = useState<"active" | "warning" | "expired" | "not_active">("active")

    useEffect(() => {
        const updateValidity = () => {
            const now = new Date()
            const start = new Date(permit.validFrom)
            const end = new Date(permit.validUntil)

            if (now < start) {
                setStatus("not_active")
                setTimeRemaining(`Starts in ${getDurationLabel(start.getTime() - now.getTime())}`)
            } else if (now > end) {
                setStatus("expired")
                setTimeRemaining("Permit has expired")
            } else {
                const diff = end.getTime() - now.getTime()
                const hoursRemaining = diff / (1000 * 60 * 60)

                if (hoursRemaining < 2) {
                    setStatus("warning")
                } else {
                    setStatus("active")
                }

                setTimeRemaining(`${getDurationLabel(diff)} remaining`)
            }
        }

        updateValidity()
        const interval = setInterval(updateValidity, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [permit.validFrom, permit.validUntil])

    const getDurationLabel = (ms: number) => {
        const mins = Math.floor(ms / (1000 * 60))
        const hours = Math.floor(mins / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}d ${hours % 24}h`
        if (hours > 0) return `${hours}h ${mins % 60}m`
        return `${mins}m`
    }

    const configs = {
        active: {
            color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400",
            icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
            title: "Permit Active",
        },
        warning: {
            color: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 animate-pulse",
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
            title: "Expiring Soon",
        },
        expired: {
            color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400",
            icon: <XCircle className="h-5 w-5 text-red-600" />,
            title: "Permit Expired",
        },
        not_active: {
            color: "bg-muted border-border text-muted-foreground",
            icon: <Clock className="h-5 w-5" />,
            title: "Awaiting Start Time",
        }
    }

    const config = configs[status]

    return (
        <Alert className={cn("border-l-4 mb-6 rounded-xl", config.color)}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    {config.icon}
                    <div>
                        <AlertTitle className="font-bold text-sm mb-0.5">{config.title}</AlertTitle>
                        <AlertDescription className="text-xs opacity-90 font-medium">
                            {timeRemaining} • Valid until {new Date(permit.validUntil).toLocaleString()}
                        </AlertDescription>
                    </div>
                </div>
                <div className="hidden md:block text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Safety Protocol Enforced
                </div>
            </div>
        </Alert>
    )
}
