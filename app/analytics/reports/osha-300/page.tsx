"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { IncidentRecord, RecordMetadata } from "@/lib/types/safety-record"
import { OSHA300Log } from "@/components/analytics/osha-300-log"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, FileDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"

function OSHA300Content() {
    const { records } = useSafetyRecordStore()
    const searchParams = useSearchParams()
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const establishmentName = "Downtown Construction Site"

    const recordableIncidents = useMemo(() => {
        return records.filter((r: RecordMetadata) => {
            if (r.type !== "incident") return false
            const incident = r as unknown as IncidentRecord
            const isCorrectYear = new Date(incident.dateOfOccurrence).getFullYear().toString() === year

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
                            OSHA Form 300 Log Viewer <span className="text-muted-foreground font-normal ml-2">({year})</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handlePrint} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                            <Printer className="h-4 w-4" />
                            Print Log
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-8 flex justify-center print:p-0">
                <OSHA300Log
                    incidents={recordableIncidents}
                    year={year}
                    establishment={establishmentName}
                />
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
          @page {
            size: landscape;
          }
        }
      `}</style>
        </div>
    )
}

export default function OSHA300Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <OSHA300Content />
        </Suspense>
    )
}
