"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { JSARecord, TaskStep, WorkerAcknowledgment, WorkflowState, AuditLogEntry } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, ClipboardCheck, Plus, Trash2, ShieldAlert, Users, HardHat, AlertCircle, CheckCircle2, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function NewJSAPage() {
    const router = useRouter()
    const { addRecord, addAuditLog } = useSafetyRecordStore()

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [projectName, setProjectName] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [supervisor, setSupervisor] = useState("")
    const [foremanName, setForemanName] = useState("")
    const [emergencyContact, setEmergencyContact] = useState("")
    const [weatherConditions, setWeatherConditions] = useState("")
    const [equipmentRequired, setEquipmentRequired] = useState("")

    const [steps, setSteps] = useState<Partial<TaskStep>[]>([
        { id: "s1", sequence: 1, task: "", hazards: [], controls: [], residualRisk: "low" }
    ])

    const [roster, setRoster] = useState<Partial<WorkerAcknowledgment>[]>([
        { id: "w1", name: "", role: "", signed: false }
    ])

    const [ppeRequired, setPpeRequired] = useState({
        hardHat: false,
        safetyGlasses: false,
        steelToedBoots: false,
        highVisVest: false,
        gloves: false,
        harness: false,
        respirator: false,
        hearingProtection: false
    })

    const addStep = () => {
        setSteps([...steps, {
            id: `s${steps.length + 1}`,
            sequence: steps.length + 1,
            task: "",
            hazards: [],
            controls: [],
            residualRisk: "low"
        }])
    }

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index))
        }
    }

    const updateStep = (index: number, field: keyof TaskStep, value: any) => {
        const newSteps = [...steps]
        newSteps[index] = { ...newSteps[index], [field]: value }
        setSteps(newSteps)
    }

    const addHazard = (stepIndex: number, hazard: string) => {
        if (!hazard.trim()) return
        const newSteps = [...steps]
        const currentHazards = newSteps[stepIndex].hazards || []
        newSteps[stepIndex] = { ...newSteps[stepIndex], hazards: [...currentHazards, hazard] }
        setSteps(newSteps)
    }

    const removeHazard = (stepIndex: number, hazardIndex: number) => {
        const newSteps = [...steps]
        const currentHazards = newSteps[stepIndex].hazards || []
        newSteps[stepIndex] = { ...newSteps[stepIndex], hazards: currentHazards.filter((_, i) => i !== hazardIndex) }
        setSteps(newSteps)
    }

    const addControl = (stepIndex: number, control: string) => {
        if (!control.trim()) return
        const newSteps = [...steps]
        const currentControls = newSteps[stepIndex].controls || []
        newSteps[stepIndex] = { ...newSteps[stepIndex], controls: [...currentControls, control] }
        setSteps(newSteps)
    }

    const removeControl = (stepIndex: number, controlIndex: number) => {
        const newSteps = [...steps]
        const currentControls = newSteps[stepIndex].controls || []
        newSteps[stepIndex] = { ...newSteps[stepIndex], controls: currentControls.filter((_, i) => i !== controlIndex) }
        setSteps(newSteps)
    }

    const addWorker = () => {
        setRoster([...roster, { id: `w${roster.length + 1}`, name: "", role: "", signed: false }])
    }

    const removeWorker = (index: number) => {
        if (roster.length > 1) {
            setRoster(roster.filter((_, i) => i !== index))
        }
    }

    const updateWorker = (index: number, field: keyof WorkerAcknowledgment, value: any) => {
        const newRoster = [...roster]
        newRoster[index] = { ...newRoster[index], [field]: value }
        setRoster(newRoster)
    }

    const handleSubmit = (status: WorkflowState = "draft") => {
        setLoading(true)

        const recordId = `jsa-${Date.now()}`
        const recordNumber = `JSA-2026-${Math.floor(Math.random() * 9000) + 1000}`

        const newRecord: JSARecord = {
            id: recordId,
            recordNumber,
            title,
            type: "jsa",
            status,
            priority: status === "submitted" ? "high" : "medium",
            owner: foremanName || "Current User",
            assignee: supervisor || "Safety Manager",
            location,
            description,
            projectName,
            workDescription: description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            taskSteps: steps as TaskStep[],
            roster: roster as WorkerAcknowledgment[]
        }

        addRecord(newRecord as any)

        addAuditLog(recordId, {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: foremanName || "Current User",
            action: "created",
            toStatus: status,
            details: `Created new JSA ${recordNumber} for ${projectName || title}`
        })

        setTimeout(() => {
            router.push(`/jsa/${recordId}`)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <header className="bg-background border-b border-border py-4 sticky top-0 z-10 w-full">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/jsa">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold font-display">New Job Safety Analysis (JSA)</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button onClick={() => handleSubmit("submitted")} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Send className="mr-2 h-4 w-4" />
                            Submit for Approval
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
                {/* Project Information */}
                <Card className="rounded-xl overflow-hidden border-border shadow-md">
                    <CardHeader className="bg-indigo-500/5 pb-6 border-b border-indigo-500/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-500/10 p-2 rounded-lg">
                                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Project Information</CardTitle>
                                <CardDescription>Basic details about the task and location.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">JSA Title *</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Scaffold Erection & Working at Height" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name *</Label>
                                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Downtown Commercial Complex" className="h-11" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Area / Location *</Label>
                                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Grid Lines A-F, Sector 3" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</Label>
                                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="h-11" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Task Description *</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the work to be performed in detail..." className="min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weather Conditions</Label>
                                <Input value={weatherConditions} onChange={(e) => setWeatherConditions(e.target.value)} placeholder="e.g., Clear, 22°C, Light wind" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Equipment Required</Label>
                                <Input value={equipmentRequired} onChange={(e) => setEquipmentRequired(e.target.value)} placeholder="e.g., Scaffold, Harnesses, Tools" className="h-11" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PPE Requirements */}
                <Card className="rounded-xl border-border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-lg">
                                <HardHat className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Required Personal Protective Equipment (PPE)</CardTitle>
                                <CardDescription>Select all PPE required for this task.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries({
                            hardHat: "Hard Hat",
                            safetyGlasses: "Safety Glasses",
                            steelToedBoots: "Steel-Toed Boots",
                            highVisVest: "High-Vis Vest",
                            gloves: "Work Gloves",
                            harness: "Safety Harness",
                            respirator: "Respirator",
                            hearingProtection: "Hearing Protection"
                        }).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                    id={key}
                                    checked={ppeRequired[key as keyof typeof ppeRequired]}
                                    onCheckedChange={(checked) => setPpeRequired({ ...ppeRequired, [key]: checked })}
                                />
                                <Label htmlFor={key} className="text-sm font-medium cursor-pointer">{label}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Task Hazard Analysis */}
                <Card className="rounded-xl border-border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500/10 p-2 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Task Hazard Analysis</CardTitle>
                                    <CardDescription>Break down the task into steps and identify hazards with controls.</CardDescription>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1" onClick={addStep}>
                                <Plus className="h-4 w-4" /> Add Step
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <div className="divide-y divide-border">
                            {steps.map((step, idx) => (
                                <div key={idx} className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="font-mono text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded">
                                            {String(idx + 1).padStart(2, "0")}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Step Description</Label>
                                                <Input
                                                    value={step.task}
                                                    onChange={(e) => updateStep(idx, 'task', e.target.value)}
                                                    placeholder="Describe this step of the task..."
                                                    className="font-medium"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-amber-600">Hazards Identified</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Add hazard and press Enter"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    addHazard(idx, e.currentTarget.value)
                                                                    e.currentTarget.value = ''
                                                                }
                                                            }}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                                                        {step.hazards?.map((h, i) => (
                                                            <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 gap-1">
                                                                {h}
                                                                <button onClick={() => removeHazard(idx, i)} className="ml-1 hover:text-amber-900">×</button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-green-600">Control Measures</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Add control and press Enter"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    addControl(idx, e.currentTarget.value)
                                                                    e.currentTarget.value = ''
                                                                }
                                                            }}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                                                        {step.controls?.map((c, i) => (
                                                            <Badge key={i} variant="outline" className="bg-green-50 text-green-800 border-green-200 gap-1">
                                                                {c}
                                                                <button onClick={() => removeControl(idx, i)} className="ml-1 hover:text-green-900">×</button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Residual Risk Level</Label>
                                                <Select value={step.residualRisk} onValueChange={(val) => updateStep(idx, 'residualRisk', val)}>
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {steps.length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => removeStep(idx)} className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Crew Roster & Signatures */}
                <Card className="rounded-xl border-border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Crew Roster & Acknowledgments</CardTitle>
                                    <CardDescription>All personnel must review and acknowledge this JSA before work begins.</CardDescription>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1" onClick={addWorker}>
                                <Plus className="h-4 w-4" /> Add Worker
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {roster.map((worker, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        value={worker.name}
                                        onChange={(e) => updateWorker(idx, 'name', e.target.value)}
                                        placeholder="Worker Name"
                                    />
                                    <Input
                                        value={worker.role}
                                        onChange={(e) => updateWorker(idx, 'role', e.target.value)}
                                        placeholder="Role/Trade"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`worker-${idx}`}
                                            checked={worker.signed}
                                            onCheckedChange={(checked) => updateWorker(idx, 'signed', checked)}
                                        />
                                        <Label htmlFor={`worker-${idx}`} className="text-sm cursor-pointer">
                                            {worker.signed ? <CheckCircle2 className="h-4 w-4 text-green-600 inline mr-1" /> : null}
                                            Acknowledged
                                        </Label>
                                    </div>
                                </div>
                                {roster.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeWorker(idx)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Supervision & Approvals */}
                <Card className="rounded-xl border-border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Supervision & Approvals</CardTitle>
                                <CardDescription>Foreman and supervisor information.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Foreman / Lead Name *</Label>
                                <Input value={foremanName} onChange={(e) => setForemanName(e.target.value)} placeholder="Enter foreman name" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Supervisor / Safety Officer</Label>
                                <Input value={supervisor} onChange={(e) => setSupervisor(e.target.value)} placeholder="Enter supervisor name" className="h-11" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Emergency Contact Number
                            </Label>
                            <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="e.g., Site Office: (555) 123-4567" className="h-11" />
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Warning */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex gap-4 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                    <ShieldAlert className="h-6 w-6 text-indigo-600 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-indigo-800 dark:text-indigo-400">Compliance Requirements</p>
                        <p className="text-xs text-indigo-700/80 dark:text-indigo-500/80 mt-1 leading-relaxed">
                            • JSAs must be reviewed and signed by all crew members before work begins<br />
                            • Foreman must approve and sign off on all hazard controls<br />
                            • JSA must be updated if site conditions change<br />
                            • Keep a copy on-site and accessible to all workers
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
