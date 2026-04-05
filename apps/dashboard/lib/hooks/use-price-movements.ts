'use client'

import { useState, useEffect } from 'react'

export function usePriceMovements() {
  const [movements, setMovements] = useState<{ drops: any[], spikes: any[] }>({ drops: [], spikes: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/price-movements')
        if (!response.ok) throw new Error('Failed to fetch price movements')
        const data = await response.json()
        setMovements(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { movements, loading, error }
}
