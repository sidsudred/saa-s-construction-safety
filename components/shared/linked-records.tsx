"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Link as LinkIcon,
    ExternalLink,
    Trash2,
    Plus,
    AlertTriangle,
    FileCheck,
    ShieldCheck,
    ClipboardCheck,
    Search
} from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { linkService, type LinkedRecord, type RecordType } from "@/lib/services/link-service"

interface LinkedRecordsProps {
    recordId: string
    recordType: RecordType
}

const typeIcons: Record<RecordType, any> = {
    incident: AlertTriangle,
    jsa: FileCheck,
    permit: ShieldCheck,
    inspection: ClipboardCheck,
    observation: LinkIcon, // default
    capa: LinkIcon // default
}

const typeColors: Record<RecordType, string> = {
    incident: "text-red-500 bg-red-500/10 border-red-500/20",
    jsa: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    permit: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    inspection: "text-green-500 bg-green-500/10 border-green-500/20",
    observation: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    capa: "text-orange-500 bg-orange-500/10 border-orange-500/20",
}

export function LinkedRecords({ recordId, recordType }: LinkedRecordsProps) {
    const [links, setLinks] = useState<LinkedRecord[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState<RecordType>("incident")

    useEffect(() => {
        // In a real app, this would be an async fetch
        setLinks(linkService.getLinks(recordId))
    }, [recordId])

    const handleAddLink = () => {
        // Mock adding a link
        // In reality, you'd select from a list of actual records
        const newLink: LinkedRecord = {
            id: `link-${Date.now()}`,
            type: selectedType,
            referenceId: `${selectedType.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
            title: `Linked ${selectedType} record`,
            status: "Active",
            date: new Date().toISOString().split('T')[0]
        }

        linkService.addLink(recordId, newLink)
        setLinks(linkService.getLinks(recordId))
        setIsDialogOpen(false)
    }

    const handleRemoveLink = (targetId: string) => {
        linkService.removeLink(recordId, targetId)
        setLinks(linkService.getLinks(recordId))
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LinkIcon className="h-5 w-5" />
                            Linked Records
                        </CardTitle>
                        <CardDescription>
                            Related safety records and documents
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Link Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Link a Record</DialogTitle>
                                <DialogDescription>
                                    Search for a record to link to this {recordType}.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Select
                                        value={selectedType}
                                        onValueChange={(val) => setSelectedType(val as RecordType)}
                                    >
                                        <SelectTrigger className="col-span-4">
                                            <SelectValue placeholder="Select Record Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="incident">Incident</SelectItem>
                                            <SelectItem value="jsa">JSA / JHA</SelectItem>
                                            <SelectItem value="permit">Permit to Work</SelectItem>
                                            <SelectItem value="inspection">Inspection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID or title..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Mock Search Results */}
                                <div className="border rounded-md p-2 mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                                    <p className="text-xs text-muted-foreground px-2 pb-2">Recent Records</p>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer border border-transparent hover:border-border">
                                            <div className="flex items-center gap-3">
                                                <FileCheck className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div className="font-medium text-sm">Example {selectedType} {i}</div>
                                                    <div className="text-xs text-muted-foreground">REF-{100 + i} • Open</div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="secondary" onClick={handleAddLink}>Select</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {links.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg bg-muted/30">
                        <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium">No linked records</p>
                        <p className="text-xs text-muted-foreground mt-1">Link related incidents, permits, or inspections</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {links.map((link) => {
                            const Icon = typeIcons[link.type] || LinkIcon
                            return (
                                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${typeColors[link.type]}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {link.title}
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
                                                    {link.referenceId}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                <span className="capitalize">{link.type}</span>
                                                <span>•</span>
                                                <span>{link.date}</span>
                                                <span>•</span>
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1">{link.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/${link.type}s/${link.id}`}>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(link.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
