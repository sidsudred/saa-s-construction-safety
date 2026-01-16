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
import {
  Plus,
  Search,
  Filter,
  Award,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Eye,
  Download,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import type { WorkerCertification, CertificationStatus } from "@/lib/types/training"
import { certificationStatusColors } from "@/lib/types/training"

const mockCertifications: WorkerCertification[] = [
  {
    id: "1",
    workerId: "w1",
    workerName: "Mike Johnson",
    certificationType: "Confined Space Entry",
    certificationNumber: "CSE-2024-001",
    issuedDate: "2024-06-15",
    expiryDate: "2025-06-15",
    status: "active",
    issuer: "Safety Training Institute",
    verificationStatus: "verified",
    verifiedBy: "Sarah Williams",
    verifiedAt: "2024-06-16T10:00:00Z",
    trainingRecordIds: ["TRN-2024-003"],
  },
  {
    id: "2",
    workerId: "w2",
    workerName: "Tom Anderson",
    certificationType: "Fall Protection",
    certificationNumber: "FP-2023-045",
    issuedDate: "2023-12-10",
    expiryDate: "2024-12-31",
    status: "expiring_soon",
    issuer: "Height Safety Training",
    verificationStatus: "verified",
    verifiedBy: "Robert Martinez",
    verifiedAt: "2023-12-11T14:00:00Z",
  },
  {
    id: "3",
    workerId: "w3",
    workerName: "Chris Davis",
    certificationType: "Crane Operator",
    certificationNumber: "CO-2022-089",
    issuedDate: "2022-08-20",
    expiryDate: "2024-08-20",
    status: "expired",
    issuer: "Heavy Equipment Training Center",
    verificationStatus: "verified",
    verifiedBy: "Sarah Williams",
    verifiedAt: "2022-08-21T09:00:00Z",
  },
  {
    id: "4",
    workerId: "w4",
    workerName: "Emily Brown",
    certificationType: "First Aid & CPR",
    certificationNumber: "FA-2024-012",
    issuedDate: "2024-10-05",
    expiryDate: "2026-10-05",
    status: "active",
    issuer: "Red Cross",
    verificationStatus: "verified",
    verifiedBy: "Robert Martinez",
    verifiedAt: "2024-10-06T11:00:00Z",
  },
  {
    id: "5",
    workerId: "w5",
    workerName: "John Smith",
    certificationType: "Electrical Safety",
    certificationNumber: "ES-2024-067",
    issuedDate: "2024-11-20",
    expiryDate: "2025-11-20",
    status: "active",
    issuer: "Electrical Safety Board",
    verificationStatus: "pending",
  },
  {
    id: "6",
    workerId: "w2",
    workerName: "Tom Anderson",
    certificationType: "Forklift Operator",
    certificationNumber: "FO-2023-034",
    issuedDate: "2023-03-15",
    expiryDate: "2024-12-20",
    status: "expiring_soon",
    issuer: "Material Handling Training",
    verificationStatus: "verified",
    verifiedBy: "Sarah Williams",
    verifiedAt: "2023-03-16T10:00:00Z",
  },
]

export function CertificationsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<CertificationStatus[]>([])

  const filteredCertifications = mockCertifications.filter((cert) => {
    const matchesSearch =
      searchQuery === "" ||
      cert.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(cert.status)

    return matchesSearch && matchesStatus
  })

  const toggleStatusFilter = (status: CertificationStatus) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearFilters = () => {
    setStatusFilters([])
    setSearchQuery("")
  }

  const activeCount = mockCertifications.filter((c) => c.status === "active").length
  const expiringSoonCount = mockCertifications.filter((c) => c.status === "expiring_soon").length
  const expiredCount = mockCertifications.filter((c) => c.status === "expired").length

  const getStatusBadge = (status: CertificationStatus) => {
    const config = {
      active: { label: "Active", icon: Award, className: certificationStatusColors.active },
      expiring_soon: {
        label: "Expiring Soon",
        icon: AlertTriangle,
        className: certificationStatusColors.expiring_soon,
      },
      expired: { label: "Expired", icon: XCircle, className: certificationStatusColors.expired },
      revoked: { label: "Revoked", icon: XCircle, className: certificationStatusColors.revoked },
    }
    const { label, icon: Icon, className } = config[status]
    return (
      <Badge variant="outline" className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Worker Certifications</h1>
          <p className="text-muted-foreground">Track and manage worker certifications and expiry dates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/training">
              <Calendar className="mr-2 h-4 w-4" />
              Training Sessions
            </Link>
          </Button>
          <Button asChild>
            <Link href="/training/certifications/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <Award className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold">{expiringSoonCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold">{expiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by worker, certification type, or number..."
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
              checked={statusFilters.includes("active")}
              onCheckedChange={() => toggleStatusFilter("active")}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("expiring_soon")}
              onCheckedChange={() => toggleStatusFilter("expiring_soon")}
            >
              Expiring Soon
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("expired")}
              onCheckedChange={() => toggleStatusFilter("expired")}
            >
              Expired
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("revoked")}
              onCheckedChange={() => toggleStatusFilter("revoked")}
            >
              Revoked
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {statusFilters.length > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {filteredCertifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications found"
          description={
            statusFilters.length > 0
              ? "Try adjusting your filters to find what you're looking for"
              : "Get started by adding worker certifications"
          }
          actionLabel={statusFilters.length > 0 ? undefined : "Add Certification"}
          onAction={
            statusFilters.length > 0 ? undefined : () => (window.location.href = "/training/certifications/add")
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Certification Type</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertifications.map((cert) => {
                const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate)
                return (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.workerName}</TableCell>
                    <TableCell className="font-medium">{cert.certificationType}</TableCell>
                    <TableCell className="font-mono text-sm">{cert.certificationNumber}</TableCell>
                    <TableCell>{getStatusBadge(cert.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{cert.issuedDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">{cert.expiryDate}</span>
                        {cert.status === "expiring_soon" && daysUntilExpiry > 0 && (
                          <span className="text-xs text-amber-500">{daysUntilExpiry} days left</span>
                        )}
                        {cert.status === "expired" && daysUntilExpiry < 0 && (
                          <span className="text-xs text-red-500">{Math.abs(daysUntilExpiry)} days overdue</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cert.issuer}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </DropdownMenuItem>
                          {cert.verificationStatus === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Verify</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Revoke</DropdownMenuItem>
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
    </div>
  )
}
