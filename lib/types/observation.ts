export type ObservationType = "positive" | "negative"

export type ObservationCategory =
  | "ppe"
  | "housekeeping"
  | "equipment"
  | "behavior"
  | "environmental"
  | "procedure"
  | "other"

export interface SafetyObservation {
  id: string
  observationNumber: string
  type: ObservationType
  category: ObservationCategory
  title: string
  description: string
  location: string
  observedBy: string
  observedAt: string
  createdAt: string
  status: "submitted" | "under_review" | "closed"
  severity?: "low" | "medium" | "high" // Only for negative observations
  requiresCapa: boolean
  capaCreated?: boolean
  photos?: string[]
}

export const observationCategoryLabels: Record<ObservationCategory, string> = {
  ppe: "Personal Protective Equipment",
  housekeeping: "Housekeeping",
  equipment: "Equipment & Tools",
  behavior: "Work Behavior",
  environmental: "Environmental Conditions",
  procedure: "Procedures & Processes",
  other: "Other",
}

export interface SiteDiary {
  id: string
  diaryNumber: string
  date: string
  location: string
  weather: string
  temperature?: string
  createdBy: string
  createdAt: string
  updatedAt: string

  // Daily information
  workActivities: string
  personnelOnSite: number
  contractorsOnSite: number
  visitorsOnSite: number

  // Safety information
  safetyBriefingConducted: boolean
  safetyIncidents: number
  safetyObservations: number
  nearMisses: number

  // Notable events
  notableEvents?: string
  equipmentIssues?: string
  delaysOrStoppages?: string

  // Documentation
  photos?: string[]
  linkedObservationIds?: string[]
  linkedIncidentIds?: string[]
}
