"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Eye,
  CheckSquare,
  GraduationCap,
  BarChart3,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import type { Module } from "@/lib/types/admin"

const mockModules: Module[] = [
  {
    id: "inspections",
    name: "Inspections & Audits",
    description: "Conduct safety inspections and create audit reports",
    enabled: true,
    icon: "ClipboardCheck",
    routes: ["/inspections", "/inspections/create", "/inspections/[id]"],
  },
  {
    id: "incidents",
    name: "Incidents & Near Miss",
    description: "Report and investigate safety incidents",
    enabled: true,
    icon: "AlertTriangle",
    routes: ["/incidents", "/incidents/create", "/incidents/[id]"],
  },
  {
    id: "jsa",
    name: "JSA / JHA",
    description: "Job Safety Analysis and hazard assessments",
    enabled: true,
    icon: "FileCheck",
    routes: ["/jsa", "/jsa/create", "/jsa/[id]"],
  },
  {
    id: "permits",
    name: "Permits to Work",
    description: "Issue and manage work permits",
    enabled: true,
    icon: "ShieldCheck",
    routes: ["/permits", "/permits/create", "/permits/[id]"],
  },
  {
    id: "observations",
    name: "Observations & Site Diaries",
    description: "Safety observations and daily site logs",
    enabled: true,
    icon: "Eye",
    routes: ["/observations", "/site-diaries"],
  },
  {
    id: "capa",
    name: "Corrective Actions",
    description: "Track corrective and preventive actions",
    enabled: true,
    icon: "CheckSquare",
    routes: ["/capa", "/capa/create", "/capa/[id]"],
  },
  {
    id: "training",
    name: "Training & Certifications",
    description: "Manage safety training and certifications",
    enabled: true,
    icon: "GraduationCap",
    routes: ["/training", "/training/certifications"],
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    description: "Safety metrics and performance analytics",
    enabled: true,
    icon: "BarChart3",
    routes: ["/analytics"],
  },
]

const iconMap: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Eye,
  CheckSquare,
  GraduationCap,
  BarChart3,
}

export function ModuleConfiguration() {
  const [modules, setModules] = useState(mockModules)

  const toggleModule = (moduleId: string) => {
    setModules((prev) => prev.map((mod) => (mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod)))
  }

  const enabledCount = modules.filter((m) => m.enabled).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Module Configuration</h1>
          <p className="text-muted-foreground">Enable or disable modules across the platform</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {enabledCount}/{modules.length}
          </div>
          <div className="text-sm text-muted-foreground">modules enabled</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = iconMap[module.icon] || ClipboardCheck
          return (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        module.enabled ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${module.enabled ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                      <CardDescription className="mt-1">{module.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor={`module-${module.id}`} className="text-sm font-medium">
                      {module.enabled ? "Enabled" : "Disabled"}
                    </Label>
                    <p className="text-xs text-muted-foreground">{module.routes.length} route(s) affected</p>
                  </div>
                  <Switch
                    id={`module-${module.id}`}
                    checked={module.enabled}
                    onCheckedChange={() => toggleModule(module.id)}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
