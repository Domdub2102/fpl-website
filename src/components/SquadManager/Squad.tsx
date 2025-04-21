'use client'

import React from "react"
import { swapPlayers } from "@/lib/utils/utils"
import { PlayerDialog } from "../PlayerDialog/PlayerDialog"
import PlayerIcon from "../PlayerIcon/PlayerIcon"
import { SquadType } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"


export default function Squad({ initialSquad }: { initialSquad: SquadType }) {
    const { 
        currentSquad, 
        setCurrentSquad, 
        startingPlayer,
        setStartingPlayer,
        subPlayer, 
        setSubPlayer, 
    } = useSquad()

    React.useEffect(() => {
        setCurrentSquad(initialSquad)
    }, [initialSquad])

    React.useEffect(() => {
        if (startingPlayer && subPlayer) {
            const updatedSquad = swapPlayers(startingPlayer, subPlayer, currentSquad)
            setCurrentSquad(updatedSquad)
            setStartingPlayer(undefined)
            setSubPlayer(undefined)
        }
    }, [startingPlayer, subPlayer])

    return (
        <div className='flex flex-col w-2/3 box-border'>
            <div className='flex flex-col basis-2/3 p-[10px] bg-[#c0fcf7] shadow-lg justify-start items-center pl-[20px] pb-[100px]'>
                <div className='flex flex-row justify-around w-[80%] items-center my-[10px]'>
                    <button className='btn'>Previous</button>
                    <span className='font-[600] text-[20px]'>GW1</span>
                    <button className='btn'>Next</button>
                </div>
                <div className='flex flex-row justify-around w-[60%] my-[10px]'>
                    <span>Transfers: 0/1</span>
                    <span>Budget: $0.0 / $102.1</span>
                </div>
                <div
                    className="w-full h-[800px] bg-cover bg-center flex flex-col items-center gap-[10px]"
                    style={{ backgroundImage: "url(/pitch3.svg)" }}
                >
                    {/* Render firstEleven players by position */}
                    {[1, 2, 3, 4].map(position => (
                        <div key={position} className="flex flex-row gap-[10px]">
                            {currentSquad.firstEleven.filter(player => player.position === position).map(player => (
                                <PlayerDialog 
                                    key={player.id}
                                    player={player}
                                    // need to pass the isSelected updates here
                                    // porbably pass the squad as well?
                                    // or just update squad state then player icon accesses it
                                    openDialog={<PlayerIcon player={player}/>}
                                />
                            ))}
                        </div>
                    ))}

                    {/* Render subs */}
                    <div className="flex flex-row gap-[20px] mt-[50px]">
                        {currentSquad.subs.map(player => (
                            <PlayerDialog 
                                key={player.id}
                                player={player}
                                openDialog={
                                    <PlayerIcon player={player}/>
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
