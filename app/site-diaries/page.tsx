"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { SiteDiaryRecord, RecordMetadata, SiteDiaryEntry } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Calendar as CalendarIcon,
  CloudSun,
  Users,
  Briefcase,
  Search,
  ChevronRight,
  HardHat,
  Thermometer,
  CloudRain
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function SiteDiariesPage() {
  const { records, addRecord, addAuditLog } = useSafetyRecordStore()
  const [searchTerm, setSearchTerm] = useState("")

  const diaries = records.filter((r: RecordMetadata) => r.type === "site_diary") as unknown as SiteDiaryRecord[]
  const filtered = diaries.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateDiary = () => {
    const recordId = `diary-${Date.now()}`
    const recordNumber = `SD-${Date.now().toString().slice(-6)}`
    const today = new Date().toISOString().split('T')[0]

    const newRecord: SiteDiaryRecord = {
      id: recordId,
      recordNumber,
      title: `Daily Site Diary - ${today}`,
      type: "site_diary",
      status: "approved",
      priority: "medium",
      owner: "John ProjectManager",
      assignee: "Records Department",
      location: "Main Construction Site",
      description: "Daily record of site activities, safety logs, and resource usage.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectName: "Downtown Commercial Tower",
      date: today,
      weatherMain: "Sunny",
      temperature: 24,
      totalWorkers: 45,
      entries: [
        { id: "e1", timestamp: new Date().toISOString(), category: "work_progress", content: "Excavation for footings completed in Sector B.", author: "John PM" },
        { id: "e2", timestamp: new Date().toISOString(), category: "safety", content: "Site-wide toolbox talk conducted regarding working at heights.", author: "Safety Officer" }
      ]
    }

    addRecord(newRecord as any)
    addAuditLog(recordId, {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "John ProjectManager",
      action: "created",
      toStatus: "approved",
      details: "Started daily site diary entry."
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Diaries</h1>
          <p className="text-muted-foreground mt-1">Daily records of site progress, safety, and operational activities.</p>
        </div>
        <Button onClick={handleCreateDiary} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4" />
          Create Daily Entry
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search diaries by date or project..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Date Range
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <Card className="border-dashed py-20 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="bg-emerald-50 rounded-full p-4 mb-4 dark:bg-emerald-950/30">
                <CalendarIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg">No diary entries found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                Start recording daily activities to maintain a consistent site history.
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((diary) => (
            <Link key={diary.id} href={`/site-diaries/${diary.id}`}>
              <Card className="hover:border-emerald-300 transition-all cursor-pointer group shadow-sm bg-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{new Date(diary.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{new Date(diary.date).getDate()}</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-bold group-hover:text-emerald-600 transition-colors">{diary.title}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{diary.projectName}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <CloudSun className="h-3.5 w-3.5" />
                            {diary.weatherMain} ({diary.temperature}°C)
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {diary.totalWorkers} Workers
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            {diary.entries.length} Logs recorded
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-border">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 uppercase text-[10px] py-0 h-5 font-bold">Approved</Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
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
