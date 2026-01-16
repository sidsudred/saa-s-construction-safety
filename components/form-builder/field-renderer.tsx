"use client"

import type { FormField } from "./form-builder-editor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    FileText, MapPin, Clock, Calculator, Database, Link2,
    Users, Tag, Image as ImageIcon, Upload
} from "lucide-react"

interface FieldRendererProps {
    field: FormField
    isPreviewMode: boolean
}

export function FieldRenderer({ field, isPreviewMode }: FieldRendererProps) {
    const disabled = !isPreviewMode

    switch (field.type) {
        // Basic Input
        case "text":
            return <Input placeholder={field.properties.placeholder || "Enter text..."} disabled={disabled} />

        case "paragraph":
            return <Textarea placeholder={field.properties.placeholder || "Enter text..."} rows={4} disabled={disabled} />

        case "label":
            return <p className="text-sm text-foreground">{field.properties.text || "Label text"}</p>

        case "poster":
            return (
                <div className="w-full h-32 rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
            )

        // Numeric
        case "number":
            return <Input type="number" placeholder="0" disabled={disabled} />

        case "percentage":
            return (
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" disabled={disabled} className="flex-1" />
                    <span className="text-muted-foreground">%</span>
                </div>
            )

        case "formula":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-mono">
                        {field.properties.formula || "= SUM(field1, field2)"}
                    </span>
                </div>
            )

        // Date & Time
        case "date":
            return <Input type="date" disabled={disabled} />

        case "time":
            return <Input type="time" disabled={disabled} />

        case "datetime":
            return <Input type="datetime-local" disabled={disabled} />

        // Selection
        case "checkbox":
            return (
                <div className="flex items-center gap-2">
                    <Checkbox id={field.id} disabled={disabled} />
                    <Label htmlFor={field.id} className="text-sm font-normal">
                        {field.properties.checkboxLabel || "Checkbox option"}
                    </Label>
                </div>
            )

        case "radio":
            return (
                <RadioGroup disabled={disabled}>
                    {(field.properties.options || [{ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]).map((option: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${field.id}-${index}`} />
                            <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )

        case "select":
            return (
                <Select disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option..." />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.properties.options || [{ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]).map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        case "multiselect":
            return (
                <Select disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select options..." />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.properties.options || [{ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]).map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        case "rating":
            return (
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Button key={star} variant="ghost" size="sm" className="p-0 h-8 w-8" disabled={disabled}>
                            ★
                        </Button>
                    ))}
                </div>
            )

        // Advanced
        case "table":
            return (
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 gap-px bg-border">
                        <div className="bg-card p-2 text-xs font-medium">Column 1</div>
                        <div className="bg-card p-2 text-xs font-medium">Column 2</div>
                        <div className="bg-card p-2 text-xs font-medium">Column 3</div>
                    </div>
                    <div className="grid grid-cols-3 gap-px bg-border">
                        <div className="bg-card p-2">
                            <Input disabled={disabled} className="h-8 text-xs" />
                        </div>
                        <div className="bg-card p-2">
                            <Input disabled={disabled} className="h-8 text-xs" />
                        </div>
                        <div className="bg-card p-2">
                            <Input disabled={disabled} className="h-8 text-xs" />
                        </div>
                    </div>
                </div>
            )

        case "attachment":
            return (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload file</p>
                </div>
            )

        case "annotated-image":
            return (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload and annotate image</p>
                </div>
            )

        case "scribble":
            return (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">Draw here</p>
                </div>
            )

        case "signature":
            return (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">Sign here</p>
                </div>
            )

        // User & References
        case "roster":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Roster selection</span>
                </div>
            )

        case "user-selector":
            return (
                <Select disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select user..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user1">John Doe</SelectItem>
                        <SelectItem value="user2">Jane Smith</SelectItem>
                    </SelectContent>
                </Select>
            )

        case "phase-code":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Phase code selection</span>
                </div>
            )

        case "reference-field":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Reference to {field.properties.referenceType || "safety record"}
                    </span>
                </div>
            )

        case "asset-reference":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">Read-only</Badge>
                    <span className="text-sm text-muted-foreground">Asset reference</span>
                </div>
            )

        // Custom Tables
        case "custom-table-link":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Direct link to custom table</span>
                </div>
            )

        case "autofill":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Autofill from custom table</span>
                </div>
            )

        // System Fields
        case "auto-timestamp":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">Auto</Badge>
                    <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                    </span>
                </div>
            )

        case "auto-location":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">Auto</Badge>
                    <span className="text-sm text-muted-foreground">GPS Location</span>
                </div>
            )

        case "status":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">System</Badge>
                    <span className="text-sm text-muted-foreground">Status field</span>
                </div>
            )

        case "version-identifier":
            return (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">System</Badge>
                    <span className="text-sm text-muted-foreground">v1.0.0</span>
                </div>
            )

        default:
            return (
                <div className="text-sm text-muted-foreground">
                    {field.label} ({field.type})
                </div>
            )
    }
}
