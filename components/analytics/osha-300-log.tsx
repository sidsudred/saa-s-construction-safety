"use client"

import { IncidentRecord } from "@/lib/types/safety-record"
import { cn } from "@/lib/utils"

interface OSHA300LogProps {
    incidents: IncidentRecord[]
    year: string
    establishment: string
}

export function OSHA300Log({ incidents, year, establishment }: OSHA300LogProps) {
    return (
        <div className="bg-white text-black p-6 w-[14in] mx-auto border shadow-sm font-sans print:shadow-none print:border-none my-8 print:my-0 overflow-x-auto print:overflow-visible">

            {/* Official Header */}
            <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
                <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-tighter leading-none mb-1">
                        OSHA's Form 300 (Rev. 01/2004)
                    </p>
                    <h1 className="text-2xl font-black leading-none uppercase">
                        Log of Work-Related Injuries and Illnesses
                    </h1>
                </div>
                <div className="flex-1 text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold uppercase px-4 py-1 border border-black mb-1">Year {year}</span>
                        <p className="text-[8px] max-w-xs text-center leading-tight uppercase font-bold">
                            U.S. Department of Labor
                            <br />
                            Occupational Safety and Health Administration
                        </p>
                    </div>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-[9px] italic leading-tight mb-1">
                        Attention: This form contains information relating to employee health and must be used in a manner that protects the confidentiality of employees to the extent possible while the information is being used for occupational safety and health purposes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 border-2 border-black text-[9px] uppercase font-bold bg-neutral-100">
                <div className="col-span-1 border-r border-black p-1 flex flex-col justify-center text-center">
                    <span>Identify the person</span>
                </div>
                <div className="col-span-3 border-r border-black p-1 flex flex-col justify-center text-center">
                    <span>Describe the case</span>
                </div>
                <div className="col-span-3 border-r border-black p-1 flex flex-col justify-center text-center">
                    <span>Classify the case</span>
                    <div className="grid grid-cols-4 gap-1 mt-1 text-[7px]">
                        <div className="text-center">(G) Death</div>
                        <div className="text-center">(H) Days away</div>
                        <div className="text-center">(I) Job transfer</div>
                        <div className="text-center">(J) Other cases</div>
                    </div>
                </div>
                <div className="col-span-2 border-r border-black p-1 flex flex-col justify-center text-center">
                    <span>Enter the number of days</span>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-[7px]">
                        <div className="text-center">(K) Away from work</div>
                        <div className="text-center">(L) On job transfer</div>
                    </div>
                </div>
                <div className="col-span-3 p-1 flex flex-col justify-center text-center">
                    <span>Check the "injury" or "illness" column</span>
                    <div className="grid grid-cols-6 gap-1 mt-1 text-[7px]">
                        <div className="text-center">(1) Inj</div>
                        <div className="text-center">(2) Skin</div>
                        <div className="text-center">(3) Resp</div>
                        <div className="text-center">(4) Pois</div>
                        <div className="text-center">(5) Hear</div>
                        <div className="text-center">(6) Other</div>
                    </div>
                </div>
            </div>

            {/* Rows */}
            <div className="border-x-2 border-b-2 border-black mb-4">
                {incidents.length === 0 ? (
                    <div className="h-20 flex items-center justify-center text-muted-foreground italic border-t border-black">
                        No recordable cases for this period
                    </div>
                ) : (
                    incidents.map((incident, idx) => (
                        <div key={incident.id} className="grid grid-cols-12 border-t border-black min-h-[40px] text-[8px]">
                            <div className="col-span-1 border-r border-black p-1 flex flex-col gap-1">
                                <div className="flex justify-between border-b border-black pb-0.5">
                                    <span className="font-bold">Case #</span>
                                    <span>{idx + 1}</span>
                                </div>
                                <div className="font-bold">{(incident as any).affectedPersons?.[0] || "Unknown"}</div>
                            </div>
                            <div className="col-span-3 border-r border-black p-1 space-y-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col"><span className="font-bold opacity-50 underline">Job Title</span><span>Worker</span></div>
                                    <div className="flex flex-col"><span className="font-bold opacity-50 underline">Date of Injury</span><span>{new Date(incident.dateOfOccurrence).toLocaleDateString()}</span></div>
                                </div>
                                <div className="flex flex-col"><span className="font-bold opacity-50 underline">Where occurred</span><span>{incident.location}</span></div>
                                <div className="flex flex-col leading-tight"><span className="font-bold opacity-50 underline">Description</span><span>{incident.title}: {incident.description.substring(0, 100)}...</span></div>
                            </div>

                            {/* Classification */}
                            <div className="col-span-3 border-r border-black grid grid-cols-4">
                                <div className="border-r border-black flex items-center justify-center font-bold text-lg">{incident.severity === "fatality" ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center font-bold text-lg">{["critical", "major", "serious"].includes(incident.severity) ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center font-bold text-lg">{incident.severity === "moderate" ? "X" : ""}</div>
                                <div className="flex items-center justify-center font-bold text-lg">{incident.severity === "minor" ? "X" : ""}</div>
                            </div>

                            {/* Number of Days */}
                            <div className="col-span-2 border-r border-black grid grid-cols-2">
                                <div className="border-r border-black flex items-center justify-center font-bold">
                                    {["critical", "major", "serious"].includes(incident.severity) ? "1+" : "0"}
                                </div>
                                <div className="flex items-center justify-center font-bold">
                                    {incident.severity === "moderate" ? "1+" : "0"}
                                </div>
                            </div>

                            {/* Injury/Illness Type */}
                            <div className="col-span-3 grid grid-cols-6 uppercase font-bold text-center">
                                <div className="border-r border-black flex items-center justify-center">{incident.incidentType === "injury" ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center">{incident.incidentType === "skin" ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center">{incident.incidentType === "respiratory" ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center">{incident.incidentType === "environmental" ? "X" : ""}</div>
                                <div className="border-r border-black flex items-center justify-center">{incident.incidentType === "hearing" ? "X" : ""}</div>
                                <div className="flex items-center justify-center">{!["injury", "skin", "respiratory", "environmental", "hearing"].includes(incident.incidentType) ? "X" : ""}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-between items-start text-[8px] uppercase">
                <div className="space-y-1">
                    <p className="font-bold underline">Establishment Information</p>
                    <p>{establishment}</p>
                    <p>City: [City] State: [State]</p>
                </div>
                <div className="text-right italic">
                    Form 300 - Generated by SafetyPro Dashboards
                </div>
            </div>
        </div>
    )
}
