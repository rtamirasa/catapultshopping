// Mock data layer for AisleIQ Insights
// Retail Attribution Platform - "Criteo for Physical Retail"
// Scans = Intent/Consideration (like "Add to Cart")
// Receipt Scans = Conversion/Purchase (like "Checkout")

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  avgPrice: number;
  priceChange: number;
  shelfPresence: number;
  stockStatus: 'high' | 'medium' | 'low';
  lastSeen: string;
  competitorDelta: number;
  volatilityScore: number;
  image?: string;
  // New attribution metrics
  scansToday: number;
  purchasesToday: number;
  conversionRate: number;
  winsVsCompetitor: number;
  lossesToCompetitor: number;
  avgPriceGapAtWin: number;
  avgPriceGapAtLoss: number;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  region: string;
  avgPrice: number;
  stockHealth: number;
  productPresence: number;
  scanFrequency: number;
  lastScan: string;
  lat?: number;
  lng?: number;
  // New store attribution metrics
  conversionRate: number;
  winRate: number;
  avgBasketSize: number;
}

export interface PriceObservation {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  price: number;
  previousPrice: number;
  timestamp: string;
  confidence: number;
  verifiedBy: number;
}

export interface ShelfImage {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  imageUrl: string;
  position: 'eye-level' | 'upper-shelf' | 'lower-shelf' | 'endcap';
  neighbors: string[];
  timestamp: string;
  confidence: number;
}

export interface Competitor {
  id: string;
  name: string;
  brand: string;
  category: string;
  avgPrice: number;
  shelfPresence: number;
  adjacencyRate: number;
  // New competitive metrics
  winsAgainstYou: number;
  lossesToYou: number;
  avgPriceGap: number;
  conversionRate: number;
}

export interface StockSignal {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  level: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
}

export interface CoverageStats {
  totalScansToday: number;
  uniqueShoppers: number;
  storesCovered: number;
  totalStores: number;
  shelvesMapped: number;
  newShelves: number;
  coveragePercentage: number;
  // New attribution stats
  totalReceiptsToday: number;
  overallConversionRate: number;
  totalWins: number;
  totalLosses: number;
  revenueAttributed: number;
  lostRevenueToCompetitors: number;
}

export interface Alert {
  id: string;
  type: 'price_drop' | 'price_increase' | 'out_of_stock' | 'competitor_adjacency' | 'missing_product' | 'low_stock' | 'conversion_drop' | 'competitor_win_streak' | 'price_sensitivity';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  productId?: string;
  storeId?: string;
  timestamp: string;
  isRead: boolean;
  actionable?: string;
}

