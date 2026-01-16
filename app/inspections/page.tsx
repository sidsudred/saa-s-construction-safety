"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { InspectionRecord, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, FileText, AlertTriangle, User, MapPin, Clock } from "lucide-react"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function InspectionsListPage() {
  const { records } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter for inspections
  const inspectionRecords = records.filter((r: RecordMetadata) => r.type === "inspection") as unknown as InspectionRecord[]
  const filteredRecords = inspectionRecords.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections & Audits</h1>
          <p className="text-muted-foreground mt-1">Manage and track site safety inspections and audits.</p>
        </div>
        <Link href="/inspections/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Inspection
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inspections..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <Card className="border-dashed py-20">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No inspections found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                Get started by creating your first safety inspection or audit.
              </p>
              <Link href="/inspections/new" className="mt-6">
                <Button>Create Inspection</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Link key={record.id} href={`/inspections/${record.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                <CardContent className="p-0">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{record.recordNumber}</span>
                        <RecordStatusPill status={record.status} />
                        {record.riskScore && record.riskScore > 75 && (
                          <Badge variant="destructive" className="h-4 text-[10px] uppercase py-0">High Risk</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{record.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> {record.inspector || record.owner}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {record.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:border-l md:pl-6 border-border">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Compliance</p>
                        <p className={cn("text-xl font-black", record.passRate && record.passRate > 80 ? "text-green-600" : "text-amber-600 font-bold")}>
                          {record.passRate || 0}%
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
