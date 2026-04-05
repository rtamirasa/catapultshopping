'use client'

import { useState, useEffect } from 'react'
import type { GroceryList } from '@/lib/mock-data'

export function useGroceryLists(userId: string = 'user_demo') {
  const [lists, setLists] = useState<GroceryList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchLists()
  }, [userId])

  async function fetchLists() {
    try {
      setLoading(true)
      const response = await fetch(`/api/lists?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch lists')
      const data = await response.json()
      setLists(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function createList(name: string, emoji: string = '🛒') {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, emoji, userId })
      })

      if (!response.ok) throw new Error('Failed to create list')

      const newList = await response.json()
      setLists(prev => [...prev, newList])
      return newList
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  async function updateList(listId: string, updates: Partial<GroceryList>) {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update list')

      setLists(prev => prev.map(list =>
        list.id === listId ? { ...list, ...updates } : list
      ))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  async function deleteList(listId: string) {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete list')

      setLists(prev => prev.filter(list => list.id !== listId))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    refetch: fetchLists
  }
}
