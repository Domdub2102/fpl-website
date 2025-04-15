'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

const SquadContext = createContext(undefined)

export function SquadProvider({ children }: { children: ReactNode }) {

    // to pass the formation to the squad planner
    const [defenders, setDefenders] = useState(3)
    const [midfielders, setMidfielders] = useState(4)
    const [attackers, setAttackers] = useState(3)

    // index in array corresponds to the player.position

    const [formation, setFormation] = useState({
        1: {ref: "goalkeepers", current: 1, min: 1, max: 1},
        2: {ref: "defenders", current: 3, min: 3, max: 5},
        3: {ref: "midfielders", current: 4, min: 2, max: 5},
        4: {ref: "attackers", current: 3, min: 1, max: 3}
    })

    /**
     * Need to set some rules for the squad:
     * Rules for the 'squad' array:
        * Exactly 2 keepers, 5 def, 5 mid, 3 attackers
        * max. 3 players per club
     * Rules for the firstEleven/subs:
        * goal: min/max 1
        * def: min/max 3/5
        * mid: min/max 2/5
        * att: min/max 1/3
        *  
     */
    

    return (
        <SquadContext.Provider value={{egg}}>
            {children}
        </SquadContext.Provider>
    )
}

export function useSquadContext() {
    const context = useContext(SquadContext)
    if (!context) {
        throw new Error("UseSquadContext must be used within the SquadProvider")
    }
    return context
}