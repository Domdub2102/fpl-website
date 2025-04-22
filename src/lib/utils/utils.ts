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

    if (!newPlayer || !oldPlayer) {
        console.log("Please select two players")
        return currentSquad
    }

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

    // ensures that new player doesnt increase a single teams no. of players past 3
    if (newPlayer.team_id !== oldPlayer.team_id) {
        const currentTeamCount = teamDict[newPlayer.team_id].count
        const currentTeamLimit = teamDict[newPlayer.team_id].limit
        if (currentTeamCount === currentTeamLimit) {
            console.log("Maximum of 3 players per team")
            return currentSquad
        } 
    }

    // stops transfer of player in different position
    if (oldPlayer.position !== newPlayer.position) {
        console.log("Cannot transfer players of different positions")
        return currentSquad
    }

    // checks if player trying to transfer in is already in the squad
    if (
        currentSquad.firstEleven.find(player => player.id === newPlayer.id) ||
        currentSquad.subs.find(player => player.id === newPlayer.id)
    ) {
        console.log("Player already in squad")
        return currentSquad
    }

    const firstElevenIndex = currentSquad.firstEleven.findIndex(player => player.id === oldPlayer.id)
    const subIndex = currentSquad.subs.findIndex(player => player.id === oldPlayer.id)

    let updatedSquad
    // if the oldplayer is in the first eleven
    if (firstElevenIndex !== -1) {
        // use .slice to remove old player and replace with new player
        const updatedFirstEleven = [
            ...currentSquad.firstEleven.slice(0, firstElevenIndex),
            {...newPlayer, inFirstEleven: true},
            ...currentSquad.firstEleven.slice(firstElevenIndex + 1)
        ]
        updatedSquad = {
            firstEleven: updatedFirstEleven,
            subs: currentSquad.subs
        }
    }
    // if oldPlayer in subs
    else if (subIndex !== -1) {
        const updatedSubs = [
            ...currentSquad.subs.slice(0, subIndex),
            {...newPlayer, inSubs: true},
            ...currentSquad.subs.slice(subIndex + 1)
        ]
        updatedSquad = {
            firstEleven: currentSquad.firstEleven,
            subs: updatedSubs
        }
    } 
    else {
        console.log("must swap players from in and out of the squad")
        return currentSquad
    }

    // checks if squad array has been filled before returning
    if (updatedSquad.firstEleven.length > 0 && updatedSquad.subs.length > 0) {
        return updatedSquad
    } 
    else {
        return currentSquad
    }
}

export function filterPlayers(view: string, sort: string, maxPrice: number, initialPlayers: Player[]) {
    let updatedPlayers 
    let sortedPlayers
    if (view === "All Players") {
        updatedPlayers = initialPlayers.filter(player => player.now_cost <= maxPrice)
    } else if (view === "Goalkeepers") {
        updatedPlayers = initialPlayers.filter(player => player.position === 1 && player.now_cost <= maxPrice)
    } else if (view === "Defenders") {
        updatedPlayers = initialPlayers.filter(player => player.position === 2 && player.now_cost <= maxPrice)
    } else if (view === "Midfielders") {
        updatedPlayers = initialPlayers.filter(player => player.position === 3 && player.now_cost <= maxPrice)
    } else if (view === "Attackers") {
        updatedPlayers = initialPlayers.filter(player => player.position === 4 && player.now_cost <= maxPrice)
    } else {
        updatedPlayers = initialPlayers.filter(player => player.team_name === view && player.now_cost <= maxPrice)
    }
    if (sort === "Total Points") {
        sortedPlayers = updatedPlayers?.toSorted(
            (player1, player2) => player2.total_points - player1.total_points
        )
    } else if (sort === "Price"){
        sortedPlayers = updatedPlayers?.toSorted(
            (player1, player2) => player2.now_cost - player1.now_cost
        )
    }
    return sortedPlayers
}