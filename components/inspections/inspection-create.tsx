"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileCheck } from "lucide-react"
import Link from "next/link"
import type { InspectionTemplate } from "@/lib/types/inspection"

const mockTemplates: InspectionTemplate[] = [
  {
    id: "1",
    name: "Scaffolding Inspection",
    inspectionType: "routine",
    sections: [
      {
        id: "1",
        name: "Structure & Stability",
        items: [
          {
            id: "1",
            item: "Base plates level and secure",
            requirement: "All base plates must be level and properly secured",
            severity: "high",
          },
          {
            id: "2",
            item: "Guardrails in place",
            requirement: "Top and mid rails present on all open sides",
            severity: "critical",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Electrical Safety Inspection",
    inspectionType: "routine",
    sections: [],
  },
  {
    id: "3",
    name: "Crane Pre-Task Inspection",
    inspectionType: "pre-task",
    sections: [],
  },
  {
    id: "4",
    name: "Fire Safety Equipment",
    inspectionType: "regulatory",
    sections: [],
  },
]

export function InspectionCreate() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [inspectionType, setInspectionType] = useState<string>("")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inspections">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Inspection</h1>
          <p className="text-muted-foreground">Start a new safety inspection from a template</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>Basic information about this inspection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Inspection Type</Label>
                  <Select value={inspectionType} onValueChange={setInspectionType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="pre-task">Pre-Task</SelectItem>
                      <SelectItem value="post-incident">Post-Incident</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspector Name</Label>
                  <Input id="inspector" placeholder="Enter inspector name" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Site and zone" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Inspection Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Brief description of inspection" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Additional details about this inspection..." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Template</CardTitle>
              <CardDescription>Choose a form template to structure your inspection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="template">Form Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTemplate && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium">Template Preview</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockTemplates.find((t) => t.id === selectedTemplate)?.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button size="lg" disabled={!selectedTemplate}>
              <FileCheck className="mr-2 h-4 w-4" />
              Start Inspection
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/inspections">Cancel</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>Quick select from common inspections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-all hover:bg-muted/50 ${
                    selectedTemplate === template.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{template.inspectionType}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
