import React from "react"
import SquadProvider from "@/lib/context/SquadContext"

export default function SquadLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SquadProvider>
            {children}
        </SquadProvider>
    )
}