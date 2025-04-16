'use client'

import React from "react"
import { swapPlayers } from "@/lib/utils/utils"
import { PlayerDialog } from "../PlayerDialog/PlayerDialog"
import PlayerIcon from "../PlayerIcon/PlayerIcon"
import { SquadType, Player } from "@/types/types"

/**
 * Problems:
 * need to put limits on the numbers of players in each position
 */
interface SquadPropTypes {
    squadState: SquadType
    setSquadState: React.Dispatch<React.SetStateAction<SquadType>>
    selectedPlayers: Player[]
    setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>
}

export default function Squad({ 
    squadState, 
    setSquadState, 
    selectedPlayers, 
    setSelectedPlayers,
}: SquadPropTypes) {

    /* ADD THESE FUNCTIONS BACK TO THE NEW DIALOG FEATURE
    function selectPlayerToSwap(newPlayer: Player) {
        setSelectedPlayers(prevSelectedPlayers => {
            if (prevSelectedPlayers.some(player => player.id === newPlayer.id)) {
                return prevSelectedPlayers;
            } else {
                return [...prevSelectedPlayers, newPlayer];
            }
        });
    }

    function selectPlayerToTransfer(player: Player) {
        setOldPlayer(player)
    }
    */

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
                        <PlayerDialog 
                            key={player.id}
                            player={player}
                            openDialog={<PlayerIcon player={player}/>}
                        />
                    ))}
                </div>
            ))}

            {/* Render subs */}
            <div className="flex flex-row gap-[20px] mt-[50px]">
                {squadState.subs.map(player => (
                    <PlayerDialog 
                        key={player.id}
                        player={player}
                        openDialog={
                            <PlayerIcon player={player}/>
                        }
                    />
                ))}
            </div>
        </div>
    );
}
