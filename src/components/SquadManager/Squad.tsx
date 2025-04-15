'use client'

import React from "react"
import { swapPlayers } from "@/utils/utils"
import { TestPlayerIcon } from "../PlayerIcon/TESTPlayerIcon"

/**
 * Problems:
 * need to put limits on the numbers of players in each position
 */

export default function Squad({ 
    squadState, 
    setSquadState, 
    selectedPlayers, 
    setSelectedPlayers,
    setOldPlayer
}) {

    // Ensure selectPlayer logic is correct (only add player if not already selected)
    function selectPlayerToSwap(newPlayer) {
        setSelectedPlayers(prevSelectedPlayers => {
            if (prevSelectedPlayers.some(player => player.id === newPlayer.id)) {
                return prevSelectedPlayers;
            } else {
                return [...prevSelectedPlayers, newPlayer];
            }
        });
    }

    function selectPlayerToTransfer(player) {
        setOldPlayer(player)
    }

    function completeSwap() {
        const updatedSquad = swapPlayers(selectedPlayers, squadState)

        if (updatedSquad) {
            setSquadState(updatedSquad)
            setSelectedPlayers([])
        } else {
            console.log("Invalid Swap")
            setSelectedPlayers([])
        }
    }

    // need to find the fixture(s) from the player.fixtures array
    // double gameweeks not currently displaying properly

    return (
        <div
            className="w-full h-[800px] bg-cover bg-center flex flex-col items-center gap-[10px]"
            style={{ backgroundImage: "url(/pitch3.svg)" }}
        >
            <button onClick={completeSwap} className="btn btn-neutral">
                SWAP
            </button>

            {/* Render firstEleven players by position */}
            {[1, 2, 3, 4].map(position => (
                <div key={position} className="flex flex-row gap-[10px]">
                    {squadState.firstEleven.filter(player => player.position === position).map(player => (
                        <TestPlayerIcon 
                            key={player.id}
                            player={player}
                            selectPlayerToSwap={selectPlayerToSwap}
                            selectPlayerToTransfer={selectPlayerToTransfer}
                        />
                    ))}
                </div>
            ))}

            {/* Render subs */}
            <div className="flex flex-row gap-[20px] mt-[50px]">
                {squadState.subs.map(player => (
                    <TestPlayerIcon 
                        key={player.id}
                        player={player}
                        selectPlayerToSwap={selectPlayerToSwap}
                        selectPlayerToTransfer={selectPlayerToTransfer}
                    />
                ))}
            </div>
        </div>
    );
}
