"use client"

import { useState } from "react"
import { FieldPalette } from "./field-palette"
import { FormCanvas } from "./form-canvas"
import { FieldProperties } from "./field-properties"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Save, Settings, ArrowLeft, History } from "lucide-react"
import Link from "next/link"

export interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  properties: Record<string, any>
}

export function FormBuilderEditor() {
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleFieldAdd = (fieldType: string, fieldLabel: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: fieldLabel,
      required: false,
      properties: {},
    }
    setFormFields([...formFields, newField])
    setSelectedField(newField)
  }

  const handleFieldSelect = (field: FormField) => {
    setSelectedField(field)
  }

  const handleFieldUpdate = (updatedField: FormField) => {
    setFormFields(formFields.map((f) => (f.id === updatedField.id ? updatedField : f)))
    setSelectedField(updatedField)
  }

  const handleFieldDelete = (fieldId: string) => {
    setFormFields(formFields.filter((f) => f.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const handleFieldReorder = (fromIndex: number, toIndex: number) => {
    const newFields = [...formFields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)
    setFormFields(newFields)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/form-builder/templates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Daily Site Inspection Form</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Form Builder</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                v2.1
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/form-builder/versions/daily-site-inspection">
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              Version History
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Field Palette */}
        {!isPreviewMode && (
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <FieldPalette onFieldAdd={handleFieldAdd} />
          </div>
        )}

        {/* Center Panel - Form Canvas */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <FormCanvas
            fields={formFields}
            selectedField={selectedField}
            onFieldSelect={handleFieldSelect}
            onFieldDelete={handleFieldDelete}
            onFieldReorder={handleFieldReorder}
            isPreviewMode={isPreviewMode}
          />
        </div>

        {/* Right Panel - Field Properties */}
        {!isPreviewMode && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <FieldProperties selectedField={selectedField} onFieldUpdate={handleFieldUpdate} />
          </div>
        )}
      </div>
    </div>
  )
}
