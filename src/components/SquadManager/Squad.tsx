'use client'

import React from "react"
import { swapPlayers, transferPlayer } from "@/lib/utils/utils"
import { PlayerDialog } from "../PlayerDialog/PlayerDialog"
import PlayerIcon from "../PlayerIcon/PlayerIcon"
import { Gameweek, SquadType, Team } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"
import { format } from "date-fns"


export default function Squad(
    { 
        initialSquad, 
        teams, 
        gameweeks 
    }: 
    { 
        initialSquad: SquadType, 
        teams: Team[], 
        gameweeks: Gameweek[]
    }
) {
    const { 
        currentSquad, 
        setCurrentSquad, 
        startingPlayer,
        setStartingPlayer,
        subPlayer, 
        setSubPlayer, 
        transferIn,
        setTransferIn,
        transferOut,
        setTransferOut,
        gameweek,
        setGameweek
    } = useSquad()

    // find first gameweek which has a future deadline (ie. the current gameweek)
    const now = new Date()
    const currentGameweek = gameweeks.find(gameweek => Date.parse(gameweek.deadline_time) > now.getTime())

    React.useEffect(() => {
        if (currentGameweek) {
            setGameweek(currentGameweek)
        }
        setCurrentSquad(initialSquad)
    }, [])

    React.useEffect(() => {
        if (startingPlayer && subPlayer) {
            const updatedSquad = swapPlayers(startingPlayer, subPlayer, currentSquad)
            setCurrentSquad(updatedSquad)
            setStartingPlayer(undefined)
            setSubPlayer(undefined)
        }
    }, [startingPlayer, subPlayer])

    React.useEffect(() => {
        if (transferIn && transferOut) {
            const updatedSquad = transferPlayer(currentSquad, teams, transferIn, transferOut)
            setCurrentSquad(updatedSquad)
            setTransferIn(undefined)
            setTransferOut(undefined)
        }
    }, [transferIn, transferOut])

    
    function prevGameweek(gameweek: Gameweek) {
        // check that prevGameweek is not below 1
        // find previous gw in gameweeks array, then update the value of state
        if (gameweek.id > 1) {
            const prevGameweek = gameweeks.find(gw => gw.id === gameweek.id - 1)
            if (prevGameweek) {
                setGameweek(prevGameweek)
            }
        }
    }

    function nextGameweek(gameweek: Gameweek) {
        // check that prevGameweek is not below 1
        // find previous gw in gameweeks array, then update the value of state
        if (gameweek.id > 1) {
            const nextGameweek = gameweeks.find(gw => gw.id === gameweek.id + 1)
            if (nextGameweek) {
                setGameweek(nextGameweek)
            }
        }
    }

    return (
        <div className='flex flex-col w-2/3 box-border'>
            <div className='flex flex-col basis-2/3 p-[10px] bg-[#c0fcf7] shadow-lg justify-start items-center pl-[100px] pb-[100px]'>
                <div className='flex flex-row justify-around w-[80%] items-center my-[10px]'>
                    {/* onClick functions required */}
                    <button onClick={() => prevGameweek(gameweek)} className='btn'>Previous</button>
                    <div className="flex flex-col items-center">
                        <span className='font-[600] text-[20px]'>{`Gameweek ${gameweek.id}`}</span>
                        <span>{`${format(gameweek.deadline_time, "EEE dd MMM, HH:mm")}`}</span>
                    </div>
                    <button onClick={() => nextGameweek(gameweek)} className='btn'>Next</button>
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
                        <div key={position} className="flex flex-row gap-[30px]">
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
