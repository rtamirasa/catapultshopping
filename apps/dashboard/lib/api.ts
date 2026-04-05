import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

// Fetch all products
export async function fetchProducts() {
  const productsSnap = await getDocs(collection(db, 'products'))
  return productsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Fetch all stores
export async function fetchStores() {
  const storesSnap = await getDocs(collection(db, 'stores'))
  return storesSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Fetch price movements (existing from consumer)
export async function fetchPriceMovements() {
  const summariesSnap = await getDocs(
    query(collection(db, 'price_summaries'), where('isSpikeActive', '==', true))
  )

  const movements = []
  for (const doc of summariesSnap.docs) {
    const data = doc.data()
    movements.push({
      productId: data.productId,
      storeId: data.storeId,
      currentPrice: data.currentPrice,
      avgPrice30d: data.avgPrice30d,
      spikeType: data.spikeType,
      spikePercent: data.spikePercent,
    })
  }
  return movements
}
