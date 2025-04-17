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

type Props = {
    player: Player
    openDialog: React.ReactNode
}


export function PlayerDialog({ player, openDialog }: Props) {

    const { setStartingPlayer, setSubPlayer, setCurrentSquad } = useSquad()

    function handleSubClick(
        selectedPlayer: Player
    ) {
        selectedPlayer.isSelected = true
        if (selectedPlayer.inFirstEleven) {
            setStartingPlayer(selectedPlayer)
        }
        if (selectedPlayer.inSubs) {
            setSubPlayer(selectedPlayer)
        }
        setCurrentSquad(prevSquad => {
            const updatedFirstEleven = prevSquad.firstEleven.map(player => 
                player.id === selectedPlayer.id ? {...player, isSelected: true} : player
            )
            const updatedSubs = prevSquad.subs.map(player => 
                player.id === selectedPlayer.id ? {...player, isSelected: true} : player
            )
            return {
                ...prevSquad,
                firstEleven: updatedFirstEleven,
                subs: updatedSubs
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>{openDialog}</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                    <DialogTitle className='text-center mb-5'>{player.first_name + " " + player.second_name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="">
                      <button onClick={() => handleSubClick(player)} className='btn btn-neutral'>Substitute</button>
                    </div>
                    <div className="">
                      <button className='btn btn-neutral'>Transfer</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}