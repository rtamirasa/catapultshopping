// API route for fetching a single product with full details
import { NextResponse } from 'next/server'
import { fetchProduct, fetchStoreComparisons, generateRecommendation } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    const [product, storeComparisons, recommendation] = await Promise.all([
      fetchProduct(productId),
      fetchStoreComparisons(productId),
      generateRecommendation(productId),
    ])

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      product,
      storeComparisons,
      recommendation,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
