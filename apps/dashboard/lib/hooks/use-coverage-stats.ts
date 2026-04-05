'use client'

import { useState, useEffect } from 'react'
import type { CoverageStats } from '@shelfsync/shared/types'

export function useCoverageStats() {
  const [stats, setStats] = useState<CoverageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/coverage-stats')
        if (!response.ok) throw new Error('Failed to fetch coverage stats')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { stats, loading, error }
}
