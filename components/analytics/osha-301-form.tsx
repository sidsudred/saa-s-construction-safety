"use client"

import { IncidentRecord } from "@/lib/types/safety-record"
import { cn } from "@/lib/utils"

interface OSHA301FormProps {
    incident: IncidentRecord
    establishment: string
    caseNumber: string
}

export function OSHA301Form({ incident, establishment, caseNumber }: OSHA301FormProps) {
    const dateOfOccurrence = new Date(incident.dateOfOccurrence)

    return (
        <div className="bg-white text-black p-8 max-w-[8.5in] mx-auto border shadow-sm font-serif print:shadow-none print:border-none my-8 print:my-0 break-after-page">
            {/* Official Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
                <div className="w-1/4">
                    <p className="text-[10px] font-bold uppercase tracking-tighter leading-none mb-1">
                        OSHA Form 301
                    </p>
                    <h1 className="text-xl font-black leading-none">
                        Injury and Illness<br />Incident Report
                    </h1>
                </div>
                <div className="w-1/2 text-center flex flex-col items-center">
                    <div className="border border-black px-4 py-2 text-xs font-bold uppercase mb-2">
                        U.S. Department of Labor
                    </div>
                    <p className="text-[9px] max-w-xs text-center leading-tight">
                        Occupational Safety and Health Administration
                        <br />
                        Form approved OMB no. 1218-0176
                    </p>
                </div>
                <div className="w-1/4 text-right">
                    <div className="border-2 border-black p-2 inline-block">
                        <p className="text-[8px] font-bold uppercase leading-none mb-1">Case Number</p>
                        <p className="text-lg font-black leading-none">{caseNumber}</p>
                    </div>
                </div>
            </div>

            <p className="text-[10px] mb-6 italic leading-tight">
                This Injury and Illness Incident Report is one of the first forms you must fill out when a recordable work-related injury or illness has occurred. Together with the Log of Work-Related Injuries and Illnesses and the accompanying Summary, these forms help the employer and OSHA develop a picture of the extent and severity of work-related incidents.
            </p>

            {/* Main Grid */}
            <div className="grid grid-cols-2 gap-x-8">

                {/* Left Column: Information about the Employee */}
                <div className="space-y-4">
                    <section>
                        <h2 className="bg-neutral-200 border-y border-black px-2 py-0.5 text-xs font-bold uppercase mb-3">
                            Information about the employee
                        </h2>

                        <div className="space-y-3">
                            <FormField label="1. Full name" value={(incident as any).affectedPersons?.[0] || "_________________________________"} />
                            <FormField label="2. Street address" value="_________________________________" note="City, State, Zip" />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="3. Date of birth" value="_________________" />
                                <FormField label="4. Date hired" value="_________________" />
                            </div>
                            <div className="flex gap-4">
                                <p className="text-[10px] font-bold uppercase min-w-[60px]">5. Gender</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1 text-[10px]"><div className="w-3 h-3 border border-black" /> Male</label>
                                    <label className="flex items-center gap-1 text-[10px]"><div className="w-3 h-3 border border-black" /> Female</label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="bg-neutral-200 border-y border-black px-2 py-0.5 text-xs font-bold uppercase mb-3">
                            Information about the physician
                        </h2>
                        <div className="space-y-3">
                            <FormField label="6. Name of physician or other health care professional" value="_________________________________" />
                            <FormField label="7. If treatment was given away from the worksite, where was it given?" value="_________________________________" note="Facility, Street address, City, State, Zip" />

                            <div className="flex flex-col gap-2 pt-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-medium">8. Was employee treated in an emergency room?</p>
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-1 text-[9px]"><div className="w-3 h-3 border border-black" /> Yes</label>
                                        <label className="flex items-center gap-1 text-[9px]"><div className="w-3 h-3 border border-black" /> No</label>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-medium">9. Was employee hospitalized overnight as an in-patient?</p>
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-1 text-[9px]"><div className="w-3 h-3 border border-black" /> Yes</label>
                                        <label className="flex items-center gap-1 text-[9px]"><div className="w-3 h-3 border border-black" /> No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Information about the Case */}
                <div className="space-y-4">
                    <section>
                        <h2 className="bg-neutral-200 border-y border-black px-2 py-0.5 text-xs font-bold uppercase mb-3">
                            Information about the case
                        </h2>
                        <div className="space-y-3">
                            <FormField label="10. Case number from the Log" value={caseNumber} />
                            <FormField label="11. Date of injury or illness" value={dateOfOccurrence.toLocaleDateString()} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="12. Time employee began work" value="_________________" />
                                <FormField label="13. Time of event" value={(incident as any).timeOfOccurrence || "_________________"} />
                            </div>

                            <FormField
                                label="14. What was the employee doing just before the incident occurred?"
                                value={incident.title}
                                isArea
                                note="Describe the activity, as well as the tools, equipment, or material the employee was using."
                            />

                            <FormField
                                label="15. What happened? Tell us how the injury occurred."
                                value={incident.description}
                                isArea
                                note="Describe the sequence of events and include any objects or substances that directly harmed the employee."
                            />

                            <FormField
                                label="16. What was the injury or illness?"
                                value={`${incident.incidentType.replace('_', ' ')} (${incident.severity})`}
                                isArea
                                note="Tell us the part of the body that was affected and how it was affected."
                            />

                            <FormField
                                label="17. What object or substance directly harmed the employee?"
                                value="[Equipment/Substance details if available]"
                                isArea
                            />

                            <div className="pt-2">
                                <p className="text-[10px] font-bold uppercase mb-1">18. If the employee died, when did death occur?</p>
                                <p className="text-xs border-b border-black py-1">_________________________________</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black grid grid-cols-3 gap-8">
                <div>
                    <p className="text-[8px] font-bold uppercase mb-4">Completed by</p>
                    <p className="border-b border-black text-xs h-6"></p>
                </div>
                <div>
                    <p className="text-[8px] font-bold uppercase mb-4">Title</p>
                    <p className="border-b border-black text-xs h-6"></p>
                </div>
                <div>
                    <p className="text-[8px] font-bold uppercase mb-4">Date</p>
                    <p className="border-b border-black text-xs h-6">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-4 text-[7px] text-center text-muted-foreground uppercase tracking-widest">
                Official Document - Produced by SafetyPro Dashboard
            </div>
        </div>
    )
}

function FormField({ label, value, note, isArea = false }: { label: string, value: string, note?: string, isArea?: boolean }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase leading-tight">{label}</p>
            <div className={cn(
                "border-b border-black py-0.5 font-sans text-xs min-h-[1.5rem]",
                isArea && "min-h-[3rem] border-none bg-neutral-50 px-2 py-1 italic"
            )}>
                {value}
            </div>
            {note && <p className="text-[8px] italic leading-tight">{note}</p>}
        </div>
    )
}
