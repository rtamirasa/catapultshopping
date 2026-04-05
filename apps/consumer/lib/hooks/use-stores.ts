'use client'

import { useState, useEffect } from 'react'

export interface Store {
  id: string
  storeId: string
  name: string
  logo?: string
  address?: string
  distance?: string
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  async function fetchStores() {
    try {
      setLoading(true)
      const response = await fetch('/api/stores')
      if (!response.ok) throw new Error('Failed to fetch stores')
      const data = await response.json()
      setStores(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    stores,
    loading,
    error,
    refetch: fetchStores
  }
}
