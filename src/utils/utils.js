// takes teams array (/api/teams) and teamsXG (/api/understat)
// adds xg data and returns new teams array

export function addXgToTeams(teams, teamsXG) {
    for (const item of teamsXG) {
        console.log(`Looking for team: ${item.team}`)
        const currentTeam = teams.find(team => team.name === item.team)

        if (currentTeam) {
            currentTeam.xG = item.xG
            currentTeam.xGA = item.xGA
        } else {
            console.log(`Team not found: ${item.team}`)
        }
    }
    return teams
}

// need to add some sort of state tracking the number of players from each team
export function createInitialSquad( players ) {
    const highOwnedPlayers = players.filter((player) => Number(player.selected_by_percent) > 15)

    // lookup dictionary:
    const positions = {
        1: { count: 0, limit: 2 }, //keeper
        2: { count: 0, limit: 5 }, //defender
        3: { count: 0, limit: 5 }, //mid
        4: { count: 0, limit: 3 }  //attacker
    }

    const squad = []

    for (const player of highOwnedPlayers) {
        if (positions[player.position].count < positions[player.position].limit) {
            squad.push(player)
            positions[player.position].count ++
        }
        if (squad.length >= 15) {
            break
        }
    }

    return squad.sort((a, b) => a.position - b.position)
}

// takes position states to set the formation
export function createFullSquad( squad, defenders, midfielders, attackers ) {
    const squadDict = {
        1: { count: 0, limit: 1 },
        2: { count: 0, limit: defenders},
        3: { count: 0, limit: midfielders },
        4: { count: 0, limit: attackers }
    }
    const fullSquad = {
        firstEleven: [],
        subs: []
    }
    for (const player of squad) {
        if (squadDict[player.position].count < squadDict[player.position].limit) {
            fullSquad.firstEleven.push(player)
            squadDict[player.position].count++
        } else {
            fullSquad.subs.push(player)
        }
    }
    return fullSquad
}

// Swapping players between firstEleven and subs
export function swapPlayers(selectedPlayers, squadState) {
    if (selectedPlayers.length !== 2) {
        console.log("Please select exactly two players to swap.")
        return null
    }

    const [player1, player2] = selectedPlayers;

    // find if both players are in firsteleven or subs:
    const bothFirstEleven = squadState.firstEleven.filter(player => player.id === player1.id || player.id === player2.id)
    const bothSubs = squadState.subs.filter(player => player.id === player1.id || player.id === player2.id)

    if (bothFirstEleven.length > 1 || bothSubs.length > 1) {
        console.log("Make sure you are swapping players between the first XI and subs bench")
        return null
    }

    let positions = {
        1: {current: 0, min: 1, max: 1},
        2: {current: 0, min: 3, max: 5},
        3: {current: 0, min: 2, max: 5},
        4: {current: 0, min: 1, max: 3}
    }
    // updates the 'formation' of the squad
    squadState.firstEleven.forEach(player => {
        positions[player.position].current++
    })


    if (player1.position !== player2.position) {
        if (squadState.firstEleven.find(player => player.id === player1.id)) {
            if (positions[player2.position].current + 1 > positions[player2.position].max) {
                console.log("Invalid Formation")
                return null
            } 
            if (positions[player1.position].current - 1 < positions[player1.position].min) {
                console.log("Invalid formation") 
                return null
            }
        } else {
            if (positions[player1.position].current + 1 > positions[player1.position].max) {
                console.log("Invalid Formation")
                return null
            } 
            if (positions[player2.position].current - 1 < positions[player2.position].min) {
                console.log("Invalid formation") 
                return null
            }
        }
    }

    let firstElevenPlayer = squadState.firstEleven.find(player => player.id === player1.id);
    let subPlayer;
    let firstElevenIndex, subIndex;

    if (firstElevenPlayer) {
        // Player1 is in firstEleven, Player2 is in subs
        subPlayer = player2;
        firstElevenIndex = squadState.firstEleven.findIndex(player => player.id === player1.id);
        subIndex = squadState.subs.findIndex(player => player.id === player2.id);
    } else {
        // Player1 is in subs, Player2 is in firstEleven
        firstElevenPlayer = player2;
        subPlayer = player1;
        firstElevenIndex = squadState.firstEleven.findIndex(player => player.id === player2.id);
        subIndex = squadState.subs.findIndex(player => player.id === player1.id);
    }

    // Swap in firstEleven at the correct index
    const updatedFirstEleven = [
        ...squadState.firstEleven.slice(0, firstElevenIndex),
        subPlayer,
        ...squadState.firstEleven.slice(firstElevenIndex + 1)
    ];

    // Swap in subs at the correct index
    // ** possibly dont order the subs, just always put keeper at index[0] **
    const updatedSubs = [
        ...squadState.subs.slice(0, subIndex),
        firstElevenPlayer,
        ...squadState.subs.slice(subIndex + 1)
    ].sort((a, b) => a.position - b.position);

    const updatedSquad = {
        firstEleven: updatedFirstEleven,
        subs: updatedSubs
    }
    return updatedSquad
}


// todo:
// add player from table into new player state, then add squad player to old player state
// state must be managed by SquadManager
// add an extra button for transferring players between squad and table
export function transferPlayer(currentSquad, newPlayer, oldPlayer) {

    if (oldPlayer.position !== newPlayer.position) {
        console.log("Cannot transfer players of different positions")
        return null
    }

    if (
        currentSquad.firstEleven.find(player => player.id === newPlayer.id) ||
        currentSquad.subs.find(player => player.id === oldPlayer.id)
    ) {
        console.log("Player already in squad")
        return null
    }
 
    let updatedSquad = {
        firstEleven: [],
        subs: []
    }

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
        return null
    }
    // checks if squad array has been filled before returning
    if (updatedSquad.firstEleven.length > 0 && updatedSquad.subs.length > 0) {
        return updatedSquad
    } 
    else {
        return undefined
    }
}
