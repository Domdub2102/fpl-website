export interface Fixture {
    opponent_id: number
    opponent_name: string
    opponent_short: string
    gameweek: number
    home_away: string
}

export interface Team {
    id: number
    name: string
    short_name: string
    matches_played: number
    xG: string
    xGA: string
    fixtures: Fixture[]
}

export interface Player {
    id: number
    web_name: string
    first_name: string
    second_name: string
    total_points: number
    expected_goals: string
    expected_assists: string
    minutes: number 
    now_cost: number
    price: number
    element_type: number
    selected_by_percent: number
    team: number
    team_id: number
    team_name: string 
    position: number
    fixtures: Fixture[]
    inFirstEleven: boolean
    inSubs: boolean
    isSelected: boolean
}

export interface SquadType {
    firstEleven: Player[]
    subs: Player[]
}

export interface SquadContextType {
    players: Player[] 
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
    currentSquad: SquadType
    setCurrentSquad: React.Dispatch<React.SetStateAction<SquadType>>
    startingPlayer: Player | undefined
    setStartingPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>
    subPlayer: Player | undefined
    setSubPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>
    transferIn: Player | undefined
    transferOut: Player | undefined
    setTransferIn: React.Dispatch<React.SetStateAction<Player | undefined>>
    setTransferOut: React.Dispatch<React.SetStateAction<Player | undefined>>
}