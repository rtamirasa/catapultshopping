import { NextResponse } from 'next/server'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const alertsSnap = await getDocs(
      query(
        collection(db, 'alerts'),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
    )

    const alerts = alertsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
