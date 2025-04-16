import {  Team } from "@/types/types";

export async function fetchTeams() {
    const url = "https://fantasy.premierleague.com/api"
    try {
        const mainResponse = await fetch(`${url}/bootstrap-static`)
        const fixtureResponse = await fetch(`${url}/fixtures`)
        
        const mainData = await mainResponse.json()
        const fixtures = await fixtureResponse.json()

        // creates teams object to then populate wih fixture data
        const teams = mainData.teams.map((team: Team) => {
            return {
                id: team.id,
                name: team.name,
                short_name: team.short_name,
                matches_played: 0,
                xG: 0,
                xGA: 0,
                fixtures: []
            }
        })

        // loops fixtures array and adds fixture data to teams object
        for (const fixture of fixtures) {
            const { team_a, team_h, event, finished } = fixture
        
            // Find the home and away team objects from the array
            const homeTeam = teams.find((team: Team) => team.id === team_h)
            const awayTeam = teams.find((team: Team) => team.id === team_a)
        
            if (homeTeam) {
                homeTeam.fixtures.push(
                    { 
                        opponent_id: team_a, 
                        opponent_name: awayTeam.name, 
                        opponent_short: awayTeam.short_name, 
                        gameweek: event, 
                        home_away: "H"
                    }
                )
                if (finished) {
                    homeTeam.matches_played++
                }
            }
            if (awayTeam) {
                awayTeam.fixtures.push(
                    { 
                        opponent_id: team_h, 
                        opponent_name: homeTeam.name, 
                        opponent_short: homeTeam.short_name, 
                        gameweek: event, 
                        home_away: "A"
                    }
                )
                if (finished){
                    awayTeam.matches_played++
                }
            }
        }
        return teams
    }
    catch (error) {
        console.error(error)
        return []
    }
}