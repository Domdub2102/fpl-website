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
}

export interface SquadType {
    firstEleven: Player[]
    subs: Player[]
}