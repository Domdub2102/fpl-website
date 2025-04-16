import React from 'react'
import { createInitialSquad, createFullSquad } from '@/lib/utils/utils'
import SquadManager from '@/components/SquadManager/SquadManager'
import { Player, Team } from '@/types/types'
import { fetchPlayers } from '@/lib/fetchers/players'
import { fetchTeams } from '@/lib/fetchers/teams'


export default async function PlayersPage() {

  // fetch teams/players and merge data
  const teams: Team[] = await fetchTeams()
  const players: Player[] = await fetchPlayers()

  const updatedPlayers = players.map((player: Player) => {
    const team = teams.find((team: Team) => team.id === player.team_id)
    
    if (!team) {
      console.log(`no team found for player ${player.web_name}`)
      return {...player, team_name: "Unknown", fixtures: []}
    }

    return {
      ...player,
      team_name: team.name,
      fixtures: team.fixtures
    }
  })

  console.log(updatedPlayers.slice(0,1))

  // create initial squad by passing in players array to createInitialSquad util function
  const initialSquad = createInitialSquad(updatedPlayers)
  const fullSquad = createFullSquad(initialSquad, 3, 4, 3)

  // sorts the players, initially by total points
  const sortedPlayers = updatedPlayers.sort(
    (p1: Player, p2: Player) => (p1.total_points < p2.total_points) ? 1 : (p1.total_points > p2.total_points) ? -1 : 0
  );

  return <SquadManager squad={fullSquad} players={sortedPlayers} teams={teams}/>
}