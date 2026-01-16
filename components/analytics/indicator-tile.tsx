"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface IndicatorTileProps {
    label: string
    value: string | number
    unit?: string
    trend?: number // percentage
    target?: string | number
    icon: LucideIcon
    color: "indigo" | "red" | "emerald" | "amber"
    href?: string
}

export function IndicatorTile({
    label,
    value,
    unit,
    trend,
    target,
    icon: Icon,
    color,
    href
}: IndicatorTileProps) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50",
        red: "text-red-600 bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/50",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
        amber: "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50",
    }

    const Content = (
        <Card className={cn("group hover:ring-2 hover:ring-offset-2 transition-all shadow-sm border-border/60",
            color === "indigo" ? "hover:ring-indigo-500" :
                color === "red" ? "hover:ring-red-500" :
                    color === "emerald" ? "hover:ring-emerald-500" : "hover:ring-amber-500"
        )}>
            <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-xl", colors[color])}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend !== undefined && (
                        <div className={cn("flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
                            trend > 0 ? "bg-emerald-50 text-emerald-600" :
                                trend < 0 ? "bg-red-50 text-red-600" : "bg-muted text-muted-foreground"
                        )}>
                            {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> :
                                trend < 0 ? <ArrowDownRight className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70 mb-1">{label}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black tabular-nums tracking-tight">{value}</span>
                        {unit && <span className="text-xs font-bold text-muted-foreground">{unit}</span>}
                    </div>
                </div>

                {target && (
                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[10px] font-bold text-muted-foreground">
                        <span className="uppercase tracking-tight">Target: {target}</span>
                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn("h-full",
                                    color === "indigo" ? "bg-indigo-500" :
                                        color === "red" ? "bg-red-500" :
                                            color === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                                )}
                                style={{ width: '75%' }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )

    if (href) {
        return (
            <Link href={href}>
                {Content}
            </Link>
        )
    }

    return Content
}
