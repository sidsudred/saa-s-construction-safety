export type CapaStatus =
  | "draft"
  | "submitted"
  | "in_progress"
  | "pending_verification"
  | "verified"
  | "closed"
  | "rejected"

export type CapaType = "corrective" | "preventive" | "both"

export type CapaPriority = "low" | "medium" | "high" | "critical"

export interface CapaAction {
  id: string
  capaNumber: string
  title: string
  description: string
  type: CapaType
  priority: CapaPriority
  status: CapaStatus

  // Assignment
  owner: string
  assignee: string
  verifier?: string

  // Dates
  createdAt: string
  updatedAt: string
  submittedAt?: string
  dueDate: string
  completedAt?: string
  verifiedAt?: string
  closedAt?: string

  // Problem definition
  problemDescription: string
  rootCause?: string
  immediateAction?: string

  // Action plan
  actionSteps: ActionStep[]

  // Verification
  verificationMethod?: string
  verificationNotes?: string
  verificationEvidence?: string[]

  // Relationships
  sourceRecordId?: string
  sourceRecordType?: string
  linkedRecordIds?: string[]

  // Evidence
  evidenceFiles?: string[]
}

export interface ActionStep {
  id: string
  description: string
  assignee: string
  dueDate: string
  status: "pending" | "in_progress" | "completed"
  completedAt?: string
  notes?: string
}

export interface CapaStatusTransition {
  from: CapaStatus
  to: CapaStatus
  allowedRoles: string[]
  requiresComment?: boolean
}

export const capaStatusTransitions: CapaStatusTransition[] = [
  { from: "draft", to: "submitted", allowedRoles: ["user", "supervisor", "manager", "admin"] },
  { from: "submitted", to: "in_progress", allowedRoles: ["supervisor", "manager", "admin"] },
  { from: "submitted", to: "rejected", allowedRoles: ["supervisor", "manager", "admin"], requiresComment: true },
  { from: "in_progress", to: "pending_verification", allowedRoles: ["user", "supervisor", "manager", "admin"] },
  { from: "pending_verification", to: "verified", allowedRoles: ["manager", "admin"] },
  { from: "pending_verification", to: "in_progress", allowedRoles: ["manager", "admin"], requiresComment: true },
  { from: "verified", to: "closed", allowedRoles: ["manager", "admin"] },
  { from: "rejected", to: "draft", allowedRoles: ["user", "supervisor", "manager", "admin"] },
]
