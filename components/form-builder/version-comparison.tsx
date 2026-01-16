"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Minus, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FormVersion {
  id: string
  version: string
  publishedDate: string
  publishedBy: string
  changes: string
  isCurrent: boolean
}

interface VersionComparisonProps {
  version1: FormVersion
  version2: FormVersion
  onClose: () => void
}

interface FieldChange {
  type: "added" | "removed" | "modified"
  fieldLabel: string
  oldValue?: string
  newValue?: string
}

// Mock field changes for comparison
const mockFieldChanges: FieldChange[] = [
  {
    type: "added",
    fieldLabel: "Photo Evidence",
    newValue: "File Upload - Required",
  },
  {
    type: "modified",
    fieldLabel: "Safety Checklist",
    oldValue: "5 items",
    newValue: "8 items",
  },
  {
    type: "modified",
    fieldLabel: "Inspection Date",
    oldValue: "Optional",
    newValue: "Required",
  },
  {
    type: "removed",
    fieldLabel: "Old Notes Field",
    oldValue: "Text Area",
  },
]

export function VersionComparison({ version1, version2, onClose }: VersionComparisonProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Compare Versions</h1>
              <p className="text-sm text-muted-foreground">Daily Site Inspection Form</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              v{version1.version}
            </Badge>
            <span className="text-muted-foreground">vs</span>
            <Badge variant="outline" className="font-mono">
              v{version2.version}
            </Badge>
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2 divide-x divide-border">
          {/* Left Side - Older Version */}
          <div className="flex flex-col">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-lg font-semibold">v{version1.version}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(version1.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant="secondary">Older</Badge>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 font-medium">Form Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Sections:</span> 4
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Fields:</span> 15
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Required Fields:</span> 8
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 font-medium">Field List</h3>
                  <div className="space-y-2">
                    {[
                      "Inspection Date",
                      "Inspector Name",
                      "Site Location",
                      "Safety Checklist",
                      "Equipment Status",
                      "Old Notes Field",
                      "Weather Conditions",
                      "Hazards Identified",
                      "Corrective Actions",
                      "Supervisor Signature",
                    ].map((field) => (
                      <div
                        key={field}
                        className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm"
                      >
                        {field === "Old Notes Field" && <Minus className="h-4 w-4 text-destructive" />}
                        <span className={field === "Old Notes Field" ? "text-muted-foreground line-through" : ""}>
                          {field}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Newer Version */}
          <div className="flex flex-col">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-lg font-semibold">v{version2.version}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(version2.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant="default">Newer</Badge>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 font-medium">Form Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Sections:</span> 4
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Fields:</span> 16
                      <Badge variant="secondary" className="text-xs">
                        +1
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Required Fields:</span> 9
                      <Badge variant="secondary" className="text-xs">
                        +1
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 font-medium">Field List</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Inspection Date", modified: true },
                      { name: "Inspector Name", modified: false },
                      { name: "Site Location", modified: false },
                      { name: "Safety Checklist", modified: true },
                      { name: "Equipment Status", modified: false },
                      { name: "Photo Evidence", added: true },
                      { name: "Weather Conditions", modified: false },
                      { name: "Hazards Identified", modified: false },
                      { name: "Corrective Actions", modified: false },
                      { name: "Supervisor Signature", modified: false },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${
                          field.added
                            ? "border-green-500/50 bg-green-500/10"
                            : field.modified
                              ? "border-amber-500/50 bg-amber-500/10"
                              : "border-border bg-background"
                        }`}
                      >
                        {field.added && <Plus className="h-4 w-4 text-green-500" />}
                        {field.modified && <RefreshCw className="h-4 w-4 text-amber-500" />}
                        <span>{field.name}</span>
                        {field.added && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            New
                          </Badge>
                        )}
                        {field.modified && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Modified
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Changes Summary */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-3 font-medium">Summary of Changes</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500/10">
                <Plus className="h-3 w-3 text-green-500" />
              </div>
              <span className="text-muted-foreground">1 field added</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10">
                <RefreshCw className="h-3 w-3 text-amber-500" />
              </div>
              <span className="text-muted-foreground">2 fields modified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-destructive/10">
                <Minus className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-muted-foreground">1 field removed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
