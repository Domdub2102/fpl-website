// returns teams array with team name and xg, xga data

import axios from "axios";
import * as cheerio from "cheerio";

interface MatchStats {
    xG: string;
    xGA: string;
}
  
interface Team {
    name: string;
    xG: number;
    xGA: number;
    matches_played: number
    xGRank: number
    xGARank: number
}

interface RawTeamData {
    title: string;
    history: MatchStats[];
}


export async function understat() {
    try {
        const url = "https://understat.com/league/epl";
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract script tag containing teamsData
        let scriptText = "";
        $("script").each((_, el) => {
            const text = $(el).html();
            if (text && text.includes("teamsData")) {
                scriptText = text;
            }
        });

        if (!scriptText) {
            throw new Error("teamsData script not found.");
        }

        // 🔹 Extract JSON-like part
        const startIdx = scriptText.indexOf("JSON.parse('") + 12; // Skip "JSON.parse('"
        const endIdx = scriptText.indexOf("')", startIdx); // Find the closing ')'
        const encodedJsonString = scriptText.substring(startIdx, endIdx).trim(); // Extract encoded JSON

        // 🔹 Decode Unicode escape sequences
        const decodedJsonString = encodedJsonString.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );

        // 🔹 Parse JSON
        const teamsData = JSON.parse(decodedJsonString);

        // Extract xG and xGA for each team
        const teamStats = Object.values(teamsData as Record<string, RawTeamData>).map((team): Team => ({
            name: team.title,
            xG: team.history.reduce((sum, match) => sum + parseFloat(match.xG), 0),
            xGA: team.history.reduce((sum, match) => sum + parseFloat(match.xGA), 0),
            matches_played: team.history.length,
            xGRank: 0,
            xGARank: 0
        }));

        teamStats.sort((a, b) => b.xG - a.xG)

        const teamsXgRankAdded = teamStats.map((team, index) => {
            return {
                ...team,
                xGRank: index + 1
            }
        })

        teamsXgRankAdded.sort((a, b) => a.xGA - b.xGA)

        const teamsXGARankAdded = teamsXgRankAdded.map((team, index) => {
            return {
                ...team,
                xGARank: index + 1
            }
        })
          
        // Replace strings which don't match other data from FPL API
        const replacements: Record<string, string> = {
            "Tottenham": "Spurs",
            "Manchester United": "Man Utd",
            "Manchester City": "Man City",
            "Newcastle United": "Newcastle",
            "Nottingham Forest": "Nott'm Forest",
            "Wolverhampton Wanderers": "Wolves"
        }
        
        const updatedTeams: Team[] = teamsXGARankAdded.map((team: Team): Team => {
            const updatedTeam: Team = { ...team };
          
            updatedTeam.name = replacements[updatedTeam.name] || updatedTeam.name;
          
            return updatedTeam;
        });
        return updatedTeams

    } catch (error) {
        console.error("Error fetching data from Understat:", error);
        return []
    }
}