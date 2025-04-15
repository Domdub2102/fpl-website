'use client'

import React from 'react'

async function fetchPlayers() {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/players`
    const res = await fetch(url, {
        method: "GET"
    })

    if (!res.ok) {
        throw new Error("Failed to fetch players from internal server")
    }

    const data = await res.json()
    return data
}

export default function PlayersTable(
    { 
        players, 
        squadState, 
        setSquadState, 
        selectedPlayers, 
        setSelectedPlayers,
        newPlayer,
        setNewPlayer
    }
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

    function selectNewPlayerToSwap(player) {
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