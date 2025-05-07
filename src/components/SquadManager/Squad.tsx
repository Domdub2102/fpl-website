'use client'

import React from "react"
import { Gameweek, Player } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"
import { format } from "date-fns"
import { nextGameweek, prevGameweek } from '@/lib/utils/utils'
import PlayerCard from "./PlayerCard"

export default function Squad(
    { 
        initialSquad, 
        gameweeks 
    }: 
    { 
        initialSquad: Player[], 
        gameweeks: Gameweek[]
    }
) {

    const { 
        currentSquad, 
        setCurrentSquad, 
        gameweek,
        setGameweek
    } = useSquad()

    const [squadValue, setSquadValue] = React.useState("0")

    // find first gameweek which has a future deadline (ie. the current gameweek)
    const now = new Date()
    const currentGameweek = gameweeks.find(gameweek => Date.parse(gameweek.deadline_time) > now.getTime())

    // sets initial value of squad and gameweek on first render
    React.useEffect(() => {
        if (currentGameweek) {
            setGameweek(currentGameweek)
        }
        setCurrentSquad(initialSquad)
    }, [])

    // calculates squad value whenever currentSquad changes
    React.useEffect(() => {
        let squadValue = 0
        currentSquad.forEach(player => {
            squadValue += player.now_cost
        })
        setSquadValue(squadValue.toFixed(1))
    }, [currentSquad])
    

    function handleGameweekClick(nextPrevious: string) {
        let newGameweek
        if (nextPrevious === "next") {
            newGameweek = nextGameweek(gameweek, gameweeks)
        }
        else if (nextPrevious === "previous") {
            newGameweek = prevGameweek(gameweek, gameweeks)
        }
        if (newGameweek){
            setGameweek(newGameweek)
        }
        else return
    }

    const positionDict: { [key: number]: {position:string}} = {
        1: {position: "GKP"},
        2: {position: "DEF"},
        3: {position: "MID"},
        4: {position: "FWD"}
    }

    return (
        <div className='flex flex-col md:w-3/5 lg:w-2/3 box-border'>
            <div className='flex flex-col lg:basis-2/3 px-1 sm:px-2 lg:p-[10px] bg-teal-200 shadow-lg justify-start items-center pb-43 sm:pb-42 md:pb-24 lg:pb-25'>
                <div className='flex flex-row justify-between w-full items-center my-[10px] sm:px-3 md:px-3 lg:px-[10px]'>
                    {/* onClick functions required */}
                    <button onClick={() => handleGameweekClick("previous")} className='btn w-[80px] lg:w-[100px]'>Previous</button>
                    <div className="flex flex-col items-center">
                        <span className='font-[600] text-[20px]'>{`Gameweek ${gameweek.id}`}</span>
                        <span>{`${format(gameweek.deadline_time, "EEE dd MMM, HH:mm")}`}</span>
                    </div>
                    {/* Change onCLick to use next:string in func and put into one function */}
                    <button onClick={() => handleGameweekClick("next")} className='btn w-[80px] lg:w-[100px]'>Next</button>
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
                            {/* here we can simply filter the players with inFirstEleven === true */}
                            
                            {currentSquad.filter(player => player.position === position && player.inFirstEleven).map(player => (  
                                <div key={player.id}>
                                    <PlayerCard 
                                        player={player}
                                    />   
                                </div>                          
                            ))}
                        </div>
                    ))}

                    {/* Render subs */}
                    <div className="flex flex-col items-center bg-[#03ba5b] rounded sm:pt-1 md:py-3 lg:pt-7 xl:pt-3 mt-4 w-full">
                        <div className="flex flex-row gap-[20px]">
                            {currentSquad.filter(player => player.inSubs).map(player => (
                                <div key={player.id} className="flex flex-col items-center"> 
                                    <div className='lg:pb-1 font-semibold pl-0.5'>{positionDict[player.position].position}</div>
                                    <PlayerCard 
                                        player={player}
                                    />  
                                </div>
                            ))}
                        </div>
                        <h2 className="text-[18px] font-semibold py-1 sm:py-3 md:mt-2 lg:mt-3">Substitutes</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
