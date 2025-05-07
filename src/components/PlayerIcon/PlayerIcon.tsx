import React from 'react'
import Image from 'next/image'

import { Player } from '@/types/types'
import { useSquad } from '@/lib/context/SquadContext'

export default function PlayerIcon ({ player }: {player: Player}) {  

  const { 
    gameweek, 
    subInProgress
  } = useSquad()

  const selectedBorder = player.isSelected 
    ? 'border-red-500' 
    : player.ableToSub 
      ? "border-teal-200" 
      : "border-transparent"
  
  const bgColor = player.isRemoved ? "bg-gray-400" : "bg-none"
  const removedOpacity = player.isRemoved ? "opacity-55" : ""
  const subInProgressStyles = subInProgress && !player.ableToSub ? "opacity-55 pointer-events-none" : ""

  // use gameweek state to find all the fixtures with the selected gameweek
  // we have access to the fixtures array of the player here
  const currentFixtures = player.fixtures.filter(fixture => fixture.gameweek === gameweek.id)

  let fixture
  if (currentFixtures.length === 0) {
    fixture = "-"
  }
  else if (currentFixtures.length === 1) {
    fixture = `${currentFixtures[0].opponent_short} (${currentFixtures[0].home_away})`
  }
  else if (currentFixtures.length === 2) {
    fixture = `${currentFixtures[0].opponent_short} (${currentFixtures[0].home_away}), ${currentFixtures[1].opponent_short} (${currentFixtures[1].home_away})`
  }

  return (
    <div>
      <div className={`relative flex flex-col items-center font-[500] ${bgColor} ${removedOpacity} ${subInProgressStyles} text-center border-2 ${selectedBorder} rounded-md cursor-pointer hover:border-white`}>                       
          <div className='w-[60px] sm:w-[75px] md:w-[75px] lg:w-[80px] xl:w-[90px]'>
              {player.isRemoved
                ? <div>
                  <Image 
                    src="/add-player2.png"
                    alt="Add Player Icon"
                    width={512}
                    height={512}
                  />
                </div>
                : <Image 
                    src={`/KitIcons/${player.team_name} Front.png`}
                    alt={`${player.team_name} Kit Icon`}
                    width={3000}
                    height={3000}
                    className='w-full h-auto'
                />             
              }
          </div>
          <div className='flex flex-col items-center w-[60px] sm:w-[80px] md:w-[80px] lg:w-[100px] xl:w-[125px]'>
              <span className="badge rounded-none rounded-t-[4px] lg:text-[15px] w-full lg:py-4">
                <p className='truncate'>{player.web_name}</p>
              </span>
              <span className="badge rounded-none rounded-b-[4px] bg-cyan-200 border-none text-black text-[12px] lg:text-[13px] w-full font-medium">
                <p className='truncate'>{fixture}</p>
              </span>
          </div>
      </div>
    </div>
  )
}