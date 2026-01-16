"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRole } from "@/lib/contexts/role-context"
import { roleLabels } from "@/lib/types/admin"
import { Shield, X } from "lucide-react"

export function PermissionBanner() {
  const { currentRole, setCurrentRole, isSimulating } = useRole()

  if (!isSimulating) return null

  return (
    <Alert className="border-chart-1 bg-chart-1/5">
      <Shield className="h-4 w-4 text-chart-1" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">
          Viewing as <span className="font-semibold">{roleLabels[currentRole]}</span> - UI elements are adjusted based
          on role permissions
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentRole("admin")}
          className="h-7 text-xs hover:bg-chart-1/10"
        >
          <X className="mr-1 h-3 w-3" />
          Exit Simulation
        </Button>
      </AlertDescription>
    </Alert>
  )
}
