import React from 'react'

interface Team {
    id: number
    name: string
    short_name: string
}

async function fetchTeams() {
    const url = "http://localhost:3000/api/teams/"
    try {
        const res = await fetch(url, {
            method: "GET",
        })
        if (!res) {
            throw new Error("Failed to fetch teams")
        }
        const data = await res.json()
        return data
    }
    catch (error) {
        console.error(error)
        return []
    }
    
}

export default async function TeamsPage() {
    const data = await fetchTeams()

    const teams = data.map((team: Team) => {
        return (
            <div key={team.id}>
                <h1>{team.name}</h1>
                <h2>{team.short_name}</h2>
            </div>
        )
    })

    return (
        <div>
            {teams}
        </div>
    )
}