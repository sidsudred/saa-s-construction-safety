"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { RecordType } from "@/lib/types/safety-record"

const formTemplates = [
  { id: "1", name: "Incident Report - Basic", type: "incident" },
  { id: "2", name: "Incident Report - Detailed Investigation", type: "incident" },
  { id: "3", name: "Weekly Safety Inspection", type: "inspection" },
  { id: "4", name: "Scaffolding Inspection", type: "inspection" },
  { id: "5", name: "Hot Work Permit", type: "permit" },
  { id: "6", name: "Confined Space Entry Permit", type: "permit" },
  { id: "7", name: "Safety Observation Card", type: "observation" },
  { id: "8", name: "Near Miss Report", type: "observation" },
]

export function RecordCreate() {
  const router = useRouter()
  const [recordType, setRecordType] = useState<RecordType | "">("")
  const [templateId, setTemplateId] = useState("")

  const filteredTemplates = recordType
    ? formTemplates.filter((template) => template.type === recordType)
    : formTemplates

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, create the record and redirect to the detail page
    router.push("/records/1")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/records">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Safety Record</h1>
          <p className="text-muted-foreground">Start a new safety record using a form template</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details for this safety record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Record Title</Label>
              <Input id="title" placeholder="Enter a descriptive title" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Record Type</Label>
                <Select value={recordType} onValueChange={(value) => setRecordType(value as RecordType)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="observation">Observation</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Site, zone, or specific location" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Provide a brief description of this record" rows={3} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="tom">Tom Anderson</SelectItem>
                  <SelectItem value="emily">Emily Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Template</CardTitle>
            <CardDescription>
              Select a form template to collect structured data
              {recordType && ` for ${recordType} records`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a form template" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {templateId && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  The selected form template will be loaded after you create this record. You'll be able to fill out the
                  form fields and add any additional information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/records">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            <Button type="submit" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