export interface InsightSummary {
  id: string;
  text: string;
  category: 'pricing' | 'placement' | 'stock' | 'competitive' | 'conversion' | 'attribution';
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  metric?: string;
  recommendation?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

// New: Purchase Decision Event
export interface PurchaseDecision {
  id: string;
  shopperId: string;
  storeId: string;
  storeName: string;
  timestamp: string;
  scannedProducts: {
    productId: string;
    productName: string;
    brand: string;
    isYours: boolean;
    price: number;
    category: string;
  }[];
  purchasedProducts: {
    productId: string;
    productName: string;
    brand: string;
    isYours: boolean;
    price: number;
    category: string;
  }[];
  // Derived insights
  outcome: 'won' | 'lost' | 'no_competition' | 'abandoned';
  priceGapAtDecision?: number;
  competitorChosen?: string;
  yourProductChosen?: string;
}

// New: Win/Loss Event
export interface WinLossEvent {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  competitorId: string;
  competitorName: string;
  storeId: string;
  storeName: string;
  outcome: 'win' | 'loss';
  yourPrice: number;
  competitorPrice: number;
  priceGap: number;
  priceGapPercentage: number;
  category: string;
}

// New: Conversion Funnel Data
export interface ConversionFunnelData {
  period: string;
  scans: number;
  considered: number;
  purchased: number;
  conversionRate: number;
}

// New: Price Sensitivity Data
export interface PriceSensitivityData {
  priceGapRange: string;
  winRate: number;
  totalDecisions: number;
  wins: number;
  losses: number;
}

// Mock Companies
export const companies: Company[] = [
  { id: 'c1', name: 'Horizon Foods' },
  { id: 'c2', name: 'GreenLeaf Organics' },
  { id: 'c3', name: 'Urban Snacks Co.' },
];

// Mock Products with Attribution Metrics
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Greek Yogurt Original',
    brand: 'Horizon Foods',
    category: 'Dairy',
    sku: 'HF-GY-001',
    avgPrice: 5.99,
    priceChange: -12.3,
    shelfPresence: 87,
    stockStatus: 'medium',
    lastSeen: '5 min ago',
    competitorDelta: -0.50,
    volatilityScore: 23,
    scansToday: 1247,
    purchasesToday: 423,
    conversionRate: 33.9,
    winsVsCompetitor: 312,
    lossesToCompetitor: 198,
    avgPriceGapAtWin: -0.45,
    avgPriceGapAtLoss: 0.32,
  },
  {
    id: 'p2',
    name: 'Almond Milk Unsweetened',
    brand: 'Horizon Foods',
    category: 'Dairy Alternatives',
    sku: 'HF-AM-002',
    avgPrice: 4.49,
    priceChange: 3.2,
    shelfPresence: 92,
    stockStatus: 'high',
    lastSeen: '2 min ago',
    competitorDelta: 0.25,
    volatilityScore: 12,
    scansToday: 892,
    purchasesToday: 267,
    conversionRate: 29.9,
    winsVsCompetitor: 156,
    lossesToCompetitor: 234,
    avgPriceGapAtWin: -0.35,
    avgPriceGapAtLoss: 0.48,
  },
  {
    id: 'p3',
    name: 'Organic Granola Clusters',
    brand: 'Horizon Foods',
    category: 'Breakfast',
    sku: 'HF-OG-003',
    avgPrice: 6.79,
    priceChange: -5.1,
    shelfPresence: 78,
    stockStatus: 'low',
    lastSeen: '12 min ago',
    competitorDelta: -0.30,
    volatilityScore: 45,
    scansToday: 567,
    purchasesToday: 245,
    conversionRate: 43.2,
    winsVsCompetitor: 189,
    lossesToCompetitor: 87,
    avgPriceGapAtWin: -0.52,
    avgPriceGapAtLoss: 0.15,
  },
  {
    id: 'p4',
    name: 'Cold Brew Coffee',
    brand: 'Horizon Foods',
    category: 'Beverages',
    sku: 'HF-CB-004',
    avgPrice: 4.99,
    priceChange: 0,
    shelfPresence: 95,
    stockStatus: 'high',
    lastSeen: '1 min ago',
    competitorDelta: -0.15,
    volatilityScore: 8,
    scansToday: 1834,
    purchasesToday: 712,
    conversionRate: 38.8,
    winsVsCompetitor: 523,
    lossesToCompetitor: 289,
    avgPriceGapAtWin: -0.28,
    avgPriceGapAtLoss: 0.42,
  },
  {
    id: 'p5',
    name: 'Protein Bar Variety Pack',
    brand: 'Horizon Foods',
    category: 'Snacks',
    sku: 'HF-PB-005',
    avgPrice: 12.99,
    priceChange: 8.5,
    shelfPresence: 65,
    stockStatus: 'low',
    lastSeen: '18 min ago',
    competitorDelta: 1.25,
    volatilityScore: 67,
    scansToday: 423,
    purchasesToday: 89,
    conversionRate: 21.0,
    winsVsCompetitor: 67,
    lossesToCompetitor: 187,
    avgPriceGapAtWin: -0.85,
    avgPriceGapAtLoss: 1.45,
  },
  {
    id: 'p6',
    name: 'Organic Honey',
    brand: 'Horizon Foods',
    category: 'Condiments',
    sku: 'HF-OH-006',
    avgPrice: 8.49,
    priceChange: -2.8,
    shelfPresence: 82,
    stockStatus: 'medium',
    lastSeen: '7 min ago',
    competitorDelta: -0.75,
    volatilityScore: 19,
    scansToday: 345,
    purchasesToday: 156,
    conversionRate: 45.2,
    winsVsCompetitor: 134,
    lossesToCompetitor: 45,
    avgPriceGapAtWin: -0.68,
    avgPriceGapAtLoss: 0.22,
  },
  {
    id: 'p7',
    name: 'Sparkling Water Lime',
    brand: 'Horizon Foods',
    category: 'Beverages',
    sku: 'HF-SW-007',
    avgPrice: 1.29,
    priceChange: 15.2,
    shelfPresence: 88,
    stockStatus: 'high',
    lastSeen: '3 min ago',
    competitorDelta: 0.10,
    volatilityScore: 31,
    scansToday: 2156,
    purchasesToday: 534,
    conversionRate: 24.8,
    winsVsCompetitor: 312,
    lossesToCompetitor: 445,
    avgPriceGapAtWin: -0.12,
    avgPriceGapAtLoss: 0.18,
  },
  {
    id: 'p8',
    name: 'Oat Milk Barista Edition',
    brand: 'Horizon Foods',
    category: 'Dairy Alternatives',
    sku: 'HF-OM-008',
    avgPrice: 5.49,
    priceChange: -7.6,
    shelfPresence: 71,
    stockStatus: 'medium',
    lastSeen: '9 min ago',
    competitorDelta: -0.40,
    volatilityScore: 28,
    scansToday: 678,
    purchasesToday: 298,
    conversionRate: 43.9,
    winsVsCompetitor: 234,
    lossesToCompetitor: 112,
    avgPriceGapAtWin: -0.55,
    avgPriceGapAtLoss: 0.28,
  },
];

