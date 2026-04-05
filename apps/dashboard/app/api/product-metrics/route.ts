import { NextResponse } from 'next/server'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const metricsSnap = await getDocs(
      query(
        collection(db, 'product_metrics_daily'),
        where('date', '==', date)
      )
    )

    const metrics = metricsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching product metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product metrics' },
      { status: 500 }
    )
  }
}
