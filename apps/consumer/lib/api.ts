// API utilities for fetching and transforming Firebase data
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Product,
  PricePoint,
  StoreComparison,
  Recommendation,
  RecentObservation,
  PriceMovement,
} from './mock-data'

// Fetch all stores
export async function fetchStores() {
  const storesSnap = await getDocs(collection(db, 'stores'))
  return storesSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Fetch all products
export async function fetchProducts() {
  const productsSnap = await getDocs(collection(db, 'products'))
  return productsSnap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      productId: data.productId,
      name: data.name,
      brand: data.brand || 'Generic',
      category: data.category,
      imageUrl: data.imageUrl,
      upc: data.barcode,
    } as Product
  })
}

// Fetch a single product
export async function fetchProduct(productId: string) {
  const productDoc = await getDoc(doc(db, 'products', productId))
  if (!productDoc.exists()) return null

  const data = productDoc.data()
  return {
    id: productDoc.id,
    productId: data.productId,
    name: data.name,
    brand: data.brand || 'Generic',
    category: data.category,
    imageUrl: data.imageUrl,
    upc: data.barcode,
  } as Product
}

// Fetch price history for a product at a specific store
export async function fetchPriceHistory(
  productId: string,
  storeId: string,
  days: number = 30
): Promise<PricePoint[]> {
  const summaryId = `${productId}_${storeId}`
  const historyRef = collection(db, 'price_summaries', summaryId, 'history')

  const historySnap = await getDocs(query(historyRef, orderBy('timestamp', 'desc'), limit(days)))

  return historySnap.docs.map(doc => {
    const data = doc.data()
    return {
      timestamp: data.timestamp.toDate().toISOString(),
      price: data.price,
      store: storeId,
    }
  }).reverse() // Return oldest to newest
}

// Fetch store comparisons for a product
export async function fetchStoreComparisons(productId: string): Promise<StoreComparison[]> {
  const summariesSnap = await getDocs(
    query(collection(db, 'price_summaries'), where('productId', '==', productId))
  )

  const stores = await fetchStores()
  const storeMap = new Map(stores.map(s => [s.storeId, s]))

  const comparisons: StoreComparison[] = []

  for (const summaryDoc of summariesSnap.docs) {
    const data = summaryDoc.data()
    const store = storeMap.get(data.storeId)

    if (!store) continue

    const observations = await fetchObservations(productId, data.storeId)
    const confidence = observations.length > 0 ? Math.min(95, 70 + observations.length * 5) : 70

    comparisons.push({
      storeId: data.storeId,
      storeName: store.name,
      currentPrice: data.currentPrice,
      unitPrice: '', // TODO: Calculate based on product size
      confidence,
      lastVerified: observations.length > 0
        ? getRelativeTime(observations[0].timestamp.toDate())
        : 'Not recently verified',
      stockStatus: 'in_stock', // TODO: Add stock tracking
      isBestValue: false, // Will be set later
      distance: undefined, // TODO: Calculate based on user location
    })
  }

  // Mark the cheapest as best value
  if (comparisons.length > 0) {
    const cheapest = comparisons.reduce((min, curr) =>
      curr.currentPrice < min.currentPrice ? curr : min
    )
    cheapest.isBestValue = true
  }

  return comparisons.sort((a, b) => a.currentPrice - b.currentPrice)
}

// Fetch observations for a product at a store
async function fetchObservations(productId: string, storeId?: string): Promise<any[]> {
  // Simple query to avoid index requirements
  const q = query(
    collection(db, 'observations'),
    where('productId', '==', productId),
    limit(10)
  )

  const obsSnap = await getDocs(q)
  let observations = obsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Filter by storeId in memory if provided
  if (storeId) {
    observations = observations.filter(obs => obs.storeId === storeId)
  }

  return observations
}

