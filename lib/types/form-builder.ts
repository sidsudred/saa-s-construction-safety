// Form Builder Type Definitions

export type FieldType =
    // Basic Input
    | "text"
    | "paragraph"
    | "label"
    | "poster"
    // Numeric
    | "number"
    | "percentage"
    | "formula"
    // Date & Time
    | "date"
    | "time"
    | "datetime"
    // Selection
    | "checkbox"
    | "radio"
    | "select"
    | "multiselect"
    | "rating"
    // Advanced
    | "table"
    | "attachment"
    | "annotated-image"
    | "scribble"
    | "signature"
    // User & References
    | "roster"
    | "user-selector"
    | "phase-code"
    | "reference-field"
    | "asset-reference"
    // Custom Tables
    | "custom-table-link"
    | "autofill"
    // System Fields
    | "auto-timestamp"
    | "auto-location"
    | "status"
    | "version-identifier"

export interface SelectOption {
    value: string
    label: string
}

export interface TableColumn {
    id: string
    label: string
    type: "text" | "number" | "date" | "select"
    width?: number
}

export interface ConditionalRule {
    id: string
    fieldId: string
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty"
    value: any
    action: "show" | "hide" | "require" | "disable"
}

export interface ValidationRule {
    id: string
    type: "required" | "min_length" | "max_length" | "min_value" | "max_value" | "pattern" | "custom"
    value?: any
    message?: string
}

export interface FormulaConfig {
    expression: string
    fields: string[] // Field IDs used in formula
    format?: "number" | "currency" | "percentage"
}

export interface FieldDefinition {
    id: string
    type: FieldType
    label: string
    required: boolean
    sectionId?: string
    order: number

    // Common properties
    placeholder?: string
    helpText?: string
    defaultValue?: any

    // Selection fields
    options?: SelectOption[]

    // Table fields
    columns?: TableColumn[]
    minRows?: number
    maxRows?: number

    // Numeric fields
    minValue?: number
    maxValue?: number
    decimalPlaces?: number

    // Text fields
    minLength?: number
    maxLength?: number
    pattern?: string

    // Formula fields
    formula?: FormulaConfig

    // Reference fields
    referenceType?: "incident" | "inspection" | "permit" | "jsa" | "observation" | "custom"
    referenceTable?: string

    // Conditional logic
    conditionalRules?: ConditionalRule[]

    // Validation
    validationRules?: ValidationRule[]

    // System fields
    isSystemField?: boolean
    isReadOnly?: boolean

    // Additional properties
    properties: Record<string, any>
}

export interface FormSection {
    id: string
    title: string
    description?: string
    order: number
    collapsible?: boolean
    collapsed?: boolean
}

export interface FormDefinition {
    id: string
    name: string
    description?: string
    version: string
    status: "draft" | "published" | "archived"
    sections: FormSection[]
    fields: FieldDefinition[]
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
}

export interface FormBuilderState {
    form: FormDefinition
    selectedFieldId: string | null
    selectedSectionId: string | null
    isPreviewMode: boolean
    isDirty: boolean
}