// Mock Stores with Attribution Metrics
export const stores: Store[] = [
  { id: 's1', name: 'Metro Market Downtown', location: 'Chicago, IL', region: 'Midwest', avgPrice: 5.89, stockHealth: 78, productPresence: 92, scanFrequency: 156, lastScan: '2 min ago', lat: 41.8781, lng: -87.6298, conversionRate: 38.5, winRate: 62.3, avgBasketSize: 47.80 },
  { id: 's2', name: 'FreshMart Oak Park', location: 'Oak Park, IL', region: 'Midwest', avgPrice: 5.45, stockHealth: 85, productPresence: 88, scanFrequency: 98, lastScan: '5 min ago', lat: 41.8850, lng: -87.7845, conversionRate: 42.1, winRate: 68.7, avgBasketSize: 52.30 },
  { id: 's3', name: 'Green Grocer NYC', location: 'New York, NY', region: 'Northeast', avgPrice: 6.79, stockHealth: 92, productPresence: 95, scanFrequency: 234, lastScan: '1 min ago', lat: 40.7128, lng: -74.0060, conversionRate: 31.2, winRate: 54.8, avgBasketSize: 68.90 },
  { id: 's4', name: 'Valley Foods SF', location: 'San Francisco, CA', region: 'West', avgPrice: 6.25, stockHealth: 71, productPresence: 82, scanFrequency: 145, lastScan: '8 min ago', lat: 37.7749, lng: -122.4194, conversionRate: 28.9, winRate: 51.2, avgBasketSize: 72.40 },
  { id: 's5', name: 'Sunrise Market Denver', location: 'Denver, CO', region: 'Mountain', avgPrice: 5.12, stockHealth: 45, productPresence: 75, scanFrequency: 67, lastScan: '15 min ago', lat: 39.7392, lng: -104.9903, conversionRate: 45.8, winRate: 71.5, avgBasketSize: 38.60 },
  { id: 's6', name: 'Harbor Grocers Seattle', location: 'Seattle, WA', region: 'West', avgPrice: 5.98, stockHealth: 88, productPresence: 91, scanFrequency: 189, lastScan: '3 min ago', lat: 47.6062, lng: -122.3321, conversionRate: 36.4, winRate: 59.8, avgBasketSize: 55.20 },
  { id: 's7', name: 'Central Foods Austin', location: 'Austin, TX', region: 'South', avgPrice: 5.35, stockHealth: 67, productPresence: 79, scanFrequency: 112, lastScan: '6 min ago', lat: 30.2672, lng: -97.7431, conversionRate: 41.2, winRate: 65.4, avgBasketSize: 44.80 },
  { id: 's8', name: 'Bayview Market Miami', location: 'Miami, FL', region: 'South', avgPrice: 5.78, stockHealth: 82, productPresence: 86, scanFrequency: 134, lastScan: '4 min ago', lat: 25.7617, lng: -80.1918, conversionRate: 33.7, winRate: 57.2, avgBasketSize: 61.50 },
];

// Mock Price Observations
export const priceObservations: PriceObservation[] = [
  { id: 'po1', productId: 'p1', productName: 'Greek Yogurt Original', storeId: 's1', storeName: 'Metro Market Downtown', price: 5.49, previousPrice: 5.99, timestamp: '2 min ago', confidence: 98, verifiedBy: 12 },
  { id: 'po2', productId: 'p3', productName: 'Organic Granola Clusters', storeId: 's3', storeName: 'Green Grocer NYC', price: 6.99, previousPrice: 7.29, timestamp: '5 min ago', confidence: 95, verifiedBy: 8 },
  { id: 'po3', productId: 'p5', productName: 'Protein Bar Variety Pack', storeId: 's4', storeName: 'Valley Foods SF', price: 14.99, previousPrice: 12.99, timestamp: '8 min ago', confidence: 92, verifiedBy: 5 },
  { id: 'po4', productId: 'p2', productName: 'Almond Milk Unsweetened', storeId: 's6', storeName: 'Harbor Grocers Seattle', price: 4.29, previousPrice: 4.49, timestamp: '12 min ago', confidence: 97, verifiedBy: 15 },
  { id: 'po5', productId: 'p7', productName: 'Sparkling Water Lime', storeId: 's2', storeName: 'FreshMart Oak Park', price: 1.49, previousPrice: 1.29, timestamp: '15 min ago', confidence: 94, verifiedBy: 7 },
  { id: 'po6', productId: 'p4', productName: 'Cold Brew Coffee', storeId: 's8', storeName: 'Bayview Market Miami', price: 4.99, previousPrice: 4.99, timestamp: '18 min ago', confidence: 99, verifiedBy: 22 },
  { id: 'po7', productId: 'p6', productName: 'Organic Honey', storeId: 's5', storeName: 'Sunrise Market Denver', price: 7.99, previousPrice: 8.49, timestamp: '22 min ago', confidence: 91, verifiedBy: 4 },
  { id: 'po8', productId: 'p8', productName: 'Oat Milk Barista Edition', storeId: 's7', storeName: 'Central Foods Austin', price: 5.19, previousPrice: 5.49, timestamp: '25 min ago', confidence: 96, verifiedBy: 9 },
];

