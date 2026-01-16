"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Filter } from "lucide-react"

export function FilterPanel() {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Date Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Last 7 days</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 30 days</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 90 days</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Custom range</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Draft</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Submitted</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Approved</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Closed</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Risk Level</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Priority</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Record Type</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Assignee</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
