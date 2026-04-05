// Shared Firestore types used across both consumer and dashboard apps

export type RecommendationAction = 'buy_now' | 'wait' | 'switch_stores'

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  imageUrl?: string
  upc?: string
}

export interface PricePoint {
  timestamp: string // ISO string
  price: number
  store: string
}

export interface StoreComparison {
  storeId: string
  storeName: string
  storeLogo?: string
  currentPrice: number
  unitPrice: string
  confidence: number // 0-100
  lastVerified: string // relative, e.g. "4 mins ago"
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
  isBestValue: boolean
  distance?: string
}

export interface Recommendation {
  action: RecommendationAction
  headline: string
  explanation: string
  estimatedSavings?: number
  targetDate?: string // e.g. "Monday morning"
  confidence: number
}

export interface BestTimeToBuy {
  cheapestDay: string
  cheapestTimeWindow: string
  estimatedSavings: number
  currentPrice: number
  projectedLowPrice: number
}

export interface VerificationStats {
  verifiedBy: number
  lastUpdatedMinutesAgo: number
  confidenceScore: number
  totalObservations: number
}

export interface RecentObservation {
  id: string
  shopperAlias: string
  store: string
  price: number
  timestamp: string
  isVerified: boolean
  note?: string
}

export interface SavingsBreakdown {
  buyNow: { price: number; label: string; savings: number }
  waitOption: { price: number; label: string; savings: number; targetWindow: string }
  switchStore: { price: number; label: string; savings: number; storeName: string }
}

export interface BasketItem {
  id: string
  product: Product
  productId?: string
  quantity: number
  currentStorePrice: number
  bestAlternatePrice: number
  bestAlternateStore: string
  recommendation: RecommendationAction
  potentialSavings: number
}

export interface Basket {
  id: string
  currentStoreName: string
  items: BasketItem[]
  totalCurrentStore: number
  totalCheapest: number
  estimatedTotalSavings: number
  bestAction: string
  bestActionDetail: string
  projectedBestWindow: string
  projectedBestWindowReason: string
}

export interface GroceryList {
  id: string
  name: string
  items: BasketItem[]
  createdAt: string
  updatedAt: string
  totalCurrentPrice: number
  totalCheapestPrice: number
  estimatedSavings: number
}

export interface Store {
  id: string
  storeId: string
  name: string
  location: string
  distance?: number
  lat?: number
  lng?: number
  logo?: string
  rating?: number
}

export interface PriceMovement {
  productId: string
  productName: string
  currentPrice: number
  previousPrice: number
  percentChange: number
  isSpike: boolean
  timestamp: string
}

export interface Reward {
  id: string
  title: string
  description: string
  points: number
  expiresAt: string
  category: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt: string
  preferences?: {
    favoriteStores?: string[]
    preferredCategories?: string[]
  }
}

export interface PriceHistory {
  productId: string
  timestamp: string
  price: number
  storeId: string
  storeName: string
  quantity?: string
  unitPrice?: number
}

export interface SingleStoreOption {
  storeName: string
  totalCost: number
  stores: string[]
}

export interface MultiStoreStop {
  stores: Array<{
    storeName: string
    items: string[]
    subtotal: number
  }>
  totalCost: number
}

export interface ShoppingOptimization {
  singleStore: SingleStoreOption
  multiStoreOptimal: MultiStoreStop
  savings: number
  savingsPercent: number
}

// Dashboard Attribution Types (Phase 2)

export interface Scan {
  id: string
  productId: string
  storeId: string
  userId: string
  timestamp: Date | string
  sessionId: string
}

export interface Receipt {
  id: string
  userId: string
  storeId: string
  timestamp: Date | string
  items: ReceiptItem[]
  totalAmount: number
}

export interface ReceiptItem {
  productId: string
  productName?: string
  price: number
  quantity: number
}

export interface WinLossEvent {
  id: string
  sessionId: string
  yourProductId: string
  competitorProductId: string
  outcome: 'win' | 'loss'
  yourPrice: number
  competitorPrice: number
  priceGap: number
  priceGapPercentage: number
  timestamp: Date | string
  storeId: string
  userId: string
}

export interface Competitor {
  id: string
  name: string
  brand: string
  category: string
  competesWithProductIds: string[]
  avgPrice?: number
  imageUrl?: string
}

export interface Alert {
  id: string
  type: 'price_spike' | 'conversion_drop' | 'competitor_win_streak' | 'low_stock' | 'high_win_rate' | 'price_opportunity'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  productId?: string
  storeId?: string
  timestamp: Date | string
  isRead: boolean
}

export interface CoverageStats {
  totalScans: number
  totalReceipts: number
  uniqueShoppers: number
  overallConversionRate: number
  totalWins: number
  totalLosses: number
  revenueAttributed: number
  lostRevenueToCompetitors: number
}

export interface ProductMetrics {
  id: string
  productId: string
  date: string
  scansTotal: number
  purchasesTotal: number
  conversionRate: number
  winsVsCompetitor: number
  lossesToCompetitor: number
  winRate: number
  revenueAttributed: number
}

export interface StoreMetrics {
  id: string
  storeId: string
  date: string
  scansTotal: number
  purchasesTotal: number
  conversionRate: number
  winRate: number
  stockHealth?: number
  productPresence?: number
  avgPrice?: number
}

export interface ShelfImage {
  id: string
  productId: string
  storeId: string
  imageUrl: string
  position: 'eye-level' | 'upper-shelf' | 'lower-shelf' | 'endcap'
  neighbors: string[]
  timestamp: Date | string
}

export interface StockSignal {
  id: string
  productId: string
  storeId: string
  level: 'high' | 'medium' | 'low'
  trend: 'increasing' | 'stable' | 'decreasing'
  timestamp: Date | string
}
