"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { IncidentRecord, IncidentType, IncidentSeverity, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Send, AlertTriangle, ShieldAlert, MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function NewIncidentPage() {
    const router = useRouter()
    const { addRecord, addAuditLog } = useSafetyRecordStore()

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("Unsafe Crane Operation Near Power Lines")
    const [location, setLocation] = useState("East Site - Zone 4")
    const [type, setType] = useState<IncidentType>("near_miss")
    const [severity, setSeverity] = useState<IncidentSeverity>("moderate")
    const [date, setDate] = useState("2026-01-14")
    const [time, setTime] = useState("14:30")

    const handleSubmit = (status: WorkflowState = "draft") => {
        setLoading(true)

        const recordId = `inc-${Date.now()}`
        const recordNumber = `INC-2026-${Math.floor(Math.random() * 9000) + 1000}`

        const newRecord: IncidentRecord = {
            id: recordId,
            recordNumber,
            title,
            type: "incident",
            status,
            priority: severity === "critical" || severity === "fatality" || severity === "major" ? "critical" : severity === "serious" ? "high" : "medium",
            owner: "John Doe",
            assignee: "Safety Officer",
            location,
            description: "During crane setup, the boom arm came within 3 meters of live overhead power lines. Operation suspended immediately.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            incidentType: type,
            severity,
            dateOfOccurrence: date,
            timeOfOccurrence: time,
            investigationStatus: "pending",
            witnesses: ["Mark Spencer", "David Lee"],
            contributingFactors: ["Poor visibility", "Inadequate spotter training"],
            timeline: [
                { id: "t1", timestamp: `${date}T${time}:00Z`, description: "Incident occurred", type: "event" },
                { id: "t2", timestamp: `${date}T${time}:05Z`, description: "Site supervisor notified", type: "action" }
            ],
            rootCauses: [],
            investigationNotes: "Initial report gathered from operator. Site photos taken."
        }

        addRecord(newRecord as any)

        addAuditLog(recordId, {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: "John Doe",
            action: "created",
            toStatus: status,
            details: `Reported new incident ${recordNumber}`
        })

        setTimeout(() => {
            router.push(`/incidents/${recordId}`)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="bg-background border-b border-border py-4 sticky top-0 z-10 w-full">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/incidents">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold font-display">Report Incident</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSubmit("submitted")} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                            <Send className="mr-2 h-4 w-4" />
                            Submit Report
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 w-full">
                <div className="space-y-8">
                    <Card className="rounded-xl overflow-hidden border-border shadow-md">
                        <CardHeader className="bg-red-500/5 pb-6 border-b border-red-500/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-red-500/10 p-2 rounded-lg">
                                    <ShieldAlert className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Incident Details</CardTitle>
                                    <CardDescription>Provide immediate information about the occurrence.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Short Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-11 font-medium bg-background shadow-none border-border/60 focus:border-red-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Incident Type</Label>
                                        <Select value={type} onValueChange={(v) => setType(v as IncidentType)}>
                                            <SelectTrigger className="h-11 bg-background shadow-none border-border/60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="near_miss">Near Miss</SelectItem>
                                                <SelectItem value="injury">Injury / First Aid</SelectItem>
                                                <SelectItem value="property_damage">Property Damage</SelectItem>
                                                <SelectItem value="environmental">Environmental Leak/Spill</SelectItem>
                                                <SelectItem value="health">Occupational Health</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Severity Level</Label>
                                        <Select value={severity} onValueChange={(v) => setSeverity(v as IncidentSeverity)}>
                                            <SelectTrigger className="h-11 bg-background shadow-none border-border/60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minor">Minor (No downtime)</SelectItem>
                                                <SelectItem value="moderate">Moderate (First aid)</SelectItem>
                                                <SelectItem value="serious">Serious (Lost time)</SelectItem>
                                                <SelectItem value="major">Major (Hospitalization)</SelectItem>
                                                <SelectItem value="critical">Critical (Site danger)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Date of Occurrence</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Time (Approx)</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 pl-10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Exact Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="h-11 pl-10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Description of Event</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe exactly what happened, and any immediate actions taken..."
                                        className="min-h-[120px] bg-background shadow-none border-border/60 resize-none"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex gap-4 dark:bg-red-950/20 dark:border-red-900/30">
                        <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-red-800 dark:text-red-400">Escalation Policy</p>
                            <p className="text-xs text-red-700/80 dark:text-red-500/80 mt-1 leading-relaxed">
                                Incidents marked as Serious or Major will automatically trigger an SMS alert to the Project Manager
                                and Regional Safety Director. Ensure all immediate life-safety actions are completed before filing.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
