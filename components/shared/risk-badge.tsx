import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

type RiskLevel = "low" | "medium" | "high" | "critical" | "minor" | "moderate" | "serious"

interface RiskBadgeProps {
  level: RiskLevel
  showIcon?: boolean
  className?: string
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
  },
  minor: {
    label: "Minor",
    className: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
  },
  medium: {
    label: "Medium",
    className: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  },
  moderate: {
    label: "Moderate",
    className: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  },
  high: {
    label: "High",
    className: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  serious: {
    label: "Serious",
    className: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
}

export function RiskBadge({ level, showIcon = true, className }: RiskBadgeProps) {
  const config = riskConfig[level] || riskConfig.medium

  return (
    <Badge variant="secondary" className={cn("gap-1", config.className, className)}>
      {showIcon && <AlertTriangle className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
