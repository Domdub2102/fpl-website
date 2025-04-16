type Gameweek = {
    id: number
    name: string
    deadline_time: string
}

export async function fetchGameweeks() {
    const url = "https://fantasy.premierleague.com/api/events/"
    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error("Failed to fetch from FPL API")
        }
        const data = await res.json()

        const gameweeks = data.map((gameweek: Gameweek) => {
            return {
                id: gameweek.id,
                name: gameweek.name,
                deadline: gameweek.deadline_time,
            }
        })
        return gameweeks
    }
    catch(error) {
        console.error(error)
        return []
    }
}