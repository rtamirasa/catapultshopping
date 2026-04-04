// API routes for individual list operations
import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fetchProductMap, normalizeGroceryList } from '@/lib/grocery-lists'

// GET single list
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listDoc = await getDoc(doc(db, 'user_lists', id))

    if (!listDoc.exists()) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    const data = listDoc.data()
    const productMap = await fetchProductMap()

    return NextResponse.json(normalizeGroceryList(data, id, productMap))
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}

// PUT update list
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData = {
      ...body,
      lastUpdated: Timestamp.now()
    }

    await updateDoc(doc(db, 'user_lists', id), updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    )
  }
}

// DELETE list
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteDoc(doc(db, 'user_lists', id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting list:', error)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}
