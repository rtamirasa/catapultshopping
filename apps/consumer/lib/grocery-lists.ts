import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import type { BasketItem, GroceryList, Product, RecommendationAction } from './mock-data'

type TimestampLike =
  | string
  | Date
  | {
      toDate?: () => Date
    }
  | null
  | undefined

type RawBasketItem = Omit<Partial<BasketItem>, 'product'> & {
  productId?: string
  product?: Partial<Product>
}

type RawGroceryList = Omit<Partial<GroceryList>, 'items' | 'lastUpdated'> & {
  id?: string
  items?: RawBasketItem[]
  lastUpdated?: TimestampLike
}

const VALID_RECOMMENDATIONS: RecommendationAction[] = ['buy_now', 'wait', 'switch_stores']

function toProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: typeof data.name === 'string' && data.name ? data.name : 'Unknown product',
    brand: typeof data.brand === 'string' && data.brand ? data.brand : 'Generic',
    category: typeof data.category === 'string' && data.category ? data.category : 'Uncategorized',
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    upc: typeof data.barcode === 'string'
      ? data.barcode
      : typeof data.upc === 'string'
        ? data.upc
        : undefined,
  }
}

function getRecommendation(value: unknown): RecommendationAction {
  return VALID_RECOMMENDATIONS.includes(value as RecommendationAction)
    ? (value as RecommendationAction)
    : 'buy_now'
}

function getLastUpdated(value: TimestampLike): string {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString()

  const date = value.toDate?.()
  return date instanceof Date ? date.toISOString() : new Date().toISOString()
}

function getFallbackProduct(productId?: string): Product {
  return {
    id: productId ?? 'unknown-product',
    name: 'Unknown product',
    brand: 'Generic',
    category: 'Uncategorized',
  }
}

function normalizeBasketItem(item: RawBasketItem): BasketItem & { productId?: string } {
  const productId = typeof item.productId === 'string'
    ? item.productId
    : typeof item.product?.id === 'string'
      ? item.product.id
      : undefined

  const nestedProduct = item.product && typeof item.product === 'object'
    ? {
        id: typeof item.product.id === 'string' ? item.product.id : productId ?? 'unknown-product',
        name: typeof item.product.name === 'string' && item.product.name ? item.product.name : 'Unknown product',
        brand: typeof item.product.brand === 'string' && item.product.brand ? item.product.brand : 'Generic',
        category: typeof item.product.category === 'string' && item.product.category ? item.product.category : 'Uncategorized',
        imageUrl: typeof item.product.imageUrl === 'string' ? item.product.imageUrl : undefined,
        upc: typeof item.product.upc === 'string' ? item.product.upc : undefined,
      }
    : undefined

  const currentStorePrice = typeof item.currentStorePrice === 'number' ? item.currentStorePrice : 0
  const bestAlternatePrice = typeof item.bestAlternatePrice === 'number'
    ? item.bestAlternatePrice
    : currentStorePrice

  return {
    id: typeof item.id === 'string' && item.id ? item.id : `item-${productId ?? 'unknown'}`,
    product: nestedProduct ?? getFallbackProduct(productId),
    productId,
    quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
    currentStorePrice,
    bestAlternatePrice,
    bestAlternateStore: typeof item.bestAlternateStore === 'string' && item.bestAlternateStore
      ? item.bestAlternateStore
      : 'Best local price',
    recommendation: getRecommendation(item.recommendation),
    potentialSavings: typeof item.potentialSavings === 'number'
      ? item.potentialSavings
      : Math.max(0, currentStorePrice - bestAlternatePrice),
  }
}

export async function fetchProductMap(): Promise<Map<string, Product>> {
  const productsSnap = await getDocs(collection(db, 'products'))
  const productMap = new Map<string, Product>()

  productsSnap.docs.forEach((productDoc) => {
    const data = productDoc.data() as Record<string, unknown>
    const product = toProduct(productDoc.id, data)
    productMap.set(productDoc.id, product)

    if (typeof data.productId === 'string' && data.productId) {
      productMap.set(data.productId, product)
    }
  })

  return productMap
}

export function normalizeGroceryList(
  data: RawGroceryList,
  fallbackId: string,
  productMap: Map<string, Product>
): GroceryList {
  const items = Array.isArray(data.items)
    ? data.items.map((item) => {
        const normalizedItem = normalizeBasketItem(item)
        const hydratedProduct = normalizedItem.productId
          ? productMap.get(normalizedItem.productId)
          : undefined

        return {
          ...normalizedItem,
          product: hydratedProduct ?? normalizedItem.product,
        }
      })
    : []

  const totalCurrentPrice = typeof data.totalCurrentPrice === 'number'
    ? data.totalCurrentPrice
    : items.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0)

  const totalCheapestPrice = typeof data.totalCheapestPrice === 'number'
    ? data.totalCheapestPrice
    : items.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0)

  return {
    id: typeof data.id === 'string' && data.id ? data.id : fallbackId,
    name: typeof data.name === 'string' && data.name ? data.name : 'Untitled List',
    emoji: typeof data.emoji === 'string' && data.emoji ? data.emoji : '🛒',
    itemCount: typeof data.itemCount === 'number' ? data.itemCount : items.length,
    totalCurrentPrice,
    totalCheapestPrice,
    estimatedSavings: typeof data.estimatedSavings === 'number'
      ? data.estimatedSavings
      : totalCurrentPrice - totalCheapestPrice,
    lastUpdated: getLastUpdated(data.lastUpdated),
    items,
  }
}