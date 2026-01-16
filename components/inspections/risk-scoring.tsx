"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface RiskScoringProps {
    score: number
    maxScore?: number
    passRate: number
}

export function RiskScoring({ score, maxScore = 100, passRate }: RiskScoringProps) {
    const getRiskColor = (s: number) => {
        if (s < 30) return "text-green-500"
        if (s < 60) return "text-amber-500"
        if (s < 85) return "text-orange-500"
        return "text-destructive"
    }

    const getRiskLabel = (s: number) => {
        if (s < 30) return "Low Risk"
        if (s < 60) return "Moderate Risk"
        if (s < 85) return "High Risk"
        return "Critical Risk"
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-none bg-muted/20 border-border">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Risk Score</span>
                    <div className={cn("text-5xl font-black tabular-nums", getRiskColor(score))}>
                        {score}<span className="text-lg font-normal text-muted-foreground ml-1">/{maxScore}</span>
                    </div>
                    <span className={cn("text-sm font-bold", getRiskColor(score))}>
                        {getRiskLabel(score)}
                    </span>
                </CardContent>
            </Card>

            <Card className="shadow-none bg-muted/20 border-border">
                <CardContent className="p-6 space-y-4 flex flex-col justify-center">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compliance Pass Rate</span>
                        <span className="text-2xl font-black tabular-nums text-primary">{passRate}%</span>
                    </div>
                    <Progress value={passRate} className="h-3 grow" />
                    <p className="text-[10px] text-muted-foreground italic text-center">
                        Calculated based on positive responses to all mandatory safety checks.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
