const API_URL = "http://localhost:8000";
import { TeamDetail } from '../matches/components/types/team'

export async function fetchTeams(): Promise<string[]> {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }
  return res.json();
}

export async function getTeamDetail(team: string): Promise<TeamDetail> {
  const res = await fetch(
    `${API_URL}/teams/${encodeURIComponent(team)}/details`
  )
  if (!res.ok) {
    throw new Error('Fetch failed')
  }

  return res.json()
}
