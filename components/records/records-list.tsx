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
import { StatusPill } from "@/components/shared/status-pill"
import { PriorityIndicator } from "@/components/shared/priority-indicator"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, FileText } from "lucide-react"
import Link from "next/link"
import type { SafetyRecord, RecordStatus, RecordType } from "@/lib/types/safety-record"

const mockRecords: SafetyRecord[] = [
  {
    id: "1",
    recordNumber: "INC-2024-001",
    title: "Near miss with crane operation",
    type: "incident",
    status: "under_review",
    priority: "high",
    owner: "Mike Johnson",
    assignee: "Sarah Williams",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-12",
    submittedAt: "2024-12-11",
    location: "Site A - Zone 3",
    description: "Crane operator reported near miss incident during lifting operation",
  },
  {
    id: "2",
    recordNumber: "INS-2024-045",
    title: "Weekly scaffolding inspection",
    type: "inspection",
    status: "approved",
    priority: "medium",
    owner: "Tom Anderson",
    assignee: "Tom Anderson",
    createdAt: "2024-12-08",
    updatedAt: "2024-12-09",
    submittedAt: "2024-12-08",
    approvedAt: "2024-12-09",
    location: "Site B - Building 2",
    description: "Regular safety inspection of scaffolding structures",
  },
  {
    id: "3",
    recordNumber: "PER-2024-023",
    title: "Hot work permit - welding operations",
    type: "permit",
    status: "approved",
    priority: "high",
    owner: "John Davis",
    assignee: "Mike Johnson",
    createdAt: "2024-12-11",
    updatedAt: "2024-12-11",
    submittedAt: "2024-12-11",
    approvedAt: "2024-12-11",
    location: "Site A - Zone 1",
    description: "Hot work permit for welding activities in confined space",
  },
  {
    id: "4",
    recordNumber: "OBS-2024-087",
    title: "Safety observation - PPE compliance",
    type: "observation",
    status: "submitted",
    priority: "low",
    owner: "Emily Brown",
    assignee: "Sarah Williams",
    createdAt: "2024-12-12",
    updatedAt: "2024-12-12",
    submittedAt: "2024-12-12",
    location: "Site C - Entrance",
    description: "Observed workers not wearing hard hats in designated area",
  },
  {
    id: "5",
    recordNumber: "INC-2024-002",
    title: "Material spill in storage area",
    type: "incident",
    status: "closed",
    priority: "medium",
    owner: "Mike Johnson",
    assignee: "Tom Anderson",
    createdAt: "2024-12-05",
    updatedAt: "2024-12-10",
    submittedAt: "2024-12-05",
    approvedAt: "2024-12-06",
    closedAt: "2024-12-10",
    location: "Site A - Storage",
    description: "Chemical material spilled during transfer operation",
  },
]

const recordTypeLabels: Record<RecordType, string> = {
  incident: "Incident",
  inspection: "Inspection",
  permit: "Permit",
  observation: "Observation",
  training: "Training",
  audit: "Audit",
}

export function RecordsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<RecordStatus[]>([])
  const [typeFilters, setTypeFilters] = useState<RecordType[]>([])

  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recordNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(record.status)
    const matchesType = typeFilters.length === 0 || typeFilters.includes(record.type)

    return matchesSearch && matchesStatus && matchesType
  })

  const toggleStatusFilter = (status: RecordStatus) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleTypeFilter = (type: RecordType) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setStatusFilters([])
    setTypeFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = statusFilters.length + typeFilters.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Safety Records</h1>
          <p className="text-muted-foreground">Manage all safety-related records and documentation</p>
        </div>
        <Button asChild>
          <Link href="/records/create">
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by record number or title..."
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
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("archived")}
              onCheckedChange={() => toggleStatusFilter("archived")}
            >
              Archived
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
              checked={typeFilters.includes("incident")}
              onCheckedChange={() => toggleTypeFilter("incident")}
            >
              Incident
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("inspection")}
              onCheckedChange={() => toggleTypeFilter("inspection")}
            >
              Inspection
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("permit")}
              onCheckedChange={() => toggleTypeFilter("permit")}
            >
              Permit
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("observation")}
              onCheckedChange={() => toggleTypeFilter("observation")}
            >
              Observation
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("training")}
              onCheckedChange={() => toggleTypeFilter("training")}
            >
              Training
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("audit")}
              onCheckedChange={() => toggleTypeFilter("audit")}
            >
              Audit
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No records found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by creating your first safety record"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Create Record"}
          onAction={activeFilterCount > 0 ? undefined : () => (window.location.href = "/records/create")}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/records/${record.id}`} className="font-mono text-sm font-medium hover:underline">
                      {record.recordNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell className="text-muted-foreground">{recordTypeLabels[record.type]}</TableCell>
                  <TableCell>
                    <StatusPill status={record.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={record.priority} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{record.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
