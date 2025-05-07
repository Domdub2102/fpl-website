import React from 'react'
import { Player } from '@/types/types'

interface TransferInProps {
    player: Player
    handleTransferClick: (player: Player) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TransferBtn({ player, handleTransferClick, setOpen }: TransferInProps) {

    return (
        <button 
            onClick={() => {
                handleTransferClick(player)
                setOpen(false)
            }}
            className={`btn btn-neutral w-full`}
        >
            {player.isRemoved ? "Restore Player": "Add to Squad"}
        </button>
    ) 
}