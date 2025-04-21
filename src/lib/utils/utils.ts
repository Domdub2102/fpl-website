import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Player, Team, SquadType } from "@/types/types"

type Position = 1 | 2 | 3 | 4

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addXgToTeams(teams: Team[], teamsXG: Team[]) {
  for (const item of teamsXG) {
      console.log(`Looking for team: ${item.name}`)
      const currentTeam = teams.find(team => team.name === item.name)

      if (currentTeam) {
          currentTeam.xG = item.xG
          currentTeam.xGA = item.xGA
      } else {
          console.log(`Team not found: ${item.name}`)
      }
  }
  return teams
}

// need to add some sort of state tracking the number of players from each team
// can simply count number of player from each team and keep checking if its greater than 3 
export function createInitialSquad( players: Player[], teams: Team[] ) {
  const highOwnedPlayers = players.filter((player) => Number(player.selected_by_percent) > 10)

  const positions: Record<Position, {count:number; limit:number}> = {
      1: { count: 0, limit: 2 }, //keeper
      2: { count: 0, limit: 5 }, //defender
      3: { count: 0, limit: 5 }, //mid
      4: { count: 0, limit: 3 }  //attacker
  }

  // creates lookup dictionary of all the teams
  const teamDict: Record<number, {count: number, limit: number}> = {}
  teams.forEach(team => {
    teamDict[team.id] = { count: 0, limit: 3 }
  })

  /**
   * team object has name and id properties
   * player has team_id and team_name
   */

  const squad = []

  for (const player of highOwnedPlayers) {
    const teamId = player.team_id
    const position = player.position as Position
    if (
        positions[position].count < positions[position].limit && 
        teamDict[teamId].count < teamDict[teamId].limit
    ) {
        squad.push(player)
        positions[position].count++
        teamDict[teamId].count++
    }
    if (squad.length >= 15) {
        break
    }
  }
  return squad.sort((a, b) => a.position - b.position)
}



// takes position states to set the formation
export function createFullSquad( 
    squad: Player[], 
    defenders:number, 
    midfielders:number, 
    attackers:number 
) {
    const squadDict: Record<Position, {count: number, limit: number}> = {
        1: { count: 0, limit: 1 },
        2: { count: 0, limit: defenders},
        3: { count: 0, limit: midfielders },
        4: { count: 0, limit: attackers }
    }
    const fullSquad: SquadType = {
        firstEleven: [],
        subs: []
    }
    for (const player of squad) {
        const position = player.position as Position
        if (squadDict[position].count < squadDict[position].limit) {
            player.inFirstEleven = true
            fullSquad.firstEleven.push(player)
            squadDict[position].count++
        } else {
            player.inSubs = true
            fullSquad.subs.push(player)
        }
    }
    return fullSquad
}

export function unselectPlayers(squad: SquadType) {
    const updatedFirstEleven = squad.firstEleven.map((player: Player)=> ({
        ...player,
        isSelected: false
    }))
    const updatedSubs = squad.subs.map((player: Player) => ({
        ...player,
        isSelected: false
    }))
    const updatedSquad = {
        firstEleven: updatedFirstEleven,
        subs: updatedSubs
    }
    return updatedSquad
}


