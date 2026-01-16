"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RecordMetadata, WorkflowState, AuditLogEntry, Evidence, LinkedRecord } from "@/lib/types/safety-record"
import { WorkflowActions } from "./workflow-actions"
import { RecordStatusPill } from "./record-status-pill"
import { AuditTimeline } from "./audit-timeline"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, User, Calendar, FileText, Link as LinkIcon, AlertTriangle, History } from "lucide-react"
import Link from "next/link"

interface RecordDetailProps {
  record: RecordMetadata
  auditLogs: AuditLogEntry[]
  evidence: Evidence[]
  linkedRecords: LinkedRecord[]
  onStatusChange: (to: WorkflowState) => void
  summaryContent: React.ReactNode
  findingsContent?: React.ReactNode
  evidenceContent?: React.ReactNode
  linkedContent?: React.ReactNode
  actionsContent?: React.ReactNode
  moduleName: string
  modulePath: string
}

export function RecordDetail({
  record,
  auditLogs,
  evidence,
  linkedRecords,
  onStatusChange,
  summaryContent,
  findingsContent,
  evidenceContent,
  linkedContent,
  actionsContent,
  moduleName,
  modulePath,
}: RecordDetailProps) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href={modulePath}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {moduleName} • {record.recordNumber}
                  </span>
                  <RecordStatusPill status={record.status} />
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">{record.title}</h1>
              </div>
            </div>

            <WorkflowActions
              currentStatus={record.status}
              onTransition={onStatusChange}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="bg-background border border-border w-full justify-start h-auto p-1 mb-6">
                <TabsTrigger value="summary" className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-muted">
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="evidence" className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-muted">
                  <AlertTriangle className="h-4 w-4" />
                  Evidence
                </TabsTrigger>
                <TabsTrigger value="findings" className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-muted">
                  <History className="h-4 w-4" />
                  Findings
                </TabsTrigger>
                <TabsTrigger value="linked" className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-muted">
                  <LinkIcon className="h-4 w-4" />
                  Linked Records
                </TabsTrigger>
              </TabsList>

              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <TabsContent value="summary" className="m-0 focus-visible:ring-0">
                  <div className="p-6 md:p-8">
                    {summaryContent}
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="m-0 focus-visible:ring-0">
                  <div className="p-6 md:p-8">
                    {evidenceContent || (
                      <div className="text-center py-12 text-muted-foreground">
                        No evidence files attached to this record
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="findings" className="m-0 focus-visible:ring-0">
                  <div className="p-6 md:p-8">
                    {findingsContent || (
                      <div className="text-center py-12 text-muted-foreground">
                        Module-specific findings will be displayed here
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="linked" className="m-0 focus-visible:ring-0">
                  <div className="p-6 md:p-8">
                    {linkedContent || (
                      <div className="text-center py-12 text-muted-foreground">
                        No linked records found
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar / Info Panel */}
          <div className="space-y-8">
            <Card className="shadow-sm border-border overflow-hidden rounded-xl">
              <CardHeader className="bg-muted/30 border-b border-border py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Record Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                    <User className="h-3 w-3" /> Owner
                  </span>
                  <p className="text-sm font-semibold">{record.owner}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                    <User className="h-3 w-3" /> Assignee
                  </span>
                  <p className="text-sm font-semibold">{record.assignee || "Not Assigned"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                    <MapPin className="h-3 w-3" /> Location
                  </span>
                  <p className="text-sm font-semibold">{record.location}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                    <Calendar className="h-3 w-3" /> Created
                  </span>
                  <p className="text-xs">{new Date(record.createdAt).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                    <Calendar className="h-3 w-3" /> Due Date
                  </span>
                  <p className="text-sm font-semibold text-amber-600">
                    {record.dueDate ? new Date(record.dueDate).toLocaleDateString() : "No Deadline"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border overflow-hidden rounded-xl">
              <CardHeader className="bg-muted/30 border-b border-border py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Audit Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AuditTimeline logs={auditLogs} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
