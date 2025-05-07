'use client'

import React, { createContext, useContext } from "react"
import { SquadContextType, Player } from "@/types/types"

export const SquadContext = createContext<SquadContextType | undefined>(undefined)

export default function SquadProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [currentSquad, setCurrentSquad] = React.useState<Player[]>([])
    const [players, setPlayers] = React.useState<Player[]>([])

    const [removedPlayers, setRemovedPlayers] = React.useState<Player[]>([])

    const [subInProgress, setSubInProgress] = React.useState<boolean>(false)

    const [gameweek, setGameweek] = React.useState({id: 1, name: "Gameweek 1", deadline_time: "2024-08-16T17:30:00Z"})
    

    return (
        <SquadContext.Provider 
            value={{
                players,
                setPlayers,
                currentSquad,
                setCurrentSquad,
                removedPlayers,
                setRemovedPlayers,
                subInProgress,
                setSubInProgress,
                gameweek,
                setGameweek
            }}
        >
            {children}
        </SquadContext.Provider>
    )
}

export function useSquad() {
    const context = useContext(SquadContext)
    if (!context) {
        throw new Error("useSquad must be used within a SquadProvider")
    }
    return context
}