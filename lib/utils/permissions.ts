import { rolePermissions, type SimulationRole } from "@/lib/types/admin"

export function getRolePermissions(role: SimulationRole) {
    return rolePermissions.find((p) => p.role === role)
}

export function canViewModule(role: SimulationRole, moduleName: string): boolean {
    const permissions = getRolePermissions(role)
    if (!permissions) return false

    if (role === "admin" || role === "safety_officer") return true
    if (permissions.canView.includes("All modules") || permissions.canView.includes("All modules except Admin")) {
        if (moduleName === "Admin" && role !== "admin") return false
        return true
    }

    return permissions.canView.some(v => v.toLowerCase() === moduleName.toLowerCase())
}

export function canCreateRecord(role: SimulationRole, recordType: string): boolean {
    const permissions = getRolePermissions(role)
    if (!permissions) return false

    if (role === "admin" || role === "safety_officer") return true
    if (permissions.canCreate.includes("All record types") || permissions.canCreate.includes("All types")) return true

    return permissions.canCreate.some(c => c.toLowerCase() === recordType.toLowerCase())
}

export function canDeleteRecord(role: SimulationRole): boolean {
    const permissions = getRolePermissions(role)
    if (!permissions) return false

    if (role === "admin") return true
    return permissions.canDelete.length > 0
}

export function canApprove(role: SimulationRole, workflowType: string): boolean {
    const permissions = getRolePermissions(role)
    if (!permissions) return false

    if (role === "admin" || role === "safety_officer") return true
    if (permissions.canApprove.includes("All workflows")) return true

    return permissions.canApprove.some(a => a.toLowerCase() === workflowType.toLowerCase())
}
