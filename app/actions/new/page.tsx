"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { CAPARecord, RecordType, WorkflowState } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send, ClipboardList, User, Calendar, MapPin, AlertCircle, Link as LinkIcon, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

import { Suspense } from "react"

function NewActionForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { addRecord, addAuditLog, records } = useSafetyRecordStore()

    const originatingId = searchParams.get("fromId")
    const originatingType = searchParams.get("fromType") as RecordType
    const originatingNum = searchParams.get("fromNum")

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState(originatingId ? `Corrective Action for ${originatingNum}` : "New Health & Safety Action")
    const [actionRequired, setActionRequired] = useState("")
    const [assignee, setAssignee] = useState("Unassigned")
    const [location, setLocation] = useState(originatingId ? (records.find(r => r.id === originatingId)?.location || "") : "")
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
    const [evidenceRequired, setEvidenceRequired] = useState(true)

    const handleSubmit = (status: WorkflowState = "open") => {
        setLoading(true)

        const recordId = `capa-${Date.now()}`
        const recordNumber = `CAPA-2026-${Math.floor(Math.random() * 9000) + 1000}`

        const newRecord: CAPARecord = {
            id: recordId,
            recordNumber,
            title,
            type: "capa",
            status,
            priority: "high",
            owner: "Safety Department",
            assignee,
            location,
            description: `Targeted corrective action triggered by ${originatingNum || 'a safety event'}.`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            originatingRecordId: originatingId || "manual",
            originatingRecordType: originatingType || "observation",
            originatingRecordNumber: originatingNum || "MANUAL-001",
            actionRequired,
            evidenceRequired,
            isEscalated: false
        }

        addRecord(newRecord as any)

        addAuditLog(recordId, {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: "Safety Officer",
            action: "created",
            toStatus: status,
            details: `Created new CAPA ${recordNumber} assigned to ${assignee}`
        })

        if (originatingId) {
            addAuditLog(originatingId, {
                id: `log-link-${Date.now()}`,
                timestamp: new Date().toISOString(),
                user: "System",
                action: "capa_linked",
                details: `Linked corrective action ${recordNumber} to this record.`
            })
        }

        setTimeout(() => {
            router.push(`/actions/${recordId}`)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="bg-background border-b border-border py-4 sticky top-0 z-10 w-full">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/actions">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">New Corrective Action</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSubmit("draft" as any)} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSubmit("open")} disabled={loading || !actionRequired} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                            <Send className="mr-2 h-4 w-4" />
                            Assign Action
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 w-full">
                <div className="space-y-8">
                    {originatingId && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between dark:bg-indigo-950/20 dark:border-indigo-900/30">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="h-5 w-5 text-indigo-500" />
                                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Linking to {originatingType} {originatingNum}</p>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40">SOURCE ATTACHED</Badge>
                        </div>
                    )}

                    <Card className="rounded-xl overflow-hidden border-border shadow-md">
                        <CardHeader className="bg-slate-500/5 pb-6 border-b border-slate-500/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-slate-500/10 p-2 rounded-lg">
                                    <ClipboardList className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Action Description</CardTitle>
                                    <CardDescription>Define the correction required to mitigate site risk.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Action Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 shadow-none focus:ring-slate-500" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Correction Required</Label>
                                    <Textarea
                                        placeholder="Detail exactly what needs to be done..."
                                        className="min-h-[120px] shadow-none resize-none"
                                        value={actionRequired}
                                        onChange={(e) => setActionRequired(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Assigned To</Label>
                                        <Select value={assignee} onValueChange={setAssignee}>
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="John ProjectManager">John ProjectManager</SelectItem>
                                                <SelectItem value="Site Supervisor A">Site Supervisor A</SelectItem>
                                                <SelectItem value="Maintenance Team">Maintenance Team</SelectItem>
                                                <SelectItem value="Electrical Subcontractor">Electrical Subcontractor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-11 pl-10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Target Completion Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-11 pl-10" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/20 dark:border-slate-800">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold">Evidence Required?</Label>
                                            <p className="text-xs text-muted-foreground">Require photo proof for verification.</p>
                                        </div>
                                        <Switch checked={evidenceRequired} onCheckedChange={setEvidenceRequired} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function NewActionPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
            <NewActionForm />
        </Suspense>
    )
}
