// ─── Types ────────────────────────────────────────────────────────────────────

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
  emoji: string
  itemCount: number
  totalCurrentPrice: number
  totalCheapestPrice: number
  estimatedSavings: number
  lastUpdated: string
  items: BasketItem[]
  currentStoreId?: string
}

export interface StoreRanking {
  storeId: string
  storeName: string
  avgSavingsPct: number
  itemCount: number
  rank: number
  isTopValue: boolean
}

export interface PriceMovement {
  id: string
  product: Product
  store: string
  previousPrice: number
  currentPrice: number
  changePct: number
  changeAmount: number
  direction: 'up' | 'down'
  timestamp: string
  verifiedBy: number
}

export interface Reward {
  id: string
  title: string
  description: string
  requiredScans: number
  rewardValue: string
  isUnlocked: boolean
  isClaimed: boolean
  iconLabel: string // single char used as icon stand-in
}

export interface UserProfile {
  id: string
  displayName: string
  avatarInitials: string
  trustLevel: string
  trustBadge: string
  totalVerified: number
  storesVisited: number
  savingsUnlocked: number
  contributorPoints: number
  joinedDate: string
  recentScans: RecentScan[]
}

export interface RecentScan {
  id: string
  productName: string
  store: string
  price: number
  timestamp: string
  action: RecommendationAction
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_FEATURED_PRODUCT: Product = {
  id: 'prod-eggs-large',
  name: 'Large Grade A Eggs, 12 ct',
  brand: 'Great Value',
  category: 'Dairy',
  upc: '818290013218',
}

export const MOCK_FEATURED_INSIGHT = {
  product: MOCK_FEATURED_PRODUCT,
  currentPrice: 5.49,
  sevenDayLow: 4.29,
  recommendation: {
    action: 'wait' as RecommendationAction,
    headline: 'Wait until Monday',
    explanation: 'This item typically drops $1.20 on Mondays at Whole Foods.',
    confidence: 91,
  },
  verifiedBy: 34,
  store: 'Whole Foods',
  lastSeen: '2 mins ago',
}

// Price history for the chart ─────────────────────────────────────────────────

function generatePriceHistory(): PricePoint[] {
  const base = [
    { day: 0, price: 5.99 },
    { day: 1, price: 5.79 },
    { day: 2, price: 4.99 },
    { day: 3, price: 4.99 },
    { day: 4, price: 5.29 },
    { day: 5, price: 5.49 },
    { day: 6, price: 5.49 },
    { day: 7, price: 4.29 },
    { day: 8, price: 4.29 },
    { day: 9, price: 4.79 },
    { day: 10, price: 5.29 },
    { day: 11, price: 5.49 },
    { day: 12, price: 5.99 },
    { day: 13, price: 6.19 },
    { day: 14, price: 5.79 },
    { day: 15, price: 5.49 },
    { day: 16, price: 5.49 },
    { day: 17, price: 4.49 },
    { day: 18, price: 4.29 },
    { day: 19, price: 4.49 },
    { day: 20, price: 5.19 },
    { day: 21, price: 5.29 },
    { day: 22, price: 5.49 },
    { day: 23, price: 5.49 },
    { day: 24, price: 5.49 },
    { day: 25, price: 5.29 },
    { day: 26, price: 5.49 },
    { day: 27, price: 5.49 },
    { day: 28, price: 5.49 },
    { day: 29, price: 5.49 },
  ]
  const now = new Date()
  return base.map(({ day, price }) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (29 - day))
    return {
      timestamp: d.toISOString(),
      price,
      store: 'Whole Foods',
    }
  })
}

export const MOCK_PRICE_HISTORY_30D: PricePoint[] = generatePriceHistory()

export const MOCK_PRICE_HISTORY_7D: PricePoint[] = MOCK_PRICE_HISTORY_30D.slice(-7)

export const MOCK_PRICE_HISTORY_24H: PricePoint[] = [
  { timestamp: new Date(Date.now() - 23 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 20 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 17 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 14 * 3600000).toISOString(), price: 5.29, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 11 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), price: 5.49, store: 'Whole Foods' },
  { timestamp: new Date().toISOString(), price: 5.49, store: 'Whole Foods' },
]

