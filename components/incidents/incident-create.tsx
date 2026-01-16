"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiskBadge } from "@/components/shared/risk-badge"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"
import type { IncidentType, IncidentSeverity, InjurySeverity } from "@/lib/types/incident"
import { incidentTypeLabels, severityLabels, injurySeverityLabels } from "@/lib/types/incident"

export function IncidentCreate() {
  const [incidentType, setIncidentType] = useState<IncidentType>()
  const [severity, setSeverity] = useState<IncidentSeverity>()
  const [injurySeverity, setInjurySeverity] = useState<InjurySeverity>()

  const showInjurySeverity = incidentType === "injury"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/incidents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Report Incident</h1>
            <p className="text-muted-foreground">Document and report a safety incident or near miss</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Classification</CardTitle>
              <CardDescription>Select the type and severity of the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type *</Label>
                  <Select value={incidentType} onValueChange={(value) => setIncidentType(value as IncidentType)}>
                    <SelectTrigger id="incident-type">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(incidentTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select value={severity} onValueChange={(value) => setSeverity(value as IncidentSeverity)}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(severityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <RiskBadge level={key as IncidentSeverity} showIcon={false} />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showInjurySeverity && (
                <div className="space-y-2">
                  <Label htmlFor="injury-severity">Injury Severity *</Label>
                  <Select value={injurySeverity} onValueChange={(value) => setInjurySeverity(value as InjurySeverity)}>
                    <SelectTrigger id="injury-severity">
                      <SelectValue placeholder="Select injury severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(injurySeverityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>When and where did the incident occur?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Incident Title *</Label>
                <Input id="title" placeholder="Brief description of the incident" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incident-date">Incident Date & Time *</Label>
                  <Input id="incident-date" type="datetime-local" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" placeholder="Site, zone, or building" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of what happened, including sequence of events, conditions, and any relevant details"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="immediate-actions">Immediate Actions Taken *</Label>
                <Textarea
                  id="immediate-actions"
                  placeholder="Describe what actions were taken immediately after the incident (first aid, evacuation, containment, etc.)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* People Involved */}
          <Card>
            <CardHeader>
              <CardTitle>People Involved</CardTitle>
              <CardDescription>Who was affected and who witnessed the incident?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="affected-persons">Affected Person(s)</Label>
                <Input id="affected-persons" placeholder="Names of people directly involved or injured" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses</Label>
                <Input id="witnesses" placeholder="Names of people who witnessed the incident" />
              </div>
            </CardContent>
          </Card>

          {/* Evidence Capture */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Attach photos, documents, or other evidence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop photos, videos, or documents
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported By</p>
                <p className="text-sm font-semibold">Current User</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Date</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm font-semibold">Draft</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assigned-to">Assign To</Label>
                <Select>
                  <SelectTrigger id="assigned-to">
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sarah Williams</SelectItem>
                    <SelectItem value="2">Mike Johnson</SelectItem>
                    <SelectItem value="3">Tom Anderson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Linked Records */}
          <Card>
            <CardHeader>
              <CardTitle>Linked Records</CardTitle>
              <CardDescription>Link to related JSA, permits, or inspections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsa">Job Safety Analysis</Label>
                <Select>
                  <SelectTrigger id="jsa">
                    <SelectValue placeholder="Select JSA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">JSA-2024-012 - Crane Operations</SelectItem>
                    <SelectItem value="2">JSA-2024-015 - Scaffolding Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permit">Work Permit</Label>
                <Select>
                  <SelectTrigger id="permit">
                    <SelectValue placeholder="Select permit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">PER-2024-023 - Hot Work Permit</SelectItem>
                    <SelectItem value="2">PER-2024-025 - Confined Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspection">Related Inspection</Label>
                <Select>
                  <SelectTrigger id="inspection">
                    <SelectValue placeholder="Select inspection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">INS-2024-045 - Pre-incident crane inspection</SelectItem>
                    <SelectItem value="2">INS-2024-048 - Equipment inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