// Generate recommendation for a product
export async function generateRecommendation(
  productId: string,
  currentStoreId?: string
): Promise<Recommendation> {
  const comparisons = await fetchStoreComparisons(productId)

  if (comparisons.length === 0) {
    return {
      action: 'buy_now',
      headline: 'No comparison data available',
      explanation: 'Not enough data to make a recommendation',
      confidence: 0,
    }
  }

  const cheapest = comparisons[0]
  const current = currentStoreId
    ? comparisons.find(c => c.storeId === currentStoreId)
    : comparisons[comparisons.length - 1]

  if (!current) {
    return {
      action: 'buy_now',
      headline: 'Price information available',
      explanation: `Best price: $${cheapest.currentPrice.toFixed(2)} at ${cheapest.storeName}`,
      confidence: cheapest.confidence,
    }
  }

  const savings = current.currentPrice - cheapest.currentPrice
  const savingsPercent = (savings / current.currentPrice) * 100

  // Check for spike
  const summaryDoc = await getDoc(doc(db, 'price_summaries', `${productId}_${current.storeId}`))
  const summaryData = summaryDoc.data()
  const isSpike = summaryData?.isSpikeActive || false

  if (isSpike && summaryData.spikeType === 'sudden_drop') {
    return {
      action: 'buy_now',
      headline: 'Great deal - buy now!',
      explanation: `Price dropped ${Math.abs(summaryData.spikePercent).toFixed(0)}% at ${current.storeName}. This is the best price in 30 days.`,
      estimatedSavings: Math.abs(current.currentPrice - summaryData.avgPrice30d),
      confidence: 90,
    }
  }

  if (isSpike && summaryData.spikeType === 'sudden_increase') {
    return {
      action: 'wait',
      headline: 'Price is spiking - wait if possible',
      explanation: `Price increased ${summaryData.spikePercent.toFixed(0)}% at ${current.storeName}. Consider waiting for it to normalize or buy at ${cheapest.storeName} for $${cheapest.currentPrice.toFixed(2)}.`,
      estimatedSavings: current.currentPrice - summaryData.avgPrice30d,
      confidence: 85,
    }
  }

  if (savingsPercent > 10) {
    return {
      action: 'switch_stores',
      headline: `Switch to ${cheapest.storeName}`,
      explanation: `You could save $${savings.toFixed(2)} (${savingsPercent.toFixed(0)}%) by buying this at ${cheapest.storeName} instead.`,
      estimatedSavings: savings,
      confidence: cheapest.confidence,
    }
  }

  return {
    action: 'buy_now',
    headline: 'Good price',
    explanation: `Current price is within 10% of the best available price.`,
    confidence: current.confidence,
  }
}

// Fetch recent price movements (biggest drops and spikes)
export async function fetchPriceMovements(): Promise<PriceMovement[]> {
  const summariesSnap = await getDocs(
    query(collection(db, 'price_summaries'), where('isSpikeActive', '==', true))
  )

  const products = await fetchProducts()
  const productMap = new Map(products.map(p => [p.productId, p]))

  const stores = await fetchStores()
  const storeMap = new Map(stores.map(s => [s.storeId, s]))

  const movements: PriceMovement[] = []

  for (const summaryDoc of summariesSnap.docs) {
    const data = summaryDoc.data()
    const product = productMap.get(data.productId)
    const store = storeMap.get(data.storeId)

    if (!product || !store) continue

    const previousPrice = data.avgPrice30d
    const changePercent = data.spikePercent
    const changeAmount = data.currentPrice - previousPrice

    movements.push({
      id: summaryDoc.id,
      product,
      store: store.name,
      previousPrice,
      currentPrice: data.currentPrice,
      changePct: Math.round(changePercent),
      changeAmount,
      direction: changePercent > 0 ? 'up' : 'down',
      timestamp: getRelativeTime(data.lastUpdated?.toDate() || new Date()),
      verifiedBy: 5, // TODO: Get from observations
    })
  }

  return movements
}

// Fetch recent observations for a product
export async function fetchRecentObservations(productId: string): Promise<RecentObservation[]> {
  const observations = await fetchObservations(productId)

  return observations.map(obs => ({
    id: obs.id,
    shopperAlias: obs.userName || 'Anonymous',
    store: obs.storeId,
    price: obs.price,
    timestamp: getRelativeTime(obs.timestamp.toDate()),
    isVerified: obs.isVerified || false,
    note: obs.note,
  }))
}

// Helper: Convert timestamp to relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}
