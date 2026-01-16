"use client"

import type { FormField } from "./form-builder-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GripVertical, Trash2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldRenderer } from "./field-renderer"

interface FormCanvasProps {
  fields: FormField[]
  selectedField: FormField | null
  onFieldSelect: (field: FormField) => void
  onFieldDelete: (fieldId: string) => void
  onFieldReorder: (fromIndex: number, toIndex: number) => void
  isPreviewMode: boolean
}

export function FormCanvas({
  fields,
  selectedField,
  onFieldSelect,
  onFieldDelete,
  onFieldReorder,
  isPreviewMode,
}: FormCanvasProps) {

  if (fields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start building your form</h3>
          <p className="text-sm text-muted-foreground">
            Click on fields from the palette on the left to add them to your form.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("max-w-4xl mx-auto p-8", isPreviewMode && "max-w-3xl")}>
      <Card className="p-8">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              onClick={() => !isPreviewMode && onFieldSelect(field)}
              className={cn(
                "group relative rounded-lg transition-all",
                !isPreviewMode && "cursor-pointer hover:bg-muted/50 p-4 -m-4",
                selectedField?.id === field.id && !isPreviewMode && "bg-primary/5 ring-2 ring-primary",
              )}
            >
              {!isPreviewMode && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <Label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {!isPreviewMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFieldDelete(field.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                {field.properties.description && (
                  <p className="text-sm text-muted-foreground">{field.properties.description}</p>
                )}
                <FieldRenderer field={field} isPreviewMode={isPreviewMode} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