// Swapping players between firstEleven and subs
export function swapPlayers(startingPlayer: Player, subPlayer: Player, squad: SquadType) {
    if (!startingPlayer || !subPlayer) {
        console.log("Please select exactly two players to swap.")
        const updatedSquad = unselectPlayers(squad)
        return updatedSquad
    }

    //each player has a position property equal to 1, 2, 3, or 4
    const positions: Record<Position, {current: number, min: number, max: number}> = {
        1: {current: 0, min: 1, max: 1},
        2: {current: 0, min: 3, max: 5},
        3: {current: 0, min: 2, max: 5},
        4: {current: 0, min: 1, max: 3}
    }
    // finds current 'formation' of the squad by updating positions dictionary
    squad.firstEleven.forEach(player => {
        positions[player.position as Position].current++
    })

    // prevents invalid formations using positions lookup dictionary
    if (startingPlayer.position !== subPlayer.position) {
        const startingPosition = positions[startingPlayer.position as Position]
        const subPosition = positions[subPlayer.position as Position]
        if (subPosition.current === subPosition.max) {
            console.log("invalid formation")
            const updatedSquad = unselectPlayers(squad)
            return updatedSquad
        }
        if (startingPosition.current === startingPosition.min) {
            console.log("Invalid Formation")
            const updatedSquad = unselectPlayers(squad)
            return updatedSquad
        }
    }

    subPlayer.inSubs = false
    subPlayer.inFirstEleven = true
    subPlayer.isSelected = false
    startingPlayer.inSubs = true
    startingPlayer.inFirstEleven = false
    startingPlayer.isSelected = false

    const startingIndex = squad.firstEleven.findIndex(player => player.id === startingPlayer.id)
    const subIndex = squad.subs.findIndex(player => player.id === subPlayer.id)

    // Swap in firstEleven at the correct index
    const updatedFirstEleven = [
        ...squad.firstEleven.slice(0, startingIndex),
        subPlayer,
        ...squad.firstEleven.slice(startingIndex + 1)
    ];

    // Swap in subs at the correct index
    const updatedSubs = [
        ...squad.subs.slice(0, subIndex),
        startingPlayer,
        ...squad.subs.slice(subIndex + 1)
    ]

    const updatedSquad = {
        firstEleven: updatedFirstEleven,
        subs: updatedSubs
    }
    return updatedSquad
}



export function transferPlayer(currentSquad: SquadType, teams: Team[], newPlayer: Player | undefined, oldPlayer: Player | undefined) {

    // create a lookup dict of teams in current squad
    const teamDict: Record<number, { count: number, limit: number }> = {}
    teams.forEach(team => {
        teamDict[team.id] = { count: 0, limit: 3 }
    })
    currentSquad.firstEleven.forEach(player => {
        teamDict[player.team_id].count++
    })
    currentSquad.subs.forEach(player => {
        teamDict[player.team_id].count++
    })

    if (!newPlayer || !oldPlayer) {
        console.log("Please select two players")
        return
    }

    // ensures that new player doesnt increase a single teams no. of players past 3
    if (newPlayer.team_id !== oldPlayer.team_id) {
        const currentTeamCount = teamDict[newPlayer.team_id].count
        const currentTeamLimit = teamDict[newPlayer.team_id].limit
        if (currentTeamCount === currentTeamLimit) {
            console.log("Maximum of 3 players per team")
            return
        } 
    }

    // stops transfer of player in different position
    if (oldPlayer.position !== newPlayer.position) {
        console.log("Cannot transfer players of different positions")
        return 
    }

    // *** can combine this with findIndex a few lines down to reduce need to search arrays again ***
    if (
        currentSquad.firstEleven.find(player => player.id === newPlayer.id) ||
        currentSquad.subs.find(player => player.id === oldPlayer.id)
    ) {
        console.log("Player already in squad")
        return 
    }

    const updatedSquad: SquadType = {
        firstEleven: [],
        subs: []
    }

    // *** update here to add the transferred player at the correct squad index ***
    const firstElevenIndex = currentSquad.firstEleven.findIndex(player => player.id === oldPlayer.id)
    // if the oldplayer is in the first eleven
    if (firstElevenIndex) {
        const newFirstEleven = currentSquad.firstEleven
            .filter(player => player.id !== oldPlayer.id)
        
        updatedSquad.firstEleven = [...newFirstEleven, newPlayer]
        updatedSquad.subs = [...currentSquad.subs]
    }
    // if oldPlayer in subs
    else if (currentSquad.subs.find(player => player.id === oldPlayer.id)) {
        const newSubs = currentSquad.subs
            .filter(player => player.id !== oldPlayer.id)
        
        updatedSquad.subs = [...newSubs, newPlayer]
        updatedSquad.firstEleven = [...currentSquad.firstEleven]
    } 
    else {
        console.log("must swap players from in and out of the squad")
        return 
    }
    // checks if squad array has been filled before returning
    if (updatedSquad.firstEleven.length > 0 && updatedSquad.subs.length > 0) {
        return updatedSquad
    } 
    else {
        return 
    }
}