// Mock Shelf Images
export const shelfImages: ShelfImage[] = [
  { id: 'si1', productId: 'p1', productName: 'Greek Yogurt Original', storeId: 's1', storeName: 'Metro Market Downtown', imageUrl: '/shelf-1.jpg', position: 'eye-level', neighbors: ['Chobani Greek Yogurt', 'Fage Total'], timestamp: '5 min ago', confidence: 94 },
  { id: 'si2', productId: 'p2', productName: 'Almond Milk Unsweetened', storeId: 's3', storeName: 'Green Grocer NYC', imageUrl: '/shelf-2.jpg', position: 'eye-level', neighbors: ['Califia Farms', 'Silk Almond'], timestamp: '12 min ago', confidence: 91 },
  { id: 'si3', productId: 'p3', productName: 'Organic Granola Clusters', storeId: 's2', storeName: 'FreshMart Oak Park', imageUrl: '/shelf-3.jpg', position: 'upper-shelf', neighbors: ['Kind Granola', 'Bear Naked'], timestamp: '18 min ago', confidence: 88 },
  { id: 'si4', productId: 'p5', productName: 'Protein Bar Variety Pack', storeId: 's4', storeName: 'Valley Foods SF', imageUrl: '/shelf-4.jpg', position: 'lower-shelf', neighbors: ['Quest Bars', 'RX Bars'], timestamp: '25 min ago', confidence: 85 },
  { id: 'si5', productId: 'p4', productName: 'Cold Brew Coffee', storeId: 's6', storeName: 'Harbor Grocers Seattle', imageUrl: '/shelf-5.jpg', position: 'endcap', neighbors: ['Stumptown Cold Brew', 'Starbucks Cold Brew'], timestamp: '32 min ago', confidence: 96 },
  { id: 'si6', productId: 'p7', productName: 'Sparkling Water Lime', storeId: 's8', storeName: 'Bayview Market Miami', imageUrl: '/shelf-6.jpg', position: 'eye-level', neighbors: ['LaCroix', 'Topo Chico'], timestamp: '45 min ago', confidence: 92 },
];

// Mock Competitors with Attribution Metrics
export const competitors: Competitor[] = [
  { id: 'comp1', name: 'Chobani Greek Yogurt', brand: 'Chobani', category: 'Dairy', avgPrice: 6.49, shelfPresence: 95, adjacencyRate: 78, winsAgainstYou: 198, lossesToYou: 312, avgPriceGap: 0.50, conversionRate: 31.2 },
  { id: 'comp2', name: 'Califia Farms Almond Milk', brand: 'Califia Farms', category: 'Dairy Alternatives', avgPrice: 4.79, shelfPresence: 88, adjacencyRate: 65, winsAgainstYou: 234, lossesToYou: 156, avgPriceGap: 0.30, conversionRate: 35.8 },
  { id: 'comp3', name: 'Kind Granola Clusters', brand: 'Kind', category: 'Breakfast', avgPrice: 7.29, shelfPresence: 82, adjacencyRate: 71, winsAgainstYou: 87, lossesToYou: 189, avgPriceGap: 0.50, conversionRate: 28.4 },
  { id: 'comp4', name: 'Starbucks Cold Brew', brand: 'Starbucks', category: 'Beverages', avgPrice: 5.49, shelfPresence: 91, adjacencyRate: 82, winsAgainstYou: 289, lossesToYou: 523, avgPriceGap: 0.50, conversionRate: 26.1 },
  { id: 'comp5', name: 'Quest Protein Bars', brand: 'Quest', category: 'Snacks', avgPrice: 14.99, shelfPresence: 89, adjacencyRate: 74, winsAgainstYou: 187, lossesToYou: 67, avgPriceGap: 2.00, conversionRate: 38.9 },
  { id: 'comp6', name: 'Oatly Barista Edition', brand: 'Oatly', category: 'Dairy Alternatives', avgPrice: 5.99, shelfPresence: 85, adjacencyRate: 68, winsAgainstYou: 112, lossesToYou: 234, avgPriceGap: 0.50, conversionRate: 32.5 },
  { id: 'comp7', name: 'LaCroix Lime', brand: 'LaCroix', category: 'Beverages', avgPrice: 1.19, shelfPresence: 94, adjacencyRate: 88, winsAgainstYou: 445, lossesToYou: 312, avgPriceGap: -0.10, conversionRate: 29.8 },
];

