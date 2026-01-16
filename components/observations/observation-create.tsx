"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import type { ObservationType, ObservationCategory } from "@/lib/types/observation"
import { observationCategoryLabels } from "@/lib/types/observation"

export function ObservationCreate() {
  const [observationType, setObservationType] = useState<ObservationType>("positive")
  const [category, setCategory] = useState<ObservationCategory>()
  const [requiresCapa, setRequiresCapa] = useState(false)

  const isNegative = observationType === "negative"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/observations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Record Safety Observation</h1>
            <p className="text-muted-foreground">Document positive behaviors or safety concerns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Observation Type */}
          <Card>
            <CardHeader>
              <CardTitle>Observation Type</CardTitle>
              <CardDescription>Is this a positive observation or a safety concern?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={observationType}
                onValueChange={(value) => setObservationType(value as ObservationType)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="positive" id="positive" className="peer sr-only" />
                  <Label
                    htmlFor="positive"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-6 transition-all hover:bg-accent peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-500/10"
                  >
                    <ThumbsUp className="mb-3 h-8 w-8 text-green-500" />
                    <div className="text-center">
                      <p className="font-semibold">Positive</p>
                      <p className="text-sm text-muted-foreground">Good safety practice</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="negative" id="negative" className="peer sr-only" />
                  <Label
                    htmlFor="negative"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-6 transition-all hover:bg-accent peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-500/10"
                  >
                    <ThumbsDown className="mb-3 h-8 w-8 text-orange-500" />
                    <div className="text-center">
                      <p className="font-semibold">Negative</p>
                      <p className="text-sm text-muted-foreground">Safety concern</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Observation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Observation Details</CardTitle>
              <CardDescription>What did you observe?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ObservationCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(observationCategoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isNegative && (
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity *</Label>
                    <Select>
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Brief description of the observation" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="observed-at">Observation Date & Time *</Label>
                  <Input id="observed-at" type="datetime-local" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" placeholder="Site, zone, or area" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder={
                    isNegative
                      ? "Describe the unsafe condition or behavior observed"
                      : "Describe the positive behavior or practice observed"
                  }
                  rows={5}
                />
              </div>

              {isNegative && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires-capa"
                    checked={requiresCapa}
                    onCheckedChange={(checked) => setRequiresCapa(checked as boolean)}
                  />
                  <Label
                    htmlFor="requires-capa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    This observation requires corrective action (CAPA)
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* People Involved */}
          <Card>
            <CardHeader>
              <CardTitle>People Involved</CardTitle>
              <CardDescription>
                {isNegative ? "Who was involved in the unsafe behavior?" : "Who demonstrated the positive behavior?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="people-involved">People Involved</Label>
                <Input id="people-involved" placeholder="Names or employee IDs (optional)" />
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Attach photos or documents to support the observation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop photos or documents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Observation Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Observed By</p>
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
          {isNegative && (
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
