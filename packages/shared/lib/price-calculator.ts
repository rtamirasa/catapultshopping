import type { BasketItem, StoreComparison } from './types'

export interface ProductWithComparisons {
  id: string
  name: string
  brand: string
  category: string
  storeComparisons?: StoreComparison[]
}

/**
 * Recalculates prices for all items in a basket based on a selected store
 * @param items - Current basket items
 * @param storeId - ID of the store to calculate prices for
 * @param products - Full product data with store comparisons
 * @returns Updated items with new prices
 */
export function calculatePricesForStore(
  items: BasketItem[],
  storeId: string,
  products: ProductWithComparisons[]
): BasketItem[] {
  const productMap = new Map(products.map(p => [p.id, p]))

  return items.map(item => {
    const productId = item.product.id || item.productId
    if (!productId) return item

    const product = productMap.get(productId)
    if (!product?.storeComparisons) return item

    // Find the price at the selected store
    const selectedStorePrice = product.storeComparisons.find(
      sc => sc.storeId === storeId
    )

    if (!selectedStorePrice) {
      // Store doesn't have this product, keep current price
      return item
    }

    // Find the absolute best price across ALL stores (including current)
    const bestPrice = product.storeComparisons.reduce((best, current) =>
      current.currentPrice < best.currentPrice ? current : best
    , product.storeComparisons[0])

    // Determine recommendation
    let recommendation: 'buy_now' | 'wait' | 'switch_stores' = 'buy_now'
    const priceDiff = selectedStorePrice.currentPrice - bestPrice.currentPrice

    if (priceDiff > 1.0) {
      recommendation = 'switch_stores'
    } else if (priceDiff > 0.25) {
      recommendation = 'wait'
    }

    return {
      ...item,
      currentStorePrice: selectedStorePrice.currentPrice,
      bestAlternatePrice: bestPrice.currentPrice,
      bestAlternateStore: bestPrice.storeName,
      recommendation,
      potentialSavings: Math.max(0, priceDiff * item.quantity)
    }
  })
}

/**
 * Calculate total prices for a list of items
 */
export function calculateTotals(items: BasketItem[]) {
  const totalCurrentPrice = items.reduce(
    (sum, item) => sum + item.currentStorePrice * item.quantity,
    0
  )
  const totalCheapestPrice = items.reduce(
    (sum, item) => sum + item.bestAlternatePrice * item.quantity,
    0
  )
  const estimatedSavings = totalCurrentPrice - totalCheapestPrice

  return {
    totalCurrentPrice,
    totalCheapestPrice,
    estimatedSavings
  }
}

/**
 * Detects price spikes in product history
 * @param prices - Array of price points over time
 * @param threshold - Percentage threshold for spike detection (default 10%)
 * @returns true if a significant price spike is detected
 */
export function detectPriceSpike(
  prices: Array<{ price: number; timestamp: string }>,
  threshold: number = 0.1
): boolean {
  if (prices.length < 2) return false

  // Sort by timestamp ascending
  const sorted = [...prices].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  // Calculate average of oldest 50% of prices
  const midpoint = Math.floor(sorted.length / 2)
  const oldPrices = sorted.slice(0, midpoint)
  const oldAverage = oldPrices.reduce((sum, p) => sum + p.price, 0) / oldPrices.length

  // Calculate average of newest 50% of prices
  const newPrices = sorted.slice(midpoint)
  const newAverage = newPrices.reduce((sum, p) => sum + p.price, 0) / newPrices.length

  // Check if there's a significant spike
  const percentChange = Math.abs(newAverage - oldAverage) / oldAverage

  return percentChange > threshold
}

/**
 * Calculates recommended action based on price trends
 * @param currentPrice - Current product price
 * @param averagePrice - Historical average price
 * @param minPrice - Lowest price seen
 * @param maxPrice - Highest price seen
 * @returns recommendation action
 */
export function getRecommendedAction(
  currentPrice: number,
  averagePrice: number,
  minPrice: number,
  maxPrice: number
): 'buy_now' | 'wait' | 'switch_stores' {
  // If current price is within 5% of minimum, it's a good time to buy
  if (currentPrice <= minPrice * 1.05) {
    return 'buy_now'
  }

  // If current price is higher than average by more than 15%, suggest waiting
  if (currentPrice > averagePrice * 1.15) {
    return 'wait'
  }

  // Otherwise, suggests switching stores if available
  return 'switch_stores'
}