// Store comparisons ────────────────────────────────────────────────────────────

export const MOCK_STORE_COMPARISONS: StoreComparison[] = [
  {
    storeId: 'wf_001',
    storeName: 'Whole Foods',
    currentPrice: 5.49,
    unitPrice: '$0.34 / oz',
    confidence: 94,
    lastVerified: '2 mins ago',
    stockStatus: 'in_stock',
    isBestValue: false,
    distance: '0.4 mi',
  },
  {
    storeId: 'tgt_001',
    storeName: 'Target',
    currentPrice: 3.69,
    unitPrice: '$0.23 / oz',
    confidence: 87,
    lastVerified: '18 mins ago',
    stockStatus: 'in_stock',
    isBestValue: true,
    distance: '1.1 mi',
  },
  {
    storeId: 'kgr_001',
    storeName: 'Kroger',
    currentPrice: 4.19,
    unitPrice: '$0.26 / oz',
    confidence: 79,
    lastVerified: '41 mins ago',
    stockStatus: 'low_stock',
    isBestValue: false,
    distance: '2.3 mi',
  },
]

// Recommendation ──────────────────────────────────────────────────────────────

export const MOCK_RECOMMENDATION: Recommendation = {
  action: 'switch_stores',
  headline: 'Switch to Target',
  explanation: 'You could save $1.80 by buying this at Target instead. Target has had this price confirmed by 12 shoppers in the last hour.',
  estimatedSavings: 1.80,
  confidence: 87,
}

// Best time to buy ─────────────────────────────────────────────────────────────

export const MOCK_BEST_TIME_TO_BUY: BestTimeToBuy = {
  cheapestDay: 'Monday',
  cheapestTimeWindow: '8am – 11am',
  estimatedSavings: 1.20,
  currentPrice: 5.49,
  projectedLowPrice: 4.29,
}

// Verification stats ──────────────────────────────────────────────────────────

export const MOCK_VERIFICATION_STATS: VerificationStats = {
  verifiedBy: 34,
  lastUpdatedMinutesAgo: 2,
  confidenceScore: 94,
  totalObservations: 218,
}

// Recent observations ─────────────────────────────────────────────────────────

export const MOCK_RECENT_OBSERVATIONS: RecentObservation[] = [
  {
    id: 'obs_001',
    shopperAlias: 'shopper_k7m',
    store: 'Whole Foods',
    price: 5.49,
    timestamp: '3 mins ago',
    isVerified: true,
    note: 'Shelf tag confirmed',
  },
  {
    id: 'obs_002',
    shopperAlias: 'shopper_p2x',
    store: 'Target',
    price: 3.69,
    timestamp: '11 mins ago',
    isVerified: true,
    note: 'Sale label visible',
  },
  {
    id: 'obs_003',
    shopperAlias: 'shopper_n8r',
    store: 'Kroger',
    price: 4.19,
    timestamp: '38 mins ago',
    isVerified: false,
  },
  {
    id: 'obs_004',
    shopperAlias: 'shopper_q1w',
    store: 'Whole Foods',
    price: 5.49,
    timestamp: '1 hr ago',
    isVerified: true,
  },
  {
    id: 'obs_005',
    shopperAlias: 'shopper_v5t',
    store: 'Target',
    price: 3.69,
    timestamp: '2 hrs ago',
    isVerified: true,
    note: 'Digital coupon applied',
  },
]

// Savings breakdown ───────────────────────────────────────────────────────────

export const MOCK_SAVINGS_BREAKDOWN: SavingsBreakdown = {
  buyNow: {
    price: 5.49,
    label: 'Buy now at Whole Foods',
    savings: 0,
  },
  waitOption: {
    price: 4.29,
    label: 'Wait until Monday morning',
    savings: 1.20,
    targetWindow: 'Mon 8–11am',
  },
  switchStore: {
    price: 3.69,
    label: 'Switch to Target (1.1 mi)',
    savings: 1.80,
    storeName: 'Target',
  },
}

// Scan result mock ────────────────────────────────────────────────────────────

