"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, GitBranch, ArrowRight } from "lucide-react"
import Link from "next/link"

const mockWorkflows = [
  {
    id: "inspection-workflow",
    name: "Inspection Workflow",
    module: "Inspections & Audits",
    stages: [
      {
        id: "draft",
        name: "Draft",
        requiredRole: "user" as const,
        requiresApproval: false,
        notifyUsers: false,
        autoTransition: false,
      },
      {
        id: "review",
        name: "Review",
        requiredRole: "supervisor" as const,
        requiresApproval: true,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "approved",
        name: "Approved",
        requiredRole: "manager" as const,
        requiresApproval: true,
        notifyUsers: true,
        autoTransition: false,
      },
    ],
  },
  {
    id: "incident-workflow",
    name: "Incident Investigation Workflow",
    module: "Incidents & Near Miss",
    stages: [
      {
        id: "reported",
        name: "Reported",
        requiredRole: "user" as const,
        requiresApproval: false,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "investigation",
        name: "Under Investigation",
        requiredRole: "supervisor" as const,
        requiresApproval: false,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "review",
        name: "Management Review",
        requiredRole: "manager" as const,
        requiresApproval: true,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "closed",
        name: "Closed",
        requiredRole: "manager" as const,
        requiresApproval: false,
        notifyUsers: true,
        autoTransition: false,
      },
    ],
  },
  {
    id: "permit-workflow",
    name: "Permit to Work Workflow",
    module: "Permits to Work",
    stages: [
      {
        id: "draft",
        name: "Draft",
        requiredRole: "user" as const,
        requiresApproval: false,
        notifyUsers: false,
        autoTransition: false,
      },
      {
        id: "pending",
        name: "Pending Approval",
        requiredRole: "supervisor" as const,
        requiresApproval: true,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "approved",
        name: "Approved",
        requiredRole: "manager" as const,
        requiresApproval: true,
        notifyUsers: true,
        autoTransition: false,
      },
      {
        id: "active",
        name: "Active",
        requiredRole: "supervisor" as const,
        requiresApproval: false,
        notifyUsers: false,
        autoTransition: true,
      },
      {
        id: "closed",
        name: "Closed",
        requiredRole: "supervisor" as const,
        requiresApproval: false,
        notifyUsers: true,
        autoTransition: false,
      },
    ],
  },
]

const roleColors: Record<string, string> = {
  user: "bg-chart-2/10 text-chart-2",
  supervisor: "bg-chart-4/10 text-chart-4",
  manager: "bg-chart-1/10 text-chart-1",
  admin: "bg-chart-5/10 text-chart-5",
}

export function WorkflowConfiguration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Workflow Configuration</h1>
          <p className="text-muted-foreground">Configure approval workflows and status transitions</p>
        </div>
      </div>

      <div className="space-y-6">
        {mockWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    {workflow.name}
                  </CardTitle>
                  <CardDescription className="mt-1">Module: {workflow.module}</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Edit Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {workflow.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-4">
                    <Card className="min-w-[240px] border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{stage.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Role:</span>
                          <Badge variant="secondary" className={roleColors[stage.requiredRole]}>
                            {stage.requiredRole}
                          </Badge>
                        </div>
                        {stage.requiresApproval && (
                          <Badge variant="secondary" className="w-full justify-center">
                            Requires Approval
                          </Badge>
                        )}
                        {stage.notifyUsers && (
                          <Badge variant="secondary" className="w-full justify-center bg-chart-3/10 text-chart-3">
                            Notify Users
                          </Badge>
                        )}
                        {stage.autoTransition && (
                          <Badge variant="secondary" className="w-full justify-center bg-chart-4/10 text-chart-4">
                            Auto Transition
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                    {index < workflow.stages.length - 1 && (
                      <ArrowRight className="h-6 w-6 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
