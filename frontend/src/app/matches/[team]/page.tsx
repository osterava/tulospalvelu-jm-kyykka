'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from '../../page.module.css'
import { getTeamDetail } from '../../services/teamsService'
import { TeamDetail } from '../components/types/team'
import { UpcomingMatches } from '../components/UpcomingMatches'
import { GroupTable } from '../components/GroupTable'

export default function TeamPage() {
  const { team: teamParam } = useParams<{ team: string }>()
  const team = teamParam ? decodeURIComponent(teamParam) : ''

  const [data, setData] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!team) return

    const load = async () => {
      try {
        const result = await getTeamDetail(team)
        console.log(result)
        setData(result)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [team])

  if (loading) return <p>Ladataan...</p>
  if (error || !data) return <p>Joukkuetta ei löytynyt</p>

  return (
    <div className={styles.page}>
      <div className={styles.team_container}>
        <h1>{team}</h1>

        <h3>Tulevat ottelut</h3>
        <UpcomingMatches matches={data.upcoming_matches} />

        <h3>Lohkopisteet kierros 1</h3>
        <GroupTable teams={data.group_teams} />
      </div>
    </div>
  )
}
