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
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, FileText, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"
import type { JSA } from "@/lib/types/jsa"
import { JSAFormModal } from "./jsa-form-modal"

const mockJSAs: JSA[] = [
  {
    id: "1",
    jsaNumber: "JSA-2024-001",
    title: "Excavation Work - Utility Trench",
    projectName: "Site A Development",
    location: "Site A - Zone 2",
    date: "2024-12-15",
    duration: "Full Day",
    crew: ["Mike Johnson", "Tom Anderson", "Chris Davis"],
    equipmentRequired: ["Excavator", "Shoring Equipment", "Water Pump"],
    status: "approved",
    tasks: [],
    acknowledgments: [
      {
        id: "1",
        workerId: "w1",
        workerName: "Mike Johnson",
        acknowledgedAt: "2024-12-15T07:00:00Z",
        role: "Operator",
      },
      {
        id: "2",
        workerId: "w2",
        workerName: "Tom Anderson",
        acknowledgedAt: "2024-12-15T07:05:00Z",
        role: "Laborer",
      },
    ],
    approvals: [
      {
        id: "1",
        approverId: "a1",
        approverName: "Sarah Williams",
        approvedAt: "2024-12-14T16:30:00Z",
        role: "supervisor",
        status: "approved",
      },
    ],
    createdBy: "Mike Johnson",
    createdAt: "2024-12-14T10:00:00Z",
    updatedAt: "2024-12-14T16:30:00Z",
    approvedAt: "2024-12-14T16:30:00Z",
  },
  {
    id: "2",
    jsaNumber: "JSA-2024-002",
    title: "Steel Erection - Main Building Frame",
    projectName: "Site B Construction",
    location: "Site B - Building 1",
    date: "2024-12-16",
    duration: "Full Day",
    crew: ["John Davis", "Emily Brown", "Robert Lee"],
    equipmentRequired: ["Mobile Crane", "Fall Protection", "Hand Tools"],
    status: "pending_approval",
    tasks: [],
    acknowledgments: [],
    approvals: [
      {
        id: "1",
        approverId: "a2",
        approverName: "Tom Anderson",
        role: "safety_manager",
        status: "pending",
      },
    ],
    createdBy: "John Davis",
    createdAt: "2024-12-13T14:20:00Z",
    updatedAt: "2024-12-13T14:20:00Z",
  },
  {
    id: "3",
    jsaNumber: "JSA-2024-003",
    title: "Confined Space Entry - Storage Tank",
    projectName: "Site A Development",
    location: "Site A - Tank Farm",
    date: "2024-12-17",
    duration: "Half Day",
    crew: ["Sarah Williams", "Mike Johnson"],
    equipmentRequired: ["Gas Monitor", "Ventilation Blower", "Rescue Equipment"],
    status: "active",
    tasks: [],
    acknowledgments: [
      {
        id: "1",
        workerId: "w3",
        workerName: "Sarah Williams",
        acknowledgedAt: "2024-12-17T06:30:00Z",
        role: "Entry Supervisor",
      },
    ],
    approvals: [
      {
        id: "1",
        approverId: "a3",
        approverName: "Robert Martinez",
        approvedAt: "2024-12-16T15:00:00Z",
        role: "safety_manager",
        status: "approved",
      },
    ],
    createdBy: "Sarah Williams",
    createdAt: "2024-12-16T09:00:00Z",
    updatedAt: "2024-12-16T15:00:00Z",
    approvedAt: "2024-12-16T15:00:00Z",
  },
]

export function JSAList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<JSA["status"][]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedJSA, setSelectedJSA] = useState<JSA | null>(null)
  const [jsas, setJsas] = useState<JSA[]>(mockJSAs)

  const filteredJSAs = jsas.filter((jsa) => {
    const matchesSearch =
      searchQuery === "" ||
      jsa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jsa.jsaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jsa.projectName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(jsa.status)

    return matchesSearch && matchesStatus
  })

  const toggleStatusFilter = (status: JSA["status"]) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearFilters = () => {
    setStatusFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = statusFilters.length

  const handleSave = (data: Partial<JSA>) => {
    if (selectedJSA) {
      setJsas((prev) =>
        prev.map((item) =>
          item.id === selectedJSA.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
        ),
      )
    } else {
      const newJSA: JSA = {
        id: String(jsas.length + 1),
        jsaNumber: `JSA-2024-${String(jsas.length + 1).padStart(3, "0")}`,
        status: "draft",
        crew: [],
        equipmentRequired: [],
        tasks: [],
        acknowledgments: [],
        approvals: [],
        createdBy: "Current User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as JSA
      setJsas((prev) => [newJSA, ...prev])
    }
  }

  const handleEdit = (jsa: JSA) => {
    setSelectedJSA(jsa)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Safety Analysis (JSA)</h1>
          <p className="text-muted-foreground">Analyze job tasks, identify hazards, and implement controls</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New JSA
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by JSA number, title, or project..."
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
              checked={statusFilters.includes("pending_approval")}
              onCheckedChange={() => toggleStatusFilter("pending_approval")}
            >
              Pending Approval
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("approved")}
              onCheckedChange={() => toggleStatusFilter("approved")}
            >
              Approved
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("active")}
              onCheckedChange={() => toggleStatusFilter("active")}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("completed")}
              onCheckedChange={() => toggleStatusFilter("completed")}
            >
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("archived")}
              onCheckedChange={() => toggleStatusFilter("archived")}
            >
              Archived
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredJSAs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No JSAs found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by creating your first Job Safety Analysis"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Create JSA"}
          onAction={activeFilterCount > 0 ? undefined : () => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead>Acknowledgments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJSAs.map((jsa) => (
                <TableRow key={jsa.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/jsa/${jsa.id}`} className="font-mono text-sm font-medium hover:underline">
                      {jsa.jsaNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{jsa.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleEdit(jsa)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{jsa.projectName}</TableCell>
                  <TableCell className="text-muted-foreground">{jsa.date}</TableCell>
                  <TableCell>
                    <StatusPill status={jsa.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{jsa.crew.length} workers</TableCell>
                  <TableCell>
                    {jsa.acknowledgments.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        {jsa.acknowledgments.length}/{jsa.crew.length}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not started</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <JSAFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleSave} />
      <JSAFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedJSA(null)
        }}
        jsa={selectedJSA}
        onSave={handleSave}
      />
    </div>
  )
}
