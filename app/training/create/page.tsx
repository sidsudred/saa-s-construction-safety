"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function CreateTrainingPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        trainer: "",
        description: "",
        maxAttendees: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would save to the store
        console.log("Creating training session:", formData)
        router.push("/training")
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/training">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Schedule Training Session</h1>
                    <p className="text-muted-foreground">Create a new training session or toolbox talk</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>Fill in the information for the training session</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Session Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Working at Heights Safety"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Training Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="induction">Site Induction</SelectItem>
                                        <SelectItem value="toolbox_talk">Toolbox Talk</SelectItem>
                                        <SelectItem value="refresher">Refresher Training</SelectItem>
                                        <SelectItem value="certification">Certification Course</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date *
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Time *
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => handleChange("time", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="e.g., 60"
                                    value={formData.duration}
                                    onChange={(e) => handleChange("duration", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxAttendees" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Max Attendees
                                </Label>
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    placeholder="e.g., 20"
                                    value={formData.maxAttendees}
                                    onChange={(e) => handleChange("maxAttendees", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Location *
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Site Office - Meeting Room A"
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trainer">Trainer/Facilitator *</Label>
                                <Input
                                    id="trainer"
                                    placeholder="e.g., John Safety Officer"
                                    value={formData.trainer}
                                    onChange={(e) => handleChange("trainer", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide details about the training session, topics to be covered, and any prerequisites..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/training">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                Schedule Session
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
