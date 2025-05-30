'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { useSquad } from '@/lib/context/SquadContext'
import { Player } from '@/types/types'
import SubBtn from '../SquadManager/SubBtn'
import TransferBtn from '../SquadManager/TransferBtn'
import { 
    removePlayer, 
    restorePlayer, 
    completeSquadTransfer, 
    playersAbleToSub, 
    completeSub 
} from '@/lib/utils/utils'

type Props = {
    player: Player
    openDialog: React.ReactNode
}

export default function PlayerDialog({ player, openDialog }: Props) {

    const { 
        subInProgress,
        setSubInProgress,
        currentSquad,
        setCurrentSquad,
        removedPlayers,
        setRemovedPlayers,
    } = useSquad()

    const [open, setOpen] = React.useState(false)

    function handleTransferClick(clickedPlayer: Player) {
        let updatedSquad: Player[] = []
        if (clickedPlayer.inFirstEleven || clickedPlayer.inSubs) {
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
        }
        // this section for players in the table, not the squad
        else {
            // if clicked player already in the current squad
            if (currentSquad.find(player => player.id === clickedPlayer.id)) {
                console.log(`${player.web_name} already in squad`)
                setRemovedPlayers(prevRemovedPlayers => 
                    prevRemovedPlayers.filter(player => player.id !== clickedPlayer.id)
                )
                updatedSquad = restorePlayer(clickedPlayer, currentSquad)
            }
            else {
                updatedSquad = completeSquadTransfer(clickedPlayer, removedPlayers, currentSquad)
                if (updatedSquad !== currentSquad) {
                    const removedPlayer = removedPlayers.find(player => player.position === clickedPlayer.position)
                    if (removedPlayer) {
                        setRemovedPlayers(prevRemovedPlayers => 
                            prevRemovedPlayers.filter(player => player.id !== removedPlayer.id)
                        )
                    }
                }
            }
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
    /**
     * TODO:
     * Disable sub button in dialog when remove players is active
     */
 
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button 
                    onClick={() => setOpen(true)}
                    disabled={subInProgress && !player.ableToSub}
                >
                    {openDialog}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                    <DialogTitle className='text-center mb-5'>{player.first_name + " " + player.second_name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center">
                    {removedPlayers.length > 0 
                        ? <div></div>
                        : <SubBtn 
                            player={player}
                            subInProgress={subInProgress}
                            handleSubClick={handleSubClick}
                            setOpen={setOpen}
                        />
                    }
                    {subInProgress 
                        ? <div></div>
                        : <TransferBtn 
                            player={player} 
                            handleTransferClick={handleTransferClick} 
                            setOpen={setOpen}
                        />
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}