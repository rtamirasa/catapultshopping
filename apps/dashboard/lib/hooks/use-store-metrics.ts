'use client'

import { useState, useEffect } from 'react'
import type { StoreMetrics } from '@shelfsync/shared/types'

export function useStoreMetrics(date?: string) {
  const [metrics, setMetrics] = useState<StoreMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const url = date ? `/api/store-metrics?date=${date}` : '/api/store-metrics'
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch store metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  return { metrics, loading, error }
}
