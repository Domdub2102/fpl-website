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

    const [squadValue, setSquadValue] = React.useState("0")

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

    React.useEffect(() => {
        let squadValue = 0
        currentSquad.firstEleven.forEach(player => {
            squadValue += player.now_cost
        })
        currentSquad.subs.forEach(player => {
            squadValue += player.now_cost
        })
        setSquadValue(squadValue.toFixed(1))
    }, [currentSquad])

    
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
        <div className='flex flex-col md:w-3/5 lg:w-2/3 box-border'>
            <div className='flex flex-col lg:basis-2/3 px-1 sm:px-2 lg:p-[10px] bg-teal-200 shadow-lg justify-start items-center pb-43 sm:pb-42 md:pb-24 lg:pb-25'>
                <div className='flex flex-row justify-between w-full items-center my-[10px] sm:px-3 md:px-3 lg:px-[10px]'>
                    {/* onClick functions required */}
                    <button onClick={() => prevGameweek(gameweek)} className='btn w-[80px] lg:w-[100px]'>Previous</button>
                    <div className="flex flex-col items-center">
                        <span className='font-[600] text-[20px]'>{`Gameweek ${gameweek.id}`}</span>
                        <span>{`${format(gameweek.deadline_time, "EEE dd MMM, HH:mm")}`}</span>
                    </div>
                    <button onClick={() => nextGameweek(gameweek)} className='btn w-[80px] lg:w-[100px]'>Next</button>
                </div>
                <div className='flex my-[10px]'>
                    <span>Squad Value: £{squadValue}</span>
                </div>
                <div
                    className="w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[868px] xl:h-[900px] bg-cover bg-center flex flex-col items-center lg:gap-5"
                    style={{ backgroundImage: "url(/pitch3.svg)" }}
                >
                    {/* Render firstEleven players by position */}
                    {[1, 2, 3, 4].map(position => (
                        <div key={position} className="flex flex-row gap-2 pb-2 md:gap-3 lg:gap-[20px]">
                            {currentSquad.firstEleven.filter(player => player.position === position).map(player => (
                                <PlayerDialog 
                                    key={player.id}
                                    player={player}
                                    openDialog={<PlayerIcon player={player}/>}
                                />
                            ))}
                        </div>
                    ))}

                    {/* Render subs */}
                    <div className="flex flex-col items-center bg-[#03ba5b] rounded sm:pt-1 md:py-3 lg:pt-7 xl:pt-3 mt-4 w-full">
                        <div className="flex flex-row gap-[20px]">
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
                        <h2 className="text-[18px] font-semibold py-1 sm:py-3 md:mt-2 lg:mt-3">Substitutes</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
