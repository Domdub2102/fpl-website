'use client'

import React from 'react'
import { Player } from '@/types/types'

interface Props {
    players: Player[]
    setNewPlayer: React.Dispatch<React.SetStateAction<Player| undefined>>
}

export default function PlayersTable (
    { players, setNewPlayer}: Props
) { 

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

    function selectNewPlayerToSwap(player: Player) {
        setNewPlayer(player)
    }

    return (
        <div>
            <table className='table'>
                <thead className='text-black'>
                    <tr>
                        <th>Name</th>
                        <th className='w-1/6'>£</th>
                        <th className='w-1/6'>**</th>
                    </tr>
                </thead>
                <tbody>
                    {slicedPlayers.map(player => {
                        return (
                            // need to add an onclick function here to select a player 
                            <tr 
                                key={player.id} 
                                className='cursor-pointer border-gray-300'
                                onClick={() => selectNewPlayerToSwap(player)}
                            >
                                <td>{player.web_name}</td>
                                <td >{player.price}</td>
                                <td >{player.total_points}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='flex mt-[10px] justify-between px-[15px] items-center'>
                <button className='btn' onClick={() => prevPageClick()}>Previous</button>
                <span className='text-[14px] font-[600]'>Page {currentPage} of {totalPages}</span>
                <button className='btn' onClick={() => nextPageClick()}>Next</button>
            </div>
        </div>
    )
}