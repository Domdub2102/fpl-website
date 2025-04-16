import React from 'react'
import { fetchTeams } from '@/lib/fetchers/teams'

interface Team {
    id: number
    name: string
    short_name: string
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