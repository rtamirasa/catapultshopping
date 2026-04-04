import { NextRequest, NextResponse } from 'next/server';
import { logEvent, updateUserPoints } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, storeId, photoData } = body;

    if (!userId || !productId || !storeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the product found event
    await logEvent({
      userId,
      type: 'product_found',
      storeId,
      productId,
      metadata: {
        hasPhoto: !!photoData,
      },
    });

    // Award points (10 points per product found)
    const pointsAwarded = 10;
    await updateUserPoints(userId, pointsAwarded);

    return NextResponse.json({
      success: true,
      pointsAwarded,
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json(
      { error: 'Confirmation failed' },
      { status: 500 }
    );
  }
}
