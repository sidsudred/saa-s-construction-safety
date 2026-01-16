"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, GraduationCap, Calendar, MoreVertical, Users, Clock } from "lucide-react"
import Link from "next/link"
import type { Training, TrainingType, TrainingStatus } from "@/lib/types/training"
import { trainingTypeLabels } from "@/lib/types/training"
import { TrainingFormModal } from "./training-form-modal"
import { Edit, X } from "lucide-react"

const mockTrainings: Training[] = [
  {
    id: "1",
    trainingNumber: "TRN-2024-001",
    title: "Site Safety Induction",
    type: "induction",
    status: "scheduled",
    date: "2024-12-20",
    duration: 120,
    location: "Site A - Training Room",
    trainer: "Sarah Williams",
    description: "Mandatory safety induction for all new site workers",
    topics: ["Site Rules", "Emergency Procedures", "PPE Requirements", "Hazard Identification"],
    requiredFor: ["All Workers"],
    maxAttendees: 25,
    createdBy: "Sarah Williams",
    createdAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-10T10:00:00Z",
  },
  {
    id: "2",
    trainingNumber: "TRN-2024-002",
    title: "Excavation Safety Toolbox Talk",
    type: "toolbox_talk",
    status: "completed",
    date: "2024-12-15",
    duration: 30,
    location: "Site A - Zone 2",
    trainer: "Mike Johnson",
    description: "Daily toolbox talk on excavation hazards and controls",
    topics: ["Trench Safety", "Cave-in Prevention", "Equipment Safety", "Utility Location"],
    createdBy: "Mike Johnson",
    createdAt: "2024-12-15T07:00:00Z",
    updatedAt: "2024-12-15T08:00:00Z",
    completedAt: "2024-12-15T07:30:00Z",
  },
  {
    id: "3",
    trainingNumber: "TRN-2024-003",
    title: "Confined Space Entry Certification",
    type: "certification",
    status: "in_progress",
    date: "2024-12-18",
    duration: 480,
    location: "Training Center",
    trainer: "Robert Martinez",
    description: "Full day certification course for confined space entry",
    topics: ["Hazard Recognition", "Atmospheric Testing", "Ventilation", "Emergency Rescue", "Permit Systems"],
    requiredFor: ["Confined Space Work"],
    maxAttendees: 12,
    createdBy: "Robert Martinez",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-18T09:00:00Z",
  },
  {
    id: "4",
    trainingNumber: "TRN-2024-004",
    title: "Fall Protection Refresher",
    type: "refresher",
    status: "scheduled",
    date: "2024-12-22",
    duration: 90,
    location: "Site B - Training Area",
    trainer: "Emily Brown",
    description: "Refresher training on fall protection systems",
    topics: ["Harness Inspection", "Anchor Points", "Rescue Procedures", "Equipment Care"],
    requiredFor: ["Work at Height"],
    maxAttendees: 15,
    createdBy: "Emily Brown",
    createdAt: "2024-12-12T14:00:00Z",
    updatedAt: "2024-12-12T14:00:00Z",
  },
]

