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
import { Card, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/shared/status-pill"
import { RiskBadge } from "@/components/shared/risk-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Filter, AlertTriangle, FileWarning, Edit } from "lucide-react"
import Link from "next/link"
import type { Incident, IncidentType, IncidentSeverity } from "@/lib/types/incident"
import { incidentTypeLabels, severityLabels } from "@/lib/types/incident"
import { IncidentFormDrawer } from "./incident-form-drawer"

const mockIncidents: Incident[] = [
  {
    id: "1",
    recordNumber: "INC-2024-001",
    title: "Near miss with crane operation",
    incidentType: "near_miss",
    severity: "serious",
    status: "under_investigation",
    priority: "high",
    reportedBy: "Mike Johnson",
    assignedTo: "Sarah Williams",
    affectedPersons: ["John Crane Operator"],
    witnesses: ["Tom Anderson", "Emily Brown"],
    incidentDate: "2024-12-10T14:30:00Z",
    reportedDate: "2024-12-10T15:00:00Z",
    location: "Site A - Zone 3",
    description: "Crane load swung unexpectedly during high winds, nearly striking worker below",
    immediateActions: "Work stopped, area cleared, weather conditions assessed",
    linkedPermitId: "PER-2024-023",
    createdAt: "2024-12-10T15:05:00Z",
    updatedAt: "2024-12-12T14:20:00Z",
  },
  {
    id: "2",
    recordNumber: "INC-2024-002",
    title: "Chemical spill in storage area",
    incidentType: "chemical_spill",
    severity: "moderate",
    status: "closed",
    priority: "medium",
    reportedBy: "Tom Anderson",
    assignedTo: "Mike Johnson",
    affectedPersons: [],
    witnesses: ["Sarah Williams"],
    incidentDate: "2024-12-05T10:15:00Z",
    reportedDate: "2024-12-05T10:20:00Z",
    location: "Site A - Storage",
    description: "5 gallon container of cleaning solution tipped over during transfer",
    immediateActions: "Spill kit deployed, area ventilated, material contained",
    investigation: {
      investigator: "Mike Johnson",
      startDate: "2024-12-05",
      completedDate: "2024-12-08",
      findings: "Improper container placement led to instability during movement",
      recommendations: ["Update storage procedures", "Additional training on chemical handling"],
    },
    createdAt: "2024-12-05T10:25:00Z",
    updatedAt: "2024-12-10T09:15:00Z",
    closedAt: "2024-12-10T09:15:00Z",
  },
  {
    id: "3",
    recordNumber: "INC-2024-003",
    title: "Minor hand injury - cut from sharp edge",
    incidentType: "injury",
    severity: "minor",
    injurySeverity: "first_aid",
    status: "submitted",
    priority: "low",
    reportedBy: "Emily Brown",
    assignedTo: "Sarah Williams",
    affectedPersons: ["David Smith"],
    witnesses: ["Emily Brown"],
    incidentDate: "2024-12-12T11:45:00Z",
    reportedDate: "2024-12-12T12:00:00Z",
    location: "Site B - Building 2",
    description: "Worker cut hand on exposed metal edge while moving materials",
    immediateActions: "First aid administered, sharp edge covered, area marked",
    createdAt: "2024-12-12T12:05:00Z",
    updatedAt: "2024-12-12T12:05:00Z",
  },
  {
    id: "4",
    recordNumber: "INC-2024-004",
    title: "Equipment damage - forklift collision",
    incidentType: "property_damage",
    severity: "moderate",
    status: "under_investigation",
    priority: "medium",
    reportedBy: "John Davis",
    assignedTo: "Tom Anderson",
    affectedPersons: [],
    witnesses: ["Mike Johnson", "David Smith"],
    incidentDate: "2024-12-11T16:20:00Z",
    reportedDate: "2024-12-11T16:30:00Z",
    location: "Site C - Warehouse",
    description: "Forklift backed into storage rack causing structural damage",
    immediateActions: "Forklift taken out of service, rack inspected and secured",
    linkedInspectionIds: ["INS-2024-048"],
    createdAt: "2024-12-11T16:35:00Z",
    updatedAt: "2024-12-12T10:00:00Z",
  },
  {
    id: "5",
    recordNumber: "INC-2024-005",
    title: "Near miss - falling tools from height",
    incidentType: "near_miss",
    severity: "critical",
    status: "under_investigation",
    priority: "high",
    reportedBy: "Sarah Williams",
    assignedTo: "Mike Johnson",
    affectedPersons: ["Worker below scaffold"],
    witnesses: ["Tom Anderson", "Emily Brown", "John Davis"],
    incidentDate: "2024-12-13T09:15:00Z",
    reportedDate: "2024-12-13T09:20:00Z",
    location: "Site A - Zone 1",
    description: "Tool bag fell from scaffold level 3, landing 2 meters from worker below",
    immediateActions: "Work stopped, area barricaded, all tools secured and inspected",
    linkedJSAId: "JSA-2024-012",
    createdAt: "2024-12-13T09:25:00Z",
    updatedAt: "2024-12-13T09:25:00Z",
  },
]

export function IncidentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<IncidentType[]>([])
  const [severityFilters, setSeverityFilters] = useState<IncidentSeverity[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilters.length === 0 || typeFilters.includes(incident.incidentType)
    const matchesSeverity = severityFilters.length === 0 || severityFilters.includes(incident.severity)
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(incident.status)

    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const toggleTypeFilter = (type: IncidentType) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleSeverityFilter = (severity: IncidentSeverity) => {
    setSeverityFilters((prev) => (prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]))
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearFilters = () => {
    setTypeFilters([])
    setSeverityFilters([])
    setStatusFilters([])
    setSearchQuery("")
  }

  const activeFilterCount = typeFilters.length + severityFilters.length + statusFilters.length

  // Calculate statistics
  const nearMissCount = incidents.filter((i) => i.incidentType === "near_miss").length
  const injuryCount = incidents.filter((i) => i.incidentType === "injury").length
  const criticalCount = incidents.filter((i) => i.severity === "critical").length

  const handleSave = (data: Partial<Incident>) => {
    if (selectedIncident) {
      // Edit existing
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === selectedIncident.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
        ),
      )
    } else {
      // Create new
      const newIncident: Incident = {
        id: String(incidents.length + 1),
        recordNumber: `INC-2024-${String(incidents.length + 1).padStart(3, "0")}`,
        status: "draft",
        priority: "medium",
        reportedBy: "Current User",
        assignedTo: "Safety Officer",
        affectedPersons: [],
        witnesses: [],
        incidentDate: new Date().toISOString(),
        reportedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as Incident
      setIncidents((prev) => [newIncident, ...prev])
    }
  }

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident)
    setIsEditDrawerOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents & Near Miss</h1>
          <p className="text-muted-foreground">Report, investigate, and manage workplace incidents</p>
        </div>
        <Button onClick={() => setIsCreateDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold">{incidents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Near Misses</p>
                <p className="text-2xl font-bold text-chart-4">{nearMissCount}</p>
              </div>
              <FileWarning className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Severity</p>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search incidents by number, title, or location..."
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
            {Object.entries(incidentTypeLabels).map(([key, label]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={typeFilters.includes(key as IncidentType)}
                onCheckedChange={() => toggleTypeFilter(key as IncidentType)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Severity
              {severityFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {severityFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(severityLabels).map(([key, label]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={severityFilters.includes(key as IncidentSeverity)}
                onCheckedChange={() => toggleSeverityFilter(key as IncidentSeverity)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
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
              checked={statusFilters.includes("under_investigation")}
              onCheckedChange={() => toggleStatusFilter("under_investigation")}
            >
              Under Investigation
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

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredIncidents.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No incidents found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "No incidents have been reported yet"
          }
          actionLabel={activeFilterCount > 0 ? undefined : "Report Incident"}
          onAction={activeFilterCount > 0 ? undefined : () => setIsCreateDrawerOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Incident Date</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/incidents/${incident.id}`} className="font-mono text-sm font-medium hover:underline">
                      {incident.recordNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{incident.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleEdit(incident)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{incidentTypeLabels[incident.incidentType]}</TableCell>
                  <TableCell>
                    <RiskBadge level={incident.severity} showIcon={false} />
                  </TableCell>
                  <TableCell>
                    <StatusPill status={incident.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(incident.incidentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{incident.assignedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <IncidentFormDrawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen} onSave={handleSave} />
      <IncidentFormDrawer
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          setIsEditDrawerOpen(open)
          if (!open) setSelectedIncident(null)
        }}
        incident={selectedIncident}
        onSave={handleSave}
      />
    </div>
  )
}
