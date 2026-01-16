"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "@/components/shared/status-pill"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, ChevronLeft, FileText, Download, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import type { PolicyDocument } from "@/lib/types/admin"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const mockPolicies: PolicyDocument[] = [
  {
    id: "1",
    title: "Personal Protective Equipment (PPE) Policy",
    category: "Safety Equipment",
    version: "3.2",
    effectiveDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "active",
    fileUrl: "/policies/ppe-policy.pdf",
    fileSize: "2.4 MB",
    uploadedBy: "Sarah Williams",
    uploadedAt: "2024-01-10",
    acknowledgedBy: ["user1", "user2", "user3"],
  },
  {
    id: "2",
    title: "Confined Space Entry Procedure",
    category: "Work Procedures",
    version: "2.1",
    effectiveDate: "2024-02-01",
    expiryDate: "2025-02-01",
    status: "active",
    fileUrl: "/policies/confined-space.pdf",
    fileSize: "3.8 MB",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-01-28",
    acknowledgedBy: ["user1", "user4"],
  },
  {
    id: "3",
    title: "Incident Investigation Guidelines",
    category: "Procedures",
    version: "1.5",
    effectiveDate: "2024-03-01",
    status: "active",
    fileUrl: "/policies/incident-investigation.pdf",
    fileSize: "1.9 MB",
    uploadedBy: "Tom Anderson",
    uploadedAt: "2024-02-25",
    acknowledgedBy: ["user2", "user3", "user5"],
  },
  {
    id: "4",
    title: "Emergency Response Plan",
    category: "Emergency",
    version: "4.0",
    effectiveDate: "2023-06-01",
    expiryDate: "2024-06-01",
    status: "expired",
    fileUrl: "/policies/emergency-response.pdf",
    fileSize: "5.2 MB",
    uploadedBy: "Sarah Williams",
    uploadedAt: "2023-05-20",
    acknowledgedBy: [],
  },
  {
    id: "5",
    title: "Hot Work Safety Policy - DRAFT",
    category: "Work Procedures",
    version: "1.0",
    effectiveDate: "2024-04-01",
    status: "draft",
    fileUrl: "/policies/hot-work-draft.pdf",
    fileSize: "2.1 MB",
    uploadedBy: "Emily Brown",
    uploadedAt: "2024-03-15",
  },
]

export function PolicyManagement() {
  const [policies, setPolicies] = useState(mockPolicies)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      searchQuery === "" ||
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold">Policies & Procedures</h1>
          <p className="text-muted-foreground">Manage safety policies and procedure documents</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Policy
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredPolicies.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No policies found"
          description="Get started by uploading your first policy document"
          actionLabel="Upload Policy"
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Acknowledged By</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div className="font-medium">{policy.title}</div>
                    <div className="text-sm text-muted-foreground">{policy.fileSize}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{policy.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{policy.version}</TableCell>
                  <TableCell>
                    <StatusPill status={policy.status as any} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{policy.effectiveDate}</div>
                    {policy.expiryDate && (
                      <div className="text-xs text-muted-foreground">Expires: {policy.expiryDate}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{policy.acknowledgedBy?.length || 0} users</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
