import type { SafetyRecord } from "./safety-record"

export type InspectionResultStatus = "pass" | "fail" | "na" | "conditional"

export interface InspectionItem {
  id: string
  section: string
  item: string
  requirement: string
  result: InspectionResultStatus
  notes?: string
  photos?: string[]
  severity?: "low" | "medium" | "high" | "critical"
}

export interface InspectionRecord extends SafetyRecord {
  type: "inspection"
  inspectionType: "routine" | "pre-task" | "post-incident" | "regulatory" | "quality"
  inspectorName: string
  inspectionDate: string
  items: InspectionItem[]
  overallResult: "pass" | "fail" | "conditional"
  failedItemsCount: number
  passRate: number
}

export interface InspectionTemplate {
  id: string
  name: string
  inspectionType: InspectionRecord["inspectionType"]
  sections: InspectionSection[]
}

export interface InspectionSection {
  id: string
  name: string
  description?: string
  items: InspectionTemplateItem[]
}

export interface InspectionTemplateItem {
  id: string
  item: string
  requirement: string
  severity: "low" | "medium" | "high" | "critical"
}
