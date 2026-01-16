"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, Activity, Filter, Download } from "lucide-react"
import Link from "next/link"

interface LogEntry {
    id: string
    timestamp: string
    user: string
    action: string
    module: string
    details: string
    status: "success" | "warning" | "error"
}

const mockLogs: LogEntry[] = [
    {
        id: "LOG-001",
        timestamp: "2024-03-10 14:32:05",
        user: "Alex Morgan",
        action: "Update Configuration",
        module: "Admin",
        details: "Enabled 'Training' module",
        status: "success",
    },
    {
        id: "LOG-002",
        timestamp: "2024-03-10 14:15:22",
        user: "Sarah Chen",
        action: "Create Incident",
        module: "Incidents",
        details: "Created incident report INC-2024-089",
        status: "success",
    },
    {
        id: "LOG-003",
        timestamp: "2024-03-10 13:45:10",
        user: "System",
        action: "Backup",
        module: "System",
        details: "Daily database backup completed",
        status: "success",
    },
    {
        id: "LOG-004",
        timestamp: "2024-03-10 12:20:00",
        user: "Mike Johnson",
        action: "Login Failed",
        module: "Auth",
        details: "Invalid password attempt (3rd try)",
        status: "warning",
    },
    {
        id: "LOG-005",
        timestamp: "2024-03-10 11:30:45",
        user: "System",
        action: "API Error",
        module: "Integration",
        details: "Connection timeout to weather service",
        status: "error",
    },
    {
        id: "LOG-006",
        timestamp: "2024-03-10 10:15:33",
        user: "Alex Morgan",
        action: "User Invite",
        module: "Users",
        details: "Invited new user: david.w@example.com",
        status: "success",
    },
]

export function SystemLogs() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredLogs = mockLogs.filter(
        (log) =>
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">System Logs</h1>
                    <p className="text-muted-foreground">View system activity, security events, and audit trails</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-sm text-muted-foreground">{log.timestamp}</TableCell>
                                <TableCell className="font-medium">{log.user}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.module}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">{log.details}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            log.status === "success"
                                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                : log.status === "warning"
                                                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        }
                                    >
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
