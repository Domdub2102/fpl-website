'use client'

import React from "react"
import PlayersTable from "./PlayersTable"
import { Player, Team } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"
import { filterPlayers } from "@/lib/utils/utils"

export default function PlayerSelector({ 
    initialPlayers, teams 
}: {
    initialPlayers: Player[], teams: Team[]
}) {

    const isFirstRender = React.useRef(true)

    const { setPlayers } = useSquad()

    const [view, setView] = React.useState("All Players")
    const [sort, setSort] = React.useState("Total Points")
    const [maxPrice, setMaxPrice] = React.useState(15.0)
    const [searchInput, setSearchInput] = React.useState("")

    // sets the initial state of the players array
    React.useEffect(() => {
        setPlayers(initialPlayers)
    }, [])


    React.useEffect(() => {
        // doesnt run on first render to fill players array with initialPlayers
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        } else {
            const filteredPlayers = filterPlayers(view, sort, maxPrice, initialPlayers)
            const searchedPlayers = filteredPlayers?.filter(player => 
                player.web_name.toLowerCase().includes(searchInput.toLowerCase()) 
                || player.first_name.toLowerCase().includes(searchInput.toLowerCase()) 
                || player.second_name.toLowerCase().includes(searchInput.toLowerCase()) 
            )
            if (searchedPlayers) {
                setPlayers(searchedPlayers)
            }
        }
    }, [view, sort, maxPrice, searchInput])

    // filters the players based on the player search input 
    React.useEffect(() => {
        // first, add an onChange to the input, to set the searchInput state
        // then, use the searchInput value to filter the players state
        console.log(searchInput)
        
    }, [searchInput])


    const priceOptions = []
    for (let i = 3.8; i < 15.0; i+=0.5) {
        priceOptions.unshift(i)
    }
    return (
        <div className="pr-[100px] w-1/3 bg-[#c0fcf7]">
            <div className='flex flex-col basis-1/3 p-[10px] bg-teal-200 shadow-lg'>
                <h3 className='text-[30px] font-[800] mb-[20px]'>Player Selection</h3>

                <label htmlFor='players' className='font-[600]'>View</label>
                <select 
                    name="players" 
                    id="players" 
                    className='bg-[#c0fcf7] mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'
                    onChange={e => setView(e.target.value)}
                >
                    <optgroup label='Global'>
                        <option value="All Players">All Players</option>
                    </optgroup>
                    <optgroup label='By Position'>
                        <option value="Goalkeepers">Goalkeepers</option>
                        <option value="Defenders">Defenders</option>
                        <option value="Midfielders">Midfielders</option>
                        <option value="Attackers">Attackers</option>
                    </optgroup>
                    <optgroup label='By Team'>
                        {teams.map((team: Team) => 
                            <option key={team.name} value={team.name}>
                                {team.name}
                            </option>
                        )}
                    </optgroup>
                </select>

                <label htmlFor='sort' className='font-[600]'>Sort</label>
                <select 
                    name="sort" 
                    id="sort" 
                    className='bg-[#c0fcf7] mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="Total Points">Total Points</option>
                    <option value="Price">Price</option>
                    <option disabled value="xG">xG</option>
                    <option disabled value="xA">xA</option>
                </select>

                <label htmlFor='maxPrice' className='font-[600]'>Max. Price</label>
                <select 
                    name="maxPrice" 
                    id="maxPrice" 
                    className='bg-[#c0fcf7] mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'
                    onChange={e => setMaxPrice(parseFloat(e.target.value))}
                >
                    {priceOptions.map(value => 
                        <option key={value} value={value}>
                            {value}
                        </option>
                    )}
                </select>

                <label htmlFor="player-search" className='font-[600]'>Search Player</label>
                <input 
                    id="player-search" 
                    placeholder='Player Search' 
                    className='bg-[#c0fcf7] mb-[15px] p-[5px] text-[14px] font-[400] rounded-sm'
                    onChange={e => setSearchInput(e.target.value)}
                />
                <PlayersTable />
            </div>
        </div>
    )
}
