"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, MoreVertical, Eye, Edit, Archive, Filter, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

import { FormCanvas } from "./form-canvas"
import type { FormField } from "./form-builder-editor"

interface FormTemplate {
  id: string
  name: string
  modules: string[]
  version: string
  status: "active" | "draft" | "archived"
  lastUpdated: string
}

const mockTemplateDefinitions: Record<string, FormField[]> = {
  "1": [ // Daily Site Inspection
    { id: "f1", type: "date", label: "Inspection Date", required: true, properties: {} },
    { id: "f2", type: "text", label: "Inspector Name", required: true, properties: { placeholder: "Enter full name" } },
    { id: "f3", type: "select", label: "Zone/Area", required: true, properties: { options: [{ label: "Zone A", value: "A" }, { label: "Zone B", value: "B" }] } },
    { id: "f4", type: "checkbox", label: "PPE Compliance Check", required: false, properties: { checkboxLabel: "All workers wearing required PPE" } },
    { id: "f5", type: "checkbox", label: "Housekeeping Check", required: false, properties: { checkboxLabel: "Walkways clear of debris" } },
    { id: "f6", type: "paragraph", label: "Observations & Comments", required: false, properties: { placeholder: "Note any issues found..." } },
    { id: "f7", type: "signature", label: "Inspector Signature", required: true, properties: {} },
  ],
  "2": [ // Incident Report
    { id: "i1", type: "datetime", label: "Time of Incident", required: true, properties: {} },
    { id: "i2", type: "select", label: "Incident Type", required: true, properties: { options: [{ label: "Injury", value: "injury" }, { label: "Near Miss", value: "near_miss" }, { label: "Property Damage", value: "property" }] } },
    { id: "i3", type: "text", label: "Location Details", required: true, properties: {} },
    { id: "i4", type: "paragraph", label: "Description of Event", required: true, properties: { placeholder: "Describe what happened..." } },
    { id: "i5", type: "roster", label: "Affected Persons", required: false, properties: {} },
    { id: "i6", type: "annotated-image", label: "Photo Evidence", required: false, properties: {} },
  ],
  "3": [ // Hot Work Permit
    { id: "p1", type: "label", label: "WARNING", required: false, properties: { text: "Ensure fire watch is present during all hot work operations." } },
    { id: "p2", type: "text", label: "Job Description", required: true, properties: {} },
    { id: "p3", type: "checkbox", label: "Fire Extinguisher Present", required: true, properties: { checkboxLabel: "Verified available and charged" } },
    { id: "p4", type: "checkbox", label: "Combustibles Removed", required: true, properties: { checkboxLabel: "Area cleared within 35ft" } },
    { id: "p5", type: "datetime", label: "Valid From", required: true, properties: {} },
    { id: "p6", type: "datetime", label: "Valid Until", required: true, properties: {} },
    { id: "p7", type: "signature", label: "Supervisor Authorization", required: true, properties: {} },
  ],
  "4": [ // Training Completion
    { id: "t1", type: "text", label: "Trainee Name", required: true, properties: {} },
    { id: "t2", type: "text", label: "Course Title", required: true, properties: {} },
    { id: "t3", type: "date", label: "Completion Date", required: true, properties: {} },
    { id: "t4", type: "number", label: "Score Achieved", required: false, properties: {} },
    { id: "t5", type: "signature", label: "Instructor Signature", required: true, properties: {} },
  ],
  "5": [ // Equipment Inspection
    { id: "e1", type: "text", label: "Equipment ID/Tag", required: true, properties: {} },
    { id: "e2", type: "number", label: "Current Odometer/Hours", required: true, properties: {} },
    { id: "e3", type: "radio", label: "Condition Rating", required: true, properties: { options: [{ label: "Good", value: "good" }, { label: "Fair", value: "fair" }, { label: "Poor", value: "poor" }] } },
    { id: "e4", type: "paragraph", label: "Maintenance Needs", required: false, properties: {} },
  ],
  "6": [ // Near Miss (Legacy)
    { id: "n1", type: "text", label: "Event Title", required: true, properties: {} },
    { id: "n2", type: "paragraph", label: "Description", required: true, properties: {} },
    { id: "n3", type: "label", label: "Legacy Form", required: false, properties: { text: "This form is deprecated. Please use the new Incident Report form." } },
  ]
}

const mockTemplates: FormTemplate[] = [
  {
    id: "1",
    name: "Daily Site Inspection Form",
    modules: ["Inspections", "Safety"],
    version: "v2.1",
    status: "active",
    lastUpdated: "2024-01-12",
  },
  {
    id: "2",
    name: "Incident Report Form",
    modules: ["Incidents"],
    version: "v3.0",
    status: "active",
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Hot Work Permit",
    modules: ["Permits", "Safety"],
    version: "v1.5",
    status: "active",
    lastUpdated: "2024-01-08",
  },
  {
    id: "4",
    name: "Training Completion Certificate",
    modules: ["Training"],
    version: "v2.0",
    status: "active",
    lastUpdated: "2024-01-05",
  },
  {
    id: "5",
    name: "Equipment Inspection Checklist",
    modules: ["Inspections", "Equipment"],
    version: "v1.8",
    status: "draft",
    lastUpdated: "2023-12-28",
  },
  {
    id: "6",
    name: "Near Miss Report (Legacy)",
    modules: ["Incidents"],
    version: "v1.2",
    status: "archived",
    lastUpdated: "2023-11-15",
  },
]

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-chart-3/10 text-chart-3",
  },
  draft: {
    label: "Draft",
    className: "bg-chart-2/10 text-chart-2",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground",
  },
}

export function FormTemplatesList() {
  const router = useRouter()
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["active", "draft"])

  const allModules = Array.from(new Set(mockTemplates.flatMap((template) => template.modules))).sort()

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule =
      selectedModules.length === 0 || template.modules.some((module) => selectedModules.includes(module))
    const matchesStatus = selectedStatuses.includes(template.status)

    return matchesSearch && matchesModule && matchesStatus
  })

  const handleModuleToggle = (module: string) => {
    setSelectedModules((prev) => (prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]))
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const handlePreview = (template: FormTemplate) => {
    setPreviewTemplate(template)
  }

  const handleEdit = (templateId: string) => {
    router.push(`/form-builder/editor/${templateId}`)
  }

  const handleArchive = (templateId: string) => {
    console.log("[v0] Archiving template:", templateId)
    alert(`Template ${templateId} archived`)
  }

  const handleCreateTemplate = () => {
    router.push("/form-builder/editor/new")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Templates</h1>
          <p className="text-sm text-muted-foreground">Create and manage reusable form templates</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="mr-2 h-4 w-4" />
              Module
              {selectedModules.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {selectedModules.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Module</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allModules.map((module) => (
              <DropdownMenuCheckboxItem
                key={module}
                checked={selectedModules.includes(module)}
                onCheckedChange={() => handleModuleToggle(module)}
              >
                {module}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="mr-2 h-4 w-4" />
              Status
              {selectedStatuses.length < 3 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.includes("active")}
              onCheckedChange={() => handleStatusToggle("active")}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.includes("draft")}
              onCheckedChange={() => handleStatusToggle("draft")}
            >
              Draft
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.includes("archived")}
              onCheckedChange={() => handleStatusToggle("archived")}
            >
              Archived
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Templates Table */}
      {filteredTemplates.length > 0 ? (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Module(s)</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.modules.map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{template.version}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(statusConfig[template.status].className)}>
                      {statusConfig[template.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(template.lastUpdated).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(template)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(template.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleArchive(template.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No templates found"
          description="No form templates match your current filters. Try adjusting your search or create a new template."
          actionLabel="Create Template"
          onAction={handleCreateTemplate}
        />
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              Version {previewTemplate?.version} • {previewTemplate?.modules.join(", ")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {previewTemplate && mockTemplateDefinitions[previewTemplate.id] ? (
              <FormCanvas
                fields={mockTemplateDefinitions[previewTemplate.id]}
                selectedField={null}
                onFieldSelect={() => { }}
                onFieldDelete={() => { }}
                onFieldReorder={() => { }}
                isPreviewMode={true}
              />
            ) : (
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Form content not available</p>
                <p className="mt-2 text-xs text-muted-foreground">This template definition is missing.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
            <Button onClick={() => previewTemplate && handleEdit(previewTemplate.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
