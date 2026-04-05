'use client'

import { useState, useEffect } from 'react'
import type { PriceMovement } from '@/lib/mock-data'

export function usePriceMovements() {
  const [data, setData] = useState<{ drops: PriceMovement[]; spikes: PriceMovement[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/price-movements')
        if (!response.ok) throw new Error('Failed to fetch price movements')
        const result = await response.json()
        setData({ drops: result.drops || [], spikes: result.spikes || [] })
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
