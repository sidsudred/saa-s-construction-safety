"use client"

import { PermitRecord } from "@/lib/types/safety-record"
import { Button } from "@/components/ui/button"
import {
    PauseCircle,
    XCircle,
    RotateCcw,
    AlertCircle
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface PermitActionsProps {
    permit: PermitRecord
    onAction: (action: "suspend" | "revoke" | "reinstate", reason?: string) => void
}

export function PermitActions({ permit, onAction }: PermitActionsProps) {
    const [reason, setReason] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeAction, setActiveAction] = useState<"suspend" | "revoke" | null>(null)

    const handleConfirm = () => {
        if (activeAction) {
            onAction(activeAction, reason)
            setIsDialogOpen(false)
            setReason("")
        }
    }

    if (permit.status === "revoked" || permit.status === "closed" || permit.status === "archived") {
        return null
    }

    return (
        <div className="flex items-center gap-2">
            {permit.status === "suspended" ? (
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                    onClick={() => onAction("reinstate")}
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reinstate Permit
                </Button>
            ) : (
                <>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                onClick={() => setActiveAction("suspend")}
                            >
                                <PauseCircle className="h-4 w-4 mr-2" />
                                Suspend
                            </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => setActiveAction("revoke")}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Revoke
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertCircle className={activeAction === "revoke" ? "text-red-600" : "text-amber-600"} />
                                    {activeAction === "revoke" ? "Revoke Permit" : "Suspend Permit"}
                                </DialogTitle>
                                <DialogDescription>
                                    Please provide a reason for this action. This will be recorded in the audit log and notified to the permit receiver.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-2">
                                <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reason for {activeAction}</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="e.g. Unsafe site conditions, lack of required PPE, shift change..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button
                                    variant={activeAction === "revoke" ? "destructive" : "default"}
                                    onClick={handleConfirm}
                                    disabled={!reason.trim()}
                                >
                                    Confirm {activeAction === "revoke" ? "Revocation" : "Suspension"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    )
}
