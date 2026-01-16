import type React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react"

type Priority = "low" | "medium" | "high" | "critical"

interface PriorityIndicatorProps {
  priority: Priority | string
  className?: string
}

const priorityConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  low: {
    label: "Low",
    icon: <ArrowDown className="h-3 w-3" />,
    className: "bg-muted text-muted-foreground hover:bg-muted",
  },
  medium: {
    label: "Medium",
    icon: <Minus className="h-3 w-3" />,
    className: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  },
  high: {
    label: "High",
    icon: <ArrowUp className="h-3 w-3" />,
    className: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  critical: {
    label: "Critical",
    icon: <AlertTriangle className="h-3 w-3" />,
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const config = priorityConfig[priority] || priorityConfig.medium

  return (
    <Badge variant="secondary" className={cn("gap-1", config.className, className)}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