export const MOCK_SCAN_RESULT = {
  product: MOCK_FEATURED_PRODUCT,
  store: 'Whole Foods',
  currentPrice: 5.49,
  unitPrice: '$0.34 / oz',
  promoLabel: null as string | null,
  lastSeen: '2 mins ago',
  confidenceScore: 94,
  verifiedBy: 34,
  isPromo: false,
  recommendation: MOCK_RECOMMENDATION,
}

// ─── Cheaper Alternatives (same-store substitution) ─────────────────────────

export type AlternativeBadge =
  | 'Best Value'
  | 'Similar Taste'
  | 'Highest Rated'
  | 'Cheapest Swap'
  | 'Staff Pick'

export interface CheaperAlternative {
  id: string
  name: string
  brand: string
  image: string | null
  currentPrice: number
  originalPriceComparison: number
  savingsAmount: number
  rating: number
  reviewCount: number
  badge: AlternativeBadge
  recommendationReason: string
  inStock: boolean
  confidenceScore: number
}

export interface AlternativesScanData {
  scannedProduct: typeof MOCK_SCAN_RESULT
  cheaperAlternatives: CheaperAlternative[]
  savingsSummary: {
    maxSavings: number
    averageSavings: number
    totalAlternatives: number
    summaryText: string
  }
  verificationStats: {
    observationsToday: number
    lastRefreshed: string
    dataSource: string
  }
  isAlreadyCheapest: boolean
  cheapestMessage: string | null
}

export const MOCK_CHEAPER_ALTERNATIVES: CheaperAlternative[] = [
  {
    id: 'alt_001',
    name: 'Fage Total 0% Greek Yogurt, Plain',
    brand: 'Fage',
    image: null,
    currentPrice: 4.29,
    originalPriceComparison: 5.49,
    savingsAmount: 1.20,
    rating: 4.6,
    reviewCount: 1284,
    badge: 'Best Value',
    recommendationReason: '4.6 stars and 22% cheaper — most popular swap in this aisle',
    inStock: true,
    confidenceScore: 91,
  },
  {
    id: 'alt_002',
    name: 'Stonyfield Organic Greek Yogurt, Plain',
    brand: 'Stonyfield',
    image: null,
    currentPrice: 4.79,
    originalPriceComparison: 5.49,
    savingsAmount: 0.70,
    rating: 4.4,
    reviewCount: 876,
    badge: 'Similar Taste',
    recommendationReason: 'Organic certified with a flavor profile shoppers say is closest to Chobani',
    inStock: true,
    confidenceScore: 88,
  },
  {
    id: 'alt_003',
    name: '365 Organic Greek Yogurt, Plain',
    brand: '365 by Whole Foods',
    image: null,
    currentPrice: 3.49,
    originalPriceComparison: 5.49,
    savingsAmount: 2.00,
    rating: 4.1,
    reviewCount: 412,
    badge: 'Cheapest Swap',
    recommendationReason: 'Save $2.00 — the store brand with solid reviews',
    inStock: true,
    confidenceScore: 94,
  },
  {
    id: 'alt_004',
    name: 'Siggi\'s Icelandic Skyr, Plain',
    brand: 'Siggi\'s',
    image: null,
    currentPrice: 4.99,
    originalPriceComparison: 5.49,
    savingsAmount: 0.50,
    rating: 4.8,
    reviewCount: 2103,
    badge: 'Highest Rated',
    recommendationReason: '4.8 rating — the highest-rated alternative in the dairy aisle',
    inStock: true,
    confidenceScore: 86,
  },
  {
    id: 'alt_005',
    name: 'Maple Hill Creamery Greek Yogurt, Plain',
    brand: 'Maple Hill',
    image: null,
    currentPrice: 4.49,
    originalPriceComparison: 5.49,
    savingsAmount: 1.00,
    rating: 4.5,
    reviewCount: 327,
    badge: 'Staff Pick',
    recommendationReason: 'Grass-fed, 100% organic — a premium option at 18% less',
    inStock: false,
    confidenceScore: 79,
  },
]

