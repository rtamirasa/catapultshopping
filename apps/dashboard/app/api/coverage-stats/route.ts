import { NextResponse } from 'next/server'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get scans in date range
    const scansSnap = await getDocs(
      query(
        collection(db, 'scans'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      )
    )

    // Get receipts in date range
    const receiptsSnap = await getDocs(
      query(
        collection(db, 'receipts'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      )
    )

    // Get win/loss events in date range
    const winLossSnap = await getDocs(
      query(
        collection(db, 'win_loss_events'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      )
    )

    // Calculate stats
    const totalScans = scansSnap.size
    const totalReceipts = receiptsSnap.size
    const uniqueShoppers = new Set(scansSnap.docs.map(doc => doc.data().userId)).size
    const overallConversionRate = totalScans > 0 ? (totalReceipts / totalScans) * 100 : 0

    const wins = winLossSnap.docs.filter(doc => doc.data().outcome === 'win')
    const losses = winLossSnap.docs.filter(doc => doc.data().outcome === 'loss')
    const totalWins = wins.length
    const totalLosses = losses.length

    let revenueAttributed = 0
    receiptsSnap.docs.forEach(doc => {
      const data = doc.data()
      revenueAttributed += data.totalAmount || 0
    })

    let lostRevenueToCompetitors = 0
    losses.forEach(doc => {
      const data = doc.data()
      lostRevenueToCompetitors += data.yourPrice || 0
    })

    return NextResponse.json({
      totalScans,
      totalReceipts,
      uniqueShoppers,
      overallConversionRate: parseFloat(overallConversionRate.toFixed(1)),
      totalWins,
      totalLosses,
      revenueAttributed: parseFloat(revenueAttributed.toFixed(2)),
      lostRevenueToCompetitors: parseFloat(lostRevenueToCompetitors.toFixed(2))
    })
  } catch (error) {
    console.error('Error fetching coverage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coverage stats' },
      { status: 500 }
    )
  }
}
