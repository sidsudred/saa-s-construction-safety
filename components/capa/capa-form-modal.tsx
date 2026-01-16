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
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CapaAction, CapaType, CapaPriority } from "@/lib/types/capa"

interface CapaFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capa?: CapaAction | null
  onSave: (capa: Partial<CapaAction>) => void
}

export function CapaFormModal({ open, onOpenChange, capa, onSave }: CapaFormModalProps) {
  const [formData, setFormData] = useState<Partial<CapaAction>>({
    title: capa?.title || "",
    description: capa?.description || "",
    type: capa?.type || "corrective",
    priority: capa?.priority || "medium",
    problemDescription: capa?.problemDescription || "",
    rootCause: capa?.rootCause || "",
    dueDate: capa?.dueDate || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      type: "corrective",
      priority: "medium",
      problemDescription: "",
      rootCause: "",
      dueDate: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{capa ? "Edit CAPA" : "Create New CAPA"}</DialogTitle>
          <DialogDescription>
            {capa ? "Update CAPA details below" : "Create a new corrective or preventive action"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          <form onSubmit={handleSubmit} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Action Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title for the action"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as CapaType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as CapaPriority })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the action"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">Problem Description</Label>
              <Textarea
                id="problem"
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                placeholder="What is the problem or issue?"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause</Label>
              <Textarea
                id="rootCause"
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                placeholder="What is the root cause?"
                rows={2}
              />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {capa ? "Update" : "Create"} CAPA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
