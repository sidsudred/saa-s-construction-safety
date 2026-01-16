import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "./status-pill"
import { PriorityIndicator } from "./priority-indicator"
import { Plus } from "lucide-react"

interface CapaItem {
  id: string
  action: string
  assignee: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
}

const mockCapaItems: CapaItem[] = [
  {
    id: "1",
    action: "Install additional safety signage",
    assignee: "Mike Johnson",
    dueDate: "2024-12-18",
    priority: "high",
    status: "submitted",
  },
  {
    id: "2",
    action: "Conduct refresher training for crane operators",
    assignee: "Sarah Williams",
    dueDate: "2024-12-22",
    priority: "medium",
    status: "approved",
  },
  {
    id: "3",
    action: "Review and update emergency procedures",
    assignee: "Tom Anderson",
    dueDate: "2024-12-25",
    priority: "low",
    status: "draft",
  },
]

export function CapaTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Corrective & Preventive Actions</CardTitle>
            <CardDescription>Track actions to address and prevent issues</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Action
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCapaItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.action}</TableCell>
                <TableCell>{item.assignee}</TableCell>
                <TableCell className="text-muted-foreground">{item.dueDate}</TableCell>
                <TableCell>
                  <PriorityIndicator priority={item.priority} />
                </TableCell>
                <TableCell>
                  <StatusPill status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
