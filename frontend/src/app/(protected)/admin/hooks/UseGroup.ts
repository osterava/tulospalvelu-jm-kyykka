'use client'
import { useEffect, useState } from 'react'

export function useGroups() {
  const [groups, setGroups] = useState<number[]>([])
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`http://localhost:8000/groups`)
        if (!res.ok) throw new Error('Fetch failed')
        const data: number[] = await res.json()
        setGroups(data)
      } catch (err) {
        console.error(err)
        setStatusMessage('Lohkojen hakeminen epäonnistui')
        setTimeout(() => setStatusMessage(''), 3000)
      }
    }
    fetchGroups()
  }, [])

  return { groups, statusMessage }
}
