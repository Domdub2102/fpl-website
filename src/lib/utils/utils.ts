import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Player, Team, TeamXG, Gameweek } from "@/types/types"

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

export function addFixturesToPlayers(players: Player[], teams: Team[]) {
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
    return updatedPlayers
}

export function initialSort(players: Player[]) {
    return players.sort((p1: Player, p2: Player) => (p1.total_points < p2.total_points) ? 1 : (p1.total_points > p2.total_points) ? -1 : 0)
}


// createSquad has its own squad state
export function createSquad(players: Player[], teams: Team[]) {
    // filters out unpopular players initially
    const highOwnedPlayers = players.filter((player) => Number(player.selected_by_percent) > 10)

    // lookup dicts to define:
    // - max no. of players in each position
    // - formation (ie positions in firsteleven)
    // - max players per team (3)
    const positions: Record<Position, {count:number; limit:number}> = {
        1: { count: 0, limit: 2 }, //keeper
        2: { count: 0, limit: 5 }, //defender
        3: { count: 0, limit: 5 }, //mid
        4: { count: 0, limit: 3 }  //attacker
    }
    const firstEleven: Record<Position, {count: number, limit: number}> = {
        1: { count: 0, limit: 1 },
        2: { count: 0, limit: 3},
        3: { count: 0, limit: 5},
        4: { count: 0, limit: 2}
    }
    const teamDict: Record<number, {count: number, limit: number}> = {}
    teams.forEach(team => {
        teamDict[team.id] = { count: 0, limit: 3 }
    })

    const initialSquad = []
    for (const player of highOwnedPlayers) {
        const teamId = player.team_id
        const position = player.position as Position
        if (
            positions[position].count < positions[position].limit && 
            teamDict[teamId].count < teamDict[teamId].limit
        ) {
            initialSquad.push(player)
            positions[position].count++
            teamDict[teamId].count++
        }
        if (initialSquad.length >= 15) {
            break
        }
    }

    const fullSquad = initialSquad.map(player => {
        const position = player.position as Position
        if (firstEleven[position].count < firstEleven[position].limit) {
            firstEleven[position].count++
            return {
                ...player,
                inFirstEleven: true
            }
        }
        else {
            return {
                ...player,
                inSubs: true
            }
        }
    })
    return fullSquad.sort((a, b) => a.position - b.position)
}

// returns updatedSquad with ableToSub property set correctly
export function playersAbleToSub(clickedPlayer: Player, currentSquad: Player[]) {
    type Position = 1 | 2 | 3 | 4
    const firstEleven: Record<Position, {count: number, min: number, max: number}> = {
        1: { count: 0, min: 1, max: 1},
        2: { count: 0, min: 3, max: 5},
        3: { count: 0, min: 2, max: 5},
        4: { count: 0, min: 1, max: 3}
    }

    // finds current 'formation'
    for (const player of currentSquad) {
        if (player.inFirstEleven){
            firstEleven[player.position as Position].count++
        }
    }
    const clickedPlayerPosCount = firstEleven[clickedPlayer.position as Position].count
    const clickedPlayerPosMin = firstEleven[clickedPlayer.position as Position].min
    
    const updatedSquad = currentSquad.map(player => {

        if (player.id === clickedPlayer.id) {
            return {
                ...player,
                ableToSub: true,
                isSelected: true
            }
        } 

        // if clicked player in same group as player, keep able to sub as false
        if (player.inFirstEleven === clickedPlayer.inFirstEleven ) {
            return player
        } 
        // if same position, add AbleToSub as true
        else if (player.position === clickedPlayer.position) {
            return {
                ...player,
                ableToSub: true
            }
        } 
        /**
         * if player in subs, keep abletosub as false if:
         * if i click a mid, need to make sure that clicked player is not on the min
         */
        else if (player.inSubs) {
            // if the position of the player being subbed out of first eleven is the min, then dont allow the sub
            // skips if clickedPlayer can be subbed out
            if (clickedPlayerPosCount === clickedPlayerPosMin) {
                return player
            }
            else if (player.position === 1) {
                return player
            }
            return {
                ...player,
                ableToSub: true
            }
        }
        // only get this far if clicked player is in subs (so player is in firstEleven)
        // if player to be subbed out has min no of players in that position, then dont allow the sub
        if (firstEleven[player.position as Position].count === firstEleven[player.position as Position].min) {
            return player
        }
        if (clickedPlayer.position === 1) {
            return player
        }
        return {
            ...player,
            ableToSub: true
        }              
    })
    return updatedSquad
}  

