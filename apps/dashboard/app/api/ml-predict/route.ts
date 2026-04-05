import { NextResponse } from 'next/server'

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product, days_ahead = 30 } = body

    // Call the ML inference API
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product,
        days_ahead,
        include_confidence: true
      })
    })

    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling ML API:', error)

    // Return mock data if ML API is not running (for demo fallback)
    return NextResponse.json({
      product: body.product || 'unknown',
      current_price: 5.49,
      predictions: [],
      trend: 'stable',
      anomaly_score: 0.0,
      confidence: 0.0,
      error: 'ML API not available',
      using_fallback: true
    }, { status: 200 })
  }
}

export async function GET() {
  try {
    // Health check for ML API
    const response = await fetch(`${ML_API_URL}/health`)
    const data = await response.json()
    return NextResponse.json({
      ml_api_status: 'connected',
      ...data
    })
  } catch (error) {
    return NextResponse.json({
      ml_api_status: 'disconnected',
      error: 'ML API not running. Start it with: cd training && python inference/api.py'
    }, { status: 503 })
  }
}
