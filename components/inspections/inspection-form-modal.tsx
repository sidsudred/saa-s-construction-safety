"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InspectionRecord } from "@/lib/types/inspection"

interface InspectionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inspection?: InspectionRecord | null
  onSave: (inspection: Partial<InspectionRecord>) => void
}

export function InspectionFormModal({ open, onOpenChange, inspection, onSave }: InspectionFormModalProps) {
  const [formData, setFormData] = useState<Partial<InspectionRecord>>({
    title: inspection?.title || "",
    inspectionType: inspection?.inspectionType || "routine",
    location: inspection?.location || "",
    description: inspection?.description || "",
    inspectorName: inspection?.inspectorName || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      inspectionType: "routine",
      location: "",
      description: "",
      inspectorName: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{inspection ? "Edit Inspection" : "Create New Inspection"}</DialogTitle>
          <DialogDescription>
            {inspection ? "Update inspection details below" : "Fill in the details to create a new inspection"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter inspection title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Inspection Type</Label>
              <Select
                value={formData.inspectionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, inspectionType: value as InspectionRecord["inspectionType"] })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
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
              <Input
                id="inspector"
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                placeholder="Enter inspector name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter inspection description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{inspection ? "Update" : "Create"} Inspection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
