import React from 'react'
import Image from 'next/image'

export default function PlayerIcon({ name, team, fixture, selectPlayerToSwap, selectPlayerToTransfer }) {
  return (
    <div className='relative flex flex-col items-center text-center border-2 border-transparent rounded-md hover:border-white'>
        <div className='w-[90px]'>
            <Image 
                src={`/KitIcons/${team} Front.png`}
                alt={`${team} Kit Icon`}
                width={3000}
                height={3000}
                className='w-full h-auto'
            />
        </div>
        <div className='flex flex-col items-center w-[140px]'>
            <span className="badge rounded-none w-full">{name}</span>
            <span className="badge rounded-none bg-cyan-200 border-none text-black w-full">{fixture}</span>
        </div>
    </div>
  )
}