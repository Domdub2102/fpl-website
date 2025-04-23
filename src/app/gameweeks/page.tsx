import { fetchGameweeks } from "@/lib/fetchers/gameweeks"
import { Gameweek } from "@/types/types"

export default async function Page() {
    const data: Gameweek[] = await fetchGameweeks()
    
    const gameweeks = data.map((gameweek: Gameweek) => {
        return (
            <div key={gameweek.id}>
                <h1>{gameweek.id}</h1>
                <h1>{gameweek.name}</h1>
                <p>{gameweek.deadline_time.toLocaleString()}</p>
            </div>
        )
    })  

    return (
        <div>
            {gameweeks}
        </div>
    )
}