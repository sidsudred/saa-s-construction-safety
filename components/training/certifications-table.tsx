"use client"

import { CertificationRecord } from "@/lib/types/safety-record"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown, ExternalLink, ShieldCheck, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificationsTableProps {
    certs: CertificationRecord[]
}

export function CertificationsTable({ certs }: CertificationsTableProps) {
    const getStatusBadge = (expiry: string) => {
        const now = new Date()
        const expiryDate = new Date(expiry)
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            return (
                <Badge variant="destructive" className="gap-1 uppercase text-[9px] font-bold py-0 h-5">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Expired
                </Badge>
            )
        }
        if (diffDays <= 30) {
            return (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 uppercase text-[9px] font-bold py-0 h-5">
                    <Clock className="h-2.5 w-2.5" />
                    Expiring Soon
                </Badge>
            )
        }
        return (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 uppercase text-[9px] font-bold py-0 h-5">
                <ShieldCheck className="h-2.5 w-2.5" />
                Active
            </Badge>
        )
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest py-4">Worker</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Certification</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Issuing Authority</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Expiry Date</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Evidence</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {certs.map((cert) => (
                        <TableRow key={cert.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {cert.workerName.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{cert.workerName}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase">{cert.workerId}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="font-bold text-sm">{cert.title}</p>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase">{cert.certificateNumber}</p>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{cert.issuingAuthority}</TableCell>
                            <TableCell className="text-sm font-medium tabular-nums">
                                {new Date(cert.expiryDate || "").toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(cert.expiryDate || "")}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-blue-600">
                                    <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-blue-600">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
