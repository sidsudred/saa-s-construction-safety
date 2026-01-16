"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon, Filter, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function AnalyticsFilters() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const { toast } = useToast()

    const handleExport = () => {
        toast({
            title: "Generating Safety Report",
            description: "PDF export initiated. Your report will be ready shortly.",
        })
    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
            </div>

            <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="sky">Skyline Tower</SelectItem>
                    <SelectItem value="bridge">Metro Bridge Phase 2</SelectItem>
                    <SelectItem value="port">East Port Expansion</SelectItem>
                </SelectContent>
            </Select>

            <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    <SelectItem value="zone-a">Zone A - Excavation</SelectItem>
                    <SelectItem value="zone-b">Zone B - Main Structure</SelectItem>
                    <SelectItem value="staging">Staging Area</SelectItem>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal bg-background"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>
        </div>
    )
}
