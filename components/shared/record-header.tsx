import { Card, CardContent } from "@/components/ui/card"
import { StatusPill } from "./status-pill"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User } from "lucide-react"

interface RecordHeaderProps {
  title: string
  status: "draft" | "submitted" | "approved" | "closed" | "archived"
  owner: {
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

export function RecordHeader({ title, status, owner, createdAt, updatedAt }: RecordHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-balance">{title}</h1>
            <StatusPill status={status} />
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Owner:</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={owner.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{owner.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{owner.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created:</span>
              <span className="font-medium text-foreground">{createdAt}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Updated:</span>
              <span className="font-medium text-foreground">{updatedAt}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