// Mock Stock Signals
export const stockSignals: StockSignal[] = [
  { id: 'ss1', productId: 'p1', productName: 'Greek Yogurt Original', storeId: 's5', storeName: 'Sunrise Market Denver', level: 'low', trend: 'decreasing', lastUpdated: '10 min ago' },
  { id: 'ss2', productId: 'p3', productName: 'Organic Granola Clusters', storeId: 's1', storeName: 'Metro Market Downtown', level: 'low', trend: 'stable', lastUpdated: '15 min ago' },
  { id: 'ss3', productId: 'p5', productName: 'Protein Bar Variety Pack', storeId: 's4', storeName: 'Valley Foods SF', level: 'low', trend: 'decreasing', lastUpdated: '8 min ago' },
  { id: 'ss4', productId: 'p8', productName: 'Oat Milk Barista Edition', storeId: 's7', storeName: 'Central Foods Austin', level: 'medium', trend: 'decreasing', lastUpdated: '20 min ago' },
];

// Mock Coverage Stats with Attribution
export const coverageStats: CoverageStats = {
  totalScansToday: 12847,
  uniqueShoppers: 3421,
  storesCovered: 847,
  totalStores: 1200,
  shelvesMapped: 24567,
  newShelves: 1893,
  coveragePercentage: 70.6,
  totalReceiptsToday: 4523,
  overallConversionRate: 35.2,
  totalWins: 1927,
  totalLosses: 1597,
  revenueAttributed: 28456.78,
  lostRevenueToCompetitors: 18234.52,
};

// Mock Alerts with Attribution Types
export const alerts: Alert[] = [
  { id: 'a1', type: 'competitor_win_streak', severity: 'critical', title: 'Losing to Quest Protein Bars', description: 'Lost 23 of last 30 purchase decisions to Quest in SF Bay Area. Price gap averaging +$1.45', productId: 'p5', timestamp: '5 min ago', isRead: false, actionable: 'Consider $1.00 promotional discount in Bay Area stores' },
  { id: 'a2', type: 'conversion_drop', severity: 'warning', title: 'Conversion rate dropped 18% for Sparkling Water', description: 'After 15% price increase, conversion dropped from 30.2% to 24.8%. Shoppers choosing LaCroix instead.', productId: 'p7', timestamp: '12 min ago', isRead: false, actionable: 'Rollback price or add value bundle' },
  { id: 'a3', type: 'price_sensitivity', severity: 'info', title: 'Price sensitivity insight: Almond Milk', description: 'Win rate jumps from 42% to 71% when priced $0.30+ below Califia Farms', productId: 'p2', timestamp: '18 min ago', isRead: false, actionable: 'Optimal price point: $4.29 or lower' },
  { id: 'a4', type: 'price_drop', severity: 'warning', title: 'Price dropped 12% in 3 Midwest stores', description: 'Greek Yogurt Original price decreased from $5.99 to $5.29. Conversion jumped 8% as a result.', productId: 'p1', timestamp: '25 min ago', isRead: false, actionable: 'Monitor if discount is sustainable' },
  { id: 'a5', type: 'low_stock', severity: 'critical', title: 'Stock likely low - losing sales', description: 'Organic Granola showing low stock. 34 shoppers scanned but only 12 purchased (likely out of stock).', productId: 'p3', storeId: 's1', timestamp: '1 hour ago', isRead: true, actionable: 'Alert distributor for restock' },
  { id: 'a6', type: 'competitor_adjacency', severity: 'info', title: 'High-converting shelf position found', description: 'Cold Brew on endcap at Harbor Grocers has 52% conversion rate vs 38% average', productId: 'p4', storeId: 's6', timestamp: '2 hours ago', isRead: true, actionable: 'Negotiate endcap placement in other stores' },
];

