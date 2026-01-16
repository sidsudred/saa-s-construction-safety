import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AuditLogEntry } from "@/lib/utils/workflow"

interface TimelineEvent {
  id: string
  action: string
  user: string
  timestamp: string
  type: "create" | "update" | "approve" | "comment" | "status_change"
}

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    action: "Incident report approved",
    user: "Safety Manager",
    timestamp: "2 hours ago",
    type: "approve",
  },
  {
    id: "2",
    action: 'Added comment: "Need additional photos of the affected area"',
    user: "John Doe",
    timestamp: "5 hours ago",
    type: "comment",
  },
  {
    id: "3",
    action: "Updated risk assessment from Medium to High",
    user: "Mike Johnson",
    timestamp: "1 day ago",
    type: "update",
  },
  {
    id: "4",
    action: "Incident report created",
    user: "Sarah Williams",
    timestamp: "2 days ago",
    type: "create",
  },
]

interface AuditTimelineProps {
  auditLog?: AuditLogEntry[]
}

export function AuditTimeline({ auditLog }: AuditTimelineProps) {
  const events: TimelineEvent[] = auditLog
    ? auditLog.map((entry) => ({
        id: entry.id,
        action: entry.comment
          ? `${entry.action} - "${entry.comment}"`
          : entry.fromStatus && entry.toStatus
            ? `${entry.action} (${entry.fromStatus} → ${entry.toStatus})`
            : entry.action,
        user: entry.user,
        timestamp: new Date(entry.timestamp).toLocaleString(),
        type: entry.toStatus === "approved" ? "approve" : entry.fromStatus ? "status_change" : "update",
      }))
    : mockEvents

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Complete audit trail of all changes and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-6">
          <div className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-border" />
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              <div
                className={cn(
                  "absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-background",
                  event.type === "approve" && "bg-chart-3",
                  event.type === "create" && "bg-primary",
                  event.type === "update" && "bg-chart-4",
                  event.type === "comment" && "bg-chart-2",
                  event.type === "status_change" && "bg-chart-4",
                )}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">{event.action}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{event.user}</span>
                  <span>•</span>
                  <span>{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
