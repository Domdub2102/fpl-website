interface Gameweek {
    id: number
    name: string
    deadline: string
}

async function fetchGameweeks() {
    const res = await fetch("http://localhost:3000/api/gameweeks/", {
        method: "GET",
    })
    if (!res.ok) {
        throw new Error("Failed to fetch gameweek data")
    }
    return res.json()
}

export default async function Page() {
    const data = await fetchGameweeks()
    
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