// Mock Insight Summaries with Attribution Focus
export const insightSummaries: InsightSummary[] = [
  { id: 'is1', text: 'You are losing $18.2K daily to competitors when priced 5%+ higher. Price parity could recover 67% of lost sales.', category: 'attribution', impact: 'high', timestamp: '5 min ago', metric: '$18.2K/day', recommendation: 'Implement dynamic pricing within 3% of competitors' },
  { id: 'is2', text: 'Protein Bars have 21% conversion vs 38% category average. Price gap of +$1.25 is the primary driver.', category: 'conversion', impact: 'high', timestamp: '12 min ago', metric: '21% CVR', recommendation: 'Test $11.99 price point in select stores' },
  { id: 'is3', text: 'Organic Granola wins 68% of head-to-head vs Kind when priced $0.30+ lower. Currently winning at $0.50 gap.', category: 'competitive', impact: 'medium', timestamp: '18 min ago', metric: '68% win rate', recommendation: 'Maintain current pricing strategy' },
  { id: 'is4', text: 'Cold Brew has highest conversion (38.8%) and best win rate (64.4%). Shelf placement at eye-level correlates with +12% conversion.', category: 'placement', impact: 'medium', timestamp: '30 min ago', metric: '38.8% CVR', recommendation: 'Prioritize eye-level placement negotiations' },
];

// Price trend data for charts
export const priceTrendData = {
  '24h': [
    { time: '12am', price: 5.99, min: 5.49, max: 6.29 },
    { time: '4am', price: 5.99, min: 5.49, max: 6.29 },
    { time: '8am', price: 5.89, min: 5.39, max: 6.19 },
    { time: '12pm', price: 5.79, min: 5.29, max: 6.09 },
    { time: '4pm', price: 5.69, min: 5.19, max: 5.99 },
    { time: '8pm', price: 5.49, min: 4.99, max: 5.89 },
  ],
  '7d': [
    { time: 'Mon', price: 6.29, min: 5.99, max: 6.79 },
    { time: 'Tue', price: 6.19, min: 5.89, max: 6.59 },
    { time: 'Wed', price: 5.99, min: 5.69, max: 6.39 },
    { time: 'Thu', price: 5.89, min: 5.49, max: 6.19 },
    { time: 'Fri', price: 5.79, min: 5.39, max: 6.09 },
    { time: 'Sat', price: 5.59, min: 5.19, max: 5.99 },
    { time: 'Sun', price: 5.49, min: 4.99, max: 5.89 },
  ],
  '30d': [
    { time: 'Week 1', price: 6.49, min: 6.19, max: 6.99 },
    { time: 'Week 2', price: 6.29, min: 5.99, max: 6.79 },
    { time: 'Week 3', price: 5.99, min: 5.69, max: 6.39 },
    { time: 'Week 4', price: 5.49, min: 4.99, max: 5.99 },
  ],
};

// Daily movers data with conversion impact
export const dailyMovers = [
  { productId: 'p1', productName: 'Greek Yogurt Original', change: -12.3, direction: 'down' as const, storesImpacted: 3, conversionImpact: 8.2 },
  { productId: 'p7', productName: 'Sparkling Water Lime', change: 15.2, direction: 'up' as const, storesImpacted: 1, conversionImpact: -5.4 },
  { productId: 'p5', productName: 'Protein Bar Variety Pack', change: 8.5, direction: 'up' as const, storesImpacted: 2, conversionImpact: -12.1 },
  { productId: 'p8', productName: 'Oat Milk Barista Edition', change: -7.6, direction: 'down' as const, storesImpacted: 4, conversionImpact: 5.8 },
  { productId: 'p3', productName: 'Organic Granola Clusters', change: -5.1, direction: 'down' as const, storesImpacted: 2, conversionImpact: 3.2 },
];

// Price distribution data
export const priceDistributionData = [
  { store: 'Metro Market Downtown', price: 5.49 },
  { store: 'FreshMart Oak Park', price: 5.29 },
  { store: 'Green Grocer NYC', price: 6.29 },
  { store: 'Valley Foods SF', price: 5.99 },
  { store: 'Sunrise Market Denver', price: 5.19 },
  { store: 'Harbor Grocers Seattle', price: 5.79 },
  { store: 'Central Foods Austin', price: 5.39 },
  { store: 'Bayview Market Miami', price: 5.69 },
];

// Volatility leaderboard
export const volatilityLeaderboard = [
  { productId: 'p5', productName: 'Protein Bar Variety Pack', volatility: 67, changes: 23 },
  { productId: 'p3', productName: 'Organic Granola Clusters', volatility: 45, changes: 15 },
  { productId: 'p7', productName: 'Sparkling Water Lime', volatility: 31, changes: 12 },
  { productId: 'p8', productName: 'Oat Milk Barista Edition', volatility: 28, changes: 9 },
  { productId: 'p1', productName: 'Greek Yogurt Original', volatility: 23, changes: 8 },
];

