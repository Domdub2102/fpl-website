'use client'

import React from 'react'
import PlayerDialog from '../PlayerDialog/PlayerDialog'
import { useSquad } from '@/lib/context/SquadContext'
import PlayerRow from './PlayerRow'

interface PlayersTableProps {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function PlayersTable({ currentPage, setCurrentPage }: PlayersTableProps) { 

    const { players } = useSquad()

    const pageSize = 14
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

    return (
        <div>
            <table className='w-full'>
                <thead className='text-black'>
                    <tr >
                        <th className='w-3/4'></th>
                        <th className='w-1/8'>£</th>
                        <th className='w-1/8'>**</th>
                    </tr>
                </thead>
                <tbody>
                    {slicedPlayers.map(player => {
                        return (
                            // need to add an onclick function here to select a player 
                            <tr key={player.id}>
                                <td className='border-b-1 border-gray-400 py-[2px]'>
                                    <PlayerDialog 
                                        player={player} 
                                        openDialog={
                                            <PlayerRow player={player}/>
                                        }
                                    />  
                                </td>
                                <td className='border-b-1 border-gray-400 text-center text-sm py-[2px]'>{player.now_cost.toFixed(1)}</td>
                                <td className='border-b-1 border-gray-400 text-center text-sm py-[2px]'>{player.total_points}</td>
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