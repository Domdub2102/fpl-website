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
            console.log("restored player")
        }
        else {
            updatedSquad = removePlayer(clickedPlayer, currentSquad)
            setRemovedPlayers(prevRemovedPlayers => [
                ...prevRemovedPlayers,
                clickedPlayer
            ])
            console.log("removed player")
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

    // disable removedbtn when sub in progress:
    const removeBtnDisabledClass = subInProgress ? "pointer-events-none" : ""

    function subBtnDisabledClass(player: Player) {
        if (removedPlayers.length > 0) {
            return "opacity-40 pointer-events-none"
        }
        if (subInProgress && !player.ableToSub) {
            return "pointer-events-none"
        }
        return ""
    }

    return (
        <div key={player.id} className="relative">                                    
            <HoverInfo 
                trigger={
                    <button 
                        className={`${removeBtnDisabledClass} absolute top-[3px] right-[3px] btn btn-circle shadow-none w-[15px] h-[15px] m-0 pb-[3px] z-10`}
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
                        className={`${subBtnDisabledClass(player)} absolute top-[3px] left-[3px] btn btn-circle bg-none border-none shadow-none w-[15px] h-[15px] m-0 z-10`}
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