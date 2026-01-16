"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Eye, Edit, Ban, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import { StatusPill } from "@/components/shared/status-pill"
import { EmptyState } from "@/components/shared/empty-state"
import type { Permit } from "@/lib/types/permit"
import { permitTypeLabels, permitTypeColors } from "@/lib/types/permit"
import { PermitActionModal } from "./permit-action-modal"

const mockPermits: Permit[] = [
  {
    id: "1",
    permitNumber: "PER-2024-001",
    title: "Welding Work - Structural Steel",
    type: "hot_work",
    status: "active",
    location: "Site A - Building 3",
    workDescription: "Welding structural steel beams for new construction",
    validFrom: "2024-12-20T08:00:00Z",
    validTo: "2024-12-20T17:00:00Z",
    contractor: "Steel Solutions Inc.",
    supervisor: "Mike Johnson",
    safetyContact: "Sarah Williams",
    emergencyNumber: "911",
    hazards: [],
    additionalPrecautions: [],
    ppeRequired: ["Welding Helmet", "Fire-resistant Clothing", "Safety Boots"],
    acknowledgments: [],
    linkedJSAIds: ["JSA-2024-001"],
    createdBy: "Sarah Williams",
    createdAt: "2024-12-19T10:00:00Z",
    updatedAt: "2024-12-19T14:30:00Z",
    approvedAt: "2024-12-19T14:30:00Z",
    approvedBy: "Robert Martinez",
  },
  {
    id: "2",
    permitNumber: "PER-2024-002",
    title: "Confined Space Entry - Tank Inspection",
    type: "confined_space",
    status: "approved",
    location: "Site B - Tank Farm",
    workDescription: "Annual inspection of storage tank interior",
    validFrom: "2024-12-21T09:00:00Z",
    validTo: "2024-12-21T15:00:00Z",
    contractor: "Inspection Services Co.",
    supervisor: "Tom Anderson",
    safetyContact: "Sarah Williams",
    emergencyNumber: "911",
    hazards: [],
    additionalPrecautions: [],
    ppeRequired: ["Respirator", "Harness", "Gas Monitor", "Communication Device"],
    acknowledgments: [],
    createdBy: "Tom Anderson",
    createdAt: "2024-12-18T11:00:00Z",
    updatedAt: "2024-12-18T16:00:00Z",
    approvedAt: "2024-12-18T16:00:00Z",
    approvedBy: "Robert Martinez",
  },
  {
    id: "3",
    permitNumber: "PER-2024-003",
    title: "Roof Repair - Building 1",
    type: "height",
    status: "suspended",
    location: "Site A - Building 1",
    workDescription: "Emergency roof leak repair",
    validFrom: "2024-12-19T08:00:00Z",
    validTo: "2024-12-19T16:00:00Z",
    contractor: "Roofing Experts LLC",
    supervisor: "Chris Davis",
    safetyContact: "Sarah Williams",
    emergencyNumber: "911",
    hazards: [],
    additionalPrecautions: [],
    ppeRequired: ["Harness", "Hard Hat", "Non-slip Boots"],
    acknowledgments: [],
    suspendedAt: "2024-12-19T13:00:00Z",
    suspendedBy: "Sarah Williams",
    suspensionReason: "High winds - unsafe working conditions",
    createdBy: "Chris Davis",
    createdAt: "2024-12-18T15:00:00Z",
    updatedAt: "2024-12-19T13:00:00Z",
    approvedAt: "2024-12-18T16:30:00Z",
    approvedBy: "Robert Martinez",
  },
  {
    id: "4",
    permitNumber: "PER-2024-004",
    title: "Underground Cable Installation",
    type: "excavation",
    status: "pending_approval",
    location: "Site C - Parking Lot",
    workDescription: "Trenching for new electrical cable runs",
    validFrom: "2024-12-22T07:00:00Z",
    validTo: "2024-12-24T17:00:00Z",
    contractor: "Underground Services Inc.",
    supervisor: "David Wilson",
    safetyContact: "Sarah Williams",
    emergencyNumber: "911",
    hazards: [],
    additionalPrecautions: [],
    ppeRequired: ["Hard Hat", "High-vis Vest", "Safety Boots", "Gloves"],
    acknowledgments: [],
    createdBy: "David Wilson",
    createdAt: "2024-12-19T09:00:00Z",
    updatedAt: "2024-12-19T09:00:00Z",
  },
]

export function PermitsList() {
  const [permits, setPermits] = useState<Permit[]>(mockPermits)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [actionModal, setActionModal] = useState<{
    open: boolean
    action: "suspend" | "revoke" | "complete" | "reactivate"
    permitId: string
    permitNumber: string
  } | null>(null)

  const filteredPermits = permits.filter((permit) => {
    const matchesSearch =
      permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || permit.status === statusFilter
    const matchesType = typeFilter === "all" || permit.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getValidityStatus = (permit: Permit) => {
    if (permit.status !== "active") return null

    const now = new Date()
    const validTo = new Date(permit.validTo)
    const hoursRemaining = (validTo.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursRemaining < 0) {
      return { label: "Expired", color: "text-red-500" }
    } else if (hoursRemaining < 2) {
      return { label: `${Math.floor(hoursRemaining * 60)}m remaining`, color: "text-orange-500" }
    } else if (hoursRemaining < 8) {
      return { label: `${Math.floor(hoursRemaining)}h remaining`, color: "text-amber-500" }
    }
    return null
  }

  const handleAction = (
    permitId: string,
    permitNumber: string,
    action: "suspend" | "revoke" | "complete" | "reactivate",
  ) => {
    setActionModal({ open: true, action, permitId, permitNumber })
  }

  const handleConfirmAction = (reason?: string) => {
    if (!actionModal) return

    setPermits((prev) =>
      prev.map((permit) => {
        if (permit.id !== actionModal.permitId) return permit

        const now = new Date().toISOString()
        const updates: Partial<Permit> = { updatedAt: now }

        switch (actionModal.action) {
          case "suspend":
            updates.status = "suspended"
            updates.suspendedAt = now
            updates.suspendedBy = "Current User"
            updates.suspensionReason = reason
            break
          case "revoke":
            updates.status = "revoked"
            updates.revokedAt = now
            updates.revokedBy = "Current User"
            updates.revocationReason = reason
            break
          case "complete":
            updates.status = "completed"
            updates.completedAt = now
            updates.completedBy = "Current User"
            break
          case "reactivate":
            updates.status = "active"
            updates.suspendedAt = undefined
            updates.suspendedBy = undefined
            updates.suspensionReason = undefined
            break
        }

        return { ...permit, ...updates }
      }),
    )

    setActionModal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permit to Work</h1>
          <p className="text-muted-foreground">Manage work permits and authorizations</p>
        </div>
        <Button asChild>
          <Link href="/permits/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Permit
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Permit Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hot_work">Hot Work</SelectItem>
            <SelectItem value="confined_space">Confined Space</SelectItem>
            <SelectItem value="height">Working at Height</SelectItem>
            <SelectItem value="electrical">Electrical Work</SelectItem>
            <SelectItem value="excavation">Excavation</SelectItem>
            <SelectItem value="lifting">Lifting Operations</SelectItem>
            <SelectItem value="energy_isolation">Energy Isolation</SelectItem>
            <SelectItem value="cold_work">Cold Work</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPermits.length === 0 ? (
        <EmptyState
          icon={Ban}
          title="No permits found"
          description="No permits match your current filters. Try adjusting your search criteria."
          action={{
            label: "Create Permit",
            href: "/permits/create",
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permit Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validity Period</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermits.map((permit) => {
                const validityStatus = getValidityStatus(permit)
                return (
                  <TableRow key={permit.id}>
                    <TableCell>
                      <Link href={`/permits/${permit.id}`} className="font-medium hover:underline">
                        {permit.permitNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{permit.title}</TableCell>
                    <TableCell>
                      <Badge className={permitTypeColors[permit.type]}>{permitTypeLabels[permit.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusPill status={permit.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {new Date(permit.validFrom).toLocaleString()} - {new Date(permit.validTo).toLocaleString()}
                        </div>
                        {validityStatus && (
                          <div className={`flex items-center gap-1 text-xs font-medium ${validityStatus.color}`}>
                            <Clock className="h-3 w-3" />
                            {validityStatus.label}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{permit.location}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/permits/${permit.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {permit.status === "draft" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/permits/edit/${permit.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Permit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {permit.status === "active" && (
                            <>
                              <DropdownMenuItem onClick={() => handleAction(permit.id, permit.permitNumber, "suspend")}>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Permit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(permit.id, permit.permitNumber, "complete")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Complete Permit
                              </DropdownMenuItem>
                            </>
                          )}
                          {permit.status === "suspended" && (
                            <DropdownMenuItem
                              onClick={() => handleAction(permit.id, permit.permitNumber, "reactivate")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate Permit
                            </DropdownMenuItem>
                          )}
                          {(permit.status === "approved" ||
                            permit.status === "active" ||
                            permit.status === "suspended") && (
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleAction(permit.id, permit.permitNumber, "revoke")}
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Revoke Permit
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {actionModal && (
        <PermitActionModal
          open={actionModal.open}
          onOpenChange={(open) => !open && setActionModal(null)}
          action={actionModal.action}
          permitNumber={actionModal.permitNumber}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  )
}
