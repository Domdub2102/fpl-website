export interface Fixture {
    opponent_id: number
    opponent_name: string
    opponent_short: string
    gameweek: number
    home_away: "H" | "A"
    xGper90: number
    xGAper90: number
    xGRank: number
    xGARank: number
}

export interface TeamFixtures {
    [gameweek: number]: Fixture[]
}

export interface TeamXG {
    id: number
    name: string
    short_name: string
    matches_played: number
    xG: string
    xGA: string
    fixtures: TeamFixtures
    expectedTotal: number
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
    can_select: boolean
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
    team_short_name: string
    position: number
    fixtures: Fixture[]
    inFirstEleven: boolean
    inSubs: boolean
    isSelected: boolean
}

export interface Gameweek {
    id: number
    name: string
    deadline_time: string
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
    gameweek: Gameweek
    setGameweek: React.Dispatch<React.SetStateAction<Gameweek>>
}