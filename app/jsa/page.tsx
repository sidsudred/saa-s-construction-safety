"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { JSARecord, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, FileText, ClipboardCheck, Clock, MapPin, User, ChevronRight } from "lucide-react"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function JSAListPage() {
  const { records } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter for JSA
  const jsaRecords = records.filter((r: RecordMetadata) => r.type === "jsa") as unknown as JSARecord[]
  const filteredRecords = jsaRecords.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Safety Analysis (JSA)</h1>
          <p className="text-muted-foreground mt-1">Hazard assessments, task breakdowns, and worker roster sign-offs.</p>
        </div>
        <Link href="/jsa/new">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4" />
            Create JSA / JHA
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search JSA records..."
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
              <div className="bg-indigo-50 rounded-full p-4 mb-4 dark:bg-indigo-950/30">
                <ClipboardCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg">No JSA records found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                JSAs are required before starting any high-risk tasks. Create one now to get started.
              </p>
              <Link href="/jsa/new" className="mt-6">
                <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">New JSA</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Link key={record.id} href={`/jsa/${record.id}`}>
              <Card className="hover:border-indigo-300 transition-all cursor-pointer group shadow-sm bg-card hover:shadow-md">
                <CardContent className="p-0">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 border-l-4 border-indigo-500 pl-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{record.recordNumber}</span>
                        <RecordStatusPill status={record.status} />
                        <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase font-bold text-indigo-600 border-indigo-100 bg-indigo-50/50">
                          {record.taskSteps?.length || 0} Steps
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{record.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {record.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> Prepared by {record.owner}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:border-l md:pl-6 border-border">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Roster</p>
                        <p className="text-sm font-bold">
                          {record.roster?.filter(w => w.signed).length} / {record.roster?.length} Signed
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
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
