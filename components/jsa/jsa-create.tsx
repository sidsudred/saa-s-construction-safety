"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JSATask, JSAHazard, JSAControl } from "@/lib/types/jsa"

export function JSACreate() {
  const router = useRouter()
  const [tasks, setTasks] = useState<JSATask[]>([])
  const [crew, setCrew] = useState<string[]>([""])
  const [equipment, setEquipment] = useState<string[]>([""])

  const addTask = () => {
    const newTask: JSATask = {
      id: `task-${Date.now()}`,
      stepNumber: tasks.length + 1,
      taskDescription: "",
      hazards: [],
      controls: [],
    }
    setTasks([...tasks, newTask])
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const updateTask = (taskId: string, description: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, taskDescription: description } : t)))
  }

  const addHazard = (taskId: string) => {
    const newHazard: JSAHazard = {
      id: `hazard-${Date.now()}`,
      description: "",
      severity: "medium",
      likelihood: "possible",
      riskLevel: "medium",
    }
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, hazards: [...t.hazards, newHazard] } : t)))
  }

  const updateHazard = (taskId: string, hazardId: string, field: keyof JSAHazard, value: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              hazards: t.hazards.map((h) => (h.id === hazardId ? { ...h, [field]: value } : h)),
            }
          : t,
      ),
    )
  }

  const removeHazard = (taskId: string, hazardId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, hazards: t.hazards.filter((h) => h.id !== hazardId) } : t)))
  }

  const addControl = (taskId: string) => {
    const newControl: JSAControl = {
      id: `control-${Date.now()}`,
      description: "",
      type: "administrative",
      residualRisk: "low",
    }
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, controls: [...t.controls, newControl] } : t)))
  }

  const updateControl = (taskId: string, controlId: string, field: keyof JSAControl, value: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              controls: t.controls.map((c) => (c.id === controlId ? { ...c, [field]: value } : c)),
            }
          : t,
      ),
    )
  }

  const removeControl = (taskId: string, controlId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, controls: t.controls.filter((c) => c.id !== controlId) } : t)))
  }

  const addCrewMember = () => {
    setCrew([...crew, ""])
  }

  const updateCrewMember = (index: number, value: string) => {
    const newCrew = [...crew]
    newCrew[index] = value
    setCrew(newCrew)
  }

  const removeCrewMember = (index: number) => {
    setCrew(crew.filter((_, i) => i !== index))
  }

  const addEquipment = () => {
    setEquipment([...equipment, ""])
  }

  const updateEquipment = (index: number, value: string) => {
    const newEquipment = [...equipment]
    newEquipment[index] = value
    setEquipment(newEquipment)
  }

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, save the JSA and redirect
    router.push("/jsa/1")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/jsa">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Job Safety Analysis</h1>
          <p className="text-muted-foreground">Break down job tasks and identify hazards with controls</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about this JSA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">JSA Title</Label>
              <Input id="title" placeholder="e.g., Excavation Work - Utility Trench" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Project Name</Label>
                <Input id="project" placeholder="Enter project name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Site location" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="half">Half Day</SelectItem>
                    <SelectItem value="full">Full Day</SelectItem>
                    <SelectItem value="multi">Multiple Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Crew Members</Label>
              {crew.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Worker name"
                    value={member}
                    onChange={(e) => updateCrewMember(index, e.target.value)}
                  />
                  {crew.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCrewMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addCrewMember}>
                <Plus className="mr-2 h-4 w-4" />
                Add Crew Member
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Equipment Required</Label>
              {equipment.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Equipment or tool"
                    value={item}
                    onChange={(e) => updateEquipment(index, e.target.value)}
                  />
                  {equipment.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeEquipment(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addEquipment}>
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Breakdown</CardTitle>
                <CardDescription>Break down the job into steps and identify hazards with controls</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {tasks.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">No tasks added yet. Click "Add Task" to get started.</p>
              </div>
            ) : (
              tasks.map((task, taskIndex) => (
                <div key={task.id} className="space-y-4 rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Label>Step {task.stepNumber}: Task Description</Label>
                      <Textarea
                        placeholder="Describe the task or step"
                        value={task.taskDescription}
                        onChange={(e) => updateTask(task.id, e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Hazards</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addHazard(task.id)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Hazard
                      </Button>
                    </div>
                    {task.hazards.map((hazard) => (
                      <div key={hazard.id} className="space-y-3 rounded-lg bg-muted/30 p-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Describe the hazard"
                            value={hazard.description}
                            onChange={(e) => updateHazard(task.id, hazard.id, "description", e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHazard(task.id, hazard.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <Select
                            value={hazard.severity}
                            onValueChange={(value) => updateHazard(task.id, hazard.id, "severity", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={hazard.likelihood}
                            onValueChange={(value) => updateHazard(task.id, hazard.id, "likelihood", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Likelihood" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="unlikely">Unlikely</SelectItem>
                              <SelectItem value="possible">Possible</SelectItem>
                              <SelectItem value="likely">Likely</SelectItem>
                              <SelectItem value="certain">Certain</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={hazard.riskLevel}
                            onValueChange={(value) => updateHazard(task.id, hazard.id, "riskLevel", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Risk</SelectItem>
                              <SelectItem value="medium">Medium Risk</SelectItem>
                              <SelectItem value="high">High Risk</SelectItem>
                              <SelectItem value="critical">Critical Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Controls</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addControl(task.id)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Control
                      </Button>
                    </div>
                    {task.controls.map((control) => (
                      <div key={control.id} className="space-y-3 rounded-lg bg-muted/30 p-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Describe the control measure"
                            value={control.description}
                            onChange={(e) => updateControl(task.id, control.id, "description", e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeControl(task.id, control.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Select
                            value={control.type}
                            onValueChange={(value) => updateControl(task.id, control.id, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Control Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="elimination">Elimination</SelectItem>
                              <SelectItem value="substitution">Substitution</SelectItem>
                              <SelectItem value="engineering">Engineering Control</SelectItem>
                              <SelectItem value="administrative">Administrative Control</SelectItem>
                              <SelectItem value="ppe">PPE</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={control.residualRisk}
                            onValueChange={(value) => updateControl(task.id, control.id, "residualRisk", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Residual Risk" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Risk</SelectItem>
                              <SelectItem value="medium">Medium Risk</SelectItem>
                              <SelectItem value="high">High Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/jsa">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            <Button type="submit" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
