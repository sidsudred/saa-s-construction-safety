import type { User, Project, Incident, Inspection, CorrectiveAction } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    role: "supervisor",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "worker",
  },
  {
    id: "4",
    name: "Tom Anderson",
    email: "tom.anderson@company.com",
    role: "supervisor",
  },
]

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Downtown Construction Site",
    location: "123 Main Street, City Center",
    status: "active",
    startDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Bridge Renovation Project",
    location: "Highway 101, Mile Marker 45",
    status: "active",
    startDate: "2024-03-01",
  },
  {
    id: "3",
    name: "Highway Extension",
    location: "Interstate 5 South",
    status: "planning",
    startDate: "2024-06-01",
  },
]

export const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Scaffolding collapse near Building A",
    description: "Partial collapse of scaffolding structure on the east side of Building A during morning shift.",
    location: "Zone 3, Level 5",
    projectId: "1",
    reportedBy: "2",
    reportedAt: "2024-12-15T08:30:00Z",
    riskLevel: "critical",
    status: "submitted",
    category: "Equipment Failure",
    evidenceUrls: [],
  },
  {
    id: "2",
    title: "Near miss - falling tools",
    description: "Tools fell from height but no injuries occurred. Worker was not in the fall zone.",
    location: "Zone 1, Ground Level",
    projectId: "1",
    reportedBy: "3",
    reportedAt: "2024-12-15T11:00:00Z",
    riskLevel: "high",
    status: "approved",
    category: "Near Miss",
    evidenceUrls: [],
  },
  {
    id: "3",
    title: "PPE violation observed",
    description: "Worker observed without hard hat in active construction zone.",
    location: "Zone 2, Level 3",
    projectId: "1",
    reportedBy: "4",
    reportedAt: "2024-12-14T14:20:00Z",
    riskLevel: "medium",
    status: "draft",
    category: "PPE Violation",
    evidenceUrls: [],
  },
]

export const mockInspections: Inspection[] = [
  {
    id: "1",
    title: "Weekly Safety Inspection - Zone 3",
    type: "safety",
    projectId: "1",
    inspectorId: "1",
    scheduledDate: "2024-12-16",
    status: "approved",
    score: 85,
    findings: [],
  },
  {
    id: "2",
    title: "Monthly Environmental Audit",
    type: "environmental",
    projectId: "1",
    inspectorId: "2",
    scheduledDate: "2024-12-20",
    status: "submitted",
    findings: [],
  },
]

export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: "1",
    title: "Replace damaged safety barriers",
    description: "Install new safety barriers to replace those damaged in recent storm.",
    relatedRecordId: "1",
    relatedRecordType: "incident",
    assigneeId: "3",
    dueDate: "2024-12-17",
    priority: "high",
    status: "submitted",
  },
  {
    id: "2",
    title: "Conduct safety training for new workers",
    description: "Mandatory safety orientation for new hires starting next week.",
    relatedRecordId: "2",
    relatedRecordType: "observation",
    assigneeId: "2",
    dueDate: "2024-12-20",
    priority: "medium",
    status: "approved",
  },
  {
    id: "3",
    title: "Update emergency evacuation plan",
    description: "Revise evacuation procedures based on recent site layout changes.",
    relatedRecordId: "1",
    relatedRecordType: "inspection",
    assigneeId: "4",
    dueDate: "2024-12-25",
    priority: "low",
    status: "draft",
  },
]
