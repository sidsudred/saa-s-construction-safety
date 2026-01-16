import { RecordDetail } from "@/components/records/record-detail"

export default function RecordDetailPage({ params }: { params: { id: string } }) {
  return (
    <RecordDetail recordId={params.id} />
  )
}
