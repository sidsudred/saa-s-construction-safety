"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Ban, CheckCircle } from "lucide-react"

interface PermitActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: "suspend" | "revoke" | "complete" | "reactivate"
  permitNumber: string
  onConfirm: (reason?: string) => void
}

export function PermitActionModal({ open, onOpenChange, action, permitNumber, onConfirm }: PermitActionModalProps) {
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(reason)
    setReason("")
    onOpenChange(false)
  }

  const getConfig = () => {
    switch (action) {
      case "suspend":
        return {
          title: "Suspend Permit",
          description: `Are you sure you want to suspend permit ${permitNumber}? Work must stop immediately.`,
          icon: <Ban className="h-12 w-12 text-warning" />,
          requireReason: true,
          buttonText: "Suspend Permit",
          buttonVariant: "default" as const,
        }
      case "revoke":
        return {
          title: "Revoke Permit",
          description: `Are you sure you want to revoke permit ${permitNumber}? This action cannot be undone.`,
          icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
          requireReason: true,
          buttonText: "Revoke Permit",
          buttonVariant: "destructive" as const,
        }
      case "complete":
        return {
          title: "Complete Permit",
          description: `Confirm that all work under permit ${permitNumber} has been completed safely.`,
          icon: <CheckCircle className="h-12 w-12 text-success" />,
          requireReason: false,
          buttonText: "Complete Permit",
          buttonVariant: "default" as const,
        }
      case "reactivate":
        return {
          title: "Reactivate Permit",
          description: `Reactivate permit ${permitNumber}? Ensure all safety conditions are met.`,
          icon: <CheckCircle className="h-12 w-12 text-chart-2" />,
          requireReason: true,
          buttonText: "Reactivate Permit",
          buttonVariant: "default" as const,
        }
    }
  }

  const config = getConfig()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4">{config.icon}</div>
          <DialogTitle className="text-center">{config.title}</DialogTitle>
          <DialogDescription className="text-center">{config.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {config.requireReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason {action === "suspend" || action === "revoke" ? "(Required)" : ""}</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Explain why you are ${action === "reactivate" ? "reactivating" : action === "complete" ? "completing" : action === "suspend" ? "suspending" : "revoking"} this permit`}
                rows={3}
                required={config.requireReason}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={config.buttonVariant}>
              {config.buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
