import { NextResponse } from "next/server";

interface Player {
    id: number
    web_name: string
    first_name: string
    second_name: string
    total_points: number
    expected_goals: string
    expected_assists: string
    minutes: number 
    now_cost: number
    element_type: number
    selected_by_percent: number
    team: number 
}

export async function GET() {
    const url = "https://fantasy.premierleague.com/api/elements/"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch player from FPL API")
    }

    const data = await res.json()

    // filter removes any managers (element_type = 5)
    const players = data
        .filter((player: Player) => player.element_type !== 5)
        .map((player: Player) => ({
            id: player.id,
            web_name: player.web_name,
            first_name: player.first_name,
            last_name: player.second_name,
            total_points: player.total_points,
            xG: player.expected_goals,
            xA: player.expected_assists,
            minutes: player.minutes,
            price: (player.now_cost / 10),
            position: player.element_type,
            selected_by_percent: player.selected_by_percent,
            team_id: player.team,
        }))

    return NextResponse.json(players)
}