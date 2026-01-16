import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plus } from "lucide-react"

interface LinkedRecord {
  id: string
  type: string
  title: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
}

const mockLinkedRecords: LinkedRecord[] = [
  {
    id: "1",
    type: "Inspection",
    title: "Weekly Safety Inspection - Zone 3",
    status: "approved",
  },
  {
    id: "2",
    type: "Corrective Action",
    title: "Replace damaged safety barriers",
    status: "submitted",
  },
]

export function LinkedRecordsList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Linked Records</CardTitle>
            <CardDescription>Related inspections, actions, and reports</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Link Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockLinkedRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{record.title}</p>
                <p className="text-xs text-muted-foreground">{record.type}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
