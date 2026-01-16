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
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "@/components/shared/status-pill"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, Eye, ThumbsUp, ThumbsDown, Edit, Archive } from "lucide-react"
import Link from "next/link"
import type { SafetyObservation, ObservationType, ObservationCategory } from "@/lib/types/observation"
import { observationCategoryLabels } from "@/lib/types/observation"
import { ObservationFormModal } from "./observation-form-modal"

const mockObservations: SafetyObservation[] = [
  {
    id: "1",
    observationNumber: "OBS-2024-087",
    type: "negative",
    category: "ppe",
    title: "Workers not wearing hard hats",
    description: "Observed two workers in the excavation area without proper head protection",
    location: "Site C - Excavation Zone",
    observedBy: "Emily Brown",
    observedAt: "2024-12-12T14:30:00Z",
    createdAt: "2024-12-12T14:35:00Z",
    status: "submitted",
    severity: "high",
    requiresCapa: true,
    capaCreated: false,
  },
  {
    id: "2",
    observationNumber: "OBS-2024-088",
    type: "positive",
    category: "housekeeping",
    title: "Excellent site cleanliness",
    description: "Zone 2 team maintained exceptional housekeeping standards throughout the week",
    location: "Site A - Zone 2",
    observedBy: "Mike Johnson",
    observedAt: "2024-12-11T16:00:00Z",
    createdAt: "2024-12-11T16:10:00Z",
    status: "closed",
    requiresCapa: false,
  },
  {
    id: "3",
    observationNumber: "OBS-2024-086",
    type: "negative",
    category: "behavior",
    title: "Unsafe ladder usage",
    description: "Worker observed standing on top rung of ladder",
    location: "Site B - Building 3",
    observedBy: "Sarah Williams",
    observedAt: "2024-12-10T10:15:00Z",
    createdAt: "2024-12-10T10:20:00Z",
    status: "under_review",
    severity: "medium",
    requiresCapa: true,
    capaCreated: true,
  },
  {
    id: "4",
    observationNumber: "OBS-2024-089",
    type: "positive",
    category: "procedure",
    title: "Proper lockout/tagout procedure",
    description: "Electrical team followed LOTO procedures perfectly during maintenance",
    location: "Site A - Electrical Room",
    observedBy: "Tom Anderson",
    observedAt: "2024-12-13T09:00:00Z",
    createdAt: "2024-12-13T09:15:00Z",
    status: "closed",
    requiresCapa: false,
  },
]

export function ObservationsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<ObservationType[]>([])
  const [categoryFilters, setCategoryFilters] = useState<ObservationCategory[]>([])
  const [observations, setObservations] = useState<SafetyObservation[]>(mockObservations)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedObservation, setSelectedObservation] = useState<SafetyObservation | null>(null)

  const filteredObservations = observations.filter((obs) => {
    const matchesSearch =
      searchQuery === "" ||
      obs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.observationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilters.length === 0 || typeFilters.includes(obs.type)
    const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(obs.category)

    return matchesSearch && matchesType && matchesCategory
  })

  const toggleTypeFilter = (type: ObservationType) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleCategoryFilter = (category: ObservationCategory) => {
    setCategoryFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const clearFilters = () => {
    setTypeFilters([])
    setCategoryFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = typeFilters.length + categoryFilters.length

  const positiveCount = observations.filter((o) => o.type === "positive").length
  const negativeCount = observations.filter((o) => o.type === "negative").length

  const handleSave = (data: Partial<SafetyObservation>) => {
    if (selectedObservation) {
      // Edit existing
      setObservations((prev) =>
        prev.map((item) =>
          item.id === selectedObservation.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
        ),
      )
    } else {
      // Create new
      const newObservation: SafetyObservation = {
        id: String(observations.length + 1),
        observationNumber: `OBS-2024-${String(observations.length + 90).padStart(3, "0")}`,
        status: "submitted",
        observedBy: "Current User",
        observedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        requiresCapa: data.type === "negative" && data.severity === "high",
        capaCreated: false,
        ...data,
      } as SafetyObservation
      setObservations((prev) => [newObservation, ...prev])
    }
  }

  const handleEdit = (observation: SafetyObservation) => {
    setSelectedObservation(observation)
    setIsEditModalOpen(true)
  }

  const handleArchive = (id: string) => {
    setObservations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "archived" as const, updatedAt: new Date().toISOString() } : item,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Safety Observations</h1>
          <p className="text-muted-foreground">Track positive behaviors and safety concerns</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{positiveCount} Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{negativeCount} Negative</span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link
            href="/observations/create"
            onClick={(e) => {
              e.preventDefault()
              setIsCreateModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Observation
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search observations..."
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
              checked={typeFilters.includes("positive")}
              onCheckedChange={() => toggleTypeFilter("positive")}
            >
              Positive
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilters.includes("negative")}
              onCheckedChange={() => toggleTypeFilter("negative")}
            >
              Negative
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Category
              {categoryFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {categoryFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(observationCategoryLabels).map(([key, label]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={categoryFilters.includes(key as ObservationCategory)}
                onCheckedChange={() => toggleCategoryFilter(key as ObservationCategory)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredObservations.length === 0 ? (
        <EmptyState
          icon={Eye}
          title="No observations found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Start recording safety observations to improve site awareness"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Create Observation"}
          onAction={activeFilterCount > 0 ? undefined : () => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Observed By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObservations.map((observation) => (
                <TableRow key={observation.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/observations/${observation.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                    >
                      {observation.observationNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {observation.type === "positive" ? (
                      <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Positive
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-orange-500">
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Negative
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{observation.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {observationCategoryLabels[observation.category]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{observation.location}</TableCell>
                  <TableCell className="text-muted-foreground">{observation.observedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(observation.observedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={observation.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(observation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {observation.status !== "archived" && (
                        <Button variant="ghost" size="sm" onClick={() => handleArchive(observation.id)}>
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

      <ObservationFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSave={handleSave} />
      <ObservationFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedObservation(null)
        }}
        observation={selectedObservation}
        onSave={handleSave}
      />
    </div>
  )
}
