"use client"

import { useEffect, useState } from "react"
import { seedDemoData } from "@/lib/seed-data"

export function DataSeeder() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Check if data has already been seeded
        const hasSeeded = localStorage.getItem("demo-data-seeded")

        if (!hasSeeded) {
            // Small delay to ensure store is ready
            setTimeout(() => {
                seedDemoData()
                localStorage.setItem("demo-data-seeded", "true")
            }, 100)
        }
    }, [])

    // Don't render anything during SSR
    if (!mounted) return null

    return null
}
