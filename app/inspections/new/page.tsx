"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { InspectionRecord, InspectionFinding, WorkflowState, AuditLogEntry, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Send, AlertTriangle, FileCheck, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function NewInspectionPage() {
    const router = useRouter()
    const { addRecord, addAuditLog } = useSafetyRecordStore()

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("Weekly Tower Crane Inspection")
    const [location, setLocation] = useState("Sector A - Level 12")
    const [type, setType] = useState("Equipment Safety")

    const handleSubmit = (status: WorkflowState = "draft") => {
        setLoading(true)

        const recordId = `ins-${Date.now()}`
        const recordNumber = `INS-2026-${Math.floor(Math.random() * 9000) + 1000}`

        // Mock findings
        const mockFindings: InspectionFinding[] = [
            { id: "f1", questionId: "q1", question: "Is the structure visually stable?", response: "pass" },
            { id: "f2", questionId: "q2", question: "Are safety rails properly secured?", response: "fail", severity: "high", notes: "Loose bolts on the western corner" },
            { id: "f3", questionId: "q3", question: "Is appropriate PPE being used?", response: "pass" },
            { id: "f4", questionId: "q4", question: "Are electrical cables elevated?", response: "fail", severity: "medium", notes: "Cables lying in water near pump" },
        ]

        const newRecord: RecordMetadata & { findings: InspectionFinding[], riskScore: number, passRate: number, inspectionType: string, inspector: string, type: string } = {
            id: recordId,
            recordNumber,
            title,
            type: "inspection",
            status,
            priority: "high",
            owner: "John Doe",
            assignee: "John Doe",
            location,
            description: "Automated weekly inspection report for equipment safety and compliance.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            inspectionType: type,
            inspector: "John Doe",
            findings: mockFindings,
            riskScore: 42,
            passRate: 50,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }

        // Add to store
        addRecord(newRecord as any)

        // Add audit log
        const log: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: "John Doe",
            action: "created",
            toStatus: status,
            details: `Created new inspection record ${recordNumber}`
        }
        addAuditLog(recordId, log)

        setTimeout(() => {
            router.push(`/inspections/${recordId}`)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="bg-background border-b border-border py-4 sticky top-0 z-10 w-full">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/inspections">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold font-display">New Inspection</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSubmit("submitted")} disabled={loading}>
                            <Send className="mr-2 h-4 w-4" />
                            Start Inspection
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 w-full">
                <div className="space-y-8">
                    <Card className="rounded-xl overflow-hidden border-border shadow-md">
                        <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <FileCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                    <CardDescription>Define the scope and location of this safety check.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-11 font-medium bg-background shadow-none border-border/60 focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Inspection Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="h-11 bg-background shadow-none border-border/60">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Equipment Safety">Equipment Safety</SelectItem>
                                            <SelectItem value="PPE Compliance">PPE Compliance</SelectItem>
                                            <SelectItem value="Environmental">Environmental</SelectItem>
                                            <SelectItem value="Work at Height">Work at Height</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 font-inter">Site Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="h-11 pl-10 font-medium bg-background shadow-none border-border/60"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Select Template</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="flex flex-col items-start p-4 rounded-xl border-2 border-primary bg-primary/5 text-left transition-all">
                                        <span className="font-bold text-sm block mb-1">Standard Weekly Check</span>
                                        <span className="text-xs text-muted-foreground">Comprehensive field audit covering all safety requirements.</span>
                                    </button>
                                    <button className="flex flex-col items-start p-4 rounded-xl border-2 border-transparent bg-muted/40 hover:bg-muted/60 text-left transition-all grayscale opacity-60">
                                        <span className="font-bold text-sm block mb-1">Custom Blank Form</span>
                                        <span className="text-xs text-muted-foreground">Start with an empty canvas and build your own.</span>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4 dark:bg-amber-950/20 dark:border-amber-900/30">
                        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Before Starting</p>
                            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 mt-1 leading-relaxed">
                                Ensure you are wearing required PPE and have the necessary permissions to enter the inspection area.
                                Data will be synced automatically once the inspection is submitted.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
