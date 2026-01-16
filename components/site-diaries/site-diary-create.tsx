"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Plus } from "lucide-react"
import Link from "next/link"

export function SiteDiaryCreate() {
  const [safetyBriefingConducted, setSafetyBriefingConducted] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/site-diaries">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Daily Site Diary</h1>
            <p className="text-muted-foreground">Record daily activities and site conditions</p>
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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Date, location, and weather conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site-a">Site A</SelectItem>
                      <SelectItem value="site-b">Site B</SelectItem>
                      <SelectItem value="site-c">Site C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weather">Weather Conditions *</Label>
                  <Select>
                    <SelectTrigger id="weather">
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunny">Sunny</SelectItem>
                      <SelectItem value="partly-cloudy">Partly Cloudy</SelectItem>
                      <SelectItem value="cloudy">Cloudy</SelectItem>
                      <SelectItem value="light-rain">Light Rain</SelectItem>
                      <SelectItem value="heavy-rain">Heavy Rain</SelectItem>
                      <SelectItem value="windy">Windy</SelectItem>
                      <SelectItem value="stormy">Stormy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input id="temperature" placeholder="e.g. 22°C" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Work Activities</CardTitle>
              <CardDescription>What work was performed today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="work-activities">Activities Description *</Label>
                <Textarea
                  id="work-activities"
                  placeholder="Describe the main work activities carried out during the day"
                  rows={5}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="personnel">Personnel on Site *</Label>
                  <Input id="personnel" type="number" min="0" placeholder="0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractors">Contractors on Site</Label>
                  <Input id="contractors" type="number" min="0" placeholder="0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitors">Visitors on Site</Label>
                  <Input id="visitors" type="number" min="0" placeholder="0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Information</CardTitle>
              <CardDescription>Safety activities and incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="safety-briefing"
                  checked={safetyBriefingConducted}
                  onCheckedChange={(checked) => setSafetyBriefingConducted(checked as boolean)}
                />
                <Label
                  htmlFor="safety-briefing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Safety briefing conducted today
                </Label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="incidents">Safety Incidents *</Label>
                  <Input id="incidents" type="number" min="0" defaultValue="0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Safety Observations *</Label>
                  <Input id="observations" type="number" min="0" defaultValue="0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="near-misses">Near Misses *</Label>
                  <Input id="near-misses" type="number" min="0" defaultValue="0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Notable events, issues, and delays</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notable-events">Notable Events</Label>
                <Textarea
                  id="notable-events"
                  placeholder="Any significant events, meetings, inspections, or deliveries"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment-issues">Equipment Issues</Label>
                <Textarea id="equipment-issues" placeholder="Any equipment breakdowns or maintenance issues" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delays">Delays or Stoppages</Label>
                <Textarea
                  id="delays"
                  placeholder="Any delays, work stoppages, or factors affecting progress"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos and Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Photos and Documentation</CardTitle>
              <CardDescription>Attach photos of work progress and site conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop photos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Diary Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-sm font-semibold">Current User</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entry Date</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Linked Records */}
          <Card>
            <CardHeader>
              <CardTitle>Linked Observations</CardTitle>
              <CardDescription>Link related observations to this diary</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Link Observation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked Incidents</CardTitle>
              <CardDescription>Link related incidents to this diary</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Link Incident
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
