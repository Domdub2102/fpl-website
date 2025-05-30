import {  Team } from "@/types/types";
import { understat } from "./understat";
import { Fixture } from "@/types/types";

export async function fetchTeamsXG() {
    const url = "https://fantasy.premierleague.com/api"
    try {
        const mainResponse = await fetch(`${url}/bootstrap-static`)
        const fixtureResponse = await fetch(`${url}/fixtures`)
        const teamsXgData = await understat()
        
        const mainData = await mainResponse.json()
        const fixtures = await fixtureResponse.json()

        // creates teams object to then populate wih fixture data
        const teams = mainData.teams.map((team: Team) => {
            const fixtureObject: Record<number, Fixture[]> = {}
            for (let i = 1; i < 39; i++) {
                fixtureObject[i] = []
            }
            return {
                id: team.id,
                name: team.name,
                short_name: team.short_name,
                matches_played: 0,
                xG: 0,
                xGA: 0,
                xGRank: 0,
                xGARank: 0,
                fixtures: fixtureObject
            }
        })


        const updatedTeams = teams.map((team: Team) => {
            const club = teamsXgData.find(club => club.name === team.name) //find the club in the teams array
            // can i map here into fixtures array (ie. team.fixtures ?)
    
            if (club) return {
                ...team,
                xG: club.xG.toFixed(2),
                xGA: club.xGA.toFixed(2),
                xGRank: club.xGRank,
                xGARank: club.xGARank,
                matches_played: club.matches_played
            }
            else {
                console.log("club not found")
                return {
                    ...team
                }
            }
        })

        // loops fixtures array and adds fixture data to teams object
        for (const fixture of fixtures) {
            const { team_a, team_h, event } = fixture
        
            // Find the home and away team objects from the array
            const homeTeam = updatedTeams.find((team: Team) => team.id === team_h)
            const awayTeam = updatedTeams.find((team: Team) => team.id === team_a)

            const homeXgPer90 = homeTeam.xG / homeTeam.matches_played
            const homexGAPer90 = homeTeam.xGA / homeTeam.matches_played
            const awayXgPer90 = awayTeam.xG / awayTeam.matches_played
            const awayxGAPer90 = awayTeam.xGA / awayTeam.matches_played

            if (homeTeam) {
                const newFixture = {
                    opponent_id: team_a, 
                    opponent_name: awayTeam.name, 
                    opponent_short: awayTeam.short_name, 
                    gameweek: event, 
                    home_away: "H",
                    xGper90: awayXgPer90,
                    xGAper90: awayxGAPer90,
                    xGRank: awayTeam.xGRank,
                    xGARank: awayTeam.xGARank
                }
                if (!homeTeam.fixtures[event]) {
                    homeTeam.fixtures[event] = []
                }
                homeTeam.fixtures[event].push(newFixture)
            }
            if (awayTeam) {
                const newFixture = {
                    opponent_id: team_h, 
                    opponent_name: homeTeam.name, 
                    opponent_short: homeTeam.short_name, 
                    gameweek: event, 
                    home_away: "A",
                    xGper90: homeXgPer90,
                    xGAper90: homexGAPer90,
                    xGRank: homeTeam.xGRank,
                    xGARank: homeTeam.xGARank
                }
                if (!awayTeam.fixtures[event]) {
                    awayTeam.fixtures[event] = []
                }
                awayTeam.fixtures[event].push(newFixture)
            }
        }
        return updatedTeams
    }
    catch (error) {
        console.error(error)
        return []
    }
}