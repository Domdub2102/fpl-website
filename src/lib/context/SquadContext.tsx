'use client'

import React, { createContext, useContext } from "react"
import { SquadContextType, SquadType, Player } from "@/types/types"

export const SquadContext = createContext<SquadContextType | undefined>(undefined)

export default function SquadProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [currentSquad, setCurrentSquad] = React.useState<SquadType>({
        firstEleven: [],
        subs: []
    })
    const [players, setPlayers] = React.useState<Player[]>([])

    const [startingPlayer, setStartingPlayer] = React.useState<Player | undefined>()
    const [subPlayer, setSubPlayer] = React.useState<Player | undefined>()

    const [transferIn, setTransferIn] = React.useState<Player | undefined>()
    const [transferOut, setTransferOut] = React.useState<Player | undefined>()
    
    //define squadstates here?
    return (
        <SquadContext.Provider 
            value={{
                players,
                setPlayers,
                currentSquad,
                setCurrentSquad,
                startingPlayer,
                setStartingPlayer,
                subPlayer,
                setSubPlayer,
                transferIn,
                setTransferIn,
                transferOut,
                setTransferOut
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