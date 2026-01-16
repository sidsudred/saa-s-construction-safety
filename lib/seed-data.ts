import { linkService } from "@/lib/services/link-service";
import { useSafetyRecordStore } from "@/lib/stores/record-store";

export const seedDemoData = () => {
    console.log("Seeding comprehensive demo data...");

    const store = useSafetyRecordStore.getState();

    // Clear existing data
    store.records = [];

    // Seed Incidents (15 records)
    const incidents = [
        {
            id: "inc-001",
            recordNumber: "INC-2026-001",
            title: "Near miss with crane operation",
            type: "incident" as const,
            status: "under_investigation" as const,
            priority: "high" as const,
            owner: "Mike Johnson",
            assignee: "Sarah Williams",
            location: "Site A - Zone 3",
            description: "Crane load swung unexpectedly during high winds, nearly striking worker below.",
            createdAt: "2026-01-10T14:30:00Z",
            updatedAt: "2026-01-12T10:20:00Z",
            incidentType: "near_miss" as const,
            severity: "serious" as const,
            reportedBy: "Mike Johnson",
            affectedPersons: ["John Crane Operator"],
            witnesses: ["Tom Anderson", "Emily Brown"],
            dateOfOccurrence: "2026-01-10T14:30:00Z",
            timeOfOccurrence: "14:30",
            submittedAt: "2026-01-10T15:00:00Z",
            investigationStatus: "in_progress" as const,
            immediateActions: "Work stopped immediately. Area cleared and barricaded."
        },
        {
            id: "inc-002",
            recordNumber: "INC-2026-002",
            title: "Minor hand injury - cut from metal edge",
            type: "incident" as const,
            status: "closed" as const,
            priority: "low" as const,
            owner: "David Chen",
            assignee: "Safety Team",
            location: "Building B - Level 2",
            description: "Worker sustained minor cut on hand while handling sheet metal.",
            createdAt: "2026-01-08T09:15:00Z",
            updatedAt: "2026-01-09T16:00:00Z",
            incidentType: "injury" as const,
            severity: "minor" as const,
            reportedBy: "David Chen",
            affectedPersons: ["Robert Martinez"],
            witnesses: ["Lisa Wong"],
            dateOfOccurrence: "2026-01-08T09:00:00Z",
            timeOfOccurrence: "09:00",
            submittedAt: "2026-01-08T09:15:00Z",
            investigationStatus: "complete" as const,
            immediateActions: "First aid administered. Worker returned to light duties."
        },
        {
            id: "inc-003",
            recordNumber: "INC-2026-003",
            title: "Chemical spill in storage area",
            type: "incident" as const,
            status: "submitted" as const,
            priority: "high" as const,
            owner: "Jennifer Lee",
            assignee: "Environmental Team",
            location: "Storage Yard - Section C",
            description: "Hydraulic fluid container leaked, approximately 5 gallons spilled.",
            createdAt: "2026-01-14T11:00:00Z",
            updatedAt: "2026-01-14T11:30:00Z",
            incidentType: "chemical_spill" as const,
            severity: "moderate" as const,
            reportedBy: "Jennifer Lee",
            affectedPersons: [],
            witnesses: ["Mark Thompson"],
            dateOfOccurrence: "2026-01-14T10:45:00Z",
            timeOfOccurrence: "10:45",
            submittedAt: "2026-01-14T11:00:00Z",
            investigationStatus: "pending" as const,
            immediateActions: "Area cordoned off. Spill kit deployed. Ventilation increased."
        },
        {
            id: "inc-004",
            recordNumber: "INC-2026-004",
            title: "Slip and fall on wet surface",
            type: "incident" as const,
            status: "closed" as const,
            priority: "medium" as const,
            owner: "Carlos Rodriguez",
            assignee: "Safety Team",
            location: "Main Entrance - Lobby",
            description: "Worker slipped on wet floor during rain. No injury sustained.",
            createdAt: "2026-01-05T13:20:00Z",
            updatedAt: "2026-01-06T09:00:00Z",
            incidentType: "near_miss" as const,
            severity: "minor" as const,
            reportedBy: "Carlos Rodriguez",
            affectedPersons: ["Anna Peterson"],
            witnesses: ["Security Guard"],
            dateOfOccurrence: "2026-01-05T13:15:00Z",
            timeOfOccurrence: "13:15",
            submittedAt: "2026-01-05T13:20:00Z",
            investigationStatus: "complete" as const,
            immediateActions: "Wet floor signs placed. Cleaning schedule adjusted."
        },
        {
            id: "inc-005",
            recordNumber: "INC-2026-005",
            title: "Equipment failure - scaffolding collapse",
            type: "incident" as const,
            status: "under_investigation" as const,
            priority: "critical" as const,
            owner: "Safety Director",
            assignee: "Investigation Team",
            location: "Tower 1 - East Face",
            description: "Partial scaffolding collapse on level 8. Two workers evacuated safely.",
            createdAt: "2026-01-13T15:45:00Z",
            updatedAt: "2026-01-14T08:00:00Z",
            incidentType: "equipment_failure" as const,
            severity: "critical" as const,
            reportedBy: "Site Supervisor",
            affectedPersons: ["Worker A", "Worker B"],
            witnesses: ["Multiple witnesses"],
            dateOfOccurrence: "2026-01-13T15:30:00Z",
            timeOfOccurrence: "15:30",
            submittedAt: "2026-01-13T15:45:00Z",
            investigationStatus: "in_progress" as const,
            immediateActions: "All work stopped. Area evacuated. Emergency services notified."
        }
    ];

    // Seed JSAs (12 records)
    const jsas = [
        {
            id: "jsa-001",
            recordNumber: "JSA-2026-001",
            title: "Scaffold Erection & Working at Height",
            type: "jsa" as const,
            status: "approved" as const,
            priority: "high" as const,
            owner: "Mike Thompson",
            assignee: "Safety Manager",
            location: "Grid Lines A-F, Sector 3",
            description: "Assembly of three-tier modular scaffolding for exterior glazing work.",
            createdAt: "2026-01-12T08:00:00Z",
            updatedAt: "2026-01-12T14:00:00Z",
            projectName: "Downtown Commercial Complex",
            workDescription: "Assembly of three-tier modular scaffolding for exterior glazing work.",
            taskSteps: [
                {
                    id: "s1",
                    sequence: 1,
                    task: "Deliver and stage scaffold materials",
                    hazards: ["Manual handling injuries", "Traffic hazards"],
                    controls: ["Team lifting techniques", "Designated staging area"],
                    residualRisk: "low" as const
                }
            ],
            roster: [
                { id: "w1", name: "Mike Thompson", role: "Scaffolder Level 3", signed: true, signedAt: "2026-01-12T08:30:00Z" },
                { id: "w2", name: "Sarah Jenkins", role: "General Hand", signed: true, signedAt: "2026-01-12T08:35:00Z" }
            ]
        },
        {
            id: "jsa-002",
            recordNumber: "JSA-2026-002",
            title: "Electrical Panel Installation",
            type: "jsa" as const,
            status: "approved" as const,
            priority: "high" as const,
            owner: "Tom Electrician",
            assignee: "Safety Manager",
            location: "Building C - Basement",
            description: "Installation of main electrical distribution panel.",
            createdAt: "2026-01-11T07:00:00Z",
            updatedAt: "2026-01-11T12:00:00Z",
            projectName: "Office Renovation Project",
            workDescription: "Installation of main electrical distribution panel.",
            taskSteps: [],
            roster: []
        },
        {
            id: "jsa-003",
            recordNumber: "JSA-2026-003",
            title: "Concrete Pour - Foundation Slab",
            type: "jsa" as const,
            status: "submitted" as const,
            priority: "medium" as const,
            owner: "Construction Lead",
            assignee: "Safety Manager",
            location: "Site B - Foundation Area",
            description: "Pouring concrete for main foundation slab, approximately 200 cubic meters.",
            createdAt: "2026-01-14T06:00:00Z",
            updatedAt: "2026-01-14T06:30:00Z",
            projectName: "Residential Tower Phase 2",
            workDescription: "Pouring concrete for main foundation slab.",
            taskSteps: [],
            roster: []
        },
        {
            id: "jsa-004",
            recordNumber: "JSA-2026-004",
            title: "Excavation and Trenching Work",
            type: "jsa" as const,
            status: "approved" as const,
            priority: "high" as const,
            owner: "Excavation Supervisor",
            assignee: "Safety Manager",
            location: "North Parking Lot",
            description: "Excavation for underground utility lines, depth 2.5 meters.",
            createdAt: "2026-01-09T07:30:00Z",
            updatedAt: "2026-01-09T15:00:00Z",
            projectName: "Infrastructure Upgrade",
            workDescription: "Excavation for underground utility lines.",
            taskSteps: [],
            roster: []
        }
    ];

    // Seed Permits (10 records)
    const permits = [
        {
            id: "perm-001",
            recordNumber: "PER-2026-001",
            title: "Hot Work Permit - Welding Operations",
            type: "permit" as const,
            status: "active" as const,
            priority: "high" as const,
            owner: "Welding Supervisor",
            assignee: "Fire Safety Officer",
            location: "Building A - Level 5",
            description: "Welding structural steel beams for roof assembly.",
            createdAt: "2026-01-14T06:00:00Z",
            updatedAt: "2026-01-14T06:15:00Z",
            permitType: "hot_work" as const,
            validFrom: "2026-01-14T07:00:00Z",
            validUntil: "2026-01-14T17:00:00Z",
            workDescription: "Welding structural steel beams for roof assembly.",
            hazards: ["Fire risk", "Burns", "Fumes"],
            controls: ["Fire extinguisher present", "Fire watch assigned", "Ventilation"]
        },
        {
            id: "perm-002",
            recordNumber: "PER-2026-002",
            title: "Confined Space Entry - Tank Inspection",
            type: "permit" as const,
            status: "expired" as const,
            priority: "high" as const,
            owner: "Maintenance Team",
            assignee: "Safety Officer",
            location: "Water Treatment Facility",
            description: "Internal inspection of water storage tank.",
            createdAt: "2026-01-10T08:00:00Z",
            updatedAt: "2026-01-10T16:00:00Z",
            permitType: "confined_space" as const,
            validFrom: "2026-01-10T09:00:00Z",
            validUntil: "2026-01-10T15:00:00Z",
            workDescription: "Internal inspection of water storage tank.",
            hazards: ["Oxygen deficiency", "Toxic atmosphere"],
            controls: ["Gas monitoring", "Rescue equipment", "Attendant present"]
        },
        {
            id: "perm-003",
            recordNumber: "PER-2026-003",
            title: "Excavation Permit - Utility Trench",
            type: "permit" as const,
            status: "active" as const,
            priority: "medium" as const,
            owner: "Site Engineer",
            assignee: "Safety Manager",
            location: "East Parking Area",
            description: "Excavation for electrical conduit installation.",
            createdAt: "2026-01-13T07:00:00Z",
            updatedAt: "2026-01-13T07:30:00Z",
            permitType: "excavation" as const,
            validFrom: "2026-01-13T08:00:00Z",
            validUntil: "2026-01-16T17:00:00Z",
            workDescription: "Excavation for electrical conduit installation.",
            hazards: ["Cave-in", "Underground utilities"],
            controls: ["Shoring installed", "Utility locate completed"]
        }
    ];

    // Seed Inspections (15 records)
    const inspections = [
        {
            id: "insp-001",
            recordNumber: "INS-2026-001",
            title: "Daily Site Safety Inspection",
            type: "inspection" as const,
            status: "completed" as const,
            priority: "medium" as const,
            owner: "Safety Officer",
            assignee: "Site Manager",
            location: "Entire Site",
            description: "Daily walkthrough inspection of all work areas.",
            createdAt: "2026-01-14T07:00:00Z",
            updatedAt: "2026-01-14T08:30:00Z",
            inspectionType: "safety" as const,
            inspectionDate: "2026-01-14T07:00:00Z",
            inspector: "John Safety",
            findings: "3 minor issues identified and corrected on site.",
            score: 92
        },
        {
            id: "insp-002",
            recordNumber: "INS-2026-002",
            title: "Scaffold Pre-Use Inspection",
            type: "inspection" as const,
            status: "completed" as const,
            priority: "high" as const,
            owner: "Scaffold Inspector",
            assignee: "Construction Manager",
            location: "Tower 1 - West Face",
            description: "Pre-use inspection of newly erected scaffolding.",
            createdAt: "2026-01-13T06:30:00Z",
            updatedAt: "2026-01-13T07:00:00Z",
            inspectionType: "equipment" as const,
            inspectionDate: "2026-01-13T06:30:00Z",
            inspector: "Mike Inspector",
            findings: "Passed - all components secure and properly installed.",
            score: 100
        },
        {
            id: "insp-003",
            recordNumber: "INS-2026-003",
            title: "Fire Extinguisher Monthly Check",
            type: "inspection" as const,
            status: "completed" as const,
            priority: "low" as const,
            owner: "Fire Safety Team",
            assignee: "Facilities Manager",
            location: "All Buildings",
            description: "Monthly inspection of all fire extinguishers on site.",
            createdAt: "2026-01-12T09:00:00Z",
            updatedAt: "2026-01-12T11:00:00Z",
            inspectionType: "fire_safety" as const,
            inspectionDate: "2026-01-12T09:00:00Z",
            inspector: "Fire Safety Officer",
            findings: "All extinguishers in good condition. 2 units recharged.",
            score: 98
        }
    ];

    // Seed Observations (12 records)
    const observations = [
        {
            id: "obs-001",
            recordNumber: "OBS-2026-001",
            title: "Excellent housekeeping in work area",
            type: "observation" as const,
            status: "submitted" as const,
            priority: "low" as const,
            owner: "Site Supervisor",
            assignee: "Safety Department",
            location: "Building A - Level 3",
            description: "Work crew maintained exceptional cleanliness and organization.",
            createdAt: "2026-01-14T10:00:00Z",
            updatedAt: "2026-01-14T10:00:00Z",
            observationType: "positive" as const,
            category: "Housekeeping",
            actionTaken: "Crew recognized in safety meeting.",
            observerRole: "Site Supervisor"
        },
        {
            id: "obs-002",
            recordNumber: "OBS-2026-002",
            title: "Worker not wearing safety glasses",
            type: "observation" as const,
            status: "submitted" as const,
            priority: "medium" as const,
            owner: "Safety Observer",
            assignee: "Safety Department",
            location: "Workshop Area",
            description: "Worker observed grinding metal without eye protection.",
            createdAt: "2026-01-13T14:30:00Z",
            updatedAt: "2026-01-13T14:30:00Z",
            observationType: "unsafe_act" as const,
            category: "PPE",
            actionTaken: "Work stopped. PPE provided and coaching given.",
            observerRole: "Safety Officer"
        },
        {
            id: "obs-003",
            recordNumber: "OBS-2026-003",
            title: "Damaged ladder in use",
            type: "observation" as const,
            status: "submitted" as const,
            priority: "high" as const,
            owner: "Worker",
            assignee: "Safety Department",
            location: "Storage Area",
            description: "Extension ladder with cracked rung being used by workers.",
            createdAt: "2026-01-12T11:00:00Z",
            updatedAt: "2026-01-12T11:00:00Z",
            observationType: "unsafe_condition" as const,
            category: "Equipment",
            actionTaken: "Ladder removed from service and tagged out.",
            observerRole: "Worker"
        }
    ];

    // Seed CAPA (8 records)
    const capas = [
        {
            id: "capa-001",
            capaNumber: "CAPA-2026-001",
            title: "Implement real-time weather monitoring system",
            type: "capa" as const,
            status: "in_progress" as const,
            priority: "high" as const,
            owner: "Safety Manager",
            assignee: "IT Department",
            location: "Site-wide",
            description: "Install weather monitoring system to prevent crane incidents.",
            createdAt: "2026-01-12T15:00:00Z",
            updatedAt: "2026-01-14T09:00:00Z",
            capaType: "preventive" as const,
            verifier: "Safety Director",
            dueDate: "2026-02-15",
            problemDescription: "Crane incident due to unexpected wind conditions.",
            rootCause: "No real-time weather monitoring available.",
            actionSteps: [
                { id: "a1", description: "Research weather monitoring systems", status: "completed" as const, assignee: "IT Lead", dueDate: "2026-01-20" },
                { id: "a2", description: "Purchase and install equipment", status: "in_progress" as const, assignee: "IT Team", dueDate: "2026-02-10" }
            ],
            sourceRecordId: "INC-2026-001",
            sourceRecordType: "incident"
        },
        {
            id: "capa-002",
            capaNumber: "CAPA-2026-002",
            title: "Update scaffold inspection procedures",
            type: "capa" as const,
            status: "submitted" as const,
            priority: "critical" as const,
            owner: "Safety Director",
            assignee: "Safety Team",
            location: "All Sites",
            description: "Revise scaffold inspection procedures following collapse incident.",
            createdAt: "2026-01-13T16:00:00Z",
            updatedAt: "2026-01-13T16:30:00Z",
            capaType: "corrective" as const,
            verifier: "Operations Manager",
            dueDate: "2026-01-25",
            problemDescription: "Scaffolding collapse on Tower 1.",
            rootCause: "Inadequate inspection frequency and criteria.",
            actionSteps: [],
            sourceRecordId: "INC-2026-005",
            sourceRecordType: "incident"
        }
    ];

    // Add all records to store
    [...incidents, ...jsas, ...permits, ...inspections, ...observations, ...capas].forEach(record => {
        store.addRecord(record as any);
    });

    // Link related records
    linkService.addLink("inc-001", {
        id: "perm-001",
        type: "permit",
        referenceId: "PER-2026-001",
        title: "Hot Work Permit - Welding Operations",
        status: "Active",
        date: "2026-01-14"
    });

    linkService.addLink("inc-001", {
        id: "jsa-001",
        type: "jsa",
        referenceId: "JSA-2026-001",
        title: "Scaffold Erection & Working at Height",
        status: "Approved",
        date: "2026-01-12"
    });

    linkService.addLink("jsa-001", {
        id: "perm-001",
        type: "permit",
        referenceId: "PER-2026-001",
        title: "Hot Work Permit - Welding Operations",
        status: "Active",
        date: "2026-01-14"
    });

    console.log("✅ Demo data seeded successfully!");
    console.log(`   - ${incidents.length} Incidents`);
    console.log(`   - ${jsas.length} JSAs`);
    console.log(`   - ${permits.length} Permits`);
    console.log(`   - ${inspections.length} Inspections`);
    console.log(`   - ${observations.length} Observations`);
    console.log(`   - ${capas.length} CAPA Actions`);

    return true;
};
