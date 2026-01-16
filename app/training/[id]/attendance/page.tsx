import { AppShell } from "@/components/app-shell"
import { AttendanceRoster } from "@/components/training/attendance-roster"

export default function AttendanceRosterPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <AttendanceRoster trainingId={params.id} />
    </AppShell>
  )
}
