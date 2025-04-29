import React from 'react'
import Image from 'next/image'

import { Player } from '@/types/types'
import { useSquad } from '@/lib/context/SquadContext'

export default function PlayerIcon ({ player }: {player: Player}) {  

  const { gameweek } = useSquad()

  const isSelected = player.isSelected
  const borderColor = isSelected ? 'border-green-300' : 'border-transparent'

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

  const positionDict: { [key: number]: {position:string}} = {
      1: {position: "GKP"},
      2: {position: "DEF"},
      3: {position: "MID"},
      4: {position: "FWD"}
  }

  const subInfo = player.inSubs ? 
      <div className='lg:pb-1 font-semibold pl-0.5'>{positionDict[player.position].position}</div> : 
      <div></div>

  return (
    <div className={`relative flex flex-col items-center font-[500] text-center border-2 ${borderColor} rounded-md cursor-pointer hover:border-white`}>
        {subInfo}
        <div className='w-[60px] lg:w-[90px]'>
            <Image 
                src={`/KitIcons/${player.team_name} Front.png`}
                alt={`${player.team_name} Kit Icon`}
                width={3000}
                height={3000}
                className='w-full h-auto'
            />
        </div>
        <div className='flex flex-col items-center w-[60px] lg:w-[125px] truncate'>
            <span className="badge rounded-none rounded-t-[4px] lg:text-[15px] w-full lg:py-4">
              {player.web_name}
            </span>
            <span className="badge rounded-none rounded-b-[4px] bg-cyan-200 border-none text-black text-[12px] lg:text-[13px] w-full font-medium">
              {fixture}
            </span>
        </div>
    </div>
  )
}