// function will only run if subInProgress
export function completeSub(clickedPlayer: Player, currentSquad: Player[]) {
    const updatedSquad = currentSquad.map((player: Player) => {
        // if same player clicked twice, cancel the sub
        if (player.id === clickedPlayer.id && player.isSelected) {
            return {
                ...player,
                ableToSub: false,
                isSelected: false
            }
        }
        // swap inSubs and inFirstELeven properties for clicked player and selected player
        if (player.id === clickedPlayer.id || player.isSelected) {
            return {
                ...player,
                inSubs: !player.inSubs,
                inFirstEleven: !player.inFirstEleven,
                ableToSub: false,
                isSelected: false
            }
        }
        return {
            ...player,
            ableToSub: false
        }
    })
    return updatedSquad
}

export function prevGameweek(gameweek: Gameweek, gameweekArray: Gameweek[]) {
    // check that prevGameweek is not below 1
    // find previous gw in gameweeks array, then update the value of state
    if (gameweek.id > 1) {
        const prevGameweek = gameweekArray.find(gw => gw.id === gameweek.id - 1)
        if (prevGameweek) {
            return prevGameweek
        }
    }
    return gameweek
}

export function nextGameweek(gameweek: Gameweek, gameweekArray: Gameweek[]) {
    // check that prevGameweek is not below 1
    // find previous gw in gameweeks array, then update the value of state
    if (gameweek.id > 1) {
        const nextGameweek = gameweekArray.find(gw => gw.id === gameweek.id + 1)
        if (nextGameweek) {
            return nextGameweek
        }
    }
    return gameweek
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


export function calcExpectedTotals(
    teams: TeamXG[], 
    minGw: number,
    maxGw: number,
    isAttack: boolean
) {
    const updatedTeams = teams.map(team => {
        let expectedTotal = 0
    
        for (const [gw, fixtureArr] of Object.entries(team.fixtures)) {
            const gwNum = Number(gw)
            if (gwNum < minGw || gwNum > maxGw) {
                continue
            }
    
            if (fixtureArr.length === 1) {
                expectedTotal += isAttack ? fixtureArr[0].xGAper90 : fixtureArr[0].xGper90
            } else if (fixtureArr.length === 2) {
                expectedTotal += (isAttack ? fixtureArr[0].xGAper90 + fixtureArr[1].xGAper90 
                                           : fixtureArr[0].xGper90 + fixtureArr[1].xGper90)
            }
        }
        return {
            ...team,
            expectedTotal,
        }
    })
    return updatedTeams
}

export function getBgColor(rank: number) {
    if (rank >= 1 && rank <= 4) return "bg-red-700 text-gray-100"; // Dark Red
    if (rank >= 5 && rank <= 8) return "bg-red-400 text-black"; // Light Red
    if (rank >= 9 && rank <= 12) return "bg-gray-300 text-black"; // Grey
    if (rank >= 13 && rank <= 16) return "bg-green-300 text-black"; // Light Green
    if (rank >= 17 && rank <= 20) return "bg-green-700 text-gray-100"; // Dark Green
    else return ""
}

// return updated squad
// sets isRemoved to true, but need another func:
// complete transfer, which updates the inSubs/inFirstEleven properties
export function removePlayer(clickedPlayer: Player, currentSquad: Player[]) {
    const updatedSquad = currentSquad.map(player => {
        if (player.id === clickedPlayer.id) {
            return {
                ...player,
                isRemoved: true
            }
        }
        else return player
    })
    return updatedSquad
    // returns either updatedSquad or old currentSquad
}

// sets isRemoved property of clickedPlayer to false
// everything else remains the same
export function restorePlayer(clickedPlayer: Player, currentSquad: Player[]) {
    const updatedSquad = currentSquad.map(player => {
        if (player.id === clickedPlayer.id) {
            return {
                ...player,
                isRemoved: false
            }
        }
        else return player
    })
    return updatedSquad
    // returns either updatedSquad or old currentSquad
}

// adds clicked player (from table) at the correct index of removed player,
// with the same properties (subs/11) as the removed player
export function completeSquadTransfer(clickedPlayer: Player, removedPlayers: Player[], currentSquad: Player[]) {
    
    const removedPlayer = removedPlayers.find(player => player.position === clickedPlayer.position)
    const removedPlayerIndex = currentSquad.findIndex(player => player.id === removedPlayer?.id)
    if (removedPlayer) {
        return [
            ...currentSquad.slice(0, removedPlayerIndex),
            {
                ...clickedPlayer,
                inSubs: removedPlayer.inSubs,
                inFirstEleven: removedPlayer.inFirstEleven
            },
            ...currentSquad.slice(removedPlayerIndex + 1)
        ]
    }
    else {
        console.log("Transfer not possible, invalid formation")
        return currentSquad
    }
    // if removedPlayer not found then return currentSquad
}


export function updatePlayersAfterTransfer(removedPlayer: Player, players: Player[]) {
    const updatedPlayers = players.map(player => {
        if (player.id === removedPlayer.id) {
            return {
                ...player,
                inSubs: false,
                inFirstEleven: false,
                isRemoved: false
            }
        }
        else return player
    })
    return updatedPlayers
}