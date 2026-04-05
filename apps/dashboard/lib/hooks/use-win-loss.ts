'use client'

import { useState, useEffect } from 'react'
import type { WinLossEvent } from '@shelfsync/shared/types'

export function useWinLoss() {
  const [events, setEvents] = useState<WinLossEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/win-loss')
        if (!response.ok) throw new Error('Failed to fetch win/loss events')
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { events, loading, error }
}
