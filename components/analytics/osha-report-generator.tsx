"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, FileText, Calendar, Building2, Users, FileStack, X, Eye } from "lucide-react"
import { IncidentRecord } from "@/lib/types/safety-record"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface OSHAReportGeneratorProps {
    incidents: IncidentRecord[]
}

export function OSHAReportGenerator({ incidents }: OSHAReportGeneratorProps) {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [establishmentName, setEstablishmentName] = useState("Downtown Construction Site")

    // Get available years from incidents
    const availableYears = Array.from(
        new Set(incidents.map(i => new Date(i.dateOfOccurrence).getFullYear()))
    ).sort((a, b) => b - a)

    // Filter incidents for selected year
    const yearIncidents = incidents.filter(i =>
        new Date(i.dateOfOccurrence).getFullYear() === parseInt(selectedYear)
    )

    // Calculate recordable incidents for metrics
    const recordableIncidents = yearIncidents.filter(i => {
        return i.severity !== "minor" || i.incidentType === "injury"
    })

    const fatalities = recordableIncidents.filter(i => i.severity === "fatality").length
    const daysAwayFromWork = recordableIncidents.filter(i =>
        i.severity === "serious" || i.severity === "major" || i.severity === "critical"
    ).length
    const jobTransferRestriction = recordableIncidents.filter(i =>
        i.severity === "moderate"
    ).length
    const otherRecordable = recordableIncidents.filter(i =>
        i.severity === "minor" && i.incidentType === "injury"
    ).length

    // Calculate rates
    const totalHoursWorked = 200000
    const daysAwayRate = ((daysAwayFromWork * 200000) / totalHoursWorked).toFixed(2)
    const totalRecordableRate = ((recordableIncidents.length * 200000) / totalHoursWorked).toFixed(2)

    const handleNavigateToReport = (type: '300' | '300a' | '301') => {
        router.push(`/analytics/reports/osha-${type}?year=${selectedYear}`)
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">OSHA Compliance Reporting</CardTitle>
                        <CardDescription>View and print official OSHA 300, 300A & 301 forms</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Configuration */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="year" className="flex items-center gap-2 font-semibold">
                            <Calendar className="h-4 w-4" />
                            Reporting Year
                        </Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger id="year" className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableYears.length > 0 ? (
                                    availableYears.map(year => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value={selectedYear}>{selectedYear}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-semibold">
                            <Building2 className="h-4 w-4" />
                            Establishment
                        </Label>
                        <div className="text-sm font-medium p-3 bg-muted rounded-md h-11 flex items-center border">
                            {establishmentName}
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    <div className="p-4 rounded-xl border bg-card/50 shadow-sm">
                        <div className="text-2xl font-bold text-red-600">{fatalities}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Fatalities</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-card/50 shadow-sm">
                        <div className="text-2xl font-bold text-amber-600">{daysAwayFromWork}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Days Away</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-card/50 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{jobTransferRestriction}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Transfers</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-card/50 shadow-sm">
                        <div className="text-2xl font-bold">{recordableIncidents.length}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Recordables</div>
                    </div>
                </div>

                {/* Rates */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Recordable Case Rate (TRCR):</span>
                        <Badge variant="secondary" className="font-mono px-3 py-1 text-sm bg-white dark:bg-black">{totalRecordableRate}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Days Away from Work Rate (DAWR):</span>
                        <Badge variant="secondary" className="font-mono px-3 py-1 text-sm bg-white dark:bg-black">{daysAwayRate}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic text-center pt-2">
                        * Rates calculated per 100 full-time workers (200,000 hours)
                    </p>
                </div>

                {/* Report Generation Buttons */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">Form Viewers</h3>
                    <div className="grid gap-4">
                        <Button
                            onClick={() => handleNavigateToReport('300')}
                            className="w-full justify-between h-auto py-5 px-6 border-2 hover:border-indigo-500 transition-all hover:bg-indigo-50/50 group"
                            variant="outline"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                    <FileDown className="h-5 w-5 text-indigo-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">OSHA Form 300 (Log)</div>
                                    <div className="text-xs text-muted-foreground">Official landscape log of injuries and illnesses</div>
                                </div>
                            </div>
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </Button>

                        <Button
                            onClick={() => handleNavigateToReport('300a')}
                            className="w-full justify-between h-auto py-5 px-6 border-2 hover:border-indigo-500 transition-all hover:bg-indigo-50/50 group"
                            variant="outline"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                    <FileText className="h-5 w-5 text-indigo-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">OSHA Form 300A (Summary)</div>
                                    <div className="text-xs text-muted-foreground">Official annual summary for posting</div>
                                </div>
                            </div>
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </Button>

                        <Button
                            onClick={() => handleNavigateToReport('301')}
                            className="w-full justify-between h-auto py-5 px-6 border-2 hover:border-indigo-500 transition-all hover:bg-indigo-50/50 group"
                            variant="outline"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                    <FileStack className="h-5 w-5 text-indigo-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">OSHA Form 301 (Incidents)</div>
                                    <div className="text-xs text-muted-foreground">Detailed report for each recordable case</div>
                                </div>
                            </div>
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                {/* Compliance Notes */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100 mb-2">
                        <Users className="h-4 w-4" />
                        OSHA Compliance Requirements
                    </div>
                    <ul className="text-xs text-amber-800/80 dark:text-amber-200/80 space-y-1.5 list-disc pl-4">
                        <li>Form 300A must be posted **February 1 - April 30** annually</li>
                        <li>Records must be maintained for **5 years**</li>
                        <li>Report fatalities within **8 hours**, hospitalizations within **24 hours**</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
