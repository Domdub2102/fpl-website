'use client'

import React from 'react'
import { PlayerDialog } from '../PlayerDialog/PlayerDialog'
import { useSquad } from '@/lib/context/SquadContext'
import Image from 'next/image'
import { Player } from '@/types/types'


export default function PlayersTable () { 

    const { players } = useSquad()

    console.log(players.slice(0,1))

    const [currentPage, setCurrentPage] = React.useState(1)
    const pageSize = 10
    const startIndex = pageSize * (currentPage - 1)
    const endIndex = startIndex + pageSize
    const totalPages = Math.ceil(players.length / pageSize)

    const slicedPlayers = players.slice(startIndex, endIndex)

    function nextPageClick() {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1)
        }
    }

    function prevPageClick() {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1)
        }
    }

    const positionDict: { [key: number]: {position:string}} = {
        1: {position: "GKP"},
        2: {position: "DEF"},
        3: {position: "MID"},
        4: {position: "FWD"}
    }

    const playerDetails = (player: Player) => {
        const position = positionDict[player.position].position
        return (
            <td>
                <div className='flex items-center gap-3'>
                    <Image 
                        src={`/KitIcons/${player.team_name} Front.png`}
                        alt={`${player.team_name} Kit Icon`}
                        width={50} 
                        height={50}
                        className="w-10 h-10 object-contain" // tailwind sizing
                    />
                    <div className='flex flex-col'>
                        <p className='font-semibold text-[15px]'>{player.web_name}</p>
                        <div className='flex flex-row gap-3 text-[13px]'>
                            <p>{player.team_short_name}</p>
                            <p>{position}</p>
                        </div>
                    </div>
                </div>
            </td>
        )
    }

    return (
        <div>
            <table className='table'>
                <thead className='text-black'>
                    <tr>
                        <th className=''></th>
                        <th></th>
                        <th className=''>£</th>
                        <th className=''>**</th>
                    </tr>
                </thead>
                <tbody>
                    {slicedPlayers.map(player => {
                        return (
                            // need to add an onclick function here to select a player 
                            <tr 
                                className='items-center'
                                key={player.id} 
                            >
                                <td>
                                    <PlayerDialog 
                                        player={player} 
                                        openDialog={
                                            <div className='btn btn-circle shadow-none w-[15px] h-[15px]'>
                                                +
                                            </div>
                                        }
                                    />
                                </td>
                                {playerDetails(player)}
                                <td >{player.now_cost}</td>
                                <td >{player.total_points}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='flex mt-[10px] justify-between px-[5px] items-center'>
                <button className='btn w-[80px]' onClick={() => prevPageClick()}>Previous</button>
                <span className='text-[14px] font-[600]'>Page {currentPage} of {totalPages}</span>
                <button className='btn w-[80px]' onClick={() => nextPageClick()}>Next</button>
            </div>
        </div>
    )
}