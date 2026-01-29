export interface Match {
  id: number
  home_team: string
  away_team: string
  time: string
  field: string
}

export interface GroupTeam {
  team: string
  wins: number
  losses: number
  draws: number
  points: number
  total_score: number
}

export interface TeamDetail {
  team: string
  group: number
  upcoming_matches: Match[]
  group_teams: GroupTeam[]
}
