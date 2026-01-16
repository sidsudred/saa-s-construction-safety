"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRole } from "@/lib/contexts/role-context"
import { roleLabels, roleDescriptions, type SimulationRole } from "@/lib/types/admin"
import { Shield, ChevronDown, User, Users, ShieldCheck, Settings, Briefcase } from "lucide-react"

const roleIcons: Record<SimulationRole, typeof User> = {
  field_worker: User,
  supervisor: Users,
  safety_officer: ShieldCheck,
  admin: Settings,
  contractor: Briefcase,
}

const roleColors: Record<SimulationRole, string> = {
  field_worker: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  supervisor: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  safety_officer: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  admin: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  contractor: "bg-chart-3/10 text-chart-3 border-chart-3/20",
}

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, isSimulating } = useRole()
  const RoleIcon = roleIcons[currentRole]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {isSimulating && <Shield className="h-4 w-4 text-chart-1" />}
          <RoleIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{roleLabels[currentRole]}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-chart-1" />
            <span>Role Simulation</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleLabels) as SimulationRole[]).map((role) => {
          const Icon = roleIcons[role]
          return (
            <DropdownMenuItem key={role} onClick={() => setCurrentRole(role)} className="cursor-pointer">
              <div className="flex items-start gap-3 py-1">
                <Icon className="h-4 w-4 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{roleLabels[role]}</span>
                    {currentRole === role && <Badge className={roleColors[role]}>Active</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{roleDescriptions[role]}</p>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
