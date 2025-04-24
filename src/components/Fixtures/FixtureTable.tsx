'use client'

import React from "react"
import { Team } from "@/types/types"
import ToggleButton from "./ToggleButton"


export default function FixtureTable(
    { teams }: { teams: Team[] }
) {

    const [isAttack, setIsAttack] = React.useState(true)

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
            <div className="overflow-auto h-[800px] w-[80%] border-2 border-black rounded-sm">
                <table className="table-auto border-spacing-none w-full">
                    <thead>
                        <tr>
                            <th className="min-w-[160px] bg-black sticky left-0 top-0 z-10 text-gray-400 text-left text-lg px-5">Team</th>
                            {[...Array(38)].map((_, i) => {
                                return (
                                    <td 
                                        key={i}
                                        className="min-w-[120px] p-2 sticky top-0 text-center text-white bg-black font-semibold"
                                    >
                                        GW{i + 1}
                                    </td>
                                )
                            })}
                            <th className="min-w-[120px] p-2 text-center cursor-pointer sticky right-0 top-0 z-10 bg-black text-white">xG Total</th>
                        </tr>                    
                    </thead>
                    <tbody>
                        {teams.map((team: Team) => {
                            return (
                                <tr key={team.id}>
                                    <th className="px-5 text-lg m-1 font-bold sticky left-0 text-white bg-black">{team.name}</th>
                                    {team.fixtures.map((fixture, index) => {
                                        // can perform manual xg / xga calculations here if required
                                        const bgColor = fixture.xGper90 > 1.5 ? "bg-red-400": "bg-green-400"
                                        return (
                                            <td key={index} className="p-[6px]">
                                                <div className={`${bgColor} rounded-md text-center text-black p-4`}>
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-semibold text-[16px]">{fixture.opponent_short} ({fixture.home_away})</span>
                                                        <div>
                                                            <span className="text-sm">xG: {fixture.xGper90.toFixed(2)}</span>
                                                        </div>                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        )
                                    })}
                                    <th className="px-4 py-2 m-1 text-center text-white text-lg font-bold sticky right-0 bg-black">{team.xG}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>   
    )
}