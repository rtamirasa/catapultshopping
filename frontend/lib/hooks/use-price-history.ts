'use client'

import { useState, useEffect } from 'react'
import type { PricePoint } from '@/lib/mock-data'

export function usePriceHistory(productId: string, storeId: string, days: number = 30) {
  const [data, setData] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/products/${productId}/price-history?storeId=${storeId}&days=${days}`
        )
        if (!response.ok) throw new Error('Failed to fetch price history')
        const result = await response.json()
        setData(result.history || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (productId && storeId) {
      fetchData()
    }
  }, [productId, storeId, days])

  return { data, loading, error }
}
