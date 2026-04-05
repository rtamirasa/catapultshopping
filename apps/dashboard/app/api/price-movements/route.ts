import { NextResponse } from 'next/server'
import { fetchPriceMovements } from '@/lib/api'

export async function GET() {
  try {
    const movements = await fetchPriceMovements()

    // Split into drops and spikes
    const drops = movements.filter(m => m.spikeType === 'sudden_drop')
    const spikes = movements.filter(m => m.spikeType === 'sudden_increase')

    return NextResponse.json({ drops, spikes })
  } catch (error) {
    console.error('Error fetching price movements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price movements' },
      { status: 500 }
    )
  }
}
