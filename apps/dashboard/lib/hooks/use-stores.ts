'use client'

import { useState, useEffect } from 'react'

export function useStores() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/stores')
        if (!response.ok) throw new Error('Failed to fetch stores')
        const data = await response.json()
        setStores(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { stores, loading, error }
}
