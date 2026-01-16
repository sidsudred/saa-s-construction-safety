"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { IncidentRecord, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, AlertTriangle, Clock, MapPin, User, ShieldAlert } from "lucide-react"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function IncidentsListPage() {
  const { records } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter for incidents
  const incidentRecords = records.filter((r: RecordMetadata) => r.type === "incident") as unknown as IncidentRecord[]
  const filteredRecords = incidentRecords.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "moderate": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "serious": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "major": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "critical": return "bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100"
      case "fatality": return "bg-slate-900 text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents & Near Misses</h1>
          <p className="text-muted-foreground mt-1">Track site incidents, near misses, and investigation progress.</p>
        </div>
        <Link href="/incidents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Report Incident
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents by ID or title..."
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
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No incidents reported</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                All clear! No incidents or near misses have been recorded for this project yet.
              </p>
              <Link href="/incidents/new" className="mt-6">
                <Button>Report Incident</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Link key={record.id} href={`/incidents/${record.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                <CardContent className="p-0">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{record.recordNumber}</span>
                        <RecordStatusPill status={record.status} />
                        <Badge variant="outline" className={cn("text-[10px] py-0 h-4 uppercase font-bold border-none", getSeverityColor(record.severity))}>
                          {record.severity}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{record.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5 capitalize">
                          <ShieldAlert className="h-3.5 w-3.5" /> {record.incidentType.replace("_", " ")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {record.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {new Date(record.dateOfOccurrence).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:border-l md:pl-6 border-border">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Investigation</p>
                        <Badge variant={record.investigationStatus === "complete" ? "outline" : "secondary"} className={cn("h-5 text-[9px]", record.investigationStatus === "complete" && "border-green-500 text-green-600 bg-green-50 uppercase font-bold")}>
                          {(record.investigationStatus || "Pending").toUpperCase()}
                        </Badge>
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
