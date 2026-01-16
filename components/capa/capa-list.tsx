"use client"

import { useState, useEffect } from "react"
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
import { PriorityIndicator } from "@/components/shared/priority-indicator"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, AlertCircle, Calendar, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import type { CapaAction, CapaStatus, CapaType, CapaPriority } from "@/lib/types/capa"
import { cn } from "@/lib/utils"
import { CapaFormModal } from "./capa-form-modal"
import { Edit, Archive } from "lucide-react"
import { capaStore } from "@/lib/store/capa-store"

const mockCapaActions: CapaAction[] = [
  {
    id: "1",
    capaNumber: "CAPA-2024-001",
    title: "Install additional safety signage",
    description: "Install warning signs near crane operation zones",
    type: "corrective",
    priority: "high",
    status: "in_progress",
    owner: "Mike Johnson",
    assignee: "Tom Anderson",
    verifier: "Sarah Williams",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-14",
    submittedAt: "2024-12-10",
    dueDate: "2024-12-18",
    problemDescription: "Insufficient warning signage identified during incident investigation",
    rootCause: "Signage not included in original site setup plan",
    immediateAction: "Verbal warnings issued to all workers",
    actionSteps: [
      {
        id: "1",
        description: "Order warning signs",
        assignee: "Tom Anderson",
        dueDate: "2024-12-12",
        status: "completed",
        completedAt: "2024-12-11",
      },
      {
        id: "2",
        description: "Install signs at identified locations",
        assignee: "Tom Anderson",
        dueDate: "2024-12-18",
        status: "in_progress",
      },
    ],
    sourceRecordId: "INC-2024-001",
    sourceRecordType: "incident",
  },
  {
    id: "2",
    capaNumber: "CAPA-2024-002",
    title: "Conduct refresher training for crane operators",
    description: "Mandatory refresher training on load calculations and safety protocols",
    type: "preventive",
    priority: "medium",
    status: "pending_verification",
    owner: "Sarah Williams",
    assignee: "Sarah Williams",
    verifier: "Mike Johnson",
    createdAt: "2024-12-08",
    updatedAt: "2024-12-13",
    submittedAt: "2024-12-08",
    dueDate: "2024-12-22",
    completedAt: "2024-12-13",
    problemDescription: "Near miss incident highlighted potential knowledge gaps",
    rootCause: "Training not conducted in past 12 months",
    actionSteps: [
      {
        id: "1",
        description: "Schedule training sessions",
        assignee: "Sarah Williams",
        dueDate: "2024-12-10",
        status: "completed",
        completedAt: "2024-12-09",
      },
      {
        id: "2",
        description: "Conduct training for all operators",
        assignee: "Sarah Williams",
        dueDate: "2024-12-15",
        status: "completed",
        completedAt: "2024-12-13",
      },
    ],
    verificationMethod: "Review training attendance records and assessment results",
    sourceRecordId: "INC-2024-001",
    sourceRecordType: "incident",
  },
  {
    id: "3",
    capaNumber: "CAPA-2024-003",
    title: "Update emergency evacuation procedures",
    description: "Revise and redistribute emergency evacuation procedures for all sites",
    type: "both",
    priority: "critical",
    status: "submitted",
    owner: "Emily Brown",
    assignee: "Tom Anderson",
    verifier: "Mike Johnson",
    createdAt: "2024-12-12",
    updatedAt: "2024-12-12",
    submittedAt: "2024-12-12",
    dueDate: "2024-12-20",
    problemDescription: "Evacuation drill revealed outdated procedures and assembly points",
    rootCause: "Procedures not updated after site layout changes",
    immediateAction: "New assembly points marked and communicated verbally",
    actionSteps: [
      {
        id: "1",
        description: "Review and update evacuation maps",
        assignee: "Tom Anderson",
        dueDate: "2024-12-15",
        status: "pending",
      },
      {
        id: "2",
        description: "Print and distribute new procedures",
        assignee: "Emily Brown",
        dueDate: "2024-12-18",
        status: "pending",
      },
      {
        id: "3",
        description: "Conduct training on new procedures",
        assignee: "Sarah Williams",
        dueDate: "2024-12-20",
        status: "pending",
      },
    ],
    sourceRecordId: "AUD-2024-012",
    sourceRecordType: "audit",
  },
  {
    id: "4",
    capaNumber: "CAPA-2024-004",
    title: "Implement PPE inspection checklist",
    description: "Develop and implement weekly PPE inspection process",
    type: "preventive",
    priority: "medium",
    status: "verified",
    owner: "Tom Anderson",
    assignee: "John Davis",
    verifier: "Sarah Williams",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-11",
    submittedAt: "2024-12-01",
    dueDate: "2024-12-15",
    completedAt: "2024-12-10",
    verifiedAt: "2024-12-11",
    problemDescription: "Multiple observations of worn or damaged PPE",
    rootCause: "No systematic inspection process in place",
    actionSteps: [
      {
        id: "1",
        description: "Create inspection checklist template",
        assignee: "John Davis",
        dueDate: "2024-12-05",
        status: "completed",
        completedAt: "2024-12-04",
      },
      {
        id: "2",
        description: "Train supervisors on inspection process",
        assignee: "John Davis",
        dueDate: "2024-12-10",
        status: "completed",
        completedAt: "2024-12-08",
      },
    ],
    verificationMethod: "Review first month of inspection records",
    verificationNotes: "Process successfully implemented, 100% compliance in week 1",
    sourceRecordId: "OBS-2024-045",
    sourceRecordType: "observation",
  },
  {
    id: "5",
    capaNumber: "CAPA-2024-005",
    title: "Repair scaffolding access points",
    description: "Fix damaged access ladders and platforms on Building 2 scaffolding",
    type: "corrective",
    priority: "high",
    status: "closed",
    owner: "Mike Johnson",
    assignee: "Tom Anderson",
    verifier: "Mike Johnson",
    createdAt: "2024-11-28",
    updatedAt: "2024-12-08",
    submittedAt: "2024-11-28",
    dueDate: "2024-12-05",
    completedAt: "2024-12-04",
    verifiedAt: "2024-12-05",
    closedAt: "2024-12-08",
    problemDescription: "Inspection identified damaged ladder rungs and loose platform boards",
    rootCause: "Normal wear and tear, insufficient preventive maintenance",
    immediateAction: "Area cordoned off, access restricted",
    actionSteps: [
      {
        id: "1",
        description: "Replace damaged ladder sections",
        assignee: "Tom Anderson",
        dueDate: "2024-12-02",
        status: "completed",
        completedAt: "2024-12-02",
      },
      {
        id: "2",
        description: "Secure all platform boards",
        assignee: "Tom Anderson",
        dueDate: "2024-12-04",
        status: "completed",
        completedAt: "2024-12-04",
      },
    ],
    verificationMethod: "Post-repair inspection",
    verificationNotes: "All repairs completed to standard, area reopened for use",
    sourceRecordId: "INS-2024-042",
    sourceRecordType: "inspection",
  },
]

