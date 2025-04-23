import Image from "next/image"
import { Player } from "@/types/types"

export default function PlayerDetails({ player }: { player: Player }) {
    const positionDict: { [key: number]: {position:string}} = {
        1: {position: "GKP"},
        2: {position: "DEF"},
        3: {position: "MID"},
        4: {position: "FWD"}
    }
    const position = positionDict[player.position].position
    return (
        <td>
            <div className='flex items-center gap-3'>
                <Image 
                    src={`/KitIcons/${player.team_name} Front.png`}
                    alt={`${player.team_name} Kit Icon`}
                    width={50} 
                    height={50}
                    className="w-10 h-10 object-contain" // tailwind sizing
                />
                <div className='flex flex-col'>
                    <p className='font-semibold text-[15px] truncate max-w-[110px]'>{player.web_name}</p>
                    <div className='flex flex-row gap-3 text-[13px]'>
                        <p>{player.team_short_name}</p>
                        <p>{position}</p>
                    </div>
                </div>
            </div>
        </td>
    )
}