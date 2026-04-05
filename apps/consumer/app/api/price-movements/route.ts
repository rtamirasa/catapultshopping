// API route for fetching today's price movements (spikes and drops)
import { NextResponse } from 'next/server'
import { fetchPriceMovements } from '@/lib/api'

export async function GET() {
  try {
    const movements = await fetchPriceMovements()

    // Split into drops and spikes
    const drops = movements.filter(m => m.direction === 'down')
    const spikes = movements.filter(m => m.direction === 'up')

    return NextResponse.json({
      drops,
      spikes,
      all: movements,
    })
  } catch (error) {
    console.error('Error fetching price movements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price movements' },
      { status: 500 }
    )
  }
}
