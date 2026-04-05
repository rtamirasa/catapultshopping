// API route for fetching price history
import { NextResponse } from 'next/server'
import { fetchPriceHistory } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId parameter is required' },
        { status: 400 }
      )
    }

    const history = await fetchPriceHistory(productId, storeId, days)

    return NextResponse.json({
      productId,
      storeId,
      history,
    })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}
