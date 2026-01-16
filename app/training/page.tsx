"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import {
  InductionRecord,
  ToolboxTalkRecord,
  CertificationRecord,
  RecordMetadata
} from "@/lib/types/safety-record"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingKPIStrip } from "@/components/training/training-kpi-strip"
import { CertificationsTable } from "@/components/training/certifications-table"
import { ToolboxTalksList } from "@/components/training/toolbox-talks-list"
import { InductionsList } from "@/components/training/inductions-list"
import {
  GraduationCap,
  ShieldCheck,
  ClipboardList,
  Users,
  Plus,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo, useEffect } from "react"

export default function TrainingPage() {
  const { records, addRecord } = useSafetyRecordStore()

  // Auto-seed Training data if missing (for prototype persistence)
  useEffect(() => {
    const hasTraining = records.some(r => ["induction", "toolbox_talk", "certification"].includes(r.type))
    if (!hasTraining) {
      console.log("Seeding training mock data...")
      const mockCerts = [
        {
          id: "cert-1",
          recordNumber: "CERT-001",
          title: "First Aid Level 2",
          type: "certification",
          status: "approved",
          priority: "high",
          owner: "John PM",
          assignee: "Alice Smith",
          location: "Main Site",
          description: "Emergency First Response certification.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          trainingCategory: "certification",
          workerName: "Alice Smith",
          workerId: "W-001",
          completionDate: "2024-01-14",
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          issuingAuthority: "Red Cross",
          certificateNumber: "RC-99221",
          evidenceUrl: "#"
        },
        {
          id: "cert-2",
          recordNumber: "CERT-002",
          title: "Forklift Operations",
          type: "certification",
          status: "approved",
          priority: "high",
          owner: "John PM",
          assignee: "Bob Miller",
          location: "Warehouse",
          description: "Industrial forklift license.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          trainingCategory: "certification",
          workerName: "Bob Miller",
          workerId: "W-002",
          completionDate: "2023-01-14",
          expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          issuingAuthority: "WorkSafe",
          certificateNumber: "WS-11223",
          evidenceUrl: "#"
        }
      ]

      const mockTalks = [
        {
          id: "tbt-1",
          recordNumber: "TBT-001",
          title: "Morning Safety Briefing",
          type: "toolbox_talk",
          status: "completed",
          priority: "medium",
          owner: "Site Supervisor",
          assignee: "All Staff",
          location: "Muster Point",
          description: "Daily briefing on site hazards.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sessionDate: new Date().toISOString().slice(0, 10),
          topic: "Slips, Trips, and Falls",
          facilitator: "Dave Foreman",
          attendanceCount: 12,
          roster: [
            { id: "r1", name: "Alice Smith", role: "Electrician", signed: true, timestamp: new Date().toISOString() },
            { id: "r2", name: "Bob Miller", role: "Operator", signed: true, timestamp: new Date().toISOString() }
          ]
        }
      ]

      const mockInds = [
        {
          id: "ind-1",
          recordNumber: "IND-001",
          title: "General Site Induction 2026",
          type: "induction",
          status: "approved",
          priority: "high",
          owner: "HSE Manager",
          assignee: "New Starters",
          location: "Online / Office",
          description: "Mandatory site entry induction.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          trainingCategory: "induction",
          workerName: "Multiple",
          workerId: "GRP-01",
          completionDate: "2025-12-01",
          templateName: "Core Site Safety v2",
          completionRate: 85,
          validityYears: 1
        }
      ]

      mockCerts.forEach(r => addRecord(r as any))
      mockTalks.forEach(r => addRecord(r as any))
      mockInds.forEach(r => addRecord(r as any))
    }
  }, [records, addRecord])

  const trainingRecords = useMemo(() => {
    return records.filter(r => ["induction", "toolbox_talk", "certification"].includes(r.type))
  }, [records])

  const inductions = useMemo(() =>
    trainingRecords.filter(r => r.type === "induction") as unknown as InductionRecord[],
    [trainingRecords]
  )

  const toolboxTalks = useMemo(() =>
    trainingRecords.filter(r => r.type === "toolbox_talk") as unknown as ToolboxTalkRecord[],
    [trainingRecords]
  )

  const certifications = useMemo(() =>
    trainingRecords.filter(r => r.type === "certification") as unknown as CertificationRecord[],
    [trainingRecords]
  )

  const stats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const completed30d = trainingRecords.filter(r => new Date(r.createdAt) >= thirtyDaysAgo).length

    // For certifications, check expiry
    const overdue = certifications.filter(c => new Date(c.expiryDate || "") < now).length
    const expiring30d = certifications.filter(c => {
      const exp = new Date(c.expiryDate || "")
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diff > 0 && diff <= 30
    }).length
    const expiring60d = certifications.filter(c => {
      const exp = new Date(c.expiryDate || "")
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diff > 30 && diff <= 60
    }).length
    const expiring90d = certifications.filter(c => {
      const exp = new Date(c.expiryDate || "")
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diff > 60 && diff <= 90
    }).length

    return {
      completed30d,
      upcoming: 4, // Mocked
      expiring30d,
      expiring60d,
      expiring90d,
      overdue
    }
  }, [trainingRecords, certifications])

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <GraduationCap className="h-4 w-4" />
            Compliance & Development
          </div>
          <h1 className="text-3xl font-black tracking-tight font-display">Training & Certifications</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage site inductions, professional credentials, and safety briefings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-2">
            <ArrowUpRight className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Plus className="h-5 w-5" />
            Schedule Session
          </Button>
        </div>
      </div>

      <TrainingKPIStrip stats={stats} />

      <Tabs defaultValue="certifications" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none">
            <TabsTrigger value="inductions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-indigo-600 transition-all">
              Inductions
            </TabsTrigger>
            <TabsTrigger value="toolbox_talks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-indigo-600 transition-all">
              Toolbox Talks
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-indigo-600 transition-all">
              Certifications
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-indigo-600 transition-all">
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inductions" className="space-y-6 focus-visible:outline-none">
          <InductionsList inductions={inductions} />
        </TabsContent>

        <TabsContent value="toolbox_talks" className="space-y-6 focus-visible:outline-none">
          <ToolboxTalksList talks={toolboxTalks} />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6 focus-visible:outline-none">
          <CertificationsTable certs={certifications} />
        </TabsContent>

        <TabsContent value="compliance" className="focus-visible:outline-none">
          <div className="p-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/5">
            <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold text-lg">Overall Compliance Index</p>
            <p className="text-sm max-w-xs mx-auto mt-2">Aggregated safety maturity scoring based on induction rates and valid certifications. Coming in Phase 3.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
