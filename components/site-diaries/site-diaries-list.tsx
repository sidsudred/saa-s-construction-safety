"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Plus, Search, Calendar, Users, AlertTriangle, Eye, CloudRain, CloudSun } from "lucide-react"
import Link from "next/link"
import type { SiteDiary } from "@/lib/types/observation"

const mockDiaries: SiteDiary[] = [
  {
    id: "1",
    diaryNumber: "DIARY-2024-12-13",
    date: "2024-12-13",
    location: "Site A",
    weather: "Partly Cloudy",
    temperature: "18°C",
    createdBy: "Mike Johnson",
    createdAt: "2024-12-13T17:00:00Z",
    updatedAt: "2024-12-13T17:30:00Z",
    workActivities: "Foundation pouring for Building 2, scaffolding installation on east wing",
    personnelOnSite: 45,
    contractorsOnSite: 12,
    visitorsOnSite: 3,
    safetyBriefingConducted: true,
    safetyIncidents: 0,
    safetyObservations: 2,
    nearMisses: 0,
    notableEvents: "Client site visit in morning, concrete delivery delayed by 2 hours",
  },
  {
    id: "2",
    diaryNumber: "DIARY-2024-12-12",
    date: "2024-12-12",
    location: "Site A",
    weather: "Sunny",
    temperature: "22°C",
    createdBy: "Sarah Williams",
    createdAt: "2024-12-12T18:00:00Z",
    updatedAt: "2024-12-12T18:15:00Z",
    workActivities: "Steel frame erection, electrical rough-in work",
    personnelOnSite: 42,
    contractorsOnSite: 15,
    visitorsOnSite: 0,
    safetyBriefingConducted: true,
    safetyIncidents: 0,
    safetyObservations: 1,
    nearMisses: 0,
  },
  {
    id: "3",
    diaryNumber: "DIARY-2024-12-11",
    date: "2024-12-11",
    location: "Site A",
    weather: "Light Rain",
    temperature: "15°C",
    createdBy: "Tom Anderson",
    createdAt: "2024-12-11T17:45:00Z",
    updatedAt: "2024-12-11T18:00:00Z",
    workActivities: "Limited outdoor work due to weather, indoor finishing work continued",
    personnelOnSite: 38,
    contractorsOnSite: 10,
    visitorsOnSite: 0,
    safetyBriefingConducted: true,
    safetyIncidents: 0,
    safetyObservations: 0,
    nearMisses: 1,
    notableEvents: "Work stopped at 2pm due to heavy rain",
    delaysOrStoppages: "4 hours lost due to weather conditions",
  },
]

export function SiteDiariesList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDiaries = mockDiaries.filter((diary) => {
    const matchesSearch =
      searchQuery === "" ||
      diary.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diary.diaryNumber.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Diaries</h1>
          <p className="text-muted-foreground">Daily records of site activities and conditions</p>
        </div>
        <Button asChild>
          <Link href="/site-diaries/create">
            <Plus className="mr-2 h-4 w-4" />
            New Diary Entry
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredDiaries.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No diary entries found"
          description="Start recording daily site activities and conditions"
          actionLabel="Create Entry"
          onAction={() => (window.location.href = "/site-diaries/create")}
        />
      ) : (
        <div className="space-y-4">
          {filteredDiaries.map((diary) => (
            <Link key={diary.id} href={`/site-diaries/${diary.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-mono text-lg font-semibold">{diary.diaryNumber}</h3>
                        <Badge variant="outline" className="font-normal">
                          {new Date(diary.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{diary.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {diary.weather.toLowerCase().includes("rain") ? (
                            <CloudRain className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CloudSun className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">
                            {diary.weather} {diary.temperature && `• ${diary.temperature}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{diary.personnelOnSite} workers</span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {diary.workActivities}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        {diary.safetyIncidents > 0 && (
                          <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-500">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {diary.safetyIncidents} Incident{diary.safetyIncidents !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {diary.nearMisses > 0 && (
                          <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-orange-500">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {diary.nearMisses} Near Miss{diary.nearMisses !== 1 ? "es" : ""}
                          </Badge>
                        )}
                        {diary.safetyObservations > 0 && (
                          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-500">
                            <Eye className="mr-1 h-3 w-3" />
                            {diary.safetyObservations} Observation{diary.safetyObservations !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {diary.safetyBriefingConducted && (
                          <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">
                            Safety Briefing Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
