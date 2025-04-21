'use client'

import React from "react"
import PlayersTable from "./PlayersTable"
import { Player, Team } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"

export default function PlayerSelector({ 
    players, teams 
}: {
    players: Player[], teams: Team[]
}) {

    const { setPlayers } = useSquad()

    React.useEffect(() => {
        setPlayers(players)
    }, [])

    const priceOptions = []
    for (let i = 3.8; i < 15.0; i+=0.5) {
        priceOptions.unshift(i)
    }
    return (
        <div className="pr-[20px] w-1/3 bg-[#c0fcf7]">
            <div className='flex flex-col basis-1/3 p-[10px] bg-teal-200 shadow-lg'>
                <h3 className='text-[30px] font-[800] mb-[20px]'>Player Selection</h3>
                <label htmlFor='players' className='font-[600]'>View</label>
                <select name="players" id="players" className='bg-teal-100 mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'>
                    <optgroup label='Global'>
                        <option>All Players</option>
                    </optgroup>
                    <optgroup label='By Position'>
                        <option>Goalkeepers</option>
                        <option>Defenders</option>
                        <option>Midfielders</option>
                        <option>Attackers</option>
                    </optgroup>
                    <optgroup label='By Team'>
                        {teams.map((team: Team) => <option key={team.name}>{team.name}</option>)}
                    </optgroup>
                </select>
                <label htmlFor='sort' className='font-[600]'>Sort</label>
                <select name="sort" id="sort" className='bg-teal-100 mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'>
                    <option>Total Points</option>
                    <option>Price</option>
                    <option>xG</option>
                    <option>xA</option>
                </select>
                <label htmlFor='maxPrice' className='font-[600]'>Max. Price</label>
                <select name="maxPrice" id="maxPrice" className='bg-teal-100 mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'>
                    {priceOptions.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
                <label htmlFor="player-search" className='font-[600]'>Search Player</label>
                <input id="player-search" placeholder='Player Search' className='bg-teal-100 mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'></input>
                <PlayersTable 
                    players={players}
                />
            </div>
        </div>
    )
}
