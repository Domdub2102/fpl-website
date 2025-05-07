import React from 'react'
import { Player } from '@/types/types'
import { useSquad } from '@/lib/context/SquadContext'

interface TransferInProps {
    player: Player
    handleTransferClick: (player: Player) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TransferBtn({ player, handleTransferClick, setOpen }: TransferInProps) {

    const { removedPlayers } = useSquad()

    const btnText = (
        player.inFirstEleven || player.inSubs 
            ? player.isRemoved
                ? "Restore Player"
                : "Remove Player"
            : removedPlayers.length > 0 
                ? "Add to Squad"
                : "First remove players from squad"
    )

    return (
        <button 
            onClick={() => {
                handleTransferClick(player)
                setOpen(false)
            }}
            className={`btn btn-neutral w-full`}
        >
            {btnText}
        </button>
    ) 
}