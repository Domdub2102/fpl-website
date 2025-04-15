'use client'

import React from 'react'
import Squad from './Squad'
import PlayersTable from './PlayersTable'
import { transferPlayer } from '@/utils/utils'
import { PlayerDialog } from '@/components/PlayerDialog/PlayerDialog'

export default function SquadManager({ squad, players, teams }) {
    const [squadState, setSquadState] = React.useState(squad);
    const [selectedPlayers, setSelectedPlayers] = React.useState([]);

    const [oldPlayer, setOldPlayer] = React.useState()
    const [newPlayer, setNewPlayer] = React.useState()

    function makeTransfer() {
        const updatedSquad = transferPlayer(squadState, newPlayer, oldPlayer)
        console.log(updatedSquad)
        if (updatedSquad) {
            setSquadState(updatedSquad)
        }
        setOldPlayer(undefined)
        setNewPlayer(undefined)
    }

      // can generate these from the player data as well
    const priceOptions = []
    for (let i = 3.8; i < 15.0; i+=0.5) {
        priceOptions.unshift(i)
    }
    return (
        <div className='flex flex-col w-full box-border px-[80px] bg-teal-100'>
            <h1 className='my-[20px] text-[40px] font-[800]'>Squad Planner</h1>
            <div className='flex flex-row w-full gap-[20px]'>
                <div className='flex flex-col basis-2/3 p-[10px] bg-teal-200 shadow-lg justify-start items-center'>
                    <div className='flex flex-row justify-around w-[80%] items-center my-[10px]'>
                        <button className='btn'>Previous</button>
                        <span className='font-[600] text-[20px]'>GW1</span>
                        <button className='btn'>Next</button>
                    </div>
                    <div className='flex flex-row justify-around w-[60%] my-[10px]'>
                        <span>Transfers: 0/1</span>
                        <span>Budget: $0.0 / $102.1</span>
                    </div>
                    <button onClick={() => makeTransfer()} className="btn btn-neutral">
                        Transfer
                    </button>
                    <PlayerDialog />
                    <Squad 
                        squadState={squadState} 
                        setSquadState={setSquadState} 
                        selectedPlayers={selectedPlayers} 
                        setSelectedPlayers={setSelectedPlayers}
                        oldPlayer={oldPlayer}
                        setOldPlayer={setOldPlayer}
                        newPlayer={newPlayer}
                        setNewPlayer={setNewPlayer}
                    />
                </div>
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
                        squadState={squadState} 
                        setSquadState={setSquadState} 
                        selectedPlayers={selectedPlayers} 
                        setSelectedPlayers={setSelectedPlayers}
                        newPlayer={newPlayer}
                        setNewPlayer={setNewPlayer}
                    />
                </div>
            </div>
        </div>
    )
}