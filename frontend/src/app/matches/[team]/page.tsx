'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from '../../page.module.css'

interface Match {
  id: number
  home_team: string
  away_team: string
  time: string
}

interface GroupTeam {
  team: string
  wins: number
  losses: number
  draws: number
  points: number
  total_score: number
}

interface TeamDetail {
  team: string
  group: number
  upcoming_matches: Match[]
  group_teams: GroupTeam[]
}

export default function TeamMatches() {
  const params = useParams()
  const teamParam = params.team
  const team = teamParam ? decodeURIComponent(teamParam as string) : ''
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!team) return

    const fetchTeamDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/teams/${encodeURIComponent(team)}/details`
        )
        if (!res.ok) throw new Error('Fetch failed')
        const data: TeamDetail = await res.json()
        setTeamDetail(data)
      } catch (err) {
        console.error('Fetch failed', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamDetail()
  }, [team])

  if (loading) return <p>Ladataan...</p>
  if (!teamDetail) return <p>Joukkuetta ei löytynyt</p>

  const { upcoming_matches = [], group_teams = [], group = 0 } = teamDetail

  return (
    <div className={styles.page}>
      <div className={styles.team_container}>
        <h1>{team}</h1>

        <h3>Tulevat ottelut</h3>
        {upcoming_matches.length === 0 ? (
          <p>Ei tulevia otteluita.</p>
        ) : (
          <ul>
            {upcoming_matches.map((m) => (
              <li key={m.id}>
                {m.home_team} vs {m.away_team} —{' '}
                {new Date(m.time).toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        <h3>Lohkopisteet – kierros 1</h3>
        {group_teams.length === 0 ? (
          <p>Lohkotietoja ei ole saatavilla.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Joukkue</th>
                <th>Voitot</th>
                <th>Häviöt</th>
                <th>Tasapelit</th>
                <th>Pisteet</th>
                <th>Kokonaistulos</th>
              </tr>
            </thead>
            <tbody>
              {group_teams.map((s) => (
                <tr key={s.team}>
                  <td>{s.team}</td>
                  <td>{s.wins}</td>
                  <td>{s.losses}</td>
                  <td>{s.draws}</td>
                  <td>{s.points}</td>
                  <td>{s.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
