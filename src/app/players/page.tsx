/**
 * Notes:
 * Only allow user to do direct swaps (ie. mid for mid):
 * this will help with formation state management
 */

import React from 'react'
import { createInitialSquad, createFullSquad } from '@/utils/utils'
import SquadManager from '@/components/SquadManager/SquadManager'

async function fetchTeams() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/teams/`
  const res = await fetch(url, {
      method: "GET",
  })

  if (!res) {
      throw new Error("Failed to fetch teams")
  }
  const data = await res.json()
  return data
}


async function fetchPlayers() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/players`
  const res = await fetch(url, {
      method: "GET"
  })
  if (!res.ok) {
      throw new Error("Failed to fetch players from internal server")
  }
  const data = await res.json()
  return data
}

export default async function PlayersPage() {

  // fetch teams/players and merge data
  const teams = await fetchTeams()
  const players = await fetchPlayers()

  const updatedPlayers = players.map((player) => {
    const team = teams.find(team => team.id === player.team_id)
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
    (p1, p2) => (p1.total_points < p2.total_points) ? 1 : (p1.total_points > p2.total_points) ? -1 : 0
  );

  
  return <SquadManager squad={fullSquad} players={sortedPlayers} teams={teams}/>
}