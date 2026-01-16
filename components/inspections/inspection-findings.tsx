"use client"

import { InspectionFinding } from "@/lib/types/safety-record"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, AlertTriangle, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InspectionFindingsProps {
    findings: InspectionFinding[]
    onCreateCapa: (findingId: string) => void
}

export function InspectionFindings({ findings, onCreateCapa }: InspectionFindingsProps) {
    if (!findings || !Array.isArray(findings) || findings.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No inspection items recorded</div>
    }

    const failedFindings = findings.filter(f => f.response === "fail")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Inspection Findings</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{findings.filter(f => f.response === "pass").length} Passed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium">{failedFindings.length} Failed</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {findings.map((finding) => (
                    <Card key={finding.id} className={finding.response === "fail" ? "border-destructive/30 bg-destructive/5" : ""}>
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1 cursor-default">
                                <div className="flex items-center gap-2">
                                    <Badge variant={finding.response === "pass" ? "outline" : finding.response === "fail" ? "destructive" : "secondary"} className={cn(finding.response === "pass" && "border-green-500 text-green-600 bg-green-50 uppercase font-bold")}>
                                        {finding.response.toUpperCase()}
                                    </Badge>
                                    {finding.severity && (
                                        <Badge variant="outline" className="opacity-70 text-[10px] py-0 h-4 normal-case">
                                            {finding.severity} risk
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm font-semibold">{finding.question}</p>
                                {finding.notes && <p className="text-xs text-muted-foreground">{finding.notes}</p>}
                            </div>

                            {finding.response === "fail" && (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {finding.capaCreated ? (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                                            CAPA Created
                                        </Badge>
                                    ) : (
                                        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => onCreateCapa(finding.id)}>
                                            <PlusCircle className="h-4 w-4" />
                                            Assign CAPA
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
