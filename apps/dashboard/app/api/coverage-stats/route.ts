import { NextResponse } from 'next/server'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    // Get today's coverage stats
    const today = new Date().toISOString().split('T')[0]

    const statsSnap = await getDocs(
      query(
        collection(db, 'coverage_stats_daily'),
        orderBy('date', 'desc'),
        limit(1)
      )
    )

    if (statsSnap.empty) {
      // Return default stats if none exist
      return NextResponse.json({
        totalScans: 0,
        totalReceipts: 0,
        uniqueShoppers: 0,
        overallConversionRate: 0,
        totalWins: 0,
        totalLosses: 0,
        revenueAttributed: 0,
        lostRevenueToCompetitors: 0
      })
    }

    const data = statsSnap.docs[0].data()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching coverage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coverage stats' },
      { status: 500 }
    )
  }
}
