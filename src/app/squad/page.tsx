import React from 'react'
import { createInitialSquad, createFullSquad, addFixturesToPlayers, initialSort } from '@/lib/utils/utils'
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

    const updatedPlayers = addFixturesToPlayers(players, teams)

    // create initial squad by passing in players array to createInitialSquad util function
    const initialSquad = createInitialSquad(updatedPlayers, teams)
    const fullSquad = createFullSquad(initialSquad, 3, 4, 3)

    // sorts the players, initially by total points
    const sortedPlayers = initialSort(updatedPlayers)

    return (
        <div className='flex flex-col items-center w-full bg-[#c0fcf7] xl:px-[100px] lg:pb-10 p-2 sm:p-5'>
            <div className='bg-[#c0fcf7] w-full text-center md:text-left lg:text-left md:py-2 lg:py-[20px]'>
                <h1 className='text-4xl lg:text-[40px] text-black font-[800] mb-2 sm:pb-2'>Squad Planner</h1>
            </div>
            <div className='flex flex-col md:flex-row lg:flex-row justify-center w-full md:gap-2 lg:gap-[20px]'>
                <SquadProvider>
                    <Squad initialSquad={fullSquad} teams={teams} gameweeks={gameweeks}/>
                    <PlayerSelector initialPlayers={sortedPlayers} teams={teams}/>
                </SquadProvider>
            </div>
        </div>
    )
}