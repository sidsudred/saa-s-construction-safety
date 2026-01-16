"use client"

import { WorkflowState, isValidTransition, WORKFLOW_TRANSITIONS } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Send, CheckCircle2, XCircle, RotateCcw, Archive } from "lucide-react"

interface WorkflowActionsProps {
    currentStatus: WorkflowState
    onTransition: (to: WorkflowState) => void
    disabled?: boolean
}

export function WorkflowActions({ currentStatus, onTransition, disabled }: WorkflowActionsProps) {
    const availableTransitions = WORKFLOW_TRANSITIONS[currentStatus] || []

    if (availableTransitions.length === 0) return null

    const getActionIcon = (status: WorkflowState) => {
        switch (status) {
            case "submitted": return <Send className="mr-2 h-4 w-4" />
            case "approved": return <CheckCircle2 className="mr-2 h-4 w-4" />
            case "closed": return <CheckCircle2 className="mr-2 h-4 w-4" />
            case "draft": return <RotateCcw className="mr-2 h-4 w-4" />
            case "archived": return <Archive className="mr-2 h-4 w-4" />
            default: return null
        }
    }

    const getActionLabel = (status: string) => {
        switch (status) {
            case "submitted": return "Submit"
            case "under_review": return "Send for Review"
            case "approved": return "Approve"
            case "closed": return "Close Record"
            case "draft": return "Revert to Draft"
            case "archived": return "Archive"
            default: return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        }
    }

    return (
        <div className="flex gap-2">
            {availableTransitions.slice(0, 1).map((to) => (
                <Button
                    key={to}
                    onClick={() => onTransition(to)}
                    disabled={disabled}
                    variant={to === "approved" || to === "submitted" ? "default" : "outline"}
                >
                    {getActionIcon(to)}
                    {getActionLabel(to)}
                </Button>
            ))}

            {availableTransitions.length > 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={disabled}>
                            More Actions
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {availableTransitions.slice(1).map((to) => (
                            <DropdownMenuItem key={to} onClick={() => onTransition(to)}>
                                {getActionIcon(to)}
                                {getActionLabel(to)}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}
