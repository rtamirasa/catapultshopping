'use client'

import { useState, useEffect } from 'react'
import type { ProductMetrics } from '@shelfsync/shared/types'

export function useProductMetrics(date?: string) {
  const [metrics, setMetrics] = useState<ProductMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const url = date ? `/api/product-metrics?date=${date}` : '/api/product-metrics'
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch product metrics')
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
