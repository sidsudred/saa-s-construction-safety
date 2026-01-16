"use client"

import { useRole } from "@/lib/contexts/role-context"
import { rolePermissions, type SimulationRole } from "@/lib/types/admin"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: SimulationRole[]
  action?: "view" | "create" | "edit" | "delete" | "approve" | "export"
  module?: string
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, action, module, fallback = null }: RoleGuardProps) {
  const { currentRole } = useRole()

  // If allowedRoles is specified, check if current role is in the list
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <>{fallback}</>
  }

  // If action and module are specified, check specific permissions
  if (action && module) {
    const rolePerms = rolePermissions.find((p) => p.role === currentRole)
    if (!rolePerms) return <>{fallback}</>

    const canPerformAction = (() => {
      switch (action) {
        case "view":
          return rolePerms.canView.includes(module) || rolePerms.canView.includes("All modules")
        case "create":
          return rolePerms.canCreate.includes(module) || rolePerms.canCreate.includes("All record types")
        case "edit":
          return (
            rolePerms.canEdit.includes(module) ||
            rolePerms.canEdit.includes("All records") ||
            rolePerms.canEdit.includes("Own and team records")
          )
        case "delete":
          return rolePerms.canDelete.includes(module) || rolePerms.canDelete.includes("All records")
        case "approve":
          return rolePerms.canApprove.includes(module) || rolePerms.canApprove.includes("All workflows")
        case "export":
          return rolePerms.canExport.includes(module) || rolePerms.canExport.includes("All data")
        default:
          return false
      }
    })()

    if (!canPerformAction) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