export function TrainingList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<TrainingType[]>([])
  const [statusFilters, setStatusFilters] = useState<TrainingStatus[]>([])
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      searchQuery === "" ||
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.trainingNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilters.length === 0 || typeFilters.includes(training.type)
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(training.status)

    return matchesSearch && matchesType && matchesStatus
  })

  const handleSave = (data: Partial<Training>) => {
    if (selectedTraining) {
      // Edit existing
      setTrainings((prev) =>
        prev.map((item) =>
          item.id === selectedTraining.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
        ),
      )
    } else {
      // Create new
      const newTraining: Training = {
        id: String(trainings.length + 1),
        trainingNumber: `TRN-2024-${String(trainings.length + 1).padStart(3, "0")}`,
        status: "scheduled",
        topics: [],
        createdBy: "Current User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as Training
      setTrainings((prev) => [newTraining, ...prev])
    }
  }

  const handleEdit = (training: Training) => {
    setSelectedTraining(training)
    setIsEditModalOpen(true)
  }

  const handleCancel = (id: string) => {
    setTrainings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "cancelled" as const, updatedAt: new Date().toISOString() } : item,
      ),
    )
  }

  const getStatusBadge = (status: TrainingStatus) => {
    const config = {
      scheduled: { label: "Scheduled", className: "bg-chart-4/10 text-chart-4" },
      in_progress: { label: "In Progress", className: "bg-chart-2/10 text-chart-2" },
      completed: { label: "Completed", className: "bg-chart-3/10 text-chart-3" },
      cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
    }
    const { label, className } = config[status]
    return (
      <Badge variant="secondary" className={className}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training & Certifications</h1>
          <p className="text-muted-foreground">Manage training sessions and worker certifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/training/certifications">
              <GraduationCap className="mr-2 h-4 w-4" />
              Certifications
            </Link>
          </Button>
          <Button
            asChild
            onClick={(e) => {
              e.preventDefault()
              setIsCreateModalOpen(true)
            }}
          >
            <Link href="/training/create">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Training
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
              <Calendar className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
              <p className="text-2xl font-bold">{trainings.filter((t) => t.status === "scheduled").length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{trainings.filter((t) => t.status === "in_progress").length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
              <GraduationCap className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{trainings.filter((t) => t.status === "completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

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
              checked={typeFilters.includes("induction")}
              onCheckedChange={() => {
                const updatedFilters = typeFilters.includes("induction")
                  ? typeFilters.filter((t) => t !== "induction")
                  : [...typeFilters, "induction"]
                setTypeFilters(updatedFilters)
              }}
            >
              Site Induction
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("toolbox_talk")}
              onCheckedChange={() => {
                const updatedFilters = typeFilters.includes("toolbox_talk")
                  ? typeFilters.filter((t) => t !== "toolbox_talk")
                  : [...typeFilters, "toolbox_talk"]
                setTypeFilters(updatedFilters)
              }}
            >
              Toolbox Talk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("refresher")}
              onCheckedChange={() => {
                const updatedFilters = typeFilters.includes("refresher")
                  ? typeFilters.filter((t) => t !== "refresher")
                  : [...typeFilters, "refresher"]
                setTypeFilters(updatedFilters)
              }}
            >
              Refresher Training
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("certification")}
              onCheckedChange={() => {
                const updatedFilters = typeFilters.includes("certification")
                  ? typeFilters.filter((t) => t !== "certification")
                  : [...typeFilters, "certification"]
                setTypeFilters(updatedFilters)
              }}
            >
              Certification Course
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
              checked={statusFilters.includes("scheduled")}
              onCheckedChange={() => {
                const updatedFilters = statusFilters.includes("scheduled")
                  ? statusFilters.filter((s) => s !== "scheduled")
                  : [...statusFilters, "scheduled"]
                setStatusFilters(updatedFilters)
              }}
            >
              Scheduled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("in_progress")}
              onCheckedChange={() => {
                const updatedFilters = statusFilters.includes("in_progress")
                  ? statusFilters.filter((s) => s !== "in_progress")
                  : [...statusFilters, "in_progress"]
                setStatusFilters(updatedFilters)
              }}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("completed")}
              onCheckedChange={() => {
                const updatedFilters = statusFilters.includes("completed")
                  ? statusFilters.filter((s) => s !== "completed")
                  : [...statusFilters, "completed"]
                setStatusFilters(updatedFilters)
              }}
            >
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("cancelled")}
              onCheckedChange={() => {
                const updatedFilters = statusFilters.includes("cancelled")
                  ? statusFilters.filter((s) => s !== "cancelled")
                  : [...statusFilters, "cancelled"]
                setStatusFilters(updatedFilters)
              }}
            >
              Cancelled
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {typeFilters.length + statusFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              setTypeFilters([])
              setStatusFilters([])
              setSearchQuery("")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {filteredTrainings.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No trainings found"
          description={
            typeFilters.length + statusFilters.length > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by scheduling your first training session"
          }
          actionLabel={typeFilters.length + statusFilters.length > 0 ? undefined : "Schedule Training"}
          onAction={typeFilters.length + statusFilters.length > 0 ? undefined : () => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/training/${training.id}`} className="font-mono text-sm font-medium hover:underline">
                      {training.trainingNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{training.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{trainingTypeLabels[training.type]}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(training.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{training.date}</TableCell>
                  <TableCell className="text-muted-foreground">{training.duration} min</TableCell>
                  <TableCell className="text-muted-foreground">{training.trainer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(training)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {training.status !== "cancelled" && training.status !== "completed" && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(training.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/training/${training.id}/attendance`}>
                              <Users className="mr-2 h-4 w-4" />
                              View Attendance
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TrainingFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleSave} />
      <TrainingFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedTraining(null)
        }}
        training={selectedTraining}
        onSave={handleSave}
      />
    </div>
  )
}
