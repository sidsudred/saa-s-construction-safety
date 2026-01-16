"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { PermitRecord, RecordMetadata } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, FileText, ShieldAlert, Clock, MapPin, Activity, ChevronRight, AlertCircle } from "lucide-react"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function PermitsListPage() {
  const { records } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter for permits
  const permitRecords = records.filter((r: RecordMetadata) => r.type === "permit") as unknown as PermitRecord[]
  const filteredRecords = permitRecords.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.permitType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPermitTypeIcon = (type: string) => {
    switch (type) {
      case "hot_work": return <Activity className="h-4 w-4 text-orange-500" />
      case "working_at_height": return <ShieldAlert className="h-4 w-4 text-blue-500" />
      case "confined_space": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permit to Work (PTW)</h1>
          <p className="text-muted-foreground mt-1">Manage high-risk work authorizations and validity periods.</p>
        </div>
        <Link href="/permits/new">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Issue New Permit
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permits by ID, type, or scope..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Status
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <Card className="border-dashed py-20 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="bg-blue-50 rounded-full p-4 mb-4 dark:bg-blue-950/30">
                <ShieldAlert className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">No permits found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                Issue a permit to authorize high-risk activities like hot work or confined space entry.
              </p>
              <Link href="/permits/new" className="mt-6">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">Issue Permit</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const isExpired = new Date(record.validUntil) < new Date()
            const isSoon = !isExpired && (new Date(record.validUntil).getTime() - Date.now()) < (2 * 60 * 60 * 1000)

            return (
              <Link key={record.id} href={`/permits/${record.id}`}>
                <Card className={cn(
                  "hover:border-blue-300 transition-all cursor-pointer group shadow-sm bg-card overflow-hidden",
                  isExpired ? "opacity-75 grayscale-[0.5]" : ""
                )}>
                  <CardContent className="p-0">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{record.recordNumber}</span>
                          <RecordStatusPill status={record.status} />
                          {isExpired && <Badge variant="destructive" className="h-4 text-[9px] uppercase">Expired</Badge>}
                          {isSoon && <Badge className="h-4 text-[9px] bg-amber-500 hover:bg-amber-600 text-white uppercase animate-pulse">Expiring</Badge>}
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          {getPermitTypeIcon(record.permitType)}
                          {record.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {record.location}
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <Activity className="h-3.5 w-3.5" /> {record.permitType.replace("_", " ")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(record.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 md:border-l md:pl-6 border-border">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Receiver</p>
                          <p className="text-sm font-bold truncate max-w-[120px]">{record.receiverId}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
