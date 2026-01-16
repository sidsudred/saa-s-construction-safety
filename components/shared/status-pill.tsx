import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Status = "draft" | "submitted" | "under_review" | "under_investigation" | "approved" | "closed" | "archived" | "active" | "expired"

interface StatusPillProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground hover:bg-muted",
  },
  submitted: {
    label: "Submitted",
    className: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
  },
  under_review: {
    label: "Under Review",
    className: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  },
  under_investigation: {
    label: "Under Investigation",
    className: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  },
  approved: {
    label: "Approved",
    className: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
  },
  active: {
    label: "Active",
    className: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
  },
  expired: {
    label: "Expired",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  closed: {
    label: "Closed",
    className: "bg-secondary text-secondary-foreground hover:bg-secondary",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground hover:bg-muted",
  },
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.draft

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
