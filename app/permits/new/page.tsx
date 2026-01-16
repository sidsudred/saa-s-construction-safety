"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { PermitRecord, PermitType, WorkflowState, WorkerAcknowledgment } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send, ShieldCheck, Clock, Calendar, MapPin, Activity, HardHat, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function NewPermitPage() {
    const router = useRouter()
    const { addRecord, addAuditLog } = useSafetyRecordStore()

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("Hot Work - Welding on Pipeline Sector 4")
    const [location, setLocation] = useState("Main Plant - Gas Compression Area")
    const [type, setType] = useState<PermitType>("hot_work")
    const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 16))
    const [validUntil, setValidUntil] = useState(new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16))
    const [isolationRequired, setIsolationRequired] = useState(true)

    const handleSubmit = (status: WorkflowState = "draft") => {
        setLoading(true)

        const recordId = `prm-${Date.now()}`
        const recordNumber = `PRM-2026-${Math.floor(Math.random() * 9000) + 1000}`

        const newRecord: PermitRecord = {
            id: recordId,
            recordNumber,
            title,
            type: "permit",
            status,
            priority: "high",
            owner: "Safety Department",
            assignee: "Site Manager",
            location,
            description: "Standard hot work permit for MIG welding activities. All fire suppression equipment must be on-site.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permitType: type,
            validFrom,
            validUntil,
            issuerId: "Edward Safety",
            receiverId: "Mark Welder",
            hazards: ["Sparks & Slag", "Explosive Atmosphere", "Fire Risk", "Fumes"],
            controls: ["Continuous Gas Monitoring", "Fire Watch Personnel", "Fire Extinguisher on Hand", "Fire Blankets"],
            ppeRequirements: ["Welding Mask", "Flame Retardant Coveralls", "Leather Gloves", "Safety Boots"],
            isolationRequired,
            isolationDetails: isolationRequired ? "Gas lines purged and LOTO applied to primary valve V-102." : undefined,
            workerAcknowledgments: [
                { id: "w1", name: "Mark Welder", role: "Primary Welder", signed: false, timestamp: "" },
                { id: "w2", name: "David Firewatch", role: "Fire Watch", signed: false, timestamp: "" }
            ]
        }

        addRecord(newRecord as any)

        addAuditLog(recordId, {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: "Safety Officer",
            action: "created",
            toStatus: status,
            details: `Issued new ${type.replace("_", " ")} permit ${recordNumber}`
        })

        setTimeout(() => {
            router.push(`/permits/${recordId}`)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="bg-background border-b border-border py-4 sticky top-0 z-10 w-full">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/permits">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold font-display text-blue-700 dark:text-blue-400">Issue Permit to Work</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSubmit("submitted")} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="mr-2 h-4 w-4" />
                            Issue Permit
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 w-full">
                <div className="space-y-8">
                    <Card className="rounded-xl overflow-hidden border-border shadow-md">
                        <CardHeader className="bg-blue-500/5 pb-6 border-b border-blue-500/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">General Permit Authorization</CardTitle>
                                    <CardDescription>Scope of work and validity period definition.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Permit Scope / Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 shadow-none focus:border-blue-500" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Permit Type</Label>
                                        <Select value={type} onValueChange={(v) => setType(v as PermitType)}>
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hot_work">Hot Work</SelectItem>
                                                <SelectItem value="working_at_height">Working at Height</SelectItem>
                                                <SelectItem value="confined_space">Confined Space</SelectItem>
                                                <SelectItem value="excavation">Excavation</SelectItem>
                                                <SelectItem value="electrical">Electrical / LOTO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Location / Zone</Label>
                                        <Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-11" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Valid From</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="datetime-local" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="h-11 pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Valid Until</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="datetime-local" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="h-11 pl-10 border-blue-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">Physical Isolation Required?</Label>
                                        <p className="text-xs text-muted-foreground">Does this work require Lock Out / Tag Out (LOTO)?</p>
                                    </div>
                                    <Switch checked={isolationRequired} onCheckedChange={setIsolationRequired} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4 dark:bg-amber-950/20 dark:border-amber-900/30">
                        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Validity Warning</p>
                            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 mt-1 leading-relaxed">
                                Permits are valid for a maximum of 1 shift (8 hours).
                                Auto-expiration occurs strictly at the "Valid Until" time. Renewals must be submitted 1 hour prior.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
