"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, Users, MoreVertical, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    id: string
    name: string
    email: string
    role: string
    department: string
    status: "active" | "inactive" | "invited"
    lastActive: string
}

const mockUsers: User[] = [
    {
        id: "1",
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        role: "Admin",
        department: "Management",
        status: "active",
        lastActive: "2 mins ago",
    },
    {
        id: "2",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        role: "Safety Officer",
        department: "EHS",
        status: "active",
        lastActive: "1 hour ago",
    },
    {
        id: "3",
        name: "Mike Johnson",
        email: "mike.j@example.com",
        role: "Supervisor",
        department: "Operations",
        status: "inactive",
        lastActive: "2 days ago",
    },
    {
        id: "4",
        name: "Emily Davis",
        email: "emily.d@example.com",
        role: "Field Worker",
        department: "Construction",
        status: "active",
        lastActive: "5 mins ago",
    },
    {
        id: "5",
        name: "David Wilson",
        email: "david.w@example.com",
        role: "Contractor",
        department: "External",
        status: "invited",
        lastActive: "Never",
    },
]

export function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()),
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
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage system users, roles, and access controls</p>
                </div>
                <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Invite User
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
                                            <AvatarFallback>
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-muted-foreground" />
                                        <span>{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            user.status === "active"
                                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                : user.status === "invited"
                                                    ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                    : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                                        }
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{user.lastActive}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Deactivate User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
