"use client"

import type { FormField } from "./form-builder-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Settings } from "lucide-react"

interface FieldPropertiesProps {
  selectedField: FormField | null
  onFieldUpdate: (field: FormField) => void
}

export function FieldProperties({ selectedField, onFieldUpdate }: FieldPropertiesProps) {
  if (!selectedField) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Settings className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Select a field to edit its properties</p>
        </div>
      </div>
    )
  }

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate({ ...selectedField, ...updates })
  }

  const updateProperty = (key: string, value: any) => {
    onFieldUpdate({
      ...selectedField,
      properties: { ...selectedField.properties, [key]: value },
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Field Properties</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="field-label"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Label
              </Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => updateField({ label: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="field-description"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="field-description"
                value={selectedField.properties.description || ""}
                onChange={(e) => updateProperty("description", e.target.value)}
                placeholder="Help text for this field..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="field-placeholder"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Placeholder
              </Label>
              <Input
                id="field-placeholder"
                value={selectedField.properties.placeholder || ""}
                onChange={(e) => updateProperty("placeholder", e.target.value)}
                placeholder="Enter placeholder text..."
                className="mt-2"
              />
            </div>
          </div>

          <Separator />

          {/* Validation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Validation</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="required" className="text-sm font-medium">
                  Required
                </Label>
                <p className="text-xs text-muted-foreground">User must fill this field</p>
              </div>
              <Switch
                id="required"
                checked={selectedField.required}
                onCheckedChange={(checked) => updateField({ required: checked })}
              />
            </div>

            {(selectedField.type === "text" || selectedField.type === "paragraph") && (
              <>
                <div>
                  <Label htmlFor="min-length" className="text-sm">
                    Minimum Length
                  </Label>
                  <Input
                    id="min-length"
                    type="number"
                    value={selectedField.properties.minLength || ""}
                    onChange={(e) => updateProperty("minLength", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max-length" className="text-sm">
                    Maximum Length
                  </Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={selectedField.properties.maxLength || ""}
                    onChange={(e) => updateProperty("maxLength", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {(selectedField.type === "number" || selectedField.type === "percentage") && (
              <>
                <div>
                  <Label htmlFor="min-value" className="text-sm">
                    Minimum Value
                  </Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={selectedField.properties.minValue || ""}
                    onChange={(e) => updateProperty("minValue", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max-value" className="text-sm">
                    Maximum Value
                  </Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={selectedField.properties.maxValue || ""}
                    onChange={(e) => updateProperty("maxValue", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Conditional Visibility */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conditional Visibility
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="conditional" className="text-sm font-medium">
                  Enable Conditions
                </Label>
                <p className="text-xs text-muted-foreground">Show field based on other field values</p>
              </div>
              <Switch
                id="conditional"
                checked={selectedField.properties.hasConditions || false}
                onCheckedChange={(checked) => updateProperty("hasConditions", checked)}
              />
            </div>

            {selectedField.properties.hasConditions && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                Conditional rules will be configured here
              </div>
            )}
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Advanced</h3>

            <div>
              <Label htmlFor="field-id" className="text-sm">
                Field ID
              </Label>
              <Input id="field-id" value={selectedField.id} disabled className="mt-2 text-muted-foreground" />
            </div>

            <div>
              <Label htmlFor="field-type" className="text-sm">
                Field Type
              </Label>
              <Input
                id="field-type"
                value={selectedField.type}
                disabled
                className="mt-2 text-muted-foreground capitalize"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
