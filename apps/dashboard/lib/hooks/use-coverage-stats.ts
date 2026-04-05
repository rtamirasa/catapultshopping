'use client'

import { useState, useEffect } from 'react'
import type { CoverageStats } from '@shelfsync/shared/types'

function getDaysFromRange(range: string): number {
  switch (range) {
    case '24h': return 1
    case '7d': return 7
    case '30d': return 30
    case '90d': return 90
    default: return 7
  }
}

export function useCoverageStats() {
  const [stats, setStats] = useState<CoverageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    // Get initial date range from localStorage
    const stored = localStorage.getItem('dashboard-date-range')
    if (stored) setDateRange(stored)

    // Listen for date range changes
    const handleDateChange = (e: CustomEvent) => {
      setDateRange(e.detail)
    }

    window.addEventListener('date-range-changed', handleDateChange as EventListener)
    return () => window.removeEventListener('date-range-changed', handleDateChange as EventListener)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const days = getDaysFromRange(dateRange)
        const response = await fetch(`/api/coverage-stats?days=${days}`)
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
  }, [dateRange])

  return { stats, loading, error }
}