export const MOCK_ALTERNATIVES_SCAN_DATA: AlternativesScanData = {
  scannedProduct: MOCK_SCAN_RESULT,
  cheaperAlternatives: MOCK_CHEAPER_ALTERNATIVES,
  savingsSummary: {
    maxSavings: 2.00,
    averageSavings: 1.08,
    totalAlternatives: 5,
    summaryText: 'You could save up to $2.00 on this item with a smart swap',
  },
  verificationStats: {
    observationsToday: 34,
    lastRefreshed: '2 mins ago',
    dataSource: 'Based on recent in-store observations and shopper data',
  },
  isAlreadyCheapest: false,
  cheapestMessage: null,
}

export const MOCK_ALREADY_CHEAPEST: AlternativesScanData = {
  scannedProduct: MOCK_SCAN_RESULT,
  cheaperAlternatives: [],
  savingsSummary: {
    maxSavings: 0,
    averageSavings: 0,
    totalAlternatives: 0,
    summaryText: '',
  },
  verificationStats: {
    observationsToday: 34,
    lastRefreshed: '2 mins ago',
    dataSource: 'Based on recent in-store observations and shopper data',
  },
  isAlreadyCheapest: true,
  cheapestMessage: "You're already looking at one of the best-value options in this aisle.",
}

// Basket ──────────────────────────────────────────────────────────────────────

export const MOCK_BASKET: Basket = {
  id: 'basket_001',
  currentStoreName: 'Whole Foods',
  totalCurrentStore: 42.17,
  totalCheapest: 33.52,
  estimatedTotalSavings: 8.65,
  bestAction: 'Split basket across two stores',
  bestActionDetail: 'Buy 4 items at Target, remaining 2 at Whole Foods for maximum savings.',
  projectedBestWindow: 'Monday, 8am – 11am',
  projectedBestWindowReason: '4 of your 6 items historically reach weekly lows on Monday mornings.',
  items: [
    {
      id: 'bi_001',
      product: { id: 'prod_001', name: 'Chobani Greek Yogurt, Plain', brand: 'Chobani', category: 'Dairy' },
      quantity: 2,
      currentStorePrice: 5.49,
      bestAlternatePrice: 3.69,
      bestAlternateStore: 'Target',
      recommendation: 'switch_stores',
      potentialSavings: 3.60,
    },
    {
      id: 'bi_002',
      product: { id: 'prod_002', name: 'Dave\'s Killer Bread, 21 Whole Grains', brand: 'Dave\'s Killer Bread', category: 'Bakery' },
      quantity: 1,
      currentStorePrice: 6.99,
      bestAlternatePrice: 5.49,
      bestAlternateStore: 'Kroger',
      recommendation: 'switch_stores',
      potentialSavings: 1.50,
    },
    {
      id: 'bi_003',
      product: { id: 'prod_003', name: 'Organic Valley Whole Milk, 1/2 gal', brand: 'Organic Valley', category: 'Dairy' },
      quantity: 1,
      currentStorePrice: 5.29,
      bestAlternatePrice: 4.89,
      bestAlternateStore: 'Target',
      recommendation: 'buy_now',
      potentialSavings: 0.40,
    },
    {
      id: 'bi_004',
      product: { id: 'prod_004', name: 'RXBAR Chocolate Sea Salt', brand: 'RXBAR', category: 'Snacks' },
      quantity: 3,
      currentStorePrice: 3.49,
      bestAlternatePrice: 2.79,
      bestAlternateStore: 'Target',
      recommendation: 'switch_stores',
      potentialSavings: 2.10,
    },
    {
      id: 'bi_005',
      product: { id: 'prod_005', name: 'Siete Almond Flour Tortillas', brand: 'Siete', category: 'Pantry' },
      quantity: 1,
      currentStorePrice: 8.99,
      bestAlternatePrice: 8.49,
      bestAlternateStore: 'Kroger',
      recommendation: 'wait',
      potentialSavings: 0.50,
    },
    {
      id: 'bi_006',
      product: { id: 'prod_006', name: 'Califia Farms Oat Milk, Barista', brand: 'Califia Farms', category: 'Dairy Alt' },
      quantity: 1,
      currentStorePrice: 7.49,
      bestAlternatePrice: 5.99,
      bestAlternateStore: 'Target',
      recommendation: 'switch_stores',
      potentialSavings: 1.50,
    },
  ],
}

// Grocery Lists ───────────────────────────────────────────────────────────────

