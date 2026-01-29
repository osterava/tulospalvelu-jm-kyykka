'use client'
import { useEffect, useState } from 'react'

export interface Match {
  id: number
  home_team: string
  away_team: string
  time: string
  field: string
}

export function useMatches(selectedGroup: number | null) {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (selectedGroup === null) return

    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:8000/matches/group/${selectedGroup}`)
        if (!res.ok) throw new Error('Fetch failed')
        const data: Match[] = await res.json()
        setMatches(data)
        setSelectedMatch(null)
      } catch (err) {
        console.error(err)
        setStatusMessage('Otteluiden hakeminen epäonnistui')
        setTimeout(() => setStatusMessage(''), 3000)
      }
    }

    fetchMatches()
  }, [selectedGroup])

  return { matches, selectedMatch, setSelectedMatch, statusMessage, setStatusMessage }
}
