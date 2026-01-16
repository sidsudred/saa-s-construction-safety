// Safety Record Framework - Type Definitions

export type WorkflowState =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "closed"
  | "archived"
  | "suspended"
  | "revoked"
  | "open"
  | "in_progress"
  | "completed"
  | "verified"

export type RecordType = "incident" | "inspection" | "permit" | "observation" | "jsa" | "capa" | "site_diary" | "training" | "induction" | "toolbox_talk" | "certification"

export interface RecordMetadata {
  id: string
  recordNumber: string
  title: string
  type: RecordType
  status: WorkflowState
  priority: "low" | "medium" | "high" | "critical"
  owner: string
  assignee: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  closedAt?: string
  location: string
  description: string
  dueDate?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details?: string
  fromStatus?: WorkflowState
  toStatus?: WorkflowState
}

export interface LinkedRecord {
  id: string
  type: RecordType
  recordNumber: string
  title: string
  status: WorkflowState
  relationship: "parent" | "child" | "related"
  createdAt: string
}

export interface Evidence {
  id: string
  type: "photo" | "document" | "video"
  name: string
  url: string
  uploadedAt: string
  uploadedBy: string
  description?: string
}

export interface RecordTemplate {
  id: string
  name: string
  description?: string
  category?: string
  fields?: any[]
}

// Workflow state transitions
export const WORKFLOW_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  draft: ["submitted", "archived"],
  submitted: ["under_review", "draft"],
  under_review: ["approved", "submitted"],
  approved: ["closed", "under_review", "suspended", "revoked"],
  closed: ["archived"],
  archived: [],
  suspended: ["approved", "revoked"],
  revoked: ["archived"],
  open: ["in_progress", "archived"],
  in_progress: ["completed", "open"],
  completed: ["verified", "in_progress"],
  verified: ["closed", "completed"],
}

// Role-based transition permissions (mock)
export const STATE_PERMISSIONS: Record<WorkflowState, string[]> = {
  draft: ["user", "supervisor", "manager", "admin"],
  submitted: ["supervisor", "manager", "admin"],
  under_review: ["manager", "admin"],
  approved: ["manager", "admin"],
  closed: ["admin"],
  archived: ["admin"],
  suspended: ["manager", "admin"],
  revoked: ["admin"],
  open: ["user", "supervisor", "manager", "admin"],
  in_progress: ["user", "supervisor", "manager", "admin"],
  completed: ["user", "supervisor", "manager", "admin"],
  verified: ["supervisor", "manager", "admin"],
}

// Check if transition is valid
export function isValidTransition(from: WorkflowState, to: WorkflowState): boolean {
  return WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false
}

// Inspection-specific types
export interface InspectionFinding {
  id: string
  questionId: string
  question: string
  response: "pass" | "fail" | "n/a"
  severity?: "low" | "medium" | "high" | "critical"
  notes?: string
  evidenceIds?: string[]
  capaCreated?: boolean
  capaId?: string
}

export interface InspectionRecord extends RecordMetadata {
  inspectionType: string
  inspector: string
  findings: InspectionFinding[]
  riskScore?: number
  passRate?: number
  evidence: Evidence[]
  linkedRecords: LinkedRecord[]
  auditLog: AuditLogEntry[]
}

// Incident-specific types
export type IncidentSeverity = "minor" | "moderate" | "serious" | "major" | "critical" | "fatality"
export type IncidentType = "injury" | "near_miss" | "property_damage" | "environmental" | "security" | "health"

export interface InvestigationTimelineEvent {
  id: string
  timestamp: string
  description: string
  type: "event" | "finding" | "action"
}

export interface IncidentRecord extends RecordMetadata {
  incidentType: IncidentType
  severity: IncidentSeverity
  dateOfOccurrence: string
  timeOfOccurrence: string
  investigationLead?: string
  investigationStatus: "pending" | "in_progress" | "complete"
  investigationNotes?: string
  contributingFactors: string[]
  timeline: InvestigationTimelineEvent[]
  witnesses: string[]
  rootCauses: string[]
}

// JSA-specific types
export interface TaskStep {
  id: string
  sequence: number
  task: string
  hazards: string[]
  controls: string[]
  residualRisk: "low" | "medium" | "high"
}

export interface WorkerAcknowledgment {
  id: string
  name: string
  role: string
  timestamp: string
  signed: boolean
}

export interface JSARecord extends RecordMetadata {
  projectName: string
  workDescription: string
  taskSteps: TaskStep[]
  roster: WorkerAcknowledgment[]
  approverId?: string
  approvedDate?: string
  permitIds?: string[]
}

// Permit-specific types
export type PermitType = "hot_work" | "working_at_height" | "confined_space" | "excavation" | "electrical" | "lifting"

export interface PermitRecord extends RecordMetadata {
  permitType: PermitType
  validFrom: string
  validUntil: string
  issuerId: string
  receiverId: string
  hazards: string[]
  controls: string[]
  ppeRequirements: string[]
  isolationRequired: boolean
  isolationDetails?: string
  suspensionReason?: string
  revocationReason?: string
  workerAcknowledgments: WorkerAcknowledgment[]
}

// Observation-specific types
export type ObservationType = "positive" | "unsafe_act" | "unsafe_condition" | "near_miss"

export interface ObservationRecord extends RecordMetadata {
  observationType: ObservationType
  category: string
  actionTaken?: string
  capaId?: string
  capaCreated?: boolean
  observerRole: string
}

// Site Diary-specific types
export interface SiteDiaryEntry {
  id: string
  timestamp: string
  category: "work_progress" | "safety" | "weather" | "delays" | "visitors"
  content: string
  author: string
}

export interface SiteDiaryRecord extends RecordMetadata {
  projectName: string
  date: string
  weatherMain: string
  temperature?: number
  totalWorkers?: number
  entries: SiteDiaryEntry[]
  summary?: string
}

// CAPA-specific types
export interface CAPARecord extends RecordMetadata {
  originatingRecordId: string
  originatingRecordType: RecordType
  originatingRecordNumber: string
  actionRequired: string
  rootCauseAnalysis?: string
  evidenceRequired: boolean
  isEscalated: boolean
  completionNotes?: string
  verificationNotes?: string
  verifiedBy?: string
  verifiedAt?: string
}

// Training & Certification types
export type TrainingCategory = "induction" | "toolbox_talk" | "certification" | "compliance"

export interface TrainingRecord extends RecordMetadata {
  trainingCategory: TrainingCategory
  completionDate: string
  expiryDate?: string
  evidenceUrl?: string
  workerName: string
  workerId: string
}

export interface InductionRecord extends TrainingRecord {
  templateName: string
  completionRate: number
  validityYears: number
}

export interface ToolboxTalkRecord extends RecordMetadata {
  sessionDate: string
  topic: string
  facilitator: string
  attendanceCount: number
  roster: WorkerAcknowledgment[]
}

export interface CertificationRecord extends TrainingRecord {
  issuingAuthority: string
  certificateNumber: string
}
