import { fetchGameweeks } from "@/lib/fetchers/gameweeks"

interface Gameweek {
    id: number
    name: string
    deadline: string
}

export default async function Page() {
    const data: Gameweek[] = await fetchGameweeks()
    
    const gameweeks = data.map((gameweek: Gameweek) => {
        return (
            <div key={gameweek.id}>
                <h1>{gameweek.name}</h1>
                <p>{gameweek.deadline}</p>
            </div>
        )
    })  

    return (
        <div>
            {gameweeks}
        </div>
    )
}