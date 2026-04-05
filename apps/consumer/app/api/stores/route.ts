// API route for fetching all stores
import { NextResponse } from 'next/server'
import { fetchStores } from '@/lib/api'

export async function GET() {
  try {
    const stores = await fetchStores()
    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}
