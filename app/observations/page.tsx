"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { ObservationRecord, RecordMetadata, ObservationType } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  MapPin,
  Heart,
  MessageSquare,
  MoreHorizontal,
  LayoutGrid,
  List
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { ObservationForm } from "@/components/observations/observation-form"
import { RecordStatusPill } from "@/components/records/record-status-pill"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function ObservationsPage() {
  const { records, addRecord, addAuditLog } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const observations = records.filter((r: RecordMetadata) => r.type === "observation") as unknown as ObservationRecord[]
  const filtered = observations.filter(o =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateObservation = (data: any) => {
    const recordId = `obs-${Date.now()}`
    const recordNumber = `OBS-2026-${Math.floor(Math.random() * 9000) + 1000}`

    const newRecord: ObservationRecord = {
      id: recordId,
      recordNumber,
      title: data.title,
      type: "observation",
      status: "submitted",
      priority: data.type === "unsafe_condition" ? "high" : "medium",
      owner: "John Doe",
      assignee: "Safety Department",
      location: data.location,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      observationType: data.type,
      category: data.category,
      actionTaken: data.actionTaken,
      observerRole: "Site Supervisor"
    }

    addRecord(newRecord as any)
    addAuditLog(recordId, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "John Doe",
      action: "created",
      toStatus: "submitted",
      details: `Reported new ${data.type.replace("_", " ")} observation.`
    })

    setIsFormOpen(false)
  }

  const getTypeConfig = (type: ObservationType) => {
    switch (type) {
      case "positive": return { icon: <Heart className="h-4 w-4" />, color: "text-green-600 bg-green-50 border-green-200" }
      case "unsafe_act": return { icon: <Zap className="h-4 w-4" />, color: "text-amber-600 bg-amber-50 border-amber-200" }
      case "unsafe_condition": return { icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-600 bg-red-50 border-red-200" }
      case "near_miss": return { icon: <Eye className="h-4 w-4" />, color: "text-indigo-600 bg-indigo-50 border-indigo-200" }
      default: return { icon: <MessageSquare className="h-4 w-4" />, color: "bg-muted" }
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety Observations</h1>
          <p className="text-muted-foreground mt-1">Share feedback, report unsafe conditions, or recognize positive behavior.</p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4" />
              Report Observation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Report Safety Observation</DialogTitle>
              <DialogDescription>
                Provide details about what you observed. High-severity unsafe conditions may trigger a CAPA.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ObservationForm onSubmit={handleCreateObservation} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search observations..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border border-border rounded-lg p-1 bg-muted/10 h-10 shrink-0">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-2 h-10">
          <Filter className="h-4 w-4" />
          Type
        </Button>
      </div>

      <div className={cn(
        "grid gap-6",
        viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {filtered.length === 0 ? (
          <div className="col-span-full border-2 border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-center bg-muted/5">
            <div className="bg-indigo-50 p-4 rounded-full mb-4 dark:bg-indigo-950/30">
              <Eye className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="font-bold text-xl">No observations reported</h3>
            <p className="text-muted-foreground max-w-xs mt-2">Be the first to share feedback or report a site condition.</p>
            <Button variant="outline" className="mt-8 border-indigo-200" onClick={() => setIsFormOpen(true)}>Report Now</Button>
          </div>
        ) : (
          filtered.map((obs) => {
            const config = getTypeConfig(obs.observationType)

            return (
              <Card key={obs.id} className="group hover:border-indigo-400 transition-all shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest gap-1.5 py-0.5 border-none", config.color)}>
                      {config.icon}
                      {obs.observationType.replace("_", " ")}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tabular-nums">{obs.recordNumber}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-indigo-600 transition-colors">{obs.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {obs.description}
                  </p>

                  <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Location</span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold truncate">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {obs.location}
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Reported</span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold justify-end">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(obs.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {obs.actionTaken && (
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-wider">Action Taken</p>
                      <p className="text-xs font-medium italic line-clamp-2">{obs.actionTaken}</p>
                    </div>
                  )}
                </CardContent>
                <div className="px-6 py-4 bg-muted/5 border-t border-border/50 flex items-center justify-between group-hover:bg-indigo-50/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                      {obs.owner.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs font-bold">{obs.owner}</span>
                  </div>
                  <Link href={`/observations/${obs.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest hover:text-indigo-600">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
