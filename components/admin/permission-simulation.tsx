"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, User, Users, ShieldCheck, Settings, Briefcase } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/lib/contexts/role-context"
import { rolePermissions, roleLabels, roleDescriptions, type SimulationRole } from "@/lib/types/admin"

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

export function PermissionSimulation() {
  const { currentRole, setCurrentRole } = useRole()

  const currentPermissions = rolePermissions.find((p) => p.role === currentRole)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Permission Simulation</h1>
          <p className="text-muted-foreground">Test and preview what different roles can see and do</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(roleLabels) as SimulationRole[]).map((role) => {
          const Icon = roleIcons[role]
          const isActive = currentRole === role
          return (
            <Card
              key={role}
              className={`cursor-pointer transition-all ${isActive ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
              onClick={() => setCurrentRole(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5" />
                  {isActive && <Badge className={roleColors[role]}>Active</Badge>}
                </div>
                <CardTitle className="text-base">{roleLabels[role]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{roleDescriptions[role]}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {currentPermissions && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Permissions Overview</CardTitle>
              <CardDescription>What {roleLabels[currentRole]} can do in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can View</p>
                  <div className="space-y-1">
                    {currentPermissions.canView.map((item, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can Create</p>
                  <div className="space-y-1">
                    {currentPermissions.canCreate.map((item, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can Edit</p>
                  <div className="space-y-1">
                    {currentPermissions.canEdit.map((item, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can Delete</p>
                  <div className="space-y-1">
                    {currentPermissions.canDelete.length > 0 ? (
                      currentPermissions.canDelete.map((item, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No delete permissions</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can Approve</p>
                  <div className="space-y-1">
                    {currentPermissions.canApprove.length > 0 ? (
                      currentPermissions.canApprove.map((item, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No approval permissions</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Can Export</p>
                  <div className="space-y-1">
                    {currentPermissions.canExport.length > 0 ? (
                      currentPermissions.canExport.map((item, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No export permissions</span>
                    )}
                  </div>
                </div>
              </div>

              {currentPermissions.restrictions.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Restrictions</p>
                  <div className="space-y-2">
                    {currentPermissions.restrictions.map((restriction, index) => (
                      <div key={index} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                        <p className="text-xs text-destructive">{restriction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UI Preview</CardTitle>
              <CardDescription>
                Switch to other pages to see how the UI adapts to {roleLabels[currentRole]} permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" asChild>
                  <Link href="/incidents">View Incidents Module</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/inspections">View Inspections Module</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/jsa">View JSA Module</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/permits">View Permits Module</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/capa">View CAPA Module</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/analytics">View Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
