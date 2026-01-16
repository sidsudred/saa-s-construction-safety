"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Eye,
  CheckSquare,
  GraduationCap,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter, usePathname } from "next/navigation"
import { useRole } from "@/lib/contexts/role-context"
import { canViewModule } from "@/lib/utils/permissions"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Form Builder", href: "/form-builder/templates" },
  { icon: ClipboardCheck, label: "Inspections & Audits", href: "/inspections" },
  { icon: AlertTriangle, label: "Incidents", href: "/incidents" },
  { icon: FileCheck, label: "JSA / JHA", href: "/jsa" },
  { icon: ShieldCheck, label: "Permits to Work", href: "/permits" },
  { icon: Eye, label: "Observations & Site Diaries", href: "/observations" },
  { icon: CheckSquare, label: "Corrective Actions", href: "/capa" },
  { icon: GraduationCap, label: "Training & Certifications", href: "/training" },
  { icon: BarChart3, label: "Analytics & Reports", href: "/analytics" },
  { icon: Settings, label: "Admin & Configuration", href: "/admin" },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentRole } = useRole()

  // Simple check for "Back to Home" requirement if needed, though Dashboard is home.
  // We can add a distinct home button if requested, but Dashboard serves this purpose.

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  const filteredItems = navigationItems.filter(item => {
    // Admin is always visible to admin only (or check permission which returns true only for admin)
    if (item.label === "Admin & Configuration") {
      return currentRole === "admin"
    }

    // Map label/href to permission module name logic logic
    // Dashboard is always visible
    if (item.label === "Dashboard") return true;

    // Use a mapping or simple check
    let moduleName = item.label;
    if (item.href === "/inspections") moduleName = "Inspections";
    if (item.href === "/incidents") moduleName = "Incidents";
    if (item.href === "/jsa") moduleName = "JSA";
    if (item.href === "/permits") moduleName = "Permits";
    if (item.href === "/observations") moduleName = "Observations";
    if (item.href === "/capa") moduleName = "CAPA"; // Corrective Actions
    if (item.href === "/training") moduleName = "Training";

    // Check permission
    // For now we map manually to what is in permissions.ts or use the utility
    if (moduleName === "Inspections") return canViewModule(currentRole, "Inspections");
    if (moduleName === "Incidents") return canViewModule(currentRole, "Incidents");
    if (moduleName === "JSA") return canViewModule(currentRole, "JSA");
    if (moduleName === "Permits") return canViewModule(currentRole, "Permits");
    if (moduleName === "Observations") return canViewModule(currentRole, "Observations");
    if (moduleName === "Training") return canViewModule(currentRole, "Training");

    // Handle special cases or default
    return canViewModule(currentRole, moduleName);
  })

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <ShieldCheck className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">SafetyPro</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent", !isOpen && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Button
                key={index}
                variant={active ? "default" : "ghost"}
                className={cn(
                  "justify-start gap-3 text-sidebar-foreground",
                  active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                  !active && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isOpen && "justify-center px-2",
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span className="text-sm">{item.label}</span>}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      {/* Explicit Home Button as requested "at the last make sure for every page there is a access button to come back to home page" */}
      <div className="p-3 border-t border-sidebar-border mt-auto">
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2", !isOpen && "justify-center px-0")}
          onClick={() => router.push('/')}
        >
          <LayoutDashboard className="h-4 w-4" />
          {isOpen && "Home"}
        </Button>
      </div>
    </aside>
  )
}