// Coverage trend data
export const coverageTrendData = [
  { date: 'Mon', scans: 10234, stores: 756, shoppers: 2890, receipts: 3567, conversions: 1245 },
  { date: 'Tue', scans: 11456, stores: 798, shoppers: 3102, receipts: 3892, conversions: 1389 },
  { date: 'Wed', scans: 12123, stores: 823, shoppers: 3256, receipts: 4123, conversions: 1502 },
  { date: 'Thu', scans: 11890, stores: 834, shoppers: 3189, receipts: 4056, conversions: 1478 },
  { date: 'Fri', scans: 13456, stores: 847, shoppers: 3421, receipts: 4567, conversions: 1634 },
  { date: 'Sat', scans: 14234, stores: 856, shoppers: 3567, receipts: 4823, conversions: 1756 },
  { date: 'Sun', scans: 12847, stores: 847, shoppers: 3421, receipts: 4523, conversions: 1598 },
];

// Coverage gaps
export const coverageGaps = [
  { storeId: 's5', storeName: 'Sunrise Market Denver', scansLast7d: 67, avgScans: 150, gapPercentage: 55 },
  { storeId: 's7', storeName: 'Central Foods Austin', scansLast7d: 112, avgScans: 180, gapPercentage: 38 },
];

// NEW: Conversion Funnel Data
export const conversionFunnelData: ConversionFunnelData[] = [
  { period: '6am', scans: 234, considered: 189, purchased: 67, conversionRate: 28.6 },
  { period: '8am', scans: 567, considered: 456, purchased: 178, conversionRate: 31.4 },
  { period: '10am', scans: 892, considered: 723, purchased: 289, conversionRate: 32.4 },
  { period: '12pm', scans: 1234, considered: 987, purchased: 412, conversionRate: 33.4 },
  { period: '2pm', scans: 1456, considered: 1167, purchased: 523, conversionRate: 35.9 },
  { period: '4pm', scans: 1678, considered: 1345, purchased: 567, conversionRate: 33.8 },
  { period: '6pm', scans: 1892, considered: 1512, purchased: 645, conversionRate: 34.1 },
  { period: '8pm', scans: 1567, considered: 1254, purchased: 489, conversionRate: 31.2 },
];

// NEW: Price Sensitivity Data - At what price gap do you win/lose?
export const priceSensitivityData: PriceSensitivityData[] = [
  { priceGapRange: '-$1.00+', winRate: 89, totalDecisions: 234, wins: 208, losses: 26 },
  { priceGapRange: '-$0.50 to -$1.00', winRate: 78, totalDecisions: 456, wins: 356, losses: 100 },
  { priceGapRange: '-$0.25 to -$0.50', winRate: 67, totalDecisions: 678, wins: 454, losses: 224 },
  { priceGapRange: '-$0.01 to -$0.25', winRate: 58, totalDecisions: 892, wins: 517, losses: 375 },
  { priceGapRange: 'Price Parity', winRate: 52, totalDecisions: 567, wins: 295, losses: 272 },
  { priceGapRange: '+$0.01 to +$0.25', winRate: 44, totalDecisions: 789, wins: 347, losses: 442 },
  { priceGapRange: '+$0.25 to +$0.50', winRate: 35, totalDecisions: 623, wins: 218, losses: 405 },
  { priceGapRange: '+$0.50 to +$1.00', winRate: 23, totalDecisions: 456, wins: 105, losses: 351 },
  { priceGapRange: '+$1.00+', winRate: 12, totalDecisions: 234, wins: 28, losses: 206 },
];