const weeklyDinnerItems: BasketItem[] = [
  {
    id: 'bi_101',
    product: { id: 'prod_001', name: 'Chobani Greek Yogurt, Plain', brand: 'Chobani', category: 'Dairy' },
    quantity: 2,
    currentStorePrice: 5.49,
    bestAlternatePrice: 3.69,
    bestAlternateStore: 'Target',
    recommendation: 'switch_stores',
    potentialSavings: 3.60,
  },
  {
    id: 'bi_102',
    product: { id: 'prod_002', name: "Dave's Killer Bread, 21 Whole Grains", brand: "Dave's Killer Bread", category: 'Bakery' },
    quantity: 1,
    currentStorePrice: 6.99,
    bestAlternatePrice: 5.49,
    bestAlternateStore: 'Kroger',
    recommendation: 'switch_stores',
    potentialSavings: 1.50,
  },
  {
    id: 'bi_103',
    product: { id: 'prod_007', name: 'Organic Chicken Breast, 1 lb', brand: 'Organic Prairie', category: 'Meat' },
    quantity: 2,
    currentStorePrice: 9.99,
    bestAlternatePrice: 8.49,
    bestAlternateStore: 'Kroger',
    recommendation: 'switch_stores',
    potentialSavings: 3.00,
  },
  {
    id: 'bi_104',
    product: { id: 'prod_008', name: 'Jasmine Rice, 5 lb', brand: "Trader Joe's", category: 'Pantry' },
    quantity: 1,
    currentStorePrice: 7.49,
    bestAlternatePrice: 5.99,
    bestAlternateStore: 'Kroger',
    recommendation: 'switch_stores',
    potentialSavings: 1.50,
  },
]

const bdayPartyItems: BasketItem[] = [
  {
    id: 'bi_201',
    product: { id: 'prod_009', name: 'Pepperidge Farm Milano Cookies', brand: 'Pepperidge Farm', category: 'Snacks' },
    quantity: 3,
    currentStorePrice: 4.29,
    bestAlternatePrice: 3.49,
    bestAlternateStore: 'Target',
    recommendation: 'switch_stores',
    potentialSavings: 2.40,
  },
  {
    id: 'bi_202',
    product: { id: 'prod_010', name: 'Topo Chico Sparkling Water, 12-pack', brand: 'Topo Chico', category: 'Beverages' },
    quantity: 2,
    currentStorePrice: 9.99,
    bestAlternatePrice: 7.99,
    bestAlternateStore: 'Kroger',
    recommendation: 'switch_stores',
    potentialSavings: 4.00,
  },
  {
    id: 'bi_203',
    product: { id: 'prod_011', name: 'Simple Mills Almond Crackers', brand: 'Simple Mills', category: 'Snacks' },
    quantity: 2,
    currentStorePrice: 5.99,
    bestAlternatePrice: 5.49,
    bestAlternateStore: 'Target',
    recommendation: 'buy_now',
    potentialSavings: 1.00,
  },
  {
    id: 'bi_204',
    product: { id: 'prod_006', name: 'Califia Farms Oat Milk, Barista', brand: 'Califia Farms', category: 'Dairy Alt' },
    quantity: 1,
    currentStorePrice: 7.49,
    bestAlternatePrice: 5.99,
    bestAlternateStore: 'Target',
    recommendation: 'switch_stores',
    potentialSavings: 1.50,
  },
]

const snackStashItems: BasketItem[] = [
  {
    id: 'bi_301',
    product: { id: 'prod_004', name: 'RXBAR Chocolate Sea Salt', brand: 'RXBAR', category: 'Snacks' },
    quantity: 6,
    currentStorePrice: 3.49,
    bestAlternatePrice: 2.79,
    bestAlternateStore: 'Target',
    recommendation: 'switch_stores',
    potentialSavings: 4.20,
  },
  {
    id: 'bi_302',
    product: { id: 'prod_012', name: 'Kind Bar, Dark Chocolate Nuts', brand: 'Kind', category: 'Snacks' },
    quantity: 4,
    currentStorePrice: 2.99,
    bestAlternatePrice: 2.49,
    bestAlternateStore: 'Kroger',
    recommendation: 'wait',
    potentialSavings: 2.00,
  },
  {
    id: 'bi_303',
    product: { id: 'prod_005', name: 'Siete Almond Flour Tortillas', brand: 'Siete', category: 'Pantry' },
    quantity: 2,
    currentStorePrice: 8.99,
    bestAlternatePrice: 8.49,
    bestAlternateStore: 'Kroger',
    recommendation: 'wait',
    potentialSavings: 1.00,
  },
]

