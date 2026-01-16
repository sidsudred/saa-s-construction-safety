"use client"

import type React from "react"

import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Incident, IncidentType, IncidentSeverity } from "@/lib/types/incident"
import { incidentTypeLabels, severityLabels } from "@/lib/types/incident"

interface IncidentFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  incident?: Incident | null
  onSave: (incident: Partial<Incident>) => void
}

export function IncidentFormDrawer({ open, onOpenChange, incident, onSave }: IncidentFormDrawerProps) {
  const [formData, setFormData] = useState<Partial<Incident>>({
    title: incident?.title || "",
    incidentType: incident?.incidentType || "near_miss",
    severity: incident?.severity || "minor",
    location: incident?.location || "",
    description: incident?.description || "",
    immediateActions: incident?.immediateActions || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      incidentType: "near_miss",
      severity: "minor",
      location: "",
      description: "",
      immediateActions: "",
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{incident ? "Edit Incident" : "Report New Incident"}</DrawerTitle>
          <DrawerDescription>
            {incident ? "Update incident details below" : "Fill in the details to report a new incident"}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-[calc(100vh-200px)] px-4">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="title">Incident Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of incident"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Incident Type</Label>
                <Select
                  value={formData.incidentType}
                  onValueChange={(value) => setFormData({ ...formData, incidentType: value as IncidentType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
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
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value as IncidentSeverity })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(severityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Where did this occur?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what happened"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actions">Immediate Actions Taken</Label>
              <Textarea
                id="actions"
                value={formData.immediateActions}
                onChange={(e) => setFormData({ ...formData, immediateActions: e.target.value })}
                placeholder="What actions were taken immediately?"
                rows={3}
              />
            </div>
          </form>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" onClick={handleSubmit}>
            {incident ? "Update" : "Report"} Incident
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
