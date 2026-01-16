"use client"

import { WorkflowState, RecordMetadata, AuditLogEntry, LinkedRecord, Evidence } from "@/lib/types/safety-record"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SafetyRecordStore {
    records: RecordMetadata[]
    auditLogs: Record<string, AuditLogEntry[]>
    linkedRecords: Record<string, LinkedRecord[]>
    evidence: Record<string, Evidence[]>

    // Actions
    addRecord: (record: RecordMetadata) => void
    updateRecord: (id: string, updates: Partial<RecordMetadata>) => void
    deleteRecord: (id: string) => void
    addAuditLog: (recordId: string, log: AuditLogEntry) => void
    addLinkedRecord: (recordId: string, link: LinkedRecord) => void
    addEvidence: (recordId: string, item: Evidence) => void
}

export const useSafetyRecordStore = create<SafetyRecordStore>()(
    persist(
        (set) => ({
            records: [
                {
                    id: "prm-sample-1",
                    recordNumber: "PRM-2026-001",
                    title: "Hot Work - Welding Sector 7",
                    type: "permit",
                    status: "approved",
                    priority: "high",
                    owner: "Safety Team",
                    assignee: "Mark Welder",
                    location: "Sector 7 - Gas Line",
                    description: "Authorization for MIG welding on refurbished pipes.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    permitType: "hot_work",
                    validFrom: new Date().toISOString(),
                    validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                    issuerId: "Edward Safety",
                    receiverId: "Mark Welder",
                    hazards: ["Fire", "Sparks"],
                    controls: ["Fire Watch"],
                    ppeRequirements: ["Mask", "Gloves"],
                    isolationRequired: true,
                    workerAcknowledgments: []
                } as any,
                {
                    id: "obs-sample-1",
                    recordNumber: "OBS-2026-001",
                    title: "Excellent PPE use in Zone B",
                    type: "observation",
                    status: "submitted",
                    priority: "medium",
                    owner: "Sarah Inspector",
                    assignee: "Safety Dept",
                    location: "Zone B",
                    description: "All workers were wearing full PPE including eye protection.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    observationType: "positive",
                    category: "PPE",
                    observerRole: "Inspector"
                } as any,
                {
                    id: "diary-sample-1",
                    recordNumber: "SD-2026-001",
                    title: "Daily Site Diary - Jan 14",
                    type: "site_diary",
                    status: "approved",
                    priority: "medium",
                    owner: "John PM",
                    assignee: "Records",
                    location: "Main Site",
                    description: "Routine recording of site events.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    projectName: "Downtown Tower",
                    date: "2026-01-14",
                    weatherMain: "Sunny",
                    temperature: 24,
                    totalWorkers: 45,
                    entries: [
                        { id: "e1", timestamp: new Date().toISOString(), category: "safety", content: "Morning toolbox talk completed.", author: "John PM" }
                    ]
                } as any,
                {
                    id: "capa-sample-1",
                    recordNumber: "CAPA-2026-001",
                    title: "Fix broken guard rail",
                    type: "capa",
                    status: "open",
                    priority: "high",
                    owner: "Safety",
                    assignee: "Maintenance Team",
                    location: "Sector C",
                    description: "Guard rail broken on scaffold level 3.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    originatingRecordId: "obs-sample-2",
                    originatingRecordType: "observation",
                    originatingRecordNumber: "OBS-2026-002",
                    actionRequired: "Weld the broken bracket and inspect entire scaffold.",
                    evidenceRequired: true,
                    isEscalated: false,
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                } as any,
                // Training & Certifications Mock Data
                {
                    id: "cert-1",
                    recordNumber: "CERT-001",
                    title: "First Aid Level 2",
                    type: "certification",
                    status: "approved",
                    priority: "high",
                    owner: "John PM",
                    assignee: "Alice Smith",
                    location: "Main Site",
                    description: "Emergency First Response certification.",
                    createdAt: "2024-01-14T10:00:00Z",
                    updatedAt: "2024-01-14T10:00:00Z",
                    trainingCategory: "certification",
                    workerName: "Alice Smith",
                    workerId: "W-001",
                    completionDate: "2024-01-14",
                    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // Expiring in 15 days
                    issuingAuthority: "Red Cross",
                    certificateNumber: "RC-99221",
                    evidenceUrl: "#"
                } as any,
                {
                    id: "cert-2",
                    recordNumber: "CERT-002",
                    title: "Forklift Operations",
                    type: "certification",
                    status: "approved",
                    priority: "high",
                    owner: "John PM",
                    assignee: "Bob Miller",
                    location: "Warehouse",
                    description: "Industrial forklift license.",
                    createdAt: "2023-01-14T10:00:00Z",
                    updatedAt: "2023-01-14T10:00:00Z",
                    trainingCategory: "certification",
                    workerName: "Bob Miller",
                    workerId: "W-002",
                    completionDate: "2023-01-14",
                    expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // Expired 5 days ago
                    issuingAuthority: "WorkSafe",
                    certificateNumber: "WS-11223",
                    evidenceUrl: "#"
                } as any,
                {
                    id: "tbt-1",
                    recordNumber: "TBT-001",
                    title: "Morning Safety Briefing",
                    type: "toolbox_talk",
                    status: "completed",
                    priority: "medium",
                    owner: "Site Supervisor",
                    assignee: "All Staff",
                    location: "Muster Point",
                    description: "Daily briefing on site hazards.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    sessionDate: new Date().toISOString().slice(0, 10),
                    topic: "Slips, Trips, and Falls",
                    facilitator: "Dave Foreman",
                    attendanceCount: 12,
                    roster: [
                        { id: "r1", name: "Alice Smith", role: "Electrician", signed: true, timestamp: new Date().toISOString() },
                        { id: "r2", name: "Bob Miller", role: "Operator", signed: true, timestamp: new Date().toISOString() }
                    ]
                } as any,
                {
                    id: "ind-1",
                    recordNumber: "IND-001",
                    title: "General Site Induction 2026",
                    type: "induction",
                    status: "approved",
                    priority: "high",
                    owner: "HSE Manager",
                    assignee: "New Starters",
                    location: "Online / Office",
                    description: "Mandatory site entry induction.",
                    createdAt: "2025-12-01T10:00:00Z",
                    updatedAt: "2025-12-01T10:00:00Z",
                    trainingCategory: "induction",
                    workerName: "Multiple",
                    workerId: "GRP-01",
                    completionDate: "2025-12-01",
                    templateName: "Core Site Safety v2",
                    completionRate: 85,
                    validityYears: 1
                } as any
            ],
            auditLogs: {},
            linkedRecords: {},
            evidence: {},

            addRecord: (record: RecordMetadata) => set((state: SafetyRecordStore) => ({
                records: [record, ...state.records]
            })),

            updateRecord: (id: string, updates: Partial<RecordMetadata>) => set((state: SafetyRecordStore) => ({
                records: state.records.map((r: RecordMetadata) => r.id === id ? { ...r, ...updates } : r)
            })),

            deleteRecord: (id: string) => set((state: SafetyRecordStore) => ({
                records: state.records.filter((r: RecordMetadata) => r.id !== id)
            })),

            addAuditLog: (recordId: string, log: AuditLogEntry) => set((state: SafetyRecordStore) => ({
                auditLogs: {
                    ...state.auditLogs,
                    [recordId]: [log, ...(state.auditLogs[recordId] || [])]
                }
            })),

            addLinkedRecord: (recordId: string, link: LinkedRecord) => set((state: SafetyRecordStore) => ({
                linkedRecords: {
                    ...state.linkedRecords,
                    [recordId]: [...(state.linkedRecords[recordId] || []), link]
                }
            })),

            addEvidence: (recordId: string, item: Evidence) => set((state: SafetyRecordStore) => ({
                evidence: {
                    ...state.evidence,
                    [recordId]: [...(state.evidence[recordId] || []), item]
                }
            })),
        }),
        {
            name: "safety-records-storage",
        }
    )
)
