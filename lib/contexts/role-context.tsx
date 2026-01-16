"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SimulationRole } from "@/lib/types/admin"

interface RoleContextType {
  currentRole: SimulationRole
  setCurrentRole: (role: SimulationRole) => void
  isSimulating: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<SimulationRole>("admin")
  const isSimulating = currentRole !== "admin"

  return <RoleContext.Provider value={{ currentRole, setCurrentRole, isSimulating }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
