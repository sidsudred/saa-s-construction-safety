export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "supervisor" | "worker"
  avatar?: string
}

export interface Project {
  id: string
  name: string
  location: string
  status: "planning" | "active" | "completed" | "on-hold"
  startDate: string
  endDate?: string
}

export interface Incident {
  id: string
  title: string
  description: string
  location: string
  projectId: string
  reportedBy: string
  reportedAt: string
  riskLevel: "low" | "medium" | "high" | "critical"
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  category: string
  injuryType?: string
  witnesses?: string[]
  evidenceUrls: string[]
}

export interface Inspection {
  id: string
  title: string
  type: "safety" | "quality" | "environmental"
  projectId: string
  inspectorId: string
  scheduledDate: string
  completedDate?: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  score?: number
  findings: InspectionFinding[]
}

export interface InspectionFinding {
  id: string
  description: string
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendation: string
  evidenceUrls: string[]
}

export interface CorrectiveAction {
  id: string
  title: string
  description: string
  relatedRecordId: string
  relatedRecordType: "incident" | "inspection" | "observation"
  assigneeId: string
  dueDate: string
  completedDate?: string
  priority: "low" | "medium" | "high"
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
}

export interface JSA {
  id: string
  title: string
  jobDescription: string
  projectId: string
  createdBy: string
  createdAt: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  steps: JSAStep[]
}

export interface JSAStep {
  id: string
  stepNumber: number
  task: string
  hazards: string[]
  controls: string[]
}

export interface Permit {
  id: string
  type: "hot-work" | "confined-space" | "height-work" | "excavation" | "electrical"
  title: string
  projectId: string
  location: string
  issuedTo: string
  issuedBy: string
  validFrom: string
  validUntil: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  requirements: string[]
  safetyPrecautions: string[]
}

export interface Observation {
  id: string
  title: string
  description: string
  projectId: string
  observedBy: string
  observedAt: string
  type: "positive" | "unsafe-act" | "unsafe-condition" | "near-miss"
  location: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  riskLevel?: "low" | "medium" | "high" | "critical"
  evidenceUrls: string[]
}

export interface Training {
  id: string
  title: string
  description: string
  type: "safety-induction" | "toolbox-talk" | "certification" | "refresher"
  duration: number
  instructorId: string
  validityPeriod?: number
  status: "scheduled" | "completed" | "cancelled"
}

export interface TrainingRecord {
  id: string
  trainingId: string
  workerId: string
  completedDate: string
  expiryDate?: string
  score?: number
  certificateUrl?: string
}
