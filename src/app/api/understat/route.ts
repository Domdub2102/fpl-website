// returns teams array with xg and xga data

import { NextResponse } from "next/server";
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
}

interface RawTeamData {
    title: string;
    history: MatchStats[];
}


export async function GET() {
    try {
        const URL = "https://understat.com/league/epl";
        const { data } = await axios.get(URL);
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
            console.error("❌ teamsData script not found.");
            return NextResponse.json({ error: "Failed to find teamsData" }, { status: 500 });
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
          }));
          

        // Replace strings which don't match other data from FPL API
        const replacements: Record<string, string> = {
            "Tottenham": "Spurs",
            "Manchester United": "Man Utd",
            "Manchester City": "Man City",
            "Nottingham Forest": "Nott'm Forest",
            "Wolverhampton Wanderers": "Wolves"
        }
        
        const updatedTeams: Team[] = teamStats.map((team: Team): Team => {
            const updatedTeam: Team = { ...team };
          
            updatedTeam.name = replacements[updatedTeam.name] || updatedTeam.name;
          
            return updatedTeam;
        });

        return NextResponse.json(updatedTeams, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}