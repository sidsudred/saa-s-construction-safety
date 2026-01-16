"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/shared/status-pill"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, FileCheck, AlertTriangle, CheckCircle2, Edit } from "lucide-react"
import Link from "next/link"
import type { InspectionRecord } from "@/lib/types/inspection"
import type { RecordStatus } from "@/lib/types/safety-record"
import { InspectionFormModal } from "./inspection-form-modal"

const inspectionTypeLabels = {
  routine: "Routine",
  "pre-task": "Pre-Task",
  "post-incident": "Post-Incident",
  regulatory: "Regulatory",
  quality: "Quality",
}

const mockInspections: InspectionRecord[] = [
  {
    id: "1",
    recordNumber: "INS-2024-045",
    title: "Weekly scaffolding inspection",
    type: "inspection",
    inspectionType: "routine",
    status: "approved",
    priority: "medium",
    owner: "Tom Anderson",
    assignee: "Tom Anderson",
    inspectorName: "Tom Anderson",
    createdAt: "2024-12-08",
    updatedAt: "2024-12-09",
    submittedAt: "2024-12-08",
    approvedAt: "2024-12-09",
    inspectionDate: "2024-12-08",
    location: "Site B - Building 2",
    description: "Regular safety inspection of scaffolding structures",
    items: [],
    overallResult: "pass",
    failedItemsCount: 0,
    passRate: 100,
  },
  {
    id: "2",
    recordNumber: "INS-2024-046",
    title: "Electrical safety inspection",
    type: "inspection",
    inspectionType: "routine",
    status: "under_review",
    priority: "high",
    owner: "Mike Johnson",
    assignee: "Sarah Williams",
    inspectorName: "Mike Johnson",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-11",
    submittedAt: "2024-12-10",
    inspectionDate: "2024-12-10",
    location: "Site A - Zone 1",
    description: "Monthly electrical systems safety inspection",
    items: [],
    overallResult: "fail",
    failedItemsCount: 3,
    passRate: 87.5,
  },
  {
    id: "3",
    recordNumber: "INS-2024-047",
    title: "Pre-task crane inspection",
    type: "inspection",
    inspectionType: "pre-task",
    status: "approved",
    priority: "high",
    owner: "John Davis",
    assignee: "John Davis",
    inspectorName: "John Davis",
    createdAt: "2024-12-11",
    updatedAt: "2024-12-11",
    submittedAt: "2024-12-11",
    approvedAt: "2024-12-11",
    inspectionDate: "2024-12-11",
    location: "Site A - Zone 3",
    description: "Pre-operational crane safety check",
    items: [],
    overallResult: "conditional",
    failedItemsCount: 1,
    passRate: 95.8,
  },
  {
    id: "4",
    recordNumber: "INS-2024-048",
    title: "Fire safety equipment inspection",
    type: "inspection",
    inspectionType: "regulatory",
    status: "submitted",
    priority: "high",
    owner: "Emily Brown",
    assignee: "Tom Anderson",
    inspectorName: "Emily Brown",
    createdAt: "2024-12-12",
    updatedAt: "2024-12-12",
    submittedAt: "2024-12-12",
    inspectionDate: "2024-12-12",
    location: "Site C - All Zones",
    description: "Quarterly fire safety equipment compliance check",
    items: [],
    overallResult: "pass",
    failedItemsCount: 0,
    passRate: 100,
  },
]

export function InspectionsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<RecordStatus[]>([])
  const [typeFilters, setTypeFilters] = useState<InspectionRecord["inspectionType"][]>([])
  const [resultFilters, setResultFilters] = useState<InspectionRecord["overallResult"][]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null)
  const [inspections, setInspections] = useState<InspectionRecord[]>(mockInspections)

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      searchQuery === "" ||
      inspection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.recordNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(inspection.status)
    const matchesType = typeFilters.length === 0 || typeFilters.includes(inspection.inspectionType)
    const matchesResult = resultFilters.length === 0 || resultFilters.includes(inspection.overallResult)

    return matchesSearch && matchesStatus && matchesType && matchesResult
  })

  const toggleStatusFilter = (status: RecordStatus) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleTypeFilter = (type: InspectionRecord["inspectionType"]) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleResultFilter = (result: InspectionRecord["overallResult"]) => {
    setResultFilters((prev) => (prev.includes(result) ? prev.filter((r) => r !== result) : [...prev, result]))
  }

  const clearFilters = () => {
    setStatusFilters([])
    setTypeFilters([])
    setResultFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = statusFilters.length + typeFilters.length + resultFilters.length

  const getResultIcon = (result: InspectionRecord["overallResult"]) => {
    switch (result) {
      case "pass":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "fail":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "conditional":
        return <AlertTriangle className="h-4 w-4 text-warning" />
    }
  }

  const getResultBadge = (result: InspectionRecord["overallResult"]) => {
    switch (result) {
      case "pass":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Pass</Badge>
      case "fail":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Fail</Badge>
      case "conditional":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Conditional</Badge>
    }
  }

  const handleSave = (data: Partial<InspectionRecord>) => {
    if (selectedInspection) {
      setInspections((prev) =>
        prev.map((item) =>
          item.id === selectedInspection.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
        ),
      )
    } else {
      const newInspection: InspectionRecord = {
        id: String(inspections.length + 1),
        recordNumber: `INS-2024-${String(inspections.length + 1).padStart(3, "0")}`,
        type: "inspection",
        status: "draft",
        priority: "medium",
        owner: "Current User",
        assignee: "Current User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inspectionDate: new Date().toISOString().split("T")[0],
        items: [],
        overallResult: "pass",
        failedItemsCount: 0,
        passRate: 100,
        ...data,
      } as InspectionRecord
      setInspections((prev) => [newInspection, ...prev])
    }
  }

  const handleEdit = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspections & Audits</h1>
          <p className="text-muted-foreground">Conduct and manage safety inspections and compliance audits</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inspections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Status
              {statusFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {statusFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("draft")}
              onCheckedChange={() => toggleStatusFilter("draft")}
            >
              Draft
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("submitted")}
              onCheckedChange={() => toggleStatusFilter("submitted")}
            >
              Submitted
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("under_review")}
              onCheckedChange={() => toggleStatusFilter("under_review")}
            >
              Under Review
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("approved")}
              onCheckedChange={() => toggleStatusFilter("approved")}
            >
              Approved
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("closed")}
              onCheckedChange={() => toggleStatusFilter("closed")}
            >
              Closed
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Type
              {typeFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {typeFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("routine")}
              onCheckedChange={() => toggleTypeFilter("routine")}
            >
              Routine
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("pre-task")}
              onCheckedChange={() => toggleTypeFilter("pre-task")}
            >
              Pre-Task
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("post-incident")}
              onCheckedChange={() => toggleTypeFilter("post-incident")}
            >
              Post-Incident
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("regulatory")}
              onCheckedChange={() => toggleTypeFilter("regulatory")}
            >
              Regulatory
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("quality")}
              onCheckedChange={() => toggleTypeFilter("quality")}
            >
              Quality
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Result
              {resultFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {resultFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Result</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={resultFilters.includes("pass")}
              onCheckedChange={() => toggleResultFilter("pass")}
            >
              Pass
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={resultFilters.includes("conditional")}
              onCheckedChange={() => toggleResultFilter("conditional")}
            >
              Conditional
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={resultFilters.includes("fail")}
              onCheckedChange={() => toggleResultFilter("fail")}
            >
              Fail
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredInspections.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No inspections found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by creating your first inspection"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Create Inspection"}
          onAction={activeFilterCount > 0 ? undefined : () => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Pass Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/inspections/${inspection.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                    >
                      {inspection.recordNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{inspection.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleEdit(inspection)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inspectionTypeLabels[inspection.inspectionType]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inspection.inspectorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResultIcon(inspection.overallResult)}
                      {getResultBadge(inspection.overallResult)}
                      {inspection.failedItemsCount > 0 && (
                        <span className="text-xs text-muted-foreground">({inspection.failedItemsCount} failed)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-success transition-all"
                          style={{ width: `${inspection.passRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{inspection.passRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={inspection.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inspection.inspectionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InspectionFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleSave} />
      <InspectionFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedInspection(null)
        }}
        inspection={selectedInspection}
        onSave={handleSave}
      />
    </div>
  )
}
