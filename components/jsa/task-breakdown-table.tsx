"use client"

import { TaskStep } from "@/lib/types/safety-record"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaskBreakdownTableProps {
    steps: TaskStep[]
}

export function TaskBreakdownTable({ steps }: TaskBreakdownTableProps) {
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "low": return "border-green-500 text-green-700 bg-green-50"
            case "medium": return "border-amber-500 text-amber-700 bg-amber-50"
            case "high": return "border-destructive text-destructive bg-destructive/5"
            default: return ""
        }
    }

    return (
        <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[80px] font-bold">Step</TableHead>
                        <TableHead className="min-w-[200px] font-bold">Job Step / Task</TableHead>
                        <TableHead className="min-w-[200px] font-bold">Potential Hazards</TableHead>
                        <TableHead className="min-w-[200px] font-bold">Control Measures</TableHead>
                        <TableHead className="w-[120px] text-right font-bold">Residual Risk</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {steps.map((step) => (
                        <TableRow key={step.id}>
                            <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                                {String(step.sequence).padStart(2, "0")}
                            </TableCell>
                            <TableCell className="font-medium align-top leading-relaxed py-4">
                                {step.task}
                            </TableCell>
                            <TableCell className="align-top py-4">
                                <ul className="space-y-1.5">
                                    {step.hazards.map((h, i) => (
                                        <li key={i} className="text-sm flex gap-2 items-start">
                                            <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 shrink-0" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell className="align-top py-4">
                                <ul className="space-y-1.5">
                                    {step.controls.map((c, i) => (
                                        <li key={i} className="text-sm flex gap-2 items-start text-muted-foreground">
                                            <span className="mt-1.5 h-1 w-1 rounded-full bg-green-500 shrink-0" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell className="text-right align-top py-4">
                                <Badge variant="outline" className={cn("uppercase text-[10px] py-0 h-5 font-bold tabular-nums", getRiskColor(step.residualRisk))}>
                                    {step.residualRisk}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    {steps.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                No task steps defined for this JSA.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
