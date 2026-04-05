import type { BasketItem, StoreComparison } from '@/lib/mock-data'

export interface Product {
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
  products: Product[]
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