const capaTypeLabels: Record<CapaType, string> = {
  corrective: "Corrective",
  preventive: "Preventive",
  both: "Both",
}

export function CapaList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<CapaStatus[]>([])
  const [typeFilters, setTypeFilters] = useState<CapaType[]>([])
  const [priorityFilters, setPriorityFilters] = useState<CapaPriority[]>([])
  const [capaActions, setCapaActions] = useState<CapaAction[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCapa, setSelectedCapa] = useState<CapaAction | null>(null)

  useEffect(() => {
    capaStore.init(mockCapaActions)
    const updateCapas = () => {
      setCapaActions(capaStore.getAll())
    }
    updateCapas()
    const unsubscribe = capaStore.subscribe(updateCapas)
    return unsubscribe
  }, [])

  const filteredActions = capaActions.filter((action) => {
    const matchesSearch =
      searchQuery === "" ||
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.capaNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(action.status)
    const matchesType = typeFilters.length === 0 || typeFilters.includes(action.type)
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(action.priority)

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const toggleStatusFilter = (status: CapaStatus) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleTypeFilter = (type: CapaType) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const togglePriorityFilter = (priority: CapaPriority) => {
    setPriorityFilters((prev) => (prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]))
  }

  const clearFilters = () => {
    setStatusFilters([])
    setTypeFilters([])
    setPriorityFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = statusFilters.length + typeFilters.length + priorityFilters.length

  // Calculate stats
  const overdueActions = capaActions.filter(
    (action) => action.status !== "closed" && action.status !== "verified" && new Date(action.dueDate) < new Date(),
  ).length

  const dueSoonActions = capaActions.filter(
    (action) =>
      action.status !== "closed" &&
      action.status !== "verified" &&
      new Date(action.dueDate) >= new Date() &&
      new Date(action.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ).length

  const completedActions = capaActions.filter(
    (action) => action.status === "verified" || action.status === "closed",
  ).length

  const isOverdue = (dueDate: string, status: CapaStatus) => {
    return status !== "closed" && status !== "verified" && new Date(dueDate) < new Date()
  }

  const isDueSoon = (dueDate: string, status: CapaStatus) => {
    const due = new Date(dueDate)
    const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return status !== "closed" && status !== "verified" && due >= new Date() && due <= soon
  }

  const handleSave = (data: Partial<CapaAction>) => {
    if (selectedCapa) {
      // Edit existing
      capaStore.update(selectedCapa.id, { ...data, updatedAt: new Date().toISOString().split("T")[0] })
    } else {
      // Create new
      const newCapa: CapaAction = {
        id: String(Date.now()),
        capaNumber: `CAPA-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        status: "draft",
        owner: "Current User",
        assignee: "Current User",
        verifier: "Safety Manager",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        actionSteps: [],
        ...data,
      } as CapaAction
      capaStore.add(newCapa)
    }
  }

  const handleEdit = (capa: CapaAction) => {
    setSelectedCapa(capa)
    setIsEditModalOpen(true)
  }

  const handleArchive = (id: string) => {
    capaStore.update(id, {
      status: "closed" as const,
      closedAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Corrective & Preventive Actions</h1>
          <p className="text-muted-foreground">Track and manage CAPA to address and prevent safety issues</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New CAPA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{overdueActions}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-chart-4/10 p-3">
              <Calendar className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due This Week</p>
              <p className="text-2xl font-bold">{dueSoonActions}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-chart-2/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedActions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by CAPA number or title..."
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
              checked={statusFilters.includes("in_progress")}
              onCheckedChange={() => toggleStatusFilter("in_progress")}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("pending_verification")}
              onCheckedChange={() => toggleStatusFilter("pending_verification")}
            >
              Pending Verification
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("verified")}
              onCheckedChange={() => toggleStatusFilter("verified")}
            >
              Verified
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("closed")}
              onCheckedChange={() => toggleStatusFilter("closed")}
            >
              Closed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("rejected")}
              onCheckedChange={() => toggleStatusFilter("rejected")}
            >
              Rejected
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
              checked={typeFilters.includes("corrective")}
              onCheckedChange={() => toggleTypeFilter("corrective")}
            >
              Corrective
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("preventive")}
              onCheckedChange={() => toggleTypeFilter("preventive")}
            >
              Preventive
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("both")}
              onCheckedChange={() => toggleTypeFilter("both")}
            >
              Both
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Priority
              {priorityFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {priorityFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={priorityFilters.includes("low")}
              onCheckedChange={() => togglePriorityFilter("low")}
            >
              Low
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={priorityFilters.includes("medium")}
              onCheckedChange={() => togglePriorityFilter("medium")}
            >
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={priorityFilters.includes("high")}
              onCheckedChange={() => togglePriorityFilter("high")}
            >
              High
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={priorityFilters.includes("critical")}
              onCheckedChange={() => togglePriorityFilter("critical")}
            >
              Critical
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredActions.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No CAPA found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by creating your first corrective or preventive action"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Create CAPA"}
          onAction={activeFilterCount > 0 ? undefined : () => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CAPA Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/capa/${action.id}`} className="font-mono text-sm font-medium hover:underline">
                      {action.capaNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{action.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{capaTypeLabels[action.type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={action.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusPill status={action.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{action.assignee}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm",
                          isOverdue(action.dueDate, action.status) && "font-medium text-destructive",
                          isDueSoon(action.dueDate, action.status) && "font-medium text-chart-4",
                        )}
                      >
                        {action.dueDate}
                      </span>
                      {isOverdue(action.dueDate, action.status) && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                      {isDueSoon(action.dueDate, action.status) && (
                        <Badge className="bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 text-xs">Due Soon</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleEdit(action)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {action.status !== "closed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleArchive(action.id)
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <CapaFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleSave} />
      <CapaFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedCapa(null)
        }}
        capa={selectedCapa}
        onSave={handleSave}
      />
    </div>
  )
}
