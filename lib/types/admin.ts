export type UserRole = "admin" | "manager" | "supervisor" | "user" | "field_worker" | "safety_officer" | "contractor"

export interface Module {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
  routes: string[]
}

export interface FormAssignment {
  id: string
  formTemplateId: string
  formTemplateName: string
  moduleName: string
  workflowStage: string
  required: boolean
  autoCreate: boolean
}

export interface WorkflowStage {
  id: string
  name: string
  requiredRole: UserRole
  requiresApproval: boolean
  notifyUsers: boolean
  autoTransition: boolean
  nextStage?: string
}

export interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: string
  conditions: string[]
  recipients: string[]
  channels: ("email" | "sms" | "in-app")[]
  enabled: boolean
}

export interface PolicyDocument {
  id: string
  title: string
  category: string
  version: string
  effectiveDate: string
  expiryDate?: string
  status: "draft" | "active" | "expired" | "archived"
  fileUrl: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  acknowledgedBy?: string[]
}

export interface PermissionSet {
  role: UserRole
  permissions: {
    [module: string]: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
      approve: boolean
      export: boolean
    }
  }
}

export type SimulationRole = "field_worker" | "supervisor" | "safety_officer" | "admin" | "contractor"

export const roleLabels: Record<SimulationRole, string> = {
  field_worker: "Field Worker",
  supervisor: "Supervisor",
  safety_officer: "Safety Officer",
  admin: "Admin",
  contractor: "Contractor",
}

export const roleDescriptions: Record<SimulationRole, string> = {
  field_worker: "Can view and acknowledge documents, submit observations",
  supervisor: "Can create records, manage teams, approve JSAs",
  safety_officer: "Can investigate incidents, manage CAPA, view analytics",
  admin: "Full system access including configuration and management",
  contractor: "Limited access to own records only",
}

export interface RolePermissions {
  role: SimulationRole
  canView: string[]
  canCreate: string[]
  canEdit: string[]
  canDelete: string[]
  canApprove: string[]
  canExport: string[]
  restrictions: string[]
}

export const rolePermissions: RolePermissions[] = [
  {
    role: "field_worker",
    canView: ["Observations", "JSA", "Permits", "Training", "Site Diaries"],
    canCreate: ["Observations", "Incidents", "Site Diaries"],
    canEdit: ["Own records only"],
    canDelete: [],
    canApprove: [],
    canExport: [],
    restrictions: ["Cannot view analytics", "Cannot access admin", "Cannot approve workflows"],
  },
  {
    role: "supervisor",
    canView: ["All modules except Admin"],
    canCreate: ["Inspections", "JSA", "Permits", "Observations", "Incidents", "Site Diaries"],
    canEdit: ["Own and team records"],
    canDelete: [],
    canApprove: ["JSA", "Permits"],
    canExport: ["Reports"],
    restrictions: ["Cannot access admin settings", "Cannot delete records"],
  },
  {
    role: "safety_officer",
    canView: ["All modules"],
    canCreate: ["All record types"],
    canEdit: ["All records"],
    canDelete: [],
    canApprove: ["All workflows"],
    canExport: ["All data"],
    restrictions: ["Cannot modify system configuration"],
  },
  {
    role: "admin",
    canView: ["All modules"],
    canCreate: ["All types"],
    canEdit: ["All records"],
    canDelete: ["All records"],
    canApprove: ["All workflows"],
    canExport: ["All data"],
    restrictions: [],
  },
  {
    role: "contractor",
    canView: ["Own records only"],
    canCreate: ["Observations", "Incidents"],
    canEdit: ["Own records only"],
    canDelete: [],
    canApprove: [],
    canExport: [],
    restrictions: [
      "Cannot view other contractor data",
      "Cannot access CAPA",
      "Cannot view analytics",
      "Time-limited access",
    ],
  },
]
