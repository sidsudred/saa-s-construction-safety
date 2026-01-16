import type { RecordStatus } from "@/lib/types/safety-record"

export interface WorkflowTransition {
  to: RecordStatus
  label: string
  icon: string
  requiresComment?: boolean
  allowedRoles: string[]
}

export const workflowTransitions: Record<RecordStatus, WorkflowTransition[]> = {
  draft: [
    {
      to: "submitted",
      label: "Submit for Review",
      icon: "Send",
      allowedRoles: ["field_worker", "supervisor", "safety_officer", "admin"],
    },
  ],
  submitted: [
    {
      to: "under_review",
      label: "Start Review",
      icon: "Eye",
      allowedRoles: ["supervisor", "safety_officer", "admin"],
    },
    {
      to: "draft",
      label: "Return to Draft",
      icon: "ArrowLeft",
      requiresComment: true,
      allowedRoles: ["supervisor", "safety_officer", "admin"],
    },
  ],
  under_review: [
    {
      to: "approved",
      label: "Approve",
      icon: "CheckCircle",
      allowedRoles: ["safety_officer", "admin"],
    },
    {
      to: "submitted",
      label: "Request Changes",
      icon: "XCircle",
      requiresComment: true,
      allowedRoles: ["safety_officer", "admin"],
    },
  ],
  approved: [
    {
      to: "closed",
      label: "Close Record",
      icon: "Archive",
      allowedRoles: ["safety_officer", "admin"],
    },
  ],
  closed: [
    {
      to: "archived",
      label: "Archive",
      icon: "FolderArchive",
      allowedRoles: ["admin"],
    },
  ],
  archived: [],
}

export function getAvailableTransitions(currentStatus: RecordStatus, userRole: string): WorkflowTransition[] {
  const transitions = workflowTransitions[currentStatus] || []
  return transitions.filter((t) => t.allowedRoles.includes(userRole))
}

export function canTransition(currentStatus: RecordStatus, nextStatus: RecordStatus, userRole: string): boolean {
  const availableTransitions = getAvailableTransitions(currentStatus, userRole)
  return availableTransitions.some((t) => t.to === nextStatus)
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  fromStatus?: RecordStatus
  toStatus?: RecordStatus
  comment?: string
}

export function createAuditLogEntry(
  user: string,
  action: string,
  fromStatus?: RecordStatus,
  toStatus?: RecordStatus,
  comment?: string,
): AuditLogEntry {
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    user,
    action,
    fromStatus,
    toStatus,
    comment,
  }
}
