"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EvidenceUploader } from "@/components/shared/evidence-uploader"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import type { ActionStep } from "@/lib/types/capa"

export function CapaCreate() {
  const [actionSteps, setActionSteps] = useState<Partial<ActionStep>[]>([
    { id: "1", description: "", assignee: "", dueDate: "", status: "pending" },
  ])

  const addActionStep = () => {
    setActionSteps([
      ...actionSteps,
      { id: Date.now().toString(), description: "", assignee: "", dueDate: "", status: "pending" },
    ])
  }

  const removeActionStep = (id: string) => {
    setActionSteps(actionSteps.filter((step) => step.id !== id))
  }

  const updateActionStep = (id: string, field: keyof ActionStep, value: string) => {
    setActionSteps(actionSteps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/capa">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create CAPA</h1>
          <p className="text-muted-foreground">Define corrective or preventive actions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the core details for this CAPA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Brief description of the action" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Action Type *</Label>
                <Select required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee *</Label>
                <Select required>
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
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the action to be taken"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceRecord">Source Record (Optional)</Label>
              <Select>
                <SelectTrigger id="sourceRecord">
                  <SelectValue placeholder="Link to incident, inspection, or observation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INC-2024-001">INC-2024-001 - Near miss with crane</SelectItem>
                  <SelectItem value="INS-2024-045">INS-2024-045 - Scaffolding inspection</SelectItem>
                  <SelectItem value="OBS-2024-087">OBS-2024-087 - PPE compliance</SelectItem>
                  <SelectItem value="AUD-2024-012">AUD-2024-012 - Evacuation drill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problem Definition */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Definition</CardTitle>
            <CardDescription>Describe the issue that requires action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problemDescription">Problem Description *</Label>
              <Textarea
                id="problemDescription"
                placeholder="Describe the problem or opportunity for improvement"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause Analysis</Label>
              <Textarea id="rootCause" placeholder="Identify the underlying cause of the problem" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediateAction">Immediate Action Taken</Label>
              <Textarea
                id="immediateAction"
                placeholder="Describe any immediate actions already taken to address the issue"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Action Steps</CardTitle>
                <CardDescription>Break down the action into specific tasks</CardDescription>
              </div>
              <Button type="button" size="sm" onClick={addActionStep}>
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionSteps.map((step, index) => (
              <div key={step.id} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                  {actionSteps.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeActionStep(step.id!)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`step-description-${step.id}`}>Task Description *</Label>
                    <Input
                      id={`step-description-${step.id}`}
                      placeholder="Describe the specific task"
                      value={step.description}
                      onChange={(e) => updateActionStep(step.id!, "description", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`step-assignee-${step.id}`}>Responsible Person *</Label>
                      <Select
                        value={step.assignee}
                        onValueChange={(value) => updateActionStep(step.id!, "assignee", value)}
                        required
                      >
                        <SelectTrigger id={`step-assignee-${step.id}`}>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                          <SelectItem value="Tom Anderson">Tom Anderson</SelectItem>
                          <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`step-dueDate-${step.id}`}>Due Date *</Label>
                      <Input
                        id={`step-dueDate-${step.id}`}
                        type="date"
                        value={step.dueDate}
                        onChange={(e) => updateActionStep(step.id!, "dueDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Plan</CardTitle>
            <CardDescription>Define how the action will be verified as effective</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verifier">Verifier</Label>
              <Select>
                <SelectTrigger id="verifier">
                  <SelectValue placeholder="Select verifier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="tom">Tom Anderson</SelectItem>
                  <SelectItem value="emily">Emily Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationMethod">Verification Method</Label>
              <Textarea
                id="verificationMethod"
                placeholder="Describe how effectiveness will be verified (e.g., inspection, audit, data review)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Evidence</CardTitle>
            <CardDescription>Upload any relevant documentation or photos</CardDescription>
          </CardHeader>
          <CardContent>
            <EvidenceUploader />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/capa">Cancel</Link>
          </Button>
          <Button type="button" variant="secondary">
            Save as Draft
          </Button>
          <Button type="submit">Submit CAPA</Button>
        </div>
      </form>
    </div>
  )
}
