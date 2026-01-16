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
import { ScrollArea } from "@/components/ui/scroll-area"
import type { JSA } from "@/lib/types/jsa"

interface JSAFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jsa?: JSA | null
  onSave: (jsa: Partial<JSA>) => void
}

export function JSAFormModal({ open, onOpenChange, jsa, onSave }: JSAFormModalProps) {
  const [formData, setFormData] = useState<Partial<JSA>>({
    title: jsa?.title || "",
    projectName: jsa?.projectName || "",
    location: jsa?.location || "",
    date: jsa?.date || new Date().toISOString().split("T")[0],
    duration: jsa?.duration || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      projectName: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      duration: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{jsa ? "Edit JSA" : "Create New JSA"}</DialogTitle>
          <DialogDescription>
            {jsa ? "Update JSA details below" : "Fill in the details to create a new Job Safety Analysis"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          <form onSubmit={handleSubmit} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter job title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project Name</Label>
                <Input
                  id="project"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., Full Day, Half Day"
                  required
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {jsa ? "Update" : "Create"} JSA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
