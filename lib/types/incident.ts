export type IncidentType =
  | "injury"
  | "near_miss"
  | "property_damage"
  | "environmental"
  | "equipment_failure"
  | "fire"
  | "chemical_spill"
  | "electrical"
  | "fall"
  | "other"

export type IncidentSeverity = "minor" | "moderate" | "serious" | "critical"

export type InjurySeverity = "first_aid" | "medical_treatment" | "lost_time" | "fatality"

export type RecordStatus = "draft" | "submitted" | "under_investigation" | "closed" | "archived"

export interface Incident {
  id: string
  recordNumber: string
  title: string
  incidentType: IncidentType
  severity: IncidentSeverity
  injurySeverity?: InjurySeverity
  status: RecordStatus
  priority: "low" | "medium" | "high"

  // People involved
  reportedBy: string
  assignedTo: string
  affectedPersons: string[]
  witnesses: string[]

  // Incident details
  incidentDate: string
  reportedDate: string
  location: string
  description: string
  immediateActions: string

  // Investigation
  rootCause?: string
  contributingFactors?: string[]
  investigation?: {
    investigator: string
    startDate: string
    completedDate?: string
    findings: string
    recommendations: string[]
  }

  // Links
  linkedJSAId?: string
  linkedPermitId?: string
  linkedInspectionIds?: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
  closedAt?: string
}

export interface IncidentSummary {
  totalIncidents: number
  byType: Record<IncidentType, number>
  bySeverity: Record<IncidentSeverity, number>
  nearMissCount: number
  injuryCount: number
}

export const incidentTypeLabels: Record<IncidentType, string> = {
  injury: "Injury",
  near_miss: "Near Miss",
  property_damage: "Property Damage",
  environmental: "Environmental",
  equipment_failure: "Equipment Failure",
  fire: "Fire",
  chemical_spill: "Chemical Spill",
  electrical: "Electrical",
  fall: "Fall from Height",
  other: "Other",
}

export const severityLabels: Record<IncidentSeverity, string> = {
  minor: "Minor",
  moderate: "Moderate",
  serious: "Serious",
  critical: "Critical",
}

export const injurySeverityLabels: Record<InjurySeverity, string> = {
  first_aid: "First Aid",
  medical_treatment: "Medical Treatment",
  lost_time: "Lost Time Injury",
  fatality: "Fatality",
}
