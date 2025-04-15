// Add data filtering here to only return the player data required

import { NextResponse } from "next/server"

type Gameweek = {
    id: number
    name: string
    deadline_time: string
}

export async function GET() {
    const url = "https://fantasy.premierleague.com/api/events/"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch from FPL API")
    }
    const data = await res.json()

    const filteredData = data.map((gameweek: Gameweek) => {
        return {
            id: gameweek.id,
            name: gameweek.name,
            deadline: gameweek.deadline_time,
        }
    })
    return NextResponse.json(filteredData)
}