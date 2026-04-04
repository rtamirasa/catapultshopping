'use client'

import { useState, useEffect } from 'react'
import type { Product, StoreComparison, Recommendation } from '@/lib/mock-data'

interface ProductData {
  product: Product
  storeComparisons: StoreComparison[]
  recommendation: Recommendation
}

export function useProduct(productId: string) {
  const [data, setData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  return { data, loading, error }
}
