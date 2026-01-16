"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { IncidentRecord, RecordMetadata } from "@/lib/types/safety-record"
import { OSHA301Form } from "@/components/analytics/osha-301-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, FileDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"

function OSHA301Content() {
    const { records } = useSafetyRecordStore()
    const searchParams = useSearchParams()
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const establishmentName = "Downtown Construction Site"

    const recordableIncidents = useMemo(() => {
        return records.filter((r: RecordMetadata) => {
            if (r.type !== "incident") return false
            const incident = r as unknown as IncidentRecord
            const isCorrectYear = new Date(incident.dateOfOccurrence).getFullYear().toString() === year

            // OSHA recordable criteria:
            // - Fatality
            // - Days away from work
            // - Medical treatment beyond first aid
            // - Loss of consciousness
            // - Significant injury diagnosed by physician
            const isRecordable = incident.severity !== "minor" || incident.incidentType === "injury"

            return isCorrectYear && isRecordable
        }) as unknown as IncidentRecord[]
    }, [records, year])

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-neutral-100/50 print:bg-white pb-20 print:pb-0">
            {/* Navigation Header - Hidden on Print */}
            <div className="sticky top-0 z-10 bg-white border-b print:hidden">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/analytics">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Analytics
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <h1 className="font-bold text-lg hidden sm:block">
                            OSHA Form 301 Viewer <span className="text-muted-foreground font-normal ml-2">({year})</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handlePrint} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                            <Printer className="h-4 w-4" />
                            Print Reports
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 print:p-0 print:space-y-0">
                {recordableIncidents.length === 0 ? (
                    <div className="bg-white border-2 border-dashed rounded-xl p-20 text-center space-y-4">
                        <FileDown className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h2 className="text-xl font-bold">No recordable incidents found</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            There are no recordable incidents for the year {year}. OSHA Form 301 is only required for recordable injuries and illnesses.
                        </p>
                        <Link href="/analytics">
                            <Button variant="outline">Return to Reporting Center</Button>
                        </Link>
                    </div>
                ) : (
                    recordableIncidents.map((incident, index) => (
                        <OSHA301Form
                            key={incident.id}
                            incident={incident}
                            establishment={establishmentName}
                            caseNumber={`${year}-${String(index + 1).padStart(4, "0")}`}
                        />
                    ))
                )}
            </div>

            <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
        </div>
    )
}

export default function OSHA301Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <OSHA301Content />
        </Suspense>
    )
}
