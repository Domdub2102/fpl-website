'use client'

import React from "react"
import { TeamXG } from "@/types/types"
import ToggleButton from "./ToggleButton"
import Key from "./Key"
import GameweekSelector from "./GameweekSelector"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"


export default function FixtureTable(
    { teams }: { teams: TeamXG[] }
) {

    const [isAttack, setIsAttack] = React.useState(false)
    const [minGw, setMinGw] = React.useState(33)
    const [maxGw, setMaxGw] = React.useState(38)
    const [processedTeams, setProcessedTeams] = React.useState<TeamXG[]>([])
    const [sortDirection, setSortDirection] = React.useState('desc'); // 'asc' or 'desc'

    function getBgColor(rank: number) {
        if (rank >= 1 && rank <= 4) return "bg-red-700 text-gray-100"; // Dark Red
        if (rank >= 5 && rank <= 8) return "bg-red-400 text-black"; // Light Red
        if (rank >= 9 && rank <= 12) return "bg-gray-300 text-black"; // Grey
        if (rank >= 13 && rank <= 16) return "bg-green-300 text-black"; // Light Green
        if (rank >= 17 && rank <= 20) return "bg-green-700 text-gray-100"; // Dark Green
        else return ""
    }

    // allows teams to be sorted by their expected totals
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

    /**
     * BUG:
     * Need to combine the following functions
     * currently, clicking the xG total column resets the sort
     * Ideally, the chosen sort should stay the same
     */

    React.useEffect(() => {
        setProcessedTeams(updatedTeams)
    }, [minGw, maxGw])

    // handle clicks of the xgtotal column
    // need to sort by asc / desc 

    const sortTeamsByExpectedTotal = () => {
        // Toggle sort direction
        const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        setSortDirection(newDirection);
        
        // Create sorted copy of teams
        const sortedTeams = [...processedTeams].sort((a, b) => {
            if (newDirection === 'desc') {
            return b.expectedTotal - a.expectedTotal;
            } else {
            return a.expectedTotal - b.expectedTotal;
            }
        });
        
        // Update state with sorted teams
        setProcessedTeams(sortedTeams);
    };
    

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-row justify-between my-10 w-full">
                <h1 className="text-[35px] text-black font-[800]">Fixture Difficulty Ratings</h1>
                <Popover>
                    <PopoverTrigger className='cursor-pointer border border-gray-500 rounded-sm p-2 hover:bg-[#75d2ce] hover:text-black hover:border-none'>
                        <h3>Click for Explanation and Instructions</h3>
                    </PopoverTrigger>
                    <PopoverContent>
                        <h3 className='mb-3'>This tool allows FPL users to view Upcoming Fixture Difficulty using expected goals data (xG).</h3>
                        <p className='mb-3'>Use the Gameweek selector to adjust which fixtures are shown.</p>
                        <p className='mb-3'>Toggle between viewing fixtures from the perspective of Attackers or Defenders by viewing either xGA or xG of upcoming opponents.</p>
                        <p>Sort Fixtures by difficulty by clicking on the Opponent Total column. Remember: higher xGA is good for attackers, and lower xG is good for defenders.</p>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex w-full pb-2 justify-between items-end">
                <ToggleButton isAttack={isAttack} setIsAttack={setIsAttack}/>                
                <GameweekSelector minGw={minGw} setMinGw={setMinGw} maxGw={maxGw} setMaxGw={setMaxGw} />
                <Key />
            </div>
            <div className="overflow-auto h-[700px] w-full border-none rounded-sm bg-[#bffcf7] shadow-lg">
                <table className="table-auto border-spacing-none w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="min-w-[170px] bg-teal-200 sticky left-0 top-0 z-10 text-black text-left text-lg border-b-1 border-black">
                                <div className="pl-5">
                                    Team
                                </div> 
                            </th>
                            {[...Array(38)].map((_, i) => {
                                if ((i + 1) >= minGw && i < maxGw) {
                                    return (
                                        <td 
                                            key={i}
                                            className="min-w-[140px] py-5 sticky top-0 text-center text-black bg-teal-200 font-semibold border-b-1 border-black"
                                        >
                                            GW{i + 1}
                                        </td>
                                    )
                                }
                            })}
                            <th 
                                className="min-w-[140px] pl-[5px] text-center cursor-pointer sticky right-0 top-0 z-10 bg-teal-200 text-black border-b-1 border-black"
                                onClick={() => sortTeamsByExpectedTotal()}
                            >                                
                                {isAttack ? "xGA Total" : "xG Total"}
                            </th>
                        </tr>                    
                    </thead>
                    <tbody>
                        {processedTeams.map((team: TeamXG) => {
                            return (
                                <tr key={team.id}>
                                    <th className="min-w-[170px] text-lg font-bold sticky left-0 text-black bg-teal-200 border-b-1 border-black">
                                        <div className="py-[33px] pl-5 w-full h-full">
                                            {team.name}
                                        </div>                                        
                                    </th>
                                                                      
                                    {Object.entries(team.fixtures).map(([gw, fixture], index) => {
                                        
                                        if (Number(gw) >= minGw && Number(gw) <= maxGw) {                                        
                                            // returns a blank space (with a hyphen) for a blank fixture
                                            if (fixture.length === 0) {
                                                return (    
                                                    <td key={index} className="text-center text-black text-[30px] border-b-1 border-black">
                                                        -
                                                    </td>
                                                )
                                            }
                                            // can perform manual xg / xga calculations here if required
                                            if (fixture.length === 1) {
                                                const bgColor = isAttack ? getBgColor(fixture[0].xGARank) : getBgColor(fixture[0].xGRank)
                                                const fixtureXG = isAttack ? fixture[0].xGAper90 : fixture[0].xGper90
                                                return (
                                                    <td key={index} className="p-[7px] border-b-1 border-t-1 border-black">
                                                        <div className={`${bgColor} rounded-md text-center text-black p-4`}>
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-semibold text-[17px]">{fixture[0].opponent_short} ({fixture[0].home_away})</span>
                                                                <div>
                                                                    <span className="text-sm">{isAttack ? "xGA" : "xG"}: {fixtureXG.toFixed(1)}</span>
                                                                </div>                                                    
                                                            </div>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                            if (fixture.length === 2) {
                                                const bgColor1 = isAttack ? getBgColor(fixture[0].xGARank) : getBgColor(fixture[0].xGRank)
                                                const bgColor2 = isAttack ? getBgColor(fixture[1].xGARank) : getBgColor(fixture[1].xGRank)
                                                const fixtureXG1 = isAttack ? fixture[0].xGAper90 : fixture[0].xGper90
                                                const fixtureXG2 = isAttack ? fixture[1].xGAper90 : fixture[1].xGper90
                                                return (
                                                    <td key={index} className="p-[7px] border-b-1 border-black">
                                                        <div className="flex flex-row gap-1 w-full">
                                                            <div className={`${bgColor1} rounded-md text-center text-black w-1/2 py-[18px]`}>
                                                                <div className="flex flex-col items-center">
                                                                    <span className="font-semibold text-[15px]">{fixture[0].opponent_short} ({fixture[0].home_away})</span>
                                                                    <span className="text-[14px]">{isAttack ? "xGA" : "xG"}: {fixtureXG1.toFixed(1)}</span>                                                  
                                                                </div>
                                                            </div>
                                                            <div className={`${bgColor2} rounded-md text-center text-black w-1/2 py-[18px]`}>
                                                                <div className="flex flex-col items-center">
                                                                    <span className="font-semibold text-[15px]">{fixture[1].opponent_short} ({fixture[1].home_away})</span>
                                                                    <span className="text-[14px]">{isAttack ? "xGA" : "xG"}: {fixtureXG2.toFixed(1)}</span>                                      
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                        }
                                    })}
                                    
                                    <th className="min-w-[170px] text-lg font-bold sticky right-0 text-black bg-teal-200 border-b-1 border-black text-center">
                                        <div className="py-[33px]">
                                            {team.expectedTotal.toFixed(1)}
                                        </div>                                        
                                    </th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>   
    )
}