import { Player } from '@/types/types'
import React from 'react'


interface SubBtnProps {
    player: Player
    subInProgress: boolean
    handleSubClick: (player: Player) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SubBtn({ player, subInProgress, handleSubClick, setOpen }: SubBtnProps) {

    const subBtnText = (
        subInProgress 
            ? player.isSelected 
                ? "Cancel"
                : "Complete Substitution"
            : "Substitute"
    )
   
    if (player.inFirstEleven || player.inSubs) {
        return (
            <button
                className='btn btn-neutral w-full mb-3'
                onClick={() => {
                    handleSubClick(player)
                    setOpen(false)
                }}
            >
                {subBtnText}
            </button>
        )
    }
    else return <div></div>
}