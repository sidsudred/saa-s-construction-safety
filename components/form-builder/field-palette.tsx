"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Type,
  AlignLeft,
  Hash,
  Percent,
  Calendar,
  Clock,
  CalendarClock,
  CheckSquare,
  Circle,
  ChevronDown,
  ListChecks,
  Star,
  Table2,
  Paperclip,
  ImageIcon,
  PenTool,
  FileSignature,
  Users,
  UserCheck,
  Code2,
  Link2,
  Database,
  Calculator,
  Tag,
  Search,
} from "lucide-react"

interface FieldType {
  id: string
  label: string
  icon: any
  category: string
}

const fieldTypes: FieldType[] = [
  // Basic Input
  { id: "text", label: "Text Box", icon: Type, category: "Basic Input" },
  { id: "paragraph", label: "Paragraph", icon: AlignLeft, category: "Basic Input" },
  { id: "label", label: "Label", icon: Tag, category: "Basic Input" },
  { id: "poster", label: "Poster", icon: ImageIcon, category: "Basic Input" },

  // Numeric
  { id: "number", label: "Number", icon: Hash, category: "Numeric" },
  { id: "percentage", label: "Percentage", icon: Percent, category: "Numeric" },
  { id: "formula", label: "Formula", icon: Calculator, category: "Numeric" },

  // Date & Time
  { id: "date", label: "Date", icon: Calendar, category: "Date & Time" },
  { id: "time", label: "Time", icon: Clock, category: "Date & Time" },
  { id: "datetime", label: "Date & Time", icon: CalendarClock, category: "Date & Time" },

  // Selection
  { id: "checkbox", label: "Checkbox", icon: CheckSquare, category: "Selection" },
  { id: "radio", label: "Radio", icon: Circle, category: "Selection" },
  { id: "select", label: "Single Select", icon: ChevronDown, category: "Selection" },
  { id: "multiselect", label: "Multi Select", icon: ListChecks, category: "Selection" },
  { id: "rating", label: "Rating", icon: Star, category: "Selection" },

  // Advanced
  { id: "table", label: "Table", icon: Table2, category: "Advanced" },
  { id: "attachment", label: "Attachment", icon: Paperclip, category: "Advanced" },
  { id: "annotated-image", label: "Annotated Image", icon: ImageIcon, category: "Advanced" },
  { id: "scribble", label: "Scribble", icon: PenTool, category: "Advanced" },
  { id: "signature", label: "Signature", icon: FileSignature, category: "Advanced" },

  // User & References
  { id: "roster", label: "Roster", icon: Users, category: "User & References" },
  { id: "user-selector", label: "User Selector", icon: UserCheck, category: "User & References" },
  { id: "phase-code", label: "Phase Code", icon: Code2, category: "User & References" },
  { id: "reference-field", label: "Reference Field", icon: Link2, category: "User & References" },
  { id: "asset-reference", label: "Asset Reference", icon: Link2, category: "User & References" },

  // Custom Tables
  { id: "custom-table-link", label: "Direct Link to Custom Tables", icon: Database, category: "Custom Tables" },
  { id: "autofill", label: "Autofill to Custom Tables", icon: Database, category: "Custom Tables" },

  // System Fields
  { id: "auto-timestamp", label: "Auto Timestamp", icon: Clock, category: "System Fields" },
  { id: "auto-location", label: "Auto Location", icon: Tag, category: "System Fields" },
  { id: "status", label: "Status", icon: Tag, category: "System Fields" },
  { id: "version-identifier", label: "Version Identifier", icon: Tag, category: "System Fields" },
]

const categories = Array.from(new Set(fieldTypes.map((f) => f.category)))

export function FieldPalette({ onFieldAdd }: { onFieldAdd: (fieldType: string, fieldLabel: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFields = fieldTypes.filter((field) => field.label.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFieldClick = (field: FieldType) => {
    onFieldAdd(field.id, field.label)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold mb-3">Field Palette</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const categoryFields = filteredFields.filter((f) => f.category === category)
            if (categoryFields.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-1">
                  {categoryFields.map((field) => {
                    const Icon = field.icon
                    return (
                      <Button
                        key={field.id}
                        variant="ghost"
                        className="w-full justify-start text-sm h-auto py-2.5"
                        onClick={() => handleFieldClick(field)}
                      >
                        <Icon className="mr-3 h-4 w-4 text-muted-foreground" />
                        {field.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
