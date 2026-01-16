export type RecordType = "incident" | "jsa" | "permit" | "inspection" | "observation" | "capa"

export interface LinkedRecord {
    id: string
    type: RecordType
    referenceId: string
    title: string
    status: string
    date: string
}

// In a real app, this would be a database table "RecordLinks"
// For prototype, we'll simulate it with a map or just return mock data based on ID
// Or better, we attach this data to the mock records themselves.

// Let's create a service that can "resolve" links
const mockLinkDatabase: Record<string, LinkedRecord[]> = {}

export const linkService = {
    // Get links for a specific record
    getLinks: (recordId: string): LinkedRecord[] => {
        return mockLinkDatabase[recordId] || []
    },

    // Add a link between two records (bidirectional)
    addLink: (sourceId: string, targetRecord: LinkedRecord) => {
        // Add to source
        if (!mockLinkDatabase[sourceId]) {
            mockLinkDatabase[sourceId] = []
        }

        // Check if already linked
        if (mockLinkDatabase[sourceId].some(l => l.id === targetRecord.id)) {
            return
        }

        // Add link
        mockLinkDatabase[sourceId].push(targetRecord)

        // Add reverse link (mocking the source record details is harder without a full store, 
        // so for this prototype we might just do one-way or assume the UI handles the reverse create)
        // For a true prototype, let's just use what we have.
    },

    // Remove a link
    removeLink: (sourceId: string, targetId: string) => {
        if (mockLinkDatabase[sourceId]) {
            mockLinkDatabase[sourceId] = mockLinkDatabase[sourceId].filter(l => l.id !== targetId)
        }
    },

    // Check for circular reference (simple depth check)
    detectCycle: (sourceId: string, targetId: string, visited = new Set<string>()): boolean => {
        if (visited.has(sourceId)) return false
        visited.add(sourceId)

        const links = linkService.getLinks(sourceId)
        for (const link of links) {
            if (link.id === targetId) return true
            if (linkService.detectCycle(link.id, targetId, visited)) return true
        }

        return false
    }
}
