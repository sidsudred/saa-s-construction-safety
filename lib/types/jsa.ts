export interface JSATask {
  id: string
  stepNumber: number
  taskDescription: string
  hazards: JSAHazard[]
  controls: JSAControl[]
}

export interface JSAHazard {
  id: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  likelihood: "rare" | "unlikely" | "possible" | "likely" | "certain"
  riskLevel: "low" | "medium" | "high" | "critical"
}

export interface JSAControl {
  id: string
  description: string
  type: "elimination" | "substitution" | "engineering" | "administrative" | "ppe"
  residualRisk: "low" | "medium" | "high"
}

export interface JSAAcknowledgment {
  id: string
  workerId: string
  workerName: string
  workerSignature?: string
  acknowledgedAt: string
  role: string
  comments?: string
}

export interface JSAApproval {
  id: string
  approverId: string
  approverName: string
  approverSignature?: string
  approvedAt?: string
  rejectedAt?: string
  role: "supervisor" | "safety_manager" | "project_manager"
  comments?: string
  status: "pending" | "approved" | "rejected"
}

export interface JSA {
  id: string
  jsaNumber: string
  title: string
  projectName: string
  location: string
  date: string
  duration: string
  crew: string[]
  equipmentRequired: string[]
  status: "draft" | "pending_approval" | "approved" | "active" | "completed" | "archived"
  tasks: JSATask[]
  acknowledgments: JSAAcknowledgment[]
  approvals: JSAApproval[]
  createdBy: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  linkedPermitIds?: string[]
  linkedInspectionIds?: string[]
}

export const controlTypeLabels: Record<JSAControl["type"], string> = {
  elimination: "Elimination",
  substitution: "Substitution",
  engineering: "Engineering Control",
  administrative: "Administrative Control",
  ppe: "PPE",
}

export const severityColors: Record<JSAHazard["severity"], string> = {
  low: "text-green-500",
  medium: "text-amber-500",
  high: "text-orange-500",
  critical: "text-red-500",
}

export const riskLevelColors: Record<JSAHazard["riskLevel"], string> = {
  low: "bg-green-500/20 text-green-500 border-green-500/30",
  medium: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  high: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  critical: "bg-red-500/20 text-red-500 border-red-500/30",
}
