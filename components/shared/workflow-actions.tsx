"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Eye, CheckCircle, XCircle, Archive, FolderArchive, ArrowLeft } from "lucide-react"
import type { RecordStatus } from "@/lib/types/safety-record"
import { getAvailableTransitions, type AuditLogEntry } from "@/lib/utils/workflow"

const iconMap = {
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  FolderArchive,
  ArrowLeft,
}

interface WorkflowActionsProps {
  currentStatus: RecordStatus
  userRole: string
  onTransition: (newStatus: RecordStatus, comment?: string) => void
  auditLog?: AuditLogEntry[]
}

export function WorkflowActions({ currentStatus, userRole, onTransition, auditLog = [] }: WorkflowActionsProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTransition, setSelectedTransition] = useState<{
    to: RecordStatus
    label: string
    requiresComment?: boolean
  } | null>(null)
  const [comment, setComment] = useState("")

  const availableTransitions = getAvailableTransitions(currentStatus, userRole)

  const handleTransitionClick = (transition: (typeof availableTransitions)[0]) => {
    if (transition.requiresComment) {
      setSelectedTransition(transition)
      setShowDialog(true)
    } else {
      onTransition(transition.to)
    }
  }

  const handleConfirmTransition = () => {
    if (selectedTransition) {
      onTransition(selectedTransition.to, comment)
      setShowDialog(false)
      setComment("")
      setSelectedTransition(null)
    }
  }

  if (availableTransitions.length === 0) {
    return null
  }

  return (
    <>
      {availableTransitions.map((transition) => {
        const Icon = iconMap[transition.icon as keyof typeof iconMap]
        return (
          <Button key={transition.to} onClick={() => handleTransitionClick(transition)}>
            <Icon className="mr-2 h-4 w-4" />
            {transition.label}
          </Button>
        )
      })}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTransition?.label}</DialogTitle>
            <DialogDescription>Please provide a reason for this status change.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your reason for this change..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false)
                setComment("")
                setSelectedTransition(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTransition} disabled={!comment.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
