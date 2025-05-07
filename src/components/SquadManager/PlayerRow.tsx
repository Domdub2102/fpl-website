import Image from "next/image"
import { Player } from "@/types/types"

export default function PlayerRow({ player }: { player: Player }) {
    const positionDict: { [key: number]: {position:string}} = {
        1: {position: "GKP"},
        2: {position: "DEF"},
        3: {position: "MID"},
        4: {position: "FWD"}
    }
    const position = positionDict[player.position].position
    return (
        <div className='flex items-start text-start gap-3 pl-1 cursor-pointer'>
            <Image 
                src={`/KitIcons/${player.team_name} Front.png`}
                alt={`${player.team_name} Kit Icon`}
                width={50} 
                height={50}
                className="w-9 h-9 object-contain" // tailwind sizing
            />
            <div className='flex flex-col'>
                <p className='font-semibold text-[15px] truncate max-w-[150px]'>{player.web_name}</p>
                <div className='flex flex-row gap-4 text-[12px]'>
                    <p>{player.team_short_name}</p>
                    <p>{position}</p>
                </div>
            </div>
        </div>          
    )
}