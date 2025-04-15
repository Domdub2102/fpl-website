import { NextResponse } from "next/server";
import { Player } from "@/types/types";

export async function GET() {
    const url = "https://fantasy.premierleague.com/api/elements/"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch player from FPL API")
    }

    const data = await res.json()

    const players = data.map((player: Player) => ({
        id: player.id,
        first_name: player.first_name,
        last_name: player.second_name,
        total_points: player.total_points,
        xG: player.expected_goals,
        xA: player.expected_assists,
        minutes: player.minutes
    }))

    return NextResponse.json(players)
}