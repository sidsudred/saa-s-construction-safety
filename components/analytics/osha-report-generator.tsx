"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, FileText, Calendar, Building2, Users, FileStack, X } from "lucide-react"
import { IncidentRecord } from "@/lib/types/safety-record"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

interface OSHAReportGeneratorProps {
    incidents: IncidentRecord[]
}

type PreviewType = 'csv' | 'text'

export function OSHAReportGenerator({ incidents }: OSHAReportGeneratorProps) {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [establishmentName, setEstablishmentName] = useState("Downtown Construction Site")

    // Preview State
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewTitle, setPreviewTitle] = useState("")
    const [previewContent, setPreviewContent] = useState<string | string[][]>("")
    const [previewType, setPreviewType] = useState<PreviewType>('text')
    const [downloadInfo, setDownloadInfo] = useState<{ content: string, filename: string, mimeType: string } | null>(null)

    // Get available years from incidents
    const availableYears = Array.from(
        new Set(incidents.map(i => new Date(i.dateOfOccurrence).getFullYear()))
    ).sort((a, b) => b - a)

    // Filter incidents for selected year
    const yearIncidents = incidents.filter(i =>
        new Date(i.dateOfOccurrence).getFullYear() === parseInt(selectedYear)
    )

    // Calculate OSHA 300 metrics
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

    // OSHA 300A Summary metrics
    const totalRecordable = recordableIncidents.length
    const injuries = recordableIncidents.filter(i => i.incidentType === "injury").length
    const skinDisorders = 0
    const respiratoryConditions = 0
    const poisonings = recordableIncidents.filter(i => i.incidentType === "environmental").length
    const hearingLoss = 0
    const allOtherIllnesses = recordableIncidents.filter(i =>
        !["injury", "environmental"].includes(i.incidentType)
    ).length

    // Calculate rates
    const totalHoursWorked = 200000
    const averageEmployees = 100
    const daysAwayRate = ((daysAwayFromWork * 200000) / totalHoursWorked).toFixed(2)
    const totalRecordableRate = ((totalRecordable * 200000) / totalHoursWorked).toFixed(2)

    const handleGenerate300 = () => {
        const headers = ["Case No.", "Employee Name", "Job Title", "Date of Injury", "Where Event Occurred", "Describe Injury/Illness", "Classify Case", "Days Away", "Days Restricted"]
        const data = recordableIncidents.map((incident, index) => [
            `${selectedYear}-${String(index + 1).padStart(4, "0")}`,
            (incident as any).affectedPersons?.[0] || "Unknown",
            "Worker",
            new Date(incident.dateOfOccurrence).toLocaleDateString(),
            incident.location,
            incident.description,
            incident.severity,
            incident.severity === "serious" ? "1+" : "0",
            incident.severity === "moderate" ? "1+" : "0"
        ])

        const csvContent = [headers, ...data]
        const csvString = csvContent.map(row => row.join(",")).join("\n")

        setPreviewTitle(`OSHA Form 300 - Log (${selectedYear})`)
        setPreviewContent(csvContent)
        setPreviewType('csv')
        setDownloadInfo({ content: csvString, filename: `OSHA_300_Log_${selectedYear}.csv`, mimeType: "text/csv" })
        setPreviewOpen(true)
    }

    const handleGenerate300A = () => {
        const reportContent = `
OSHA Form 300A - Summary of Work-Related Injuries and Illnesses
================================================================================

Establishment Information:
--------------------------
Establishment Name: ${establishmentName}
City: [City]
State: [State]
Industry Description: Construction
Standard Industrial Classification (SIC): 1542 or North American Industry Classification (NAICS): 236220

Employment Information:
------------------------
Annual Average Number of Employees: ${averageEmployees}
Total Hours Worked by All Employees: ${totalHoursWorked.toLocaleString()}

Number of Cases:
----------------
Total number of deaths: ${fatalities}
Total number of cases with days away from work: ${daysAwayFromWork}
Total number of cases with job transfer or restriction: ${jobTransferRestriction}
Total number of other recordable cases: ${otherRecordable}

Number of Days:
---------------
Total number of days away from work: [To be calculated from detailed records]
Total number of days of job transfer or restriction: [To be calculated from detailed records]

Injury and Illness Types:
--------------------------
(G) Injuries: ${injuries}
(H) Skin Disorders: ${skinDisorders}
(I) Respiratory Conditions: ${respiratoryConditions}
(J) Poisonings: ${poisonings}
(K) Hearing Loss: ${hearingLoss}
(L) All Other Illnesses: ${allOtherIllnesses}

Injury and Illness Rates:
--------------------------
Total Recordable Case Rate: ${totalRecordableRate}
Days Away from Work Rate: ${daysAwayRate}

Certification:
--------------
I certify that I have examined this document and that to the best of my knowledge the entries are true, accurate, and complete.

Company Executive: _________________________
Title: _____________________________________
Date: ${new Date().toLocaleDateString()}

================================================================================
This summary must be posted from February 1 to April 30 of the year following the year covered by the form.
        `.trim()

        setPreviewTitle(`OSHA Form 300A - Summary (${selectedYear})`)
        setPreviewContent(reportContent)
        setPreviewType('text')
        setDownloadInfo({ content: reportContent, filename: `OSHA_300A_Summary_${selectedYear}.txt`, mimeType: "text/plain" })
        setPreviewOpen(true)
    }

    const handleGenerate301 = () => {
        if (recordableIncidents.length === 0) {
            alert("No recordable incidents found for this year.")
            return
        }

        // Navigate to the full-page official form viewer as requested by user
        router.push(`/analytics/reports/osha-301?year=${selectedYear}`)
    }

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setPreviewOpen(false)
    }

    const renderPreviewContent = () => {
        if (previewType === 'csv' && Array.isArray(previewContent)) {
            const [headers, ...rows] = previewContent as string[][]
            return (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {headers.map((h, i) => <TableHead key={i} className="whitespace-nowrap">{h}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow key={i}>
                                    {row.map((cell, j) => <TableCell key={j} className="whitespace-nowrap">{cell}</TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
        }

        return (
            <pre className="p-4 bg-muted overflow-auto rounded-md text-sm font-mono whitespace-pre-wrap">
                {previewContent as string}
            </pre>
        )
    }

    return (
        <>
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">OSHA Reporting</CardTitle>
                            <CardDescription>Generate OSHA 300, 300A & 301 compliance reports</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Configuration */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="year" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Reporting Year
                            </Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger id="year">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(year => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Establishment
                            </Label>
                            <div className="text-sm font-medium p-2 bg-muted rounded-md">
                                {establishmentName}
                            </div>
                        </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="grid gap-3 md:grid-cols-4">
                        <div className="p-4 rounded-lg border bg-card">
                            <div className="text-2xl font-bold text-red-600">{fatalities}</div>
                            <div className="text-xs text-muted-foreground mt-1">Fatalities</div>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                            <div className="text-2xl font-bold text-amber-600">{daysAwayFromWork}</div>
                            <div className="text-xs text-muted-foreground mt-1">Days Away Cases</div>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                            <div className="text-2xl font-bold text-blue-600">{jobTransferRestriction}</div>
                            <div className="text-xs text-muted-foreground mt-1">Job Transfer/Restriction</div>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                            <div className="text-2xl font-bold">{totalRecordable}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Recordable</div>
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Recordable Case Rate (TRCR):</span>
                            <Badge variant="outline" className="font-mono">{totalRecordableRate}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Days Away from Work Rate (DAWR):</span>
                            <Badge variant="outline" className="font-mono">{daysAwayRate}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            * Rates calculated per 100 full-time workers (200,000 hours)
                        </div>
                    </div>

                    {/* Report Generation Buttons */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Available Reports</h3>
                        <div className="grid gap-3">
                            <Button
                                onClick={handleGenerate300}
                                className="w-full justify-start gap-3 h-auto py-4"
                                variant="outline"
                            >
                                <FileDown className="h-5 w-5 text-indigo-600" />
                                <div className="text-left flex-1">
                                    <div className="font-semibold">OSHA Form 300 (Log)</div>
                                    <div className="text-xs text-muted-foreground font-normal">
                                        Log of work-related injuries and illnesses (CSV)
                                    </div>
                                </div>
                            </Button>

                            <Button
                                onClick={handleGenerate300A}
                                className="w-full justify-start gap-3 h-auto py-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                            >
                                <FileText className="h-5 w-5" />
                                <div className="text-left flex-1">
                                    <div className="font-semibold">OSHA Form 300A (Summary)</div>
                                    <div className="text-xs opacity-90 font-normal">
                                        Annual summary for posting Feb 1 - Apr 30 (Text)
                                    </div>
                                </div>
                            </Button>

                            <Button
                                onClick={handleGenerate301}
                                className="w-full justify-start gap-3 h-auto py-4 border-indigo-600 border-2"
                                variant="outline"
                            >
                                <FileStack className="h-5 w-5 text-indigo-600" />
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-indigo-600">OSHA Form 301 (Incidents)</div>
                                    <div className="text-xs text-muted-foreground font-normal">
                                        View official incident reports (Full Page Viewer)
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Compliance Notes */}
                    <div className="text-xs text-muted-foreground space-y-1 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                        <div className="font-semibold text-amber-900 dark:text-amber-100 mb-2">OSHA Compliance Requirements:</div>
                        <div>• Form 300A must be posted February 1 - April 30 annually</div>
                        <div>• Records must be maintained for 5 years</div>
                        <div>• Establishments with 250+ employees must submit electronically by March 2</div>
                        <div>• Report fatalities within 8 hours, hospitalizations within 24 hours</div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{previewTitle}</DialogTitle>
                        <DialogDescription>
                            Review the report content before downloading.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 border rounded-md p-4">
                        {renderPreviewContent()}
                    </ScrollArea>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setPreviewOpen(false)}>Cancel</Button>
                        {downloadInfo && (
                            <Button onClick={() => downloadFile(downloadInfo.content, downloadInfo.filename, downloadInfo.mimeType)}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Download Report
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
