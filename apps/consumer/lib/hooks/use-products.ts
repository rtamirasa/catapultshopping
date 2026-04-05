'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StoreComparison } from '@/lib/mock-data'

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  imageUrl?: string
  upc?: string
  storeComparisons?: StoreComparison[]
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const filtered = products.filter(
          p =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
        setFilteredProducts(filtered)
      } else {
        setFilteredProducts(products)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, products])

  async function fetchProducts() {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return {
    products: filteredProducts,
    loading,
    error,
    searchProducts,
    refetch: fetchProducts
  }
}
