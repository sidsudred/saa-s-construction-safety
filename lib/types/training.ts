export type TrainingType = "induction" | "toolbox_talk" | "refresher" | "certification"
export type TrainingStatus = "scheduled" | "in_progress" | "completed" | "cancelled"
export type CertificationStatus = "active" | "expiring_soon" | "expired" | "revoked"

export interface Training {
  id: string
  trainingNumber: string
  title: string
  type: TrainingType
  status: TrainingStatus
  date: string
  duration: number // minutes
  location: string
  trainer: string
  description: string
  topics: string[]
  requiredFor?: string[] // e.g., ["Hot Work", "Confined Space"]
  maxAttendees?: number
  materialsUrl?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface TrainingAttendance {
  id: string
  trainingId: string
  attendeeId: string
  attendeeName: string
  role: string
  company: string
  checkInTime?: string
  status: "registered" | "attended" | "no_show" | "cancelled"
  quizScore?: number
  signature?: string
  signedAt?: string
  certificateIssued?: boolean
  comments?: string
}

export interface WorkerCertification {
  id: string
  workerId: string
  workerName: string
  certificationType: string
  certificationNumber: string
  issuedDate: string
  expiryDate: string
  status: CertificationStatus
  issuer: string
  attachmentUrl?: string
  verificationStatus: "pending" | "verified" | "rejected"
  verifiedBy?: string
  verifiedAt?: string
  trainingRecordIds?: string[]
}

export const trainingTypeLabels: Record<TrainingType, string> = {
  induction: "Site Induction",
  toolbox_talk: "Toolbox Talk",
  refresher: "Refresher Training",
  certification: "Certification Course",
}

export const certificationStatusColors: Record<CertificationStatus, string> = {
  active: "bg-green-500/20 text-green-500 border-green-500/30",
  expiring_soon: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  expired: "bg-red-500/20 text-red-500 border-red-500/30",
  revoked: "bg-muted text-muted-foreground border-border",
}
