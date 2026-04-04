import { NextRequest, NextResponse } from 'next/server';
import { searchProduct, logEvent } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const storeId = searchParams.get('storeId');
    const userId = searchParams.get('userId');

    if (!query || !storeId) {
      return NextResponse.json(
        { error: 'Missing query or storeId parameter' },
        { status: 400 }
      );
    }

    const products = await searchProduct(query, storeId);

    // Log the search event
    if (userId) {
      await logEvent({
        userId,
        type: 'product_searched',
        storeId,
        searchQuery: query,
      });
    }

    return NextResponse.json({
      success: true,
      products,
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
