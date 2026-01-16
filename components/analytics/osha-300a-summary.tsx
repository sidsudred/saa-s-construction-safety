"use client"

import { IncidentRecord } from "@/lib/types/safety-record"
import { cn } from "@/lib/utils"

interface OSHA300ASummaryProps {
    incidents: IncidentRecord[]
    year: string
    establishment: string
}

export function OSHA300ASummary({ incidents, year, establishment }: OSHA300ASummaryProps) {
    // Calculate metrics
    const recordableIncidents = incidents.filter(i => i.severity !== "minor" || i.incidentType === "injury")
    const fatalities = recordableIncidents.filter(i => i.severity === "fatality").length
    const daysAway = recordableIncidents.filter(i => ["critical", "major", "serious"].includes(i.severity)).length
    const jobTransfer = recordableIncidents.filter(i => i.severity === "moderate").length
    const otherRecordable = recordableIncidents.filter(i => i.severity === "minor").length

    const injuries = recordableIncidents.filter(i => i.incidentType === "injury").length
    const poisonings = recordableIncidents.filter(i => i.incidentType === "environmental").length
    const otherIllness = recordableIncidents.length - injuries - poisonings

    return (
        <div className="bg-white text-black p-8 max-w-[8.5in] mx-auto border shadow-sm font-sans print:shadow-none print:border-none my-8 print:my-0 break-after-page">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
                <div className="w-2/3">
                    <p className="text-[10px] font-bold uppercase tracking-tighter leading-none mb-1">
                        OSHA's Form 300A (Rev. 01/2004)
                    </p>
                    <h1 className="text-2xl font-black leading-none uppercase">
                        Summary of Work-Related Injuries and Illnesses
                    </h1>
                </div>
                <div className="w-1/3 flex flex-col items-end">
                    <div className="border-4 border-black px-6 py-2 text-xl font-black mb-1">
                        {year}
                    </div>
                    <p className="text-[8px] text-right leading-tight uppercase font-bold">
                        U.S. Department of Labor
                        <br />
                        Occupational Safety and Health Administration
                        <br />
                        Form approved OMB no. 1218-0176
                    </p>
                </div>
            </div>

            <p className="text-[10px] mb-6 leading-tight">
                All establishments covered by Part 1904 must complete this Summary page, even if no injuries or illnesses occurred during the year. Remember to review the Log to verify that the entries are complete and accurate before completing this summary.
            </p>

            <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    <section>
                        <h2 className="bg-neutral-200 border-y-2 border-black px-2 py-1 text-xs font-black uppercase mb-4">
                            Number of Cases
                        </h2>
                        <div className="space-y-4">
                            <SummaryRow label="Total number of deaths" value={fatalities} code="(G)" />
                            <SummaryRow label="Total number of cases with days away from work" value={daysAway} code="(H)" />
                            <SummaryRow label="Total number of cases with job transfer or restriction" value={jobTransfer} code="(I)" />
                            <SummaryRow label="Total number of other recordable cases" value={otherRecordable} code="(J)" />
                        </div>
                    </section>

                    <section>
                        <h2 className="bg-neutral-200 border-y-2 border-black px-2 py-1 text-xs font-black uppercase mb-4">
                            Number of Days
                        </h2>
                        <div className="space-y-4">
                            <SummaryRow label="Total number of days away from work" value="--" code="(K)" />
                            <SummaryRow label="Total number of days of job transfer or restriction" value="--" code="(L)" />
                        </div>
                    </section>

                    <section>
                        <h2 className="bg-neutral-200 border-y-2 border-black px-2 py-1 text-xs font-black uppercase mb-4">
                            Injury and Illness Types
                        </h2>
                        <div className="space-y-2 text-[10px] font-bold uppercase">
                            <div className="flex justify-between border-b border-black"><span>(1) Injuries</span><span>{injuries}</span></div>
                            <div className="flex justify-between border-b border-black"><span>(2) Skin disorders</span><span>0</span></div>
                            <div className="flex justify-between border-b border-black"><span>(3) Respiratory conditions</span><span>0</span></div>
                            <div className="flex justify-between border-b border-black"><span>(4) Poisonings</span><span>{poisonings}</span></div>
                            <div className="flex justify-between border-b border-black"><span>(5) Hearing loss</span><span>0</span></div>
                            <div className="flex justify-between border-b border-black"><span>(6) All other illnesses</span><span>{otherIllness}</span></div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <section>
                        <h2 className="bg-neutral-200 border-y-2 border-black px-2 py-1 text-xs font-black uppercase mb-4">
                            Establishment Information
                        </h2>
                        <div className="text-[10px] space-y-4">
                            <p><span className="font-bold">Establishment Name:</span><br />{establishment}</p>
                            <p><span className="font-bold">Street:</span><br />[Address Line 1]</p>
                            <p><span className="font-bold">City:</span> [City]  <span className="font-bold">State:</span> [State]  <span className="font-bold">Zip:</span> [Zip]</p>
                            <div className="pt-2">
                                <p className="font-bold underline mb-1">Industry description</p>
                                <p className="italic">Construction (General Industrial)</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="bg-neutral-200 border-y-2 border-black px-2 py-1 text-xs font-black uppercase mb-4">
                            Employment Information
                        </h2>
                        <div className="text-[10px] space-y-3">
                            <p><span className="font-bold">Annual average number of employees:</span> 100</p>
                            <p><span className="font-bold">Total hours worked by all employees last year:</span> 200,000</p>
                        </div>
                    </section>

                    <section className="border-2 border-black p-4">
                        <h2 className="text-xs font-black uppercase mb-2">Sign here</h2>
                        <p className="text-[8px] mb-4 italic">Knowingly falsifying this document may result in a fine.</p>
                        <div className="space-y-6">
                            <div className="border-b border-black h-8 flex items-end text-[10px]">_________________________________</div>
                            <div className="flex justify-between text-[8px] font-bold uppercase"><span>Company Executive</span><span>Title</span></div>
                            <div className="flex justify-between pt-4">
                                <div className="flex flex-col"><span className="border-b border-black w-24 h-4"></span><span className="text-[8px] font-bold uppercase">Phone</span></div>
                                <div className="flex flex-col"><span className="border-b border-black w-24 h-4">{new Date().toLocaleDateString()}</span><span className="text-[8px] font-bold uppercase">Date</span></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-12 text-[7px] text-center text-muted-foreground uppercase tracking-widest border-t pt-2 border-black">
                Post this Summary page from February 1 to April 30 of the year following the year covered by the form.
            </div>
        </div>
    )
}

function SummaryRow({ label, value, code }: { label: string, value: string | number, code: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-lg font-black">{value}</div>
            <div className="flex-1">
                <p className="text-[10px] font-black leading-tight uppercase">{label}</p>
                <p className="text-[8px] font-bold italic">{code}</p>
            </div>
        </div>
    )
}
