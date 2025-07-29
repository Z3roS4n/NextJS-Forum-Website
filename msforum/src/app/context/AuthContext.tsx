// src/context/AuthContext.tsx
'use client'
import { createContext, useContext, ReactNode } from "react"
import { useSession } from "@/lib/auth-client"

type AuthContextType = {
    user: { id: string; name?: string; email?: string } | null
    isPending: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession()
    const user = session?.user ?? null
    return (
        <AuthContext.Provider value={{ user, isPending }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useUser must be used inside AuthProvider")
    return ctx
}
