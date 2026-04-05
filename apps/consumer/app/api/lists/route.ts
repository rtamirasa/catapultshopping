// API routes for grocery lists
import { NextResponse } from 'next/server'
import { collection, getDocs, doc, setDoc, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fetchProductMap, normalizeGroceryList } from '@/lib/grocery-lists'

// GET all lists for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user_demo'

    const listsSnap = await getDocs(
      query(collection(db, 'user_lists'), where('userId', '==', userId))
    )
    const productMap = await fetchProductMap()

    const lists = listsSnap.docs.map((listDoc) => normalizeGroceryList(listDoc.data(), listDoc.id, productMap))

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    )
  }
}

// POST create new list
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, emoji = '🛒', userId = 'user_demo' } = body

    if (!name) {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      )
    }

    const listId = `list_${Date.now()}`
    const newList = {
      id: listId,
      userId,
      name,
      emoji,
      itemCount: 0,
      totalCurrentPrice: 0,
      totalCheapestPrice: 0,
      estimatedSavings: 0,
      lastUpdated: Timestamp.now(),
      items: [],
      currentStore: 'walmart-lafayette-1'
    }

    await setDoc(doc(db, 'user_lists', listId), newList)

    return NextResponse.json(normalizeGroceryList(newList, listId, new Map()))
  } catch (error) {
    console.error('Error creating list:', error)
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    )
  }
}
