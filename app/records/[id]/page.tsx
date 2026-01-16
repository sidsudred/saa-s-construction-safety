import { AppShell } from "@/components/app-shell"
import { RecordDetail } from "@/components/records/record-detail"

export default function RecordDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <RecordDetail recordId={params.id} />
    </AppShell>
  )
}
