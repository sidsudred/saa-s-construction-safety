"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, FileText, GitBranch, Bell, FileCheck, ShieldCheck, Users, Activity } from "lucide-react"
import Link from "next/link"

const adminSections = [
  {
    title: "Module Configuration",
    description: "Enable or disable modules and configure module settings",
    icon: Settings,
    href: "/admin/modules",
    stats: "8 modules active",
  },
  {
    title: "Form Assignment",
    description: "Assign form templates to modules and workflows",
    icon: FileText,
    href: "/admin/forms",
    stats: "23 forms assigned",
  },
  {
    title: "Workflow Configuration",
    description: "Configure approval workflows and status transitions",
    icon: GitBranch,
    href: "/admin/workflows",
    stats: "5 workflows configured",
  },
  {
    title: "Notification Rules",
    description: "Set up automated notifications and alerts",
    icon: Bell,
    href: "/admin/notifications",
    stats: "12 rules active",
  },
  {
    title: "Policies & Procedures",
    description: "Manage safety policies and procedure documents",
    icon: FileCheck,
    href: "/admin/policies",
    stats: "45 documents",
  },
  {
    title: "Permission Simulation",
    description: "Test and preview what different roles can see",
    icon: ShieldCheck,
    href: "/admin/permissions",
    stats: "4 roles configured",
  },
  {
    title: "User Management",
    description: "Manage users, roles, and access control",
    icon: Users,
    href: "/admin/users",
    stats: "127 active users",
  },
  {
    title: "System Logs",
    description: "View system activity and audit trails",
    icon: Activity,
    href: "/admin/logs",
    stats: "2,456 events today",
  },
]

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin & Configuration</h1>
        <p className="text-muted-foreground">Manage system settings, workflows, and configuration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.href} className="group transition-colors hover:bg-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{section.stats}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={section.href}>Configure</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
