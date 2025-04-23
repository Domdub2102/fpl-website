import React from 'react'
import { createInitialSquad, createFullSquad } from '@/lib/utils/utils'
import { Player, Team, Gameweek } from '@/types/types'
import { fetchPlayers } from '@/lib/fetchers/players'
import { fetchTeams } from '@/lib/fetchers/teams'
import Squad from '@/components/SquadManager/Squad'
import PlayerSelector from '@/components/SquadManager/PlayerSelector'
import SquadProvider from '@/lib/context/SquadContext'
import { fetchGameweeks } from '@/lib/fetchers/gameweeks'

// fetch data here, then pass down as props to squad and player selector
// squad/playerstable can then setState as they are client components 

export default async function SquadPage() {

    // fetch teams/players and merge data
    const teams: Team[] = await fetchTeams()
    const players: Player[] = await fetchPlayers()
    const gameweeks: Gameweek[] = await fetchGameweeks()

    const updatedPlayers = players.map((player: Player) => {
        const team = teams.find((team: Team) => team.id === player.team_id)
      
        if (!team) {
            console.log(`no team found for player ${player.web_name}`)
            return {...player, team_name: "Unknown", fixtures: []}
        }

        return {
            ...player,
            team_name: team.name,
            team_short_name: team.short_name,
            fixtures: team.fixtures
        }
    })

    // create initial squad by passing in players array to createInitialSquad util function
    const initialSquad = createInitialSquad(updatedPlayers, teams)
    const fullSquad = createFullSquad(initialSquad, 3, 4, 3)

    // sorts the players, initially by total points
    const sortedPlayers = updatedPlayers.sort(
        (p1: Player, p2: Player) => (p1.total_points < p2.total_points) ? 1 : (p1.total_points > p2.total_points) ? -1 : 0
    );

    return (
        <div className='flex flex-col items-center w-full bg-[#c0fcf7]'>
            <div className='bg-[#c0fcf7] w-full text-center py-[20px]'>
                <h1 className='text-[40px] text-black font-[800]'>Squad Planner</h1>
            </div>
            <div className='flex flex-row justify-center w-full gap-[20px]'>
                <SquadProvider>
                    <Squad initialSquad={fullSquad} teams={teams} gameweeks={gameweeks}/>
                    <PlayerSelector initialPlayers={sortedPlayers} teams={teams}/>
                </SquadProvider>
            </div>
        </div>
    )
}