"use client"

import { ObservationType } from "@/lib/types/safety-record"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    CheckCircle2,
    AlertTriangle,
    Zap,
    Eye,
    Camera,
    User,
    Tag,
    Send,
    PlusCircle,
    MapPin
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ObservationFormProps {
    onSubmit: (data: {
        title: string
        type: ObservationType
        category: string
        description: string
        location: string
        actionTaken?: string
    }) => void
    loading?: boolean
}

export function ObservationForm({ onSubmit, loading }: ObservationFormProps) {
    const [type, setType] = useState<ObservationType>("unsafe_condition")
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("PPE Compliance")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [actionTaken, setActionTaken] = useState("")

    const types: { value: ObservationType, label: string, icon: any, color: string }[] = [
        { value: "positive", label: "Positive", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
        { value: "unsafe_act", label: "Unsafe Act", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200" },
        { value: "unsafe_condition", label: "Unsafe Condition", icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
        { value: "near_miss", label: "Near Miss", icon: Eye, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    ]

    const formalType = type === ("unsafe_condtion" as any) ? "unsafe_condition" : type

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-8">
                {/* Type Selector */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Observation Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {types.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setType(t.value)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                    type === t.value
                                        ? cn("border-primary ring-2 ring-primary/20", t.color)
                                        : "border-border bg-background hover:border-muted-foreground/30 text-muted-foreground"
                                )}
                            >
                                <t.icon className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase tracking-tight">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Title</Label>
                            <Input
                                placeholder="e.g. Broken guard rail on scaffold"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-11 shadow-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Lift Shaft 3, Level 5"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-11 pl-10 shadow-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="h-11 pl-10 shadow-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detailed Description</Label>
                            <Textarea
                                placeholder="Describe what you observed..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] shadow-none resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Immediate Action Taken (Optional)</Label>
                            <Textarea
                                placeholder="What did you do to rectify it immediately?"
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                className="min-h-[60px] shadow-none resize-none bg-muted/20 border-dashed"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <Button variant="ghost" className="gap-2 text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        Attach Photo
                    </Button>
                    <Button
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]"
                        onClick={() => onSubmit({ title, type: formalType, category, description, location, actionTaken })}
                        disabled={loading || !title || !description || !location}
                    >
                        {loading ? "Submitting..." : (
                            <>
                                <Send className="h-4 w-4" />
                                Submit Observation
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
