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
import { Checkbox } from "@/components/ui/checkbox"
import type { PermitHazard } from "@/lib/types/permit"
import { permitTypeLabels, hazardCategories } from "@/lib/types/permit"

export function PermitCreate() {
  const router = useRouter()
  const [permitType, setPermitType] = useState<string>("")
  const [hazards, setHazards] = useState<PermitHazard[]>([])
  const [precautions, setPrecautions] = useState<string[]>([""])
  const [ppeRequired, setPPERequired] = useState<string[]>([])

  const commonPPE = [
    "Hard Hat",
    "Safety Glasses",
    "High-visibility Vest",
    "Safety Boots",
    "Gloves",
    "Hearing Protection",
    "Respirator",
    "Face Shield",
    "Welding Helmet",
    "Fall Protection Harness",
    "Fire-resistant Clothing",
    "Chemical Suit",
  ]

  const addHazard = () => {
    const newHazard: PermitHazard = {
      id: `hazard-${Date.now()}`,
      category: "",
      description: "",
      controls: [""],
      severity: "medium",
    }
    setHazards([...hazards, newHazard])
  }

  const removeHazard = (hazardId: string) => {
    setHazards(hazards.filter((h) => h.id !== hazardId))
  }

  const updateHazard = (hazardId: string, field: keyof PermitHazard, value: any) => {
    setHazards(hazards.map((h) => (h.id === hazardId ? { ...h, [field]: value } : h)))
  }

  const addControl = (hazardId: string) => {
    setHazards(hazards.map((h) => (h.id === hazardId ? { ...h, controls: [...h.controls, ""] } : h)))
  }

  const updateControl = (hazardId: string, controlIndex: number, value: string) => {
    setHazards(
      hazards.map((h) =>
        h.id === hazardId ? { ...h, controls: h.controls.map((c, i) => (i === controlIndex ? value : c)) } : h,
      ),
    )
  }

  const removeControl = (hazardId: string, controlIndex: number) => {
    setHazards(
      hazards.map((h) => (h.id === hazardId ? { ...h, controls: h.controls.filter((_, i) => i !== controlIndex) } : h)),
    )
  }

  const addPrecaution = () => {
    setPrecautions([...precautions, ""])
  }

  const updatePrecaution = (index: number, value: string) => {
    const newPrecautions = [...precautions]
    newPrecautions[index] = value
    setPrecautions(newPrecautions)
  }

  const removePrecaution = (index: number) => {
    setPrecautions(precautions.filter((_, i) => i !== index))
  }

  const togglePPE = (ppe: string) => {
    if (ppeRequired.includes(ppe)) {
      setPPERequired(ppeRequired.filter((p) => p !== ppe))
    } else {
      setPPERequired([...ppeRequired, ppe])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, save the permit and redirect
    router.push("/permits/1")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/permits">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Permit to Work</h1>
          <p className="text-muted-foreground">Issue a new work permit with safety requirements</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Permit Information</CardTitle>
            <CardDescription>Basic details about the work permit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Permit Type</Label>
              <Select value={permitType} onValueChange={setPermitType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select permit type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(permitTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Permit Title</Label>
              <Input id="title" placeholder="e.g., Welding Work - Structural Steel" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Site location or area" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Work Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the work to be performed"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Input id="validFrom" type="datetime-local" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validTo">Valid To</Label>
                <Input id="validTo" type="datetime-local" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contractor">Contractor</Label>
                <Input id="contractor" placeholder="Company or individual name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor</Label>
                <Input id="supervisor" placeholder="Supervisor name" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="safetyContact">Safety Contact</Label>
                <Input id="safetyContact" placeholder="On-site safety contact" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Number</Label>
                <Input id="emergency" type="tel" placeholder="Emergency contact number" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hazard Identification & Controls</CardTitle>
                <CardDescription>Identify hazards and specify control measures</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addHazard}>
                <Plus className="mr-2 h-4 w-4" />
                Add Hazard
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {hazards.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No hazards identified yet. Click "Add Hazard" to get started.
                </p>
              </div>
            ) : (
              hazards.map((hazard) => (
                <div key={hazard.id} className="space-y-4 rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Hazard Category</Label>
                          <Select
                            value={hazard.category}
                            onValueChange={(value) => updateHazard(hazard.id, "category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {hazardCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Severity</Label>
                          <Select
                            value={hazard.severity}
                            onValueChange={(value) => updateHazard(hazard.id, "severity", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
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
                        <Label>Hazard Description</Label>
                        <Textarea
                          placeholder="Describe the specific hazard"
                          value={hazard.description}
                          onChange={(e) => updateHazard(hazard.id, "description", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Control Measures</Label>
                          <Button type="button" variant="outline" size="sm" onClick={() => addControl(hazard.id)}>
                            <Plus className="mr-2 h-3 w-3" />
                            Add Control
                          </Button>
                        </div>
                        {hazard.controls.map((control, controlIndex) => (
                          <div key={controlIndex} className="flex gap-2">
                            <Input
                              placeholder="Describe control measure"
                              value={control}
                              onChange={(e) => updateControl(hazard.id, controlIndex, e.target.value)}
                            />
                            {hazard.controls.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeControl(hazard.id, controlIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHazard(hazard.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Precautions</CardTitle>
            <CardDescription>Any additional safety precautions or requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {precautions.map((precaution, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter precaution or requirement"
                  value={precaution}
                  onChange={(e) => updatePrecaution(index, e.target.value)}
                />
                {precautions.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePrecaution(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPrecaution}>
              <Plus className="mr-2 h-4 w-4" />
              Add Precaution
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required PPE</CardTitle>
            <CardDescription>Select all personal protective equipment required for this work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {commonPPE.map((ppe) => (
                <div key={ppe} className="flex items-center space-x-2">
                  <Checkbox id={ppe} checked={ppeRequired.includes(ppe)} onCheckedChange={() => togglePPE(ppe)} />
                  <Label htmlFor={ppe} className="cursor-pointer font-normal">
                    {ppe}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/permits">Cancel</Link>
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
