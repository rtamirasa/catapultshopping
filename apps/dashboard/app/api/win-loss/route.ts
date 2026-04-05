import { NextResponse } from 'next/server'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const eventsSnap = await getDocs(
      query(
        collection(db, 'win_loss_events'),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
    )

    const events = eventsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching win/loss events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch win/loss events' },
      { status: 500 }
    )
  }
}
