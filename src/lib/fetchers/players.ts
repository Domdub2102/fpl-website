import { Player } from "@/types/types";

export async function fetchPlayers() {
    try {
        const res = await fetch("https://fantasy.premierleague.com/api/elements/")

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
                second_name: player.second_name,
                total_points: player.total_points,
                expected_goals: player.expected_goals,
                expected_assists: player.expected_assists,
                minutes: player.minutes,
                now_cost: (player.now_cost / 10),
                position: player.element_type,
                selected_by_percent: player.selected_by_percent,
                team_id: player.team,
            }))
            
        return players
    }
    catch (error) {
        console.error(error)
        return []
    }
}