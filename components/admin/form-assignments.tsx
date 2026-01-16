"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, ChevronLeft, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import type { FormAssignment } from "@/lib/types/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const mockAssignments: FormAssignment[] = [
  {
    id: "1",
    formTemplateId: "FT-001",
    formTemplateName: "General Safety Inspection",
    moduleName: "Inspections & Audits",
    workflowStage: "Initial Review",
    required: true,
    autoCreate: false,
  },
  {
    id: "2",
    formTemplateId: "FT-002",
    formTemplateName: "Incident Report Form",
    moduleName: "Incidents & Near Miss",
    workflowStage: "Incident Submission",
    required: true,
    autoCreate: true,
  },
  {
    id: "3",
    formTemplateId: "FT-003",
    formTemplateName: "JSA Standard Template",
    moduleName: "JSA / JHA",
    workflowStage: "Task Analysis",
    required: true,
    autoCreate: false,
  },
  {
    id: "4",
    formTemplateId: "FT-004",
    formTemplateName: "Hot Work Permit Checklist",
    moduleName: "Permits to Work",
    workflowStage: "Pre-Work Assessment",
    required: true,
    autoCreate: false,
  },
  {
    id: "5",
    formTemplateId: "FT-005",
    formTemplateName: "Training Attendance Sheet",
    moduleName: "Training & Certifications",
    workflowStage: "Session Delivery",
    required: false,
    autoCreate: true,
  },
]

export function FormAssignments() {
  const [assignments, setAssignments] = useState(mockAssignments)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      searchQuery === "" ||
      assignment.formTemplateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Form Assignment</h1>
          <p className="text-muted-foreground">Assign form templates to modules and workflow stages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Form Template</DialogTitle>
              <DialogDescription>Connect a form template to a module and workflow stage</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="form-template">Form Template</Label>
                <Select>
                  <SelectTrigger id="form-template">
                    <SelectValue placeholder="Select form template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft-1">General Safety Inspection</SelectItem>
                    <SelectItem value="ft-2">Incident Report Form</SelectItem>
                    <SelectItem value="ft-3">JSA Standard Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="module">Module</Label>
                <Select>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspections">Inspections & Audits</SelectItem>
                    <SelectItem value="incidents">Incidents & Near Miss</SelectItem>
                    <SelectItem value="jsa">JSA / JHA</SelectItem>
                    <SelectItem value="permits">Permits to Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow">Workflow Stage</Label>
                <Select>
                  <SelectTrigger id="workflow">
                    <SelectValue placeholder="Select workflow stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial Review</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="required">Required Field</Label>
                  <p className="text-sm text-muted-foreground">Form must be completed to proceed</p>
                </div>
                <Switch id="required" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-create">Auto-create</Label>
                  <p className="text-sm text-muted-foreground">Automatically create form instance</p>
                </div>
                <Switch id="auto-create" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Assign Form</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by form name or module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No form assignments found"
          description="Get started by assigning your first form template"
          actionLabel="Assign Form"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Template</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Workflow Stage</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Auto-create</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="font-medium">{assignment.formTemplateName}</div>
                    <div className="text-sm text-muted-foreground">{assignment.formTemplateId}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{assignment.moduleName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{assignment.workflowStage}</Badge>
                  </TableCell>
                  <TableCell>
                    {assignment.required ? (
                      <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {assignment.autoCreate ? (
                      <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
