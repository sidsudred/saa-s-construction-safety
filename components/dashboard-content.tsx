"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusPill } from "@/components/shared/status-pill"
import { RiskBadge } from "@/components/shared/risk-badge"
import { PriorityIndicator } from "@/components/shared/priority-indicator"
import { FilterPanel } from "@/components/shared/filter-panel"
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react"

import { seedDemoData } from "@/lib/seed-data"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function DashboardContent() {
  const router = useRouter()

  const handleReset = () => {
    seedDemoData()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Safety Dashboard</h1>
          <p className="text-muted-foreground">Overview of safety metrics and recent activity</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => router.push("/incidents")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 critical, 9 standard</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => router.push("/inspections")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => router.push("/capa")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Actions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => router.push("/analytics")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Latest safety incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => router.push(`/incidents/${incident.id}`)}
                  className="flex cursor-pointer items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0 transition-colors hover:bg-accent/30 rounded-lg p-2 -m-2"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{incident.title}</p>
                    <p className="text-sm text-muted-foreground">{incident.location}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <RiskBadge level={incident.risk} />
                      <StatusPill status={incident.status} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{incident.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Corrective actions requiring completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => router.push(`/capa/${action.id}`)}
                  className="flex cursor-pointer items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0 transition-colors hover:bg-accent/30 rounded-lg p-2 -m-2"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.assignee}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <PriorityIndicator priority={action.priority} />
                      <span className="text-xs text-muted-foreground">Due: {action.dueDate}</span>
                    </div>
                  </div>
                  <StatusPill status={action.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Records</CardTitle>
              <CardDescription>Filter and view all safety records</CardDescription>
            </div>
            <FilterPanel />
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

const mockIncidents = [
  {
    id: 1,
    title: "Scaffolding collapse near Building A",
    location: "Zone 3, Level 5",
    risk: "critical" as const,
    status: "submitted" as const,
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Near miss - falling tools",
    location: "Zone 1, Ground Level",
    risk: "high" as const,
    status: "approved" as const,
    date: "5 hours ago",
  },
  {
    id: 3,
    title: "PPE violation observed",
    location: "Zone 2, Level 3",
    risk: "medium" as const,
    status: "draft" as const,
    date: "1 day ago",
  },
]

const mockActions = [
  {
    id: 1,
    title: "Replace damaged safety barriers",
    assignee: "Mike Johnson",
    priority: "high" as const,
    status: "submitted" as const,
    dueDate: "Tomorrow",
  },
  {
    id: 2,
    title: "Conduct safety training for new workers",
    assignee: "Sarah Williams",
    priority: "medium" as const,
    status: "approved" as const,
    dueDate: "Dec 20",
  },
  {
    id: 3,
    title: "Update emergency evacuation plan",
    assignee: "Tom Anderson",
    priority: "low" as const,
    status: "draft" as const,
    dueDate: "Dec 25",
  },
]
