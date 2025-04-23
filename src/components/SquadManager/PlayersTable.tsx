'use client'

import React from 'react'
import { PlayerDialog } from '../PlayerDialog/PlayerDialog'
import { useSquad } from '@/lib/context/SquadContext'
import PlayerDetails from './PlayerDetails'


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


    return (
        <div>
            <table className='table table-compact w-full'>
                <thead className='text-black'>
                    <tr className='p-0 m-0'>
                        <th className='w-1/8 p-0 pl-5'></th>
                        <th className='p-0 pl-5'></th>
                        <th className='w-1/8 p-0 pl-5'>£</th>
                        <th className='w-1/8 p-0 pl-5'>**</th>
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
                                            <div className='btn btn-circle shadow-none w-[15px] h-[15px] m-0 p-1'>
                                                +
                                            </div>
                                        }
                                    />
                                </td>
                                <PlayerDetails player={player} />
                                <td >{player.now_cost.toFixed(1)}</td>
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