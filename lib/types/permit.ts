export interface PermitHazard {
  id: string
  category: string
  description: string
  controls: string[]
  severity: "low" | "medium" | "high" | "critical"
}

export interface PermitAcknowledgment {
  id: string
  workerId: string
  workerName: string
  workerSignature?: string
  acknowledgedAt: string
  role: string
  comments?: string
}

export interface Permit {
  id: string
  permitNumber: string
  title: string
  type:
    | "hot_work"
    | "confined_space"
    | "height"
    | "electrical"
    | "excavation"
    | "lifting"
    | "energy_isolation"
    | "cold_work"
  status:
    | "draft"
    | "pending_approval"
    | "approved"
    | "active"
    | "suspended"
    | "revoked"
    | "completed"
    | "expired"
    | "archived"
  location: string
  workDescription: string
  validFrom: string
  validTo: string

  // Permit details
  contractor: string
  supervisor: string
  safetyContact: string
  emergencyNumber: string

  // Hazards and controls
  hazards: PermitHazard[]
  additionalPrecautions: string[]

  // PPE requirements
  ppeRequired: string[]

  // Acknowledgments
  acknowledgments: PermitAcknowledgment[]

  // Linked records
  linkedJSAIds?: string[]
  linkedInspectionIds?: string[]
  linkedIncidentIds?: string[]

  // Metadata
  createdBy: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
  suspendedAt?: string
  suspendedBy?: string
  suspensionReason?: string
  revokedAt?: string
  revokedBy?: string
  revocationReason?: string
  completedAt?: string
}

export const permitTypeLabels: Record<Permit["type"], string> = {
  hot_work: "Hot Work",
  confined_space: "Confined Space",
  height: "Working at Height",
  electrical: "Electrical Work",
  excavation: "Excavation",
  lifting: "Lifting Operations",
  energy_isolation: "Energy Isolation (LOTO)",
  cold_work: "Cold Work",
}

export const permitTypeColors: Record<Permit["type"], string> = {
  hot_work: "bg-red-500/20 text-red-500 border-red-500/30",
  confined_space: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  height: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  electrical: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  excavation: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  lifting: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
  energy_isolation: "bg-pink-500/20 text-pink-500 border-pink-500/30",
  cold_work: "bg-slate-500/20 text-slate-500 border-slate-500/30",
}

export const hazardCategories = [
  "Fire/Explosion",
  "Toxic Atmosphere",
  "Oxygen Deficiency",
  "Fall Hazard",
  "Electrical",
  "Mechanical",
  "Chemical",
  "Environmental",
  "Traffic",
  "Other",
]
