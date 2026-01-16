"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Bell, Mail, MessageSquare, Smartphone } from "lucide-react"
import Link from "next/link"
import type { NotificationRule } from "@/lib/types/admin"

const mockRules: NotificationRule[] = [
  {
    id: "1",
    name: "Incident Reported",
    description: "Send notification when a new incident is reported",
    trigger: "incident.created",
    conditions: ["severity = high"],
    recipients: ["safety_manager", "site_supervisor"],
    channels: ["email", "in-app"],
    enabled: true,
  },
  {
    id: "2",
    name: "Inspection Overdue",
    description: "Alert when an inspection is past its due date",
    trigger: "inspection.overdue",
    conditions: ["days_overdue > 3"],
    recipients: ["assigned_inspector", "supervisor"],
    channels: ["email", "sms", "in-app"],
    enabled: true,
  },
  {
    id: "3",
    name: "CAPA Approaching Due Date",
    description: "Remind assignee when CAPA action is due soon",
    trigger: "capa.due_soon",
    conditions: ["days_until_due <= 7", "status != completed"],
    recipients: ["action_assignee", "action_owner"],
    channels: ["email", "in-app"],
    enabled: true,
  },
  {
    id: "4",
    name: "Permit Expiring",
    description: "Notify permit holder when permit is about to expire",
    trigger: "permit.expiring",
    conditions: ["hours_until_expiry <= 2"],
    recipients: ["permit_holder", "issuing_authority"],
    channels: ["sms", "in-app"],
    enabled: true,
  },
  {
    id: "5",
    name: "Certification Expired",
    description: "Alert when a worker's certification has expired",
    trigger: "certification.expired",
    conditions: [],
    recipients: ["worker", "hr_manager", "supervisor"],
    channels: ["email", "in-app"],
    enabled: false,
  },
]

const channelIcons = {
  email: Mail,
  sms: Smartphone,
  "in-app": MessageSquare,
}

export function NotificationRules() {
  const [rules, setRules] = useState(mockRules)

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const enabledCount = rules.filter((r) => r.enabled).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Notification Rules</h1>
          <p className="text-muted-foreground">Configure automated notifications and alerts</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {enabledCount}/{rules.length}
          </div>
          <div className="text-sm text-muted-foreground">rules active</div>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className={!rule.enabled ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      rule.enabled ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Bell className={`h-5 w-5 ${rule.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <CardDescription className="mt-1">{rule.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Trigger</div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {rule.trigger}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Recipients</div>
                  <div className="flex flex-wrap gap-2">
                    {rule.recipients.map((recipient) => (
                      <Badge key={recipient} variant="secondary">
                        {recipient.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {rule.conditions.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Conditions</div>
                  <div className="flex flex-wrap gap-2">
                    {rule.conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="font-mono text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Channels</div>
                <div className="flex gap-2">
                  {rule.channels.map((channel) => {
                    const Icon = channelIcons[channel]
                    return (
                      <div key={channel} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{channel}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