export const MOCK_GROCERY_LISTS: GroceryList[] = [
  {
    id: 'list_001',
    name: 'Weekly Dinners',
    emoji: '🍽',
    itemCount: weeklyDinnerItems.length,
    totalCurrentPrice: 39.95,
    totalCheapestPrice: 30.35,
    estimatedSavings: 9.60,
    lastUpdated: '2 hrs ago',
    items: weeklyDinnerItems,
  },
  {
    id: 'list_002',
    name: 'Bday Party',
    emoji: '🎉',
    itemCount: bdayPartyItems.length,
    totalCurrentPrice: 47.73,
    totalCheapestPrice: 38.83,
    estimatedSavings: 8.90,
    lastUpdated: '1 day ago',
    items: bdayPartyItems,
  },
  {
    id: 'list_003',
    name: 'Snack Stash',
    emoji: '🥨',
    itemCount: snackStashItems.length,
    totalCurrentPrice: 38.88,
    totalCheapestPrice: 31.68,
    estimatedSavings: 7.20,
    lastUpdated: '3 days ago',
    items: snackStashItems,
  },
]

export const MOCK_ACTIVE_LIST = MOCK_GROCERY_LISTS[0]

// Shelf photo contribution state ──────────────────────────────────────────────
// The gate: user must submit at least ceil(itemCount / 2) shelf photos
// before they can unlock price intelligence on subsequent scans.
export const MOCK_SHELF_CONTRIBUTION = {
  shelfPhotosSubmitted: 1,           // photos the user has submitted so far
  requiredToUnlock: Math.ceil(MOCK_GROCERY_LISTS[0].itemCount / 2), // = 2
  totalListItems: MOCK_GROCERY_LISTS[0].itemCount, // = 4
}

// Store rankings (cheapest for today's lists) ─────────────────────────────────

export const MOCK_STORE_RANKINGS: StoreRanking[] = [
  { storeId: 'tgt_001', storeName: 'Target', avgSavingsPct: 21, itemCount: 14, rank: 1, isTopValue: true },
  { storeId: 'kgr_001', storeName: 'Kroger', avgSavingsPct: 14, itemCount: 11, rank: 2, isTopValue: false },
  { storeId: 'aldi_001', storeName: 'Aldi', avgSavingsPct: 9, itemCount: 8, rank: 3, isTopValue: false },
  { storeId: 'wf_001', storeName: 'Whole Foods', avgSavingsPct: 0, itemCount: 16, rank: 4, isTopValue: false },
  { storeId: 'cvs_001', storeName: 'Walmart', avgSavingsPct: -3, itemCount: 13, rank: 5, isTopValue: false },
]

// Shopping optimization ───────────────────────────────────────────────────────

export interface SingleStoreOption {
  storeId: string
  storeName: string
  total: number
  savings: number
  savingsPct: number
  isBest: boolean
}

export interface MultiStoreStop {
  storeName: string
  items: { name: string; price: number; qty: number }[]
  subtotal: number
}

export interface ShoppingOptimization {
  listName: string
  baselineTotal: number
  singleStoreOptions: SingleStoreOption[]
  multiStoreTotal: number
  multiStoreSavings: number
  multiStoreStops: MultiStoreStop[]
}

export const MOCK_SHOPPING_OPTIMIZATION: ShoppingOptimization = {
  listName: 'Weekly Dinners',
  baselineTotal: 39.95,
  singleStoreOptions: [
    { storeId: 'tgt_001', storeName: 'Target',      total: 32.14, savings: 7.81, savingsPct: 20, isBest: true },
    { storeId: 'kgr_001', storeName: 'Kroger',      total: 34.46, savings: 5.49, savingsPct: 14, isBest: false },
    { storeId: 'wf_001',  storeName: 'Whole Foods', total: 39.95, savings: 0,    savingsPct: 0,  isBest: false },
  ],
  multiStoreTotal: 28.66,
  multiStoreSavings: 11.29,
  multiStoreStops: [
    {
      storeName: 'Target',
      items: [
        { name: 'Chobani Greek Yogurt, Plain',       price: 3.69, qty: 2 },
        { name: 'Califia Farms Oat Milk, Barista',   price: 5.99, qty: 1 },
      ],
      subtotal: 13.37,
    },
    {
      storeName: 'Kroger',
      items: [
        { name: "Dave's Killer Bread, 21 Whole Grains", price: 5.49, qty: 1 },
        { name: 'Organic Chicken Breast, 1 lb',         price: 8.49, qty: 2 },
        { name: 'Jasmine Rice, 5 lb',                   price: 5.99, qty: 1 },
      ],
      subtotal: 28.46,
    },
  ],
}

// Price movements ─────────────────────────────────────────────────────────────

export const MOCK_PRICE_MOVEMENTS: PriceMovement[] = [
  {
    id: 'mv_001',
    product: { id: 'prod_004', name: 'RXBAR Chocolate Sea Salt', brand: 'RXBAR', category: 'Snacks' },
    store: 'Target',
    previousPrice: 3.49,
    currentPrice: 2.79,
    changePct: -20,
    changeAmount: -0.70,
    direction: 'down',
    timestamp: '14 mins ago',
    verifiedBy: 8,
  },
  {
    id: 'mv_002',
    product: { id: 'prod_013', name: 'Beyond Meat Burger Patties', brand: 'Beyond Meat', category: 'Meat Alt' },
    store: 'Whole Foods',
    previousPrice: 5.99,
    currentPrice: 8.49,
    changePct: 42,
    changeAmount: 2.50,
    direction: 'up',
    timestamp: '1 hr ago',
    verifiedBy: 5,
  },
]

// Rewards ─────────────────────────────────────────────────────────────────────

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'rwd_001',
    title: 'First Scan',
    description: 'Scan your first product in any aisle.',
    requiredScans: 1,
    rewardValue: '+25 pts',
    isUnlocked: true,
    isClaimed: true,
    iconLabel: 'S',
  },
  {
    id: 'rwd_002',
    title: 'Aisle Explorer',
    description: 'Scan products across 5 different aisles.',
    requiredScans: 5,
    rewardValue: '+75 pts',
    isUnlocked: true,
    isClaimed: true,
    iconLabel: 'A',
  },
  {
    id: 'rwd_003',
    title: 'Price Hunter',
    description: 'Verify 25 prices across any stores.',
    requiredScans: 25,
    rewardValue: '$0.50 off',
    isUnlocked: true,
    isClaimed: false,
    iconLabel: 'P',
  },
  {
    id: 'rwd_004',
    title: 'Aisle Champion',
    description: 'Scan products in 10 unique aisles.',
    requiredScans: 50,
    rewardValue: '$1.00 off',
    isUnlocked: false,
    isClaimed: false,
    iconLabel: 'C',
  },
  {
    id: 'rwd_005',
    title: 'Store Insider',
    description: 'Complete a full store scan — every aisle.',
    requiredScans: 100,
    rewardValue: '$2.50 off',
    isUnlocked: false,
    isClaimed: false,
    iconLabel: 'I',
  },
  {
    id: 'rwd_006',
    title: 'Price Oracle',
    description: 'Verify 200 prices with 90%+ accuracy.',
    requiredScans: 200,
    rewardValue: '$5.00 off',
    isUnlocked: false,
    isClaimed: false,
    iconLabel: 'O',
  },
]

// User profile ─────────────────────────────────────────────────────────────────

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user_001',
  displayName: 'Alex M.',
  avatarInitials: 'AM',
  trustLevel: 'Gold Contributor',
  trustBadge: 'Verified Shopper',
  totalVerified: 142,
  storesVisited: 8,
  savingsUnlocked: 94.20,
  contributorPoints: 2_840,
  joinedDate: 'Feb 2025',
  recentScans: [
    { id: 'rs_001', productName: 'Chobani Greek Yogurt, Plain', store: 'Whole Foods', price: 5.49, timestamp: '2 mins ago', action: 'wait' },
    { id: 'rs_002', productName: 'Califia Farms Oat Milk', store: 'Whole Foods', price: 7.49, timestamp: '8 mins ago', action: 'switch_stores' },
    { id: 'rs_003', productName: 'Dave\'s Killer Bread', store: 'Kroger', price: 5.49, timestamp: '1 hr ago', action: 'buy_now' },
    { id: 'rs_004', productName: 'RXBAR Chocolate Sea Salt', store: 'Target', price: 2.79, timestamp: '2 hrs ago', action: 'buy_now' },
    { id: 'rs_005', productName: 'Siete Almond Flour Tortillas', store: 'Whole Foods', price: 8.99, timestamp: 'Yesterday', action: 'wait' },
  ],
}

// ─── Receipt Scan ──────────────────────────────────────────────────────────

export interface ReceiptLineItem {
  id: string
  rawText: string
  matchedProduct: Product | null
  quantity: number
  unitPrice: number
  lineTotal: number
  matchedToList: string | null
  isNewItem: boolean
}

export interface ParsedReceipt {
  id: string
  store: string
  date: string
  lineItems: ReceiptLineItem[]
  subtotal: number
  tax: number
  total: number
  matchedListId: string | null
  matchedListName: string | null
  itemsMatchedToList: number
  newItemsDetected: number
  pricesUpdated: number
}

export const MOCK_PARSED_RECEIPT: ParsedReceipt = {
  id: 'rcpt_001',
  store: 'Whole Foods',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  lineItems: [
    {
      id: 'rli_001',
      rawText: 'CHOBANI GRK YOG PLN 16OZ',
      matchedProduct: { id: 'prod_001', name: 'Chobani Greek Yogurt, Plain', brand: 'Chobani', category: 'Dairy' },
      quantity: 2,
      unitPrice: 5.49,
      lineTotal: 10.98,
      matchedToList: 'list_001',
      isNewItem: false,
    },
    {
      id: 'rli_002',
      rawText: 'DKB 21 WHOLE GRAINS',
      matchedProduct: { id: 'prod_002', name: "Dave's Killer Bread, 21 Whole Grains", brand: "Dave's Killer Bread", category: 'Bakery' },
      quantity: 1,
      unitPrice: 6.99,
      lineTotal: 6.99,
      matchedToList: 'list_001',
      isNewItem: false,
    },
    {
      id: 'rli_003',
      rawText: 'ORG CHKN BRST 1LB',
      matchedProduct: { id: 'prod_007', name: 'Organic Chicken Breast, 1 lb', brand: 'Organic Prairie', category: 'Meat' },
      quantity: 2,
      unitPrice: 9.99,
      lineTotal: 19.98,
      matchedToList: 'list_001',
      isNewItem: false,
    },
    {
      id: 'rli_004',
      rawText: 'JASMINE RICE 5LB',
      matchedProduct: { id: 'prod_008', name: 'Jasmine Rice, 5 lb', brand: "Trader Joe's", category: 'Pantry' },
      quantity: 1,
      unitPrice: 7.49,
      lineTotal: 7.49,
      matchedToList: 'list_001',
      isNewItem: false,
    },
    {
      id: 'rli_005',
      rawText: 'OATLY OAT MILK XTRA CRM',
      matchedProduct: { id: 'prod_014', name: 'Oatly Oat Milk, Extra Creamy', brand: 'Oatly', category: 'Dairy Alt' },
      quantity: 1,
      unitPrice: 5.99,
      lineTotal: 5.99,
      matchedToList: null,
      isNewItem: true,
    },
    {
      id: 'rli_006',
      rawText: 'SIETE ALM FLOUR TORT',
      matchedProduct: { id: 'prod_005', name: 'Siete Almond Flour Tortillas', brand: 'Siete', category: 'Pantry' },
      quantity: 1,
      unitPrice: 8.99,
      lineTotal: 8.99,
      matchedToList: null,
      isNewItem: true,
    },
  ],
  subtotal: 60.42,
  tax: 3.63,
  total: 64.05,
  matchedListId: MOCK_ACTIVE_LIST.id,
  matchedListName: MOCK_ACTIVE_LIST.name,
  itemsMatchedToList: 4,
  newItemsDetected: 2,
  pricesUpdated: 4,
}
