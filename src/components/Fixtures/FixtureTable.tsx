'use client'

import React from "react"
import { TeamXG } from "@/types/types"
import ToggleButton from "./ToggleButton"


export default function FixtureTable(
    { teams }: { teams: TeamXG[] }
) {

    const [isAttack, setIsAttack] = React.useState(false)

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="flex w-[80%] pb-2 justify-between">
                <ToggleButton isAttack={isAttack} setIsAttack={setIsAttack}/>
                <div className='relative w-[220px] h-[50px]'>
                    <span className='absolute top-[3px] left-1 font-[500]'>Key:</span>
                    <div className='absolute right-0 w-4/5 h-3/5 grid grid-cols-5 font-bold gap-[1px]'>
                        <div className='border-none rounded-sm bg-green-700 flex items-center justify-center'>1</div>
                        <div className='border-none rounded-sm bg-green-300 text-black flex items-center justify-center'>2</div>
                        <div className='border-none rounded-sm bg-gray-300 text-black flex items-center justify-center'>3</div>
                        <div className='border-none rounded-sm bg-red-400 text-black flex items-center justify-center'>4</div>
                        <div className='border-none rounded-sm bg-red-700 flex items-center justify-center'>5</div>
                    </div>
                    <span className='absolute left-[45px] bottom-0 font-[500]'>Easy</span>
                    <span className='absolute right-0 bottom-0 font-[500]'>Hard</span>
                </div>
            </div>
            <div className="overflow-auto h-[800px] w-[80%] border-2 border-teal-200 rounded-sm bg-teal-200 shadow-lg">
                <table className="table-auto border-spacing-none w-full">
                    <thead>
                        <tr>
                            <th className="min-w-[170px] bg-teal-200 sticky left-0 top-0 z-10 text-black text-left text-lg px-5">Team</th>
                            {[...Array(38)].map((_, i) => {
                                return (
                                    <td 
                                        key={i}
                                        className="min-w-[140px] p-2 sticky top-0 text-center text-black bg-teal-200 font-semibold"
                                    >
                                        GW{i + 1}
                                    </td>
                                )
                            })}
                            <th className="min-w-[120px] p-2 text-center cursor-pointer sticky right-0 top-0 z-10 bg-teal-200 text-black">xG Total</th>
                        </tr>                    
                    </thead>
                    <tbody>
                        {teams.map((team: TeamXG) => {

                            return (
                                <tr key={team.id}>
                                    <th className="px-5 text-lg m-1 font-bold sticky left-0 text-black bg-teal-200">{team.name}</th>
                                                                      
                                    {Object.entries(team.fixtures).map(([gw, fixture], index) => {
                                        
                                        // returns a blank space (with a hyphen) for a blank fixture
                                        if (gw && fixture.length === 0) {
                                            return (    
                                                <td key={index} className="text-center">
                                                    -
                                                </td>
                                            )
                                        }
                                        // can perform manual xg / xga calculations here if required
                                        if (fixture.length === 1) {
                                            const bgColor = fixture[0].xGper90 > 1.5 ? "bg-red-400": "bg-green-400"
                                            return (
                                                <td key={index} className="p-[6px]">
                                                    <div className={`${bgColor} rounded-md text-center text-black p-4`}>
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-semibold text-[16px]">{fixture[0].opponent_short} ({fixture[0].home_away})</span>
                                                            <div>
                                                                <span className="text-sm">xG: {Number(fixture[0].xGper90).toFixed(2)}</span>
                                                            </div>                                                    
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        }
                                        if (fixture.length === 2) {
                                            const bgColor1 = fixture[0].xGper90 > 1.5 ? "bg-red-400": "bg-green-400"
                                            const bgColor2 = fixture[1].xGper90 > 1.5 ? "bg-red-400": "bg-green-400"
                                            return (
                                                <td key={index} className="p-[6px]">
                                                    <div className="flex flex-row gap-1 w-full">
                                                        <div className={`${bgColor1} rounded-md text-center text-black w-1/2 py-[18px]`}>
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-semibold text-[15px]">{fixture[0].opponent_short} ({fixture[0].home_away})</span>
                                                                <span className="text-[14px]">xG: {Number(fixture[0].xGper90).toFixed(2)}</span>                                                  
                                                            </div>
                                                        </div>
                                                        <div className={`${bgColor2} rounded-md text-center text-black w-1/2 py-[18px]`}>
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-semibold text-[15px]">{fixture[1].opponent_short} ({fixture[1].home_away})</span>
                                                                <span className="text-[14px]">xG: {Number(fixture[1].xGper90).toFixed(2)}</span>                                      
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        }
                                        
                                    })}
                                    <th className="px-4 py-2 m-1 text-center text-black text-lg font-bold sticky right-0 bg-teal-200">{team.xG}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>   
    )
}