import React from 'react'
import Image from 'next/image'

import { Player } from '@/types/types'


export default function PlayerIcon ({ player }: {player: Player}) {
  const fixture = `${player.fixtures[32].opponent_short} (${player.fixtures[32].home_away})`
  return (
    <div className='relative flex flex-col items-center text-center border-2 border-transparent rounded-md cursor-pointer hover:border-white'>
        <div className='w-[90px]'>
            <Image 
                src={`/KitIcons/${player.team_name} Front.png`}
                alt={`${player.team_name} Kit Icon`}
                width={3000}
                height={3000}
                className='w-full h-auto'
            />
        </div>
        <div className='flex flex-col items-center w-[140px]'>
            <span className="badge rounded-none w-full">{player.web_name}</span>
            <span className="badge rounded-none bg-cyan-200 border-none text-black w-full">{fixture}</span>
        </div>
    </div>
  )
}