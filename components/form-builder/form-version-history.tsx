"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreVertical, Eye, GitCompare, RotateCcw, Download } from "lucide-react"
import Link from "next/link"
import { VersionComparison } from "./version-comparison"

interface FormVersion {
  id: string
  version: string
  publishedDate: string
  publishedBy: string
  changes: string
  isCurrent: boolean
}

const mockVersions: FormVersion[] = [
  {
    id: "v2.1",
    version: "2.1",
    publishedDate: "2024-01-15",
    publishedBy: "Sarah Chen",
    changes: "Added photo evidence field and updated safety checklist",
    isCurrent: true,
  },
  {
    id: "v2.0",
    version: "2.0",
    publishedDate: "2024-01-10",
    publishedBy: "Mike Torres",
    changes: "Major update: Restructured form sections and added conditional logic",
    isCurrent: false,
  },
  {
    id: "v1.5",
    version: "1.5",
    publishedDate: "2023-12-20",
    publishedBy: "Sarah Chen",
    changes: "Added weather conditions field",
    isCurrent: false,
  },
  {
    id: "v1.4",
    version: "1.4",
    publishedDate: "2023-12-05",
    publishedBy: "John Martinez",
    changes: "Updated validation rules for date fields",
    isCurrent: false,
  },
  {
    id: "v1.3",
    version: "1.3",
    publishedDate: "2023-11-22",
    publishedBy: "Sarah Chen",
    changes: "Added signature field for supervisor approval",
    isCurrent: false,
  },
  {
    id: "v1.2",
    version: "1.2",
    publishedDate: "2023-11-10",
    publishedBy: "Mike Torres",
    changes: "Fixed field validation issues",
    isCurrent: false,
  },
  {
    id: "v1.1",
    version: "1.1",
    publishedDate: "2023-11-01",
    publishedBy: "Sarah Chen",
    changes: "Minor layout improvements",
    isCurrent: false,
  },
  {
    id: "v1.0",
    version: "1.0",
    publishedDate: "2023-10-15",
    publishedBy: "John Martinez",
    changes: "Initial release",
    isCurrent: false,
  },
]

export function FormVersionHistory() {
  const [compareVersions, setCompareVersions] = useState<{
    version1: FormVersion | null
    version2: FormVersion | null
  }>({ version1: null, version2: null })
  const [userRole] = useState<"admin" | "user">("admin") // Mock user role

  const handleCompare = (version: FormVersion) => {
    if (!compareVersions.version1) {
      setCompareVersions({ ...compareVersions, version1: version })
    } else if (!compareVersions.version2) {
      setCompareVersions({ ...compareVersions, version2: version })
    }
  }

  const handleCancelCompare = () => {
    setCompareVersions({ version1: null, version2: null })
  }

  const handleRestore = (version: FormVersion) => {
    console.log("Restoring version:", version.version)
    // In real app, this would call an API to restore the version
  }

  // If comparing versions, show comparison view
  if (compareVersions.version1 && compareVersions.version2) {
    return (
      <VersionComparison
        version1={compareVersions.version1}
        version2={compareVersions.version2}
        onClose={handleCancelCompare}
      />
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/form-builder/templates">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Version History</h1>
              <p className="text-sm text-muted-foreground">Daily Site Inspection Form</p>
            </div>
          </div>
          {compareVersions.version1 && !compareVersions.version2 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Selected: v{compareVersions.version1.version}</Badge>
              <Button variant="outline" size="sm" onClick={handleCancelCompare}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Published By</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVersions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">v{version.version}</span>
                      {version.isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(version.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{version.publishedBy}</TableCell>
                  <TableCell>
                    <p className="text-sm">{version.changes}</p>
                  </TableCell>
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompare(version)}>
                          <GitCompare className="mr-2 h-4 w-4" />
                          {compareVersions.version1 ? "Compare with" : "Compare"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        {!version.isCurrent && userRole === "admin" && (
                          <DropdownMenuItem onClick={() => handleRestore(version)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