// NEW: Recent Win/Loss Events
export const recentWinLossEvents: WinLossEvent[] = [
  { id: 'wl1', timestamp: '2 min ago', productId: 'p1', productName: 'Greek Yogurt Original', competitorId: 'comp1', competitorName: 'Chobani Greek Yogurt', storeId: 's1', storeName: 'Metro Market Downtown', outcome: 'win', yourPrice: 5.49, competitorPrice: 6.49, priceGap: -1.00, priceGapPercentage: -15.4, category: 'Dairy' },
  { id: 'wl2', timestamp: '3 min ago', productId: 'p5', productName: 'Protein Bar Variety Pack', competitorId: 'comp5', competitorName: 'Quest Protein Bars', storeId: 's4', storeName: 'Valley Foods SF', outcome: 'loss', yourPrice: 14.99, competitorPrice: 12.99, priceGap: 2.00, priceGapPercentage: 15.4, category: 'Snacks' },
  { id: 'wl3', timestamp: '5 min ago', productId: 'p4', productName: 'Cold Brew Coffee', competitorId: 'comp4', competitorName: 'Starbucks Cold Brew', storeId: 's6', storeName: 'Harbor Grocers Seattle', outcome: 'win', yourPrice: 4.99, competitorPrice: 5.49, priceGap: -0.50, priceGapPercentage: -9.1, category: 'Beverages' },
  { id: 'wl4', timestamp: '7 min ago', productId: 'p7', productName: 'Sparkling Water Lime', competitorId: 'comp7', competitorName: 'LaCroix Lime', storeId: 's2', storeName: 'FreshMart Oak Park', outcome: 'loss', yourPrice: 1.49, competitorPrice: 1.19, priceGap: 0.30, priceGapPercentage: 25.2, category: 'Beverages' },
  { id: 'wl5', timestamp: '8 min ago', productId: 'p2', productName: 'Almond Milk Unsweetened', competitorId: 'comp2', competitorName: 'Califia Farms Almond Milk', storeId: 's3', storeName: 'Green Grocer NYC', outcome: 'loss', yourPrice: 4.79, competitorPrice: 4.49, priceGap: 0.30, priceGapPercentage: 6.7, category: 'Dairy Alternatives' },
  { id: 'wl6', timestamp: '10 min ago', productId: 'p8', productName: 'Oat Milk Barista Edition', competitorId: 'comp6', competitorName: 'Oatly Barista Edition', storeId: 's7', storeName: 'Central Foods Austin', outcome: 'win', yourPrice: 5.19, competitorPrice: 5.99, priceGap: -0.80, priceGapPercentage: -13.4, category: 'Dairy Alternatives' },
  { id: 'wl7', timestamp: '12 min ago', productId: 'p3', productName: 'Organic Granola Clusters', competitorId: 'comp3', competitorName: 'Kind Granola Clusters', storeId: 's5', storeName: 'Sunrise Market Denver', outcome: 'win', yourPrice: 6.79, competitorPrice: 7.29, priceGap: -0.50, priceGapPercentage: -6.9, category: 'Breakfast' },
  { id: 'wl8', timestamp: '15 min ago', productId: 'p6', productName: 'Organic Honey', competitorId: 'comp1', competitorName: 'Local Honey Brand', storeId: 's8', storeName: 'Bayview Market Miami', outcome: 'win', yourPrice: 7.99, competitorPrice: 8.99, priceGap: -1.00, priceGapPercentage: -11.1, category: 'Condiments' },
];

// NEW: Category Performance Summary
export const categoryPerformance = [
  { category: 'Dairy', scans: 1247, purchases: 423, conversionRate: 33.9, winRate: 61.2, avgPriceGap: -0.45, revenue: 2312.45, lostRevenue: 987.32 },
  { category: 'Dairy Alternatives', scans: 1570, purchases: 565, conversionRate: 36.0, winRate: 55.8, avgPriceGap: -0.12, revenue: 3456.78, lostRevenue: 1234.56 },
  { category: 'Breakfast', scans: 567, purchases: 245, conversionRate: 43.2, winRate: 68.5, avgPriceGap: -0.52, revenue: 1663.55, lostRevenue: 432.18 },
  { category: 'Beverages', scans: 3990, purchases: 1246, conversionRate: 31.2, winRate: 52.4, avgPriceGap: -0.08, revenue: 5678.90, lostRevenue: 2345.67 },
  { category: 'Snacks', scans: 423, purchases: 89, conversionRate: 21.0, winRate: 26.4, avgPriceGap: 1.25, revenue: 1156.11, lostRevenue: 2456.78 },
  { category: 'Condiments', scans: 345, purchases: 156, conversionRate: 45.2, winRate: 74.9, avgPriceGap: -0.68, revenue: 1246.44, lostRevenue: 234.56 },
];

// NEW: Hourly Win Rate by Store Type
export const hourlyWinRateByStore = [
  { hour: '6am', urban: 52, suburban: 58, rural: 61 },
  { hour: '8am', urban: 54, suburban: 62, rural: 65 },
  { hour: '10am', urban: 58, suburban: 65, rural: 68 },
  { hour: '12pm', urban: 55, suburban: 63, rural: 67 },
  { hour: '2pm', urban: 52, suburban: 60, rural: 64 },
  { hour: '4pm', urban: 48, suburban: 58, rural: 62 },
  { hour: '6pm', urban: 45, suburban: 55, rural: 60 },
  { hour: '8pm', urban: 42, suburban: 52, rural: 58 },
];

// NEW: Lost Revenue Breakdown
export const lostRevenueBreakdown = [
  { competitor: 'Quest Protein Bars', lostSales: 187, lostRevenue: 2456.78, avgPriceGap: 1.45, category: 'Snacks' },
  { competitor: 'LaCroix Lime', lostSales: 445, lostRevenue: 574.05, avgPriceGap: 0.10, category: 'Beverages' },
  { competitor: 'Califia Farms Almond Milk', lostSales: 234, lostRevenue: 1121.94, avgPriceGap: 0.30, category: 'Dairy Alternatives' },
  { competitor: 'Starbucks Cold Brew', lostSales: 289, lostRevenue: 1586.61, avgPriceGap: 0.50, category: 'Beverages' },
  { competitor: 'Chobani Greek Yogurt', lostSales: 198, lostRevenue: 1185.06, avgPriceGap: 0.50, category: 'Dairy' },
];
