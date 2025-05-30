import React from "react"
import Image from "next/image"
import { Player } from "@/types/types"
import { useSquad } from "@/lib/context/SquadContext"
import HoverInfo from "../HoverInfo"
import PlayerDialog from "../PlayerDialog/PlayerDialog"
import PlayerIcon  from "../PlayerIcon/PlayerIcon"
import { 
    playersAbleToSub, 
    completeSub, 
    removePlayer, 
    restorePlayer, 
} from "@/lib/utils/utils"

interface PlayerProps {
    player: Player
}

export default function PlayerCard({ player }: PlayerProps) {

    const {
        subInProgress,
        setSubInProgress,
        removedPlayers,
        setRemovedPlayers,
        currentSquad,
        setCurrentSquad,
    } = useSquad()

    function handleTransferClick(clickedPlayer: Player) {
        let updatedSquad: Player[] = []
        if (player.isRemoved) {
            updatedSquad = restorePlayer(clickedPlayer, currentSquad)
            setRemovedPlayers(prevRemovedPlayers => 
                prevRemovedPlayers.filter(player => player.id !== clickedPlayer.id)
            )
        }
        else {
            updatedSquad = removePlayer(clickedPlayer, currentSquad)
            setRemovedPlayers(prevRemovedPlayers => [
                ...prevRemovedPlayers,
                clickedPlayer
            ])
        }
        setCurrentSquad(updatedSquad)
    }

    function handleSubClick(player: Player) {
        if (!subInProgress) {
            setCurrentSquad(prevSquad => 
                playersAbleToSub(player, prevSquad)
            )
            setSubInProgress(true)
        }   
        else if (subInProgress) {
            setCurrentSquad(prevSquad => 
                completeSub(player, prevSquad)
            )
            setSubInProgress(false)
        }
    }

   
    const removeBtnDisabledClass = subInProgress ? "pointer-events-none opacity-55" : ""
    const subBtnDisabledClass = (removedPlayers.length > 0 || (subInProgress && !player.ableToSub) ) ? "pointer-events-none opacity-55" : ""

    const removeBtnActive = player.isRemoved ? "bg-amber-400 text-black border-none" : ""

    return (
        <div key={player.id} className="relative">                                    
            <HoverInfo 
                trigger={
                    <button 
                        className={`${removeBtnDisabledClass} ${removeBtnActive} hidden sm:flex absolute top-[3px] right-[3px] btn btn-circle shadow-none w-[15px] h-[15px] m-0 pb-[3px] z-10`}
                        onClick={() => handleTransferClick(player)}
                    >
                        x
                    </button> 
                }
                content={player.isRemoved ? "Restore" : "Remove"}
            /> 
            <HoverInfo 
                trigger={                    
                    <button 
                        className={`${subBtnDisabledClass} hidden sm:flex absolute top-[3px] left-[3px] btn btn-circle bg-none shadow-none w-[15px] h-[15px] m-0 z-10`}
                        onClick={() => handleSubClick(player)}
                    >
                        <Image 
                            src="/sub-icon3.png"
                            alt="sub-icon"
                            width={256}
                            height={256}    
                        />
                    </button> 
                }
                content={player.isSelected ? "Cancel" : "Substitute"}
            />

            <PlayerDialog 
                player={player}
                openDialog={<PlayerIcon player={player} />}
            />
        </div>
    )
}