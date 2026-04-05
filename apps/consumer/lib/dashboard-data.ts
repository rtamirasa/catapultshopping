// AisleIQ Insights — B2B Dashboard Mock Data
// All UI components read from these objects. Replace with real API calls later.

export type DateRange = '24h' | '7d' | '30d'
export type StockLevel = 'high' | 'medium' | 'low'
export type AlertSeverity = 'critical' | 'warning' | 'info'
export type Trend = 'up' | 'down' | 'flat'

// ─── Products ────────────────────────────────────────────────────────────────

export interface DashProduct {
  id: string
  name: string
  brand: string
  sku: string
  category: string
  avgPrice: number
  competitorAvgPrice: number
  priceDelta: number           // vs competitor, negative = cheaper
  priceChangePct: number       // vs prior period
  trend: Trend
  shelfPresencePct: number     // % of stores where seen
  stockStatus: StockLevel
  lastSeen: string
  observationsToday: number
  volatilityScore: number      // 0–100
}

export const DASH_PRODUCTS: DashProduct[] = [
  {
    id: 'dp_001', name: 'Chobani Greek Yogurt, Plain 32oz', brand: 'Chobani',
    sku: 'CHO-GYP-32', category: 'Dairy',
    avgPrice: 5.49, competitorAvgPrice: 5.89, priceDelta: -0.40,
    priceChangePct: -8.2, trend: 'down',
    shelfPresencePct: 84, stockStatus: 'high', lastSeen: '6 min ago',
    observationsToday: 47, volatilityScore: 28,
  },
  {
    id: 'dp_002', name: "Dave's Killer Bread, 21 Grains", brand: "Dave's Killer Bread",
    sku: 'DKB-21G-27', category: 'Bakery',
    avgPrice: 6.99, competitorAvgPrice: 5.99, priceDelta: 1.00,
    priceChangePct: 4.5, trend: 'up',
    shelfPresencePct: 71, stockStatus: 'medium', lastSeen: '22 min ago',
    observationsToday: 31, volatilityScore: 52,
  },
  {
    id: 'dp_003', name: 'RXBAR Chocolate Sea Salt, 12-pack', brand: 'RXBAR',
    sku: 'RXB-CSS-12', category: 'Snacks',
    avgPrice: 3.49, competitorAvgPrice: 3.79, priceDelta: -0.30,
    priceChangePct: -20.0, trend: 'down',
    shelfPresencePct: 62, stockStatus: 'low', lastSeen: '1 hr ago',
    observationsToday: 19, volatilityScore: 74,
  },
  {
    id: 'dp_004', name: 'Califia Farms Oat Milk, Barista', brand: 'Califia Farms',
    sku: 'CAL-OMB-48', category: 'Dairy Alt',
    avgPrice: 7.49, competitorAvgPrice: 7.29, priceDelta: 0.20,
    priceChangePct: 2.7, trend: 'flat',
    shelfPresencePct: 55, stockStatus: 'medium', lastSeen: '3 hrs ago',
    observationsToday: 14, volatilityScore: 19,
  },
  {
    id: 'dp_005', name: 'Siete Almond Flour Tortillas, 7-pack', brand: 'Siete',
    sku: 'SIE-AFT-07', category: 'Pantry',
    avgPrice: 8.99, competitorAvgPrice: 9.49, priceDelta: -0.50,
    priceChangePct: 0, trend: 'flat',
    shelfPresencePct: 48, stockStatus: 'high', lastSeen: '5 hrs ago',
    observationsToday: 9, volatilityScore: 11,
  },
  {
    id: 'dp_006', name: 'Beyond Meat Burger Patties, 2-pack', brand: 'Beyond Meat',
    sku: 'BYM-BPP-02', category: 'Meat Alt',
    avgPrice: 8.49, competitorAvgPrice: 5.99, priceDelta: 2.50,
    priceChangePct: 41.7, trend: 'up',
    shelfPresencePct: 39, stockStatus: 'low', lastSeen: '45 min ago',
    observationsToday: 22, volatilityScore: 88,
  },
]

// ─── Stores ──────────────────────────────────────────────────────────────────

export interface DashStore {
  id: string
  name: string
  chain: string
  city: string
  state: string
  avgPrice: number
  stockHealth: number       // 0–100
  productPresencePct: number
  scanFrequency: number     // scans / day avg
  lastActivity: string
  isUnderperforming: boolean
  lat: number
  lng: number
}

export const DASH_STORES: DashStore[] = [
  { id: 'st_001', name: 'Target Midtown', chain: 'Target', city: 'New York', state: 'NY', avgPrice: 5.92, stockHealth: 88, productPresencePct: 84, scanFrequency: 34, lastActivity: '4 min ago', isUnderperforming: false, lat: 40.754, lng: -73.984 },
  { id: 'st_002', name: 'Kroger Buckhead', chain: 'Kroger', city: 'Atlanta', state: 'GA', avgPrice: 5.61, stockHealth: 72, productPresencePct: 71, scanFrequency: 21, lastActivity: '18 min ago', isUnderperforming: false, lat: 33.848, lng: -84.373 },
  { id: 'st_003', name: 'Whole Foods Lincoln Park', chain: 'Whole Foods', city: 'Chicago', state: 'IL', avgPrice: 7.49, stockHealth: 41, productPresencePct: 52, scanFrequency: 11, lastActivity: '2 hrs ago', isUnderperforming: true, lat: 41.921, lng: -87.644 },
  { id: 'st_004', name: 'Aldi West Loop', chain: 'Aldi', city: 'Chicago', state: 'IL', avgPrice: 4.29, stockHealth: 67, productPresencePct: 63, scanFrequency: 18, lastActivity: '1 hr ago', isUnderperforming: false, lat: 41.882, lng: -87.650 },
  { id: 'st_005', name: 'Walmart Supercenter', chain: 'Walmart', city: 'Dallas', state: 'TX', avgPrice: 4.98, stockHealth: 29, productPresencePct: 44, scanFrequency: 7, lastActivity: '6 hrs ago', isUnderperforming: true, lat: 32.789, lng: -96.800 },
  { id: 'st_006', name: 'Target Silver Lake', chain: 'Target', city: 'Los Angeles', state: 'CA', avgPrice: 6.14, stockHealth: 81, productPresencePct: 78, scanFrequency: 29, lastActivity: '12 min ago', isUnderperforming: false, lat: 34.086, lng: -118.271 },
]

// ─── Price observations ───────────────────────────────────────────────────────

export interface PriceObservation {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  price: number
  previousPrice: number
  changePct: number
  direction: 'up' | 'down'
  timestamp: string
  confidence: number    // 0–100
  shopperHandle: string
}

export const PRICE_OBSERVATIONS: PriceObservation[] = [
  { id: 'obs_001', productId: 'dp_003', productName: 'RXBAR Chocolate Sea Salt', storeId: 'st_001', storeName: 'Target Midtown', price: 2.79, previousPrice: 3.49, changePct: -20.1, direction: 'down', timestamp: '6 min ago', confidence: 94, shopperHandle: '@mj_scans' },
  { id: 'obs_002', productId: 'dp_006', productName: 'Beyond Meat Burger Patties', storeId: 'st_003', storeName: 'Whole Foods Lincoln Park', price: 8.49, previousPrice: 5.99, changePct: 41.7, direction: 'up', timestamp: '14 min ago', confidence: 88, shopperHandle: '@urbangrocr' },
  { id: 'obs_003', productId: 'dp_001', productName: 'Chobani Greek Yogurt', storeId: 'st_006', storeName: 'Target Silver Lake', price: 4.99, previousPrice: 5.49, changePct: -9.1, direction: 'down', timestamp: '22 min ago', confidence: 97, shopperHandle: '@pricewatch_k' },
  { id: 'obs_004', productId: 'dp_002', productName: "Dave's Killer Bread", storeId: 'st_002', storeName: 'Kroger Buckhead', price: 7.29, previousPrice: 6.99, changePct: 4.3, direction: 'up', timestamp: '31 min ago', confidence: 82, shopperHandle: '@atl_deals' },
  { id: 'obs_005', productId: 'dp_004', productName: 'Califia Farms Oat Milk', storeId: 'st_004', storeName: 'Aldi West Loop', price: 5.79, previousPrice: 5.99, changePct: -3.3, direction: 'down', timestamp: '47 min ago', confidence: 91, shopperHandle: '@chi_scanner' },
  { id: 'obs_006', productId: 'dp_005', productName: 'Siete Tortillas', storeId: 'st_005', storeName: 'Walmart Supercenter', price: 9.49, previousPrice: 8.99, changePct: 5.6, direction: 'up', timestamp: '1 hr ago', confidence: 76, shopperHandle: '@dfw_finds' },
]

// ─── Price trend data (chart) ─────────────────────────────────────────────────

export interface PriceTrendPoint {
  label: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  competitorAvg: number
}

export const PRICE_TREND_7D: PriceTrendPoint[] = [
  { label: 'Mar 29', avgPrice: 5.89, minPrice: 5.49, maxPrice: 6.29, competitorAvg: 5.99 },
  { label: 'Mar 30', avgPrice: 5.72, minPrice: 5.29, maxPrice: 6.19, competitorAvg: 5.95 },
  { label: 'Mar 31', avgPrice: 5.61, minPrice: 4.99, maxPrice: 6.09, competitorAvg: 5.89 },
  { label: 'Apr 1',  avgPrice: 5.49, minPrice: 4.79, maxPrice: 6.19, competitorAvg: 5.89 },
  { label: 'Apr 2',  avgPrice: 5.39, minPrice: 4.69, maxPrice: 6.09, competitorAvg: 5.85 },
  { label: 'Apr 3',  avgPrice: 5.44, minPrice: 4.79, maxPrice: 6.14, competitorAvg: 5.87 },
  { label: 'Apr 4',  avgPrice: 5.49, minPrice: 4.99, maxPrice: 5.99, competitorAvg: 5.89 },
]

export const PRICE_TREND_30D: PriceTrendPoint[] = [
  { label: 'Mar 5',  avgPrice: 6.19, minPrice: 5.79, maxPrice: 6.59, competitorAvg: 6.09 },
  { label: 'Mar 9',  avgPrice: 5.99, minPrice: 5.49, maxPrice: 6.39, competitorAvg: 6.05 },
  { label: 'Mar 13', avgPrice: 5.89, minPrice: 5.29, maxPrice: 6.29, competitorAvg: 6.01 },
  { label: 'Mar 17', avgPrice: 5.79, minPrice: 5.19, maxPrice: 6.29, competitorAvg: 5.97 },
  { label: 'Mar 21', avgPrice: 5.99, minPrice: 5.49, maxPrice: 6.49, competitorAvg: 5.99 },
  { label: 'Mar 25', avgPrice: 5.69, minPrice: 5.09, maxPrice: 6.19, competitorAvg: 5.95 },
  { label: 'Mar 29', avgPrice: 5.49, minPrice: 4.99, maxPrice: 6.09, competitorAvg: 5.89 },
  { label: 'Apr 4',  avgPrice: 5.49, minPrice: 4.99, maxPrice: 5.99, competitorAvg: 5.89 },
]

// ─── Competitors ──────────────────────────────────────────────────────────────

export interface Competitor {
  id: string
  name: string
  brand: string
  category: string
  avgPrice: number
  shelfPresencePct: number
  stockStatus: StockLevel
  adjacencyPct: number    // % of time seen next to our product
  eyeLevelPct: number
}

export const COMPETITORS: Competitor[] = [
  { id: 'comp_001', name: 'Fage Total 0% Greek Yogurt', brand: 'Fage', category: 'Dairy', avgPrice: 5.89, shelfPresencePct: 79, stockStatus: 'high', adjacencyPct: 64, eyeLevelPct: 58 },
  { id: 'comp_002', name: 'Oikos Pro Protein Yogurt', brand: 'Oikos', category: 'Dairy', avgPrice: 5.49, shelfPresencePct: 72, stockStatus: 'medium', adjacencyPct: 41, eyeLevelPct: 72 },
  { id: 'comp_003', name: 'Silk Oat Yeah Oat Milk', brand: 'Silk', category: 'Dairy Alt', avgPrice: 6.99, shelfPresencePct: 68, stockStatus: 'medium', adjacencyPct: 55, eyeLevelPct: 44 },
]

// ─── Shelf images ─────────────────────────────────────────────────────────────

export interface ShelfImage {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  timestamp: string
  confidence: number
  placement: 'eye-level' | 'lower-shelf' | 'endcap' | 'top-shelf'
  neighbors: string[]
  imageColor: string  // placeholder color for mock image block
}

export const SHELF_IMAGES: ShelfImage[] = [
  { id: 'img_001', productId: 'dp_001', productName: 'Chobani Greek Yogurt', storeId: 'st_001', storeName: 'Target Midtown', timestamp: '6 min ago', confidence: 94, placement: 'eye-level', neighbors: ['Fage Total', 'Oikos Pro'], imageColor: '#dbeafe' },
  { id: 'img_002', productId: 'dp_003', productName: 'RXBAR Chocolate Sea Salt', storeId: 'st_001', storeName: 'Target Midtown', timestamp: '14 min ago', confidence: 88, placement: 'endcap', neighbors: ['Kind Bar', 'Larabar'], imageColor: '#fef9c3' },
  { id: 'img_003', productId: 'dp_004', productName: 'Califia Oat Milk', storeId: 'st_002', storeName: 'Kroger Buckhead', timestamp: '31 min ago', confidence: 91, placement: 'lower-shelf', neighbors: ['Silk Oat Yeah', 'Oatly Barista'], imageColor: '#dcfce7' },
  { id: 'img_004', productId: 'dp_006', productName: 'Beyond Meat Patties', storeId: 'st_003', storeName: 'Whole Foods Lincoln Park', timestamp: '45 min ago', confidence: 79, placement: 'eye-level', neighbors: ['Impossible Burger', 'MorningStar'], imageColor: '#fce7f3' },
  { id: 'img_005', productId: 'dp_002', productName: "Dave's Killer Bread", storeId: 'st_006', storeName: 'Target Silver Lake', timestamp: '1 hr ago', confidence: 96, placement: 'eye-level', neighbors: ['Nature Bread', 'Oroweat'], imageColor: '#ede9fe' },
  { id: 'img_006', productId: 'dp_005', productName: 'Siete Tortillas', storeId: 'st_004', storeName: 'Aldi West Loop', timestamp: '2 hrs ago', confidence: 83, placement: 'lower-shelf', neighbors: ['Mission Tortillas', 'La Banderita'], imageColor: '#ffedd5' },
]

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface DashAlert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  timestamp: string
  productId?: string
  storeId?: string
  isRead: boolean
}

export const DASH_ALERTS: DashAlert[] = [
  { id: 'alt_001', title: 'Price spike detected', description: 'Beyond Meat Patties +41.7% at Whole Foods Lincoln Park vs. prior week.', severity: 'critical', timestamp: '14 min ago', productId: 'dp_006', storeId: 'st_003', isRead: false },
  { id: 'alt_002', title: 'Low stock signal', description: 'RXBAR Chocolate Sea Salt stock appears critically low in 3 stores.', severity: 'critical', timestamp: '1 hr ago', productId: 'dp_003', isRead: false },
  { id: 'alt_003', title: 'Competitor gained shelf adjacency', description: 'Fage Total now adjacent to Chobani in 4 new Target locations.', severity: 'warning', timestamp: '2 hrs ago', productId: 'dp_001', isRead: false },
  { id: 'alt_004', title: 'Product not seen in expected store', description: "Dave's Killer Bread not observed at Walmart Supercenter in 2 days.", severity: 'warning', timestamp: '6 hrs ago', productId: 'dp_002', storeId: 'st_005', isRead: true },
  { id: 'alt_005', title: 'Coverage gap detected', description: 'Walmart Supercenter Dallas has fewer than 5 scans this week.', severity: 'info', timestamp: '8 hrs ago', storeId: 'st_005', isRead: true },
  { id: 'alt_006', title: 'Price dropped — monitor', description: 'Chobani Greek Yogurt down 9.1% at Target Silver Lake.', severity: 'info', timestamp: '22 min ago', productId: 'dp_001', storeId: 'st_006', isRead: true },
]

// ─── Coverage stats ───────────────────────────────────────────────────────────

export interface CoverageStat {
  label: string
  value: string | number
  sub?: string
}

export const COVERAGE_STATS: CoverageStat[] = [
  { label: 'Total scans today', value: 342, sub: '+18% vs yesterday' },
  { label: 'Unique contributors', value: 89, sub: 'across all stores' },
  { label: 'Stores covered', value: '6 / 9', sub: '67% of network' },
  { label: 'Shelves mapped', value: 214, sub: '31 new today' },
]

export interface CoverageTrendPoint {
  label: string
  scans: number
  stores: number
  contributors: number
}

export const COVERAGE_TREND: CoverageTrendPoint[] = [
  { label: 'Mar 29', scans: 210, stores: 4, contributors: 61 },
  { label: 'Mar 30', scans: 240, stores: 5, contributors: 68 },
  { label: 'Mar 31', scans: 198, stores: 4, contributors: 55 },
  { label: 'Apr 1',  scans: 312, stores: 6, contributors: 81 },
  { label: 'Apr 2',  scans: 289, stores: 5, contributors: 77 },
  { label: 'Apr 3',  scans: 301, stores: 6, contributors: 84 },
  { label: 'Apr 4',  scans: 342, stores: 6, contributors: 89 },
]

export const COVERAGE_GAPS = [
  { storeName: 'Walmart Supercenter', city: 'Dallas, TX', scansThisWeek: 7, expected: 40, pct: 18 },
  { storeName: 'Whole Foods Lincoln Park', city: 'Chicago, IL', scansThisWeek: 11, expected: 35, pct: 31 },
]

// ─── Overview KPIs ────────────────────────────────────────────────────────────

export interface KpiCard {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  tooltip: string
}

export const OVERVIEW_KPIS: KpiCard[] = [
  { label: 'Avg price vs competitors', value: '-$0.18', delta: '-3.1% vs last week', deltaPositive: true, tooltip: 'Average difference between your product prices and tracked competitors across all stores.' },
  { label: 'Price volatility score', value: '38 / 100', delta: '+6 pts vs last week', deltaPositive: false, tooltip: 'Composite score measuring how frequently and dramatically your prices change. Lower is more stable.' },
  { label: 'Shelf presence rate', value: '64%', delta: '+2% vs last week', deltaPositive: true, tooltip: '% of tracked stores where your products were observed on shelf in the selected period.' },
  { label: 'Stock health score', value: '71 / 100', delta: '-4 pts vs last week', deltaPositive: false, tooltip: 'Estimated stock health based on recency and frequency of shopper observations per store.' },
  { label: 'Verified observations', value: '342', delta: '+18% vs yesterday', deltaPositive: true, tooltip: 'Number of shopper-verified price and shelf observations recorded today.' },
]

// ─── AI insight summary ───────────────────────────────────────────────────────

export const AI_INSIGHT = {
  summary: 'Your Chobani SKU dropped 9.1% in 2 West Coast stores — likely a promotional markdown. Beyond Meat Patties spiked 41.7% at Whole Foods Chicago; consider a competitive response. RXBAR stock signals are low in 3 locations — restock urgency is high. Fage gained shelf adjacency in 4 new Target stores this week.',
  updatedAt: 'Updated 5 min ago',
}

// ─── Volatility leaderboard ───────────────────────────────────────────────────

export const VOLATILITY_LEADERBOARD = DASH_PRODUCTS
  .slice()
  .sort((a, b) => b.volatilityScore - a.volatilityScore)

// ─── Price heatmap (day × time) ──────────────────────────────────────────────

export interface HeatmapCell {
  day: string
  hour: string
  changeCount: number   // 0–10, drives intensity
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']
const HEAT_RAW = [
  [1,2,4,3,2,1,0], [2,3,5,4,3,2,1], [1,2,3,5,6,4,2],
  [0,1,2,4,7,5,3], [1,3,4,3,5,8,4], [2,4,3,2,3,6,7], [1,2,1,2,2,4,3],
]
export const PRICE_HEATMAP: HeatmapCell[] = HOURS.flatMap((hour, hi) =>
  DAYS.map((day, di) => ({ day, hour, changeCount: HEAT_RAW[di][hi] }))
)

// ─── Adjacency analysis ───────────────────────────────────────────────────────

export interface AdjacencyEntry {
  productA: string
  productB: string
  adjacencyPct: number
  stores: number
}

export const ADJACENCY_DATA: AdjacencyEntry[] = [
  { productA: 'Chobani Greek Yogurt', productB: 'Fage Total', adjacencyPct: 64, stores: 5 },
  { productA: 'Chobani Greek Yogurt', productB: 'Oikos Pro', adjacencyPct: 41, stores: 3 },
  { productA: 'Califia Oat Milk', productB: 'Silk Oat Yeah', adjacencyPct: 55, stores: 4 },
  { productA: 'Beyond Meat Patties', productB: 'Impossible Burger', adjacencyPct: 78, stores: 3 },
]

// ─── Price gap trend (competitor vs ours) ────────────────────────────────────

export interface PriceGapPoint {
  label: string
  ourPrice: number
  competitorPrice: number
  gap: number
}

export const PRICE_GAP_TREND: PriceGapPoint[] = [
  { label: 'Mar 29', ourPrice: 5.89, competitorPrice: 5.99, gap: -0.10 },
  { label: 'Mar 31', ourPrice: 5.61, competitorPrice: 5.89, gap: -0.28 },
  { label: 'Apr 2',  ourPrice: 5.39, competitorPrice: 5.85, gap: -0.46 },
  { label: 'Apr 4',  ourPrice: 5.49, competitorPrice: 5.89, gap: -0.40 },
]

// ─── Vendors / company selector ───────────────────────────────────────────────

export const VENDORS = [
  { id: 'v_001', name: 'Chobani LLC', logo: 'C' },
  { id: 'v_002', name: 'RXBAR (Kellogg)', logo: 'R' },
  { id: 'v_003', name: 'Califia Farms', logo: 'CF' },
]
