/**
 * Client-side seed script for Dashboard Attribution Data
 * Run this from the browser console or a special admin page
 */

import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

function getDateDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substr(2, 9)
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9)
}

export async function seedAllAttributionData() {
  console.log('🌱 Starting attribution data seeding...\n')

  try {
    // Fetch existing products and stores
    console.log('📦 Fetching existing products...')
    const productsSnap = await getDocs(collection(db, 'products'))
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(`  Found ${products.length} products\n`)

    console.log('🏪 Fetching existing stores...')
    const storesSnap = await getDocs(collection(db, 'stores'))
    const stores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(`  Found ${stores.length} stores\n`)

    if (products.length === 0 || stores.length === 0) {
      throw new Error('No products or stores found. Please seed products and stores first.')
    }

    // 1. Seed Competitors
    console.log('🥊 Seeding competitors...')
    const competitors = await seedCompetitors(products)
    console.log(`  ✅ Created ${competitors.length} competitors\n`)

    // 2. Seed Scans (last 7 days)
    console.log('👁️  Seeding product scans...')
    const scans = await seedScans(products, stores, 7)
    console.log(`  ✅ Created ${scans.length} scans\n`)

    // 3. Seed Receipts (last 7 days)
    console.log('🧾 Seeding receipts...')
    const receipts = await seedReceipts(products, stores, scans)
    console.log(`  ✅ Created ${receipts.length} receipts\n`)

    // 4. Seed Win/Loss Events
    console.log('⚔️  Seeding win/loss events...')
    const winLossEvents = await seedWinLossEvents(products, competitors, stores, scans)
    console.log(`  ✅ Created ${winLossEvents.length} win/loss events\n`)

    // 5. Seed Alerts
    console.log('🚨 Seeding alerts...')
    const alerts = await seedAlerts(products, stores)
    console.log(`  ✅ Created ${alerts.length} alerts\n`)

    // 6. Seed Product Metrics (daily aggregates)
    console.log('📊 Seeding product metrics...')
    const productMetrics = await seedProductMetrics(products, scans, receipts, winLossEvents, 7)
    console.log(`  ✅ Created ${productMetrics.length} product metric records\n`)

    // 7. Seed Store Metrics (daily aggregates)
    console.log('🏬 Seeding store metrics...')
    const storeMetrics = await seedStoreMetrics(stores, scans, receipts, 7)
    console.log(`  ✅ Created ${storeMetrics.length} store metric records\n`)

    // 8. Seed Coverage Stats (daily aggregates)
    console.log('📈 Seeding coverage stats...')
    const coverageStats = await seedCoverageStats(scans, receipts, winLossEvents, 7)
    console.log(`  ✅ Created ${coverageStats.length} coverage stat records\n`)

    console.log('✨ Attribution data seeding complete!\n')
    return {
      scans: scans.length,
      receipts: receipts.length,
      winLossEvents: winLossEvents.length,
      competitors: competitors.length,
      alerts: alerts.length,
      productMetrics: productMetrics.length,
      storeMetrics: storeMetrics.length,
      coverageStats: coverageStats.length
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

async function seedCompetitors(products: any[]) {
  const competitors: any[] = []
  const categories = [...new Set(products.map((p: any) => p.category))]

  for (const category of categories) {
    const categoryProducts = products.filter((p: any) => p.category === category)
    const numCompetitors = randomInt(3, 6)

    for (let i = 0; i < numCompetitors; i++) {
      const competitor = {
        name: `Competitor ${category} Brand ${String.fromCharCode(65 + i)}`,
        brand: `CompBrand ${String.fromCharCode(65 + i)}`,
        category,
        competesWithProductIds: categoryProducts.slice(0, randomInt(1, 3)).map((p: any) => p.id),
        avgPrice: randomFloat(3.99, 12.99),
        imageUrl: `/placeholder-competitor-${i}.jpg`
      }

      const docRef = await addDoc(collection(db, 'competitors'), competitor)
      competitors.push({ id: docRef.id, ...competitor })
    }
  }

  return competitors
}

async function seedScans(products: any[], stores: any[], days: number) {
  const scans: any[] = []

  // Generate 50-150 scans per day
  for (let day = 0; day < days; day++) {
    const numScans = randomInt(50, 150)
    const date = getDateDaysAgo(day)

    for (let i = 0; i < numScans; i++) {
      const timestamp = new Date(date)
      timestamp.setHours(randomInt(8, 21), randomInt(0, 59), randomInt(0, 59))

      const scan = {
        productId: randomChoice(products).id,
        storeId: randomChoice(stores).id,
        userId: generateUserId(),
        timestamp: Timestamp.fromDate(timestamp),
        sessionId: generateSessionId()
      }

      const docRef = await addDoc(collection(db, 'scans'), scan)
      scans.push({ id: docRef.id, ...scan })
    }
  }

  return scans
}

async function seedReceipts(products: any[], stores: any[], scans: any[]) {
  const receipts: any[] = []

  // Convert ~35-45% of scans into purchases
  const conversionRate = randomFloat(0.35, 0.45)

  // Group scans by session
  const sessionScans: Record<string, any[]> = {}
  scans.forEach(scan => {
    if (!sessionScans[scan.sessionId]) sessionScans[scan.sessionId] = []
    sessionScans[scan.sessionId].push(scan)
  })

  const sessions = Object.keys(sessionScans)
  const sessionsToConvert = sessions.slice(0, Math.floor(sessions.length * conversionRate))

  for (const sessionId of sessionsToConvert) {
    const sessionScanList = sessionScans[sessionId]
    const firstScan = sessionScanList[0]

    const items: any[] = []
    let totalAmount = 0

    const numItems = Math.min(randomInt(1, 3), sessionScanList.length)
    const selectedScans = sessionScanList.slice(0, numItems)

    for (const scan of selectedScans) {
      const product = products.find((p: any) => p.id === scan.productId)
      const price = randomFloat(3.99, 15.99)
      const quantity = randomInt(1, 3)

      items.push({
        productId: scan.productId,
        productName: product?.name || 'Unknown Product',
        price,
        quantity
      })

      totalAmount += price * quantity
    }

    const receipt = {
      userId: firstScan.userId,
      storeId: firstScan.storeId,
      timestamp: firstScan.timestamp,
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }

    const docRef = await addDoc(collection(db, 'receipts'), receipt)
    receipts.push({ id: docRef.id, ...receipt })
  }

  return receipts
}

async function seedWinLossEvents(products: any[], competitors: any[], stores: any[], scans: any[]) {
  const events: any[] = []

  // Generate win/loss events for ~30% of scans
  const comparisonRate = 0.30
  const scansToCompare = Math.floor(scans.length * comparisonRate)
  const winRate = 0.65

  for (let i = 0; i < scansToCompare; i++) {
    const scan = randomChoice(scans)

    const matchingCompetitors = competitors.filter((c: any) =>
      c.competesWithProductIds.includes(scan.productId)
    )

    if (matchingCompetitors.length === 0) continue

    const competitor = randomChoice(matchingCompetitors)
    const isWin = Math.random() < winRate

    const yourPrice = randomFloat(4.99, 12.99)
    const competitorPrice = isWin
      ? yourPrice + randomFloat(0.50, 2.00)
      : yourPrice - randomFloat(0.50, 2.00)

    const priceGap = Math.abs(yourPrice - competitorPrice)
    const priceGapPercentage = (priceGap / competitorPrice) * 100

    const event = {
      sessionId: scan.sessionId,
      yourProductId: scan.productId,
      competitorProductId: competitor.id,
      outcome: isWin ? 'win' : 'loss',
      yourPrice,
      competitorPrice,
      priceGap: parseFloat(priceGap.toFixed(2)),
      priceGapPercentage: parseFloat(priceGapPercentage.toFixed(1)),
      timestamp: scan.timestamp,
      storeId: scan.storeId,
      userId: scan.userId
    }

    const docRef = await addDoc(collection(db, 'win_loss_events'), event)
    events.push({ id: docRef.id, ...event })
  }

  return events
}

async function seedAlerts(products: any[], stores: any[]) {
  const alerts: any[] = []

  const alertTypes = [
    {
      type: 'price_spike',
      severity: 'critical',
      title: 'Price spike detected on Organic Milk',
      description: 'Price increased 22% at Whole Foods - consider promotional pricing',
      productId: products[0]?.id,
      storeId: stores[0]?.id
    },
    {
      type: 'high_win_rate',
      severity: 'info',
      title: 'Strong competitive performance',
      description: 'Your Greek Yogurt has 78% win rate vs competitors this week',
      productId: products[1]?.id
    },
    {
      type: 'competitor_win_streak',
      severity: 'warning',
      title: 'Competitor gaining traction',
      description: 'Competitor brand has won 8 consecutive comparisons for Almond Milk',
      productId: products[2]?.id,
      storeId: stores[1]?.id
    },
    {
      type: 'conversion_drop',
      severity: 'warning',
      title: 'Conversion rate declining',
      description: 'Organic Eggs conversion dropped from 42% to 28% this week',
      productId: products[3]?.id
    },
    {
      type: 'price_opportunity',
      severity: 'info',
      title: 'Price optimization opportunity',
      description: 'Target has underpriced your Cheddar Cheese - 15% margin available',
      productId: products[4]?.id,
      storeId: stores[2]?.id
    },
    {
      type: 'low_stock',
      severity: 'critical',
      title: 'Low stock detected',
      description: 'Only 3 units remaining at Kroger - restock recommended',
      productId: products[5]?.id,
      storeId: stores[3]?.id
    }
  ]

  for (const alertData of alertTypes) {
    const alert = {
      ...alertData,
      timestamp: Timestamp.fromDate(getDateDaysAgo(randomInt(0, 3))),
      isRead: Math.random() > 0.5
    }

    const docRef = await addDoc(collection(db, 'alerts'), alert)
    alerts.push({ id: docRef.id, ...alert })
  }

  return alerts
}

async function seedProductMetrics(products: any[], scans: any[], receipts: any[], winLossEvents: any[], days: number) {
  const metrics: any[] = []

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day)
    const dateStr = date.toISOString().split('T')[0]

    for (const product of products) {
      const dayScans = scans.filter((s: any) => {
        const scanDate = s.timestamp.toDate().toISOString().split('T')[0]
        return s.productId === product.id && scanDate === dateStr
      })

      const dayReceipts = receipts.filter((r: any) => {
        const receiptDate = r.timestamp.toDate().toISOString().split('T')[0]
        return r.items.some((item: any) => item.productId === product.id) && receiptDate === dateStr
      })

      const dayWins = winLossEvents.filter((e: any) => {
        const eventDate = e.timestamp.toDate().toISOString().split('T')[0]
        return e.yourProductId === product.id && e.outcome === 'win' && eventDate === dateStr
      })

      const dayLosses = winLossEvents.filter((e: any) => {
        const eventDate = e.timestamp.toDate().toISOString().split('T')[0]
        return e.yourProductId === product.id && e.outcome === 'loss' && eventDate === dateStr
      })

      const scansTotal = dayScans.length
      const purchasesTotal = dayReceipts.length
      const conversionRate = scansTotal > 0 ? (purchasesTotal / scansTotal) * 100 : 0
      const winsVsCompetitor = dayWins.length
      const lossesToCompetitor = dayLosses.length
      const winRate = (winsVsCompetitor + lossesToCompetitor) > 0
        ? (winsVsCompetitor / (winsVsCompetitor + lossesToCompetitor)) * 100
        : 0

      let revenueAttributed = 0
      for (const receipt of dayReceipts) {
        const item = receipt.items.find((i: any) => i.productId === product.id)
        if (item) {
          revenueAttributed += item.price * item.quantity
        }
      }

      const metric = {
        productId: product.id,
        date: dateStr,
        scansTotal,
        purchasesTotal,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        winsVsCompetitor,
        lossesToCompetitor,
        winRate: parseFloat(winRate.toFixed(1)),
        revenueAttributed: parseFloat(revenueAttributed.toFixed(2))
      }

      const docRef = await addDoc(collection(db, 'product_metrics_daily'), metric)
      metrics.push({ id: docRef.id, ...metric })
    }
  }

  return metrics
}

async function seedStoreMetrics(stores: any[], scans: any[], receipts: any[], days: number) {
  const metrics: any[] = []

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day)
    const dateStr = date.toISOString().split('T')[0]

    for (const store of stores) {
      const dayScans = scans.filter((s: any) => {
        const scanDate = s.timestamp.toDate().toISOString().split('T')[0]
        return s.storeId === store.id && scanDate === dateStr
      })

      const dayReceipts = receipts.filter((r: any) => {
        const receiptDate = r.timestamp.toDate().toISOString().split('T')[0]
        return r.storeId === store.id && receiptDate === dateStr
      })

      const scansTotal = dayScans.length
      const purchasesTotal = dayReceipts.length
      const conversionRate = scansTotal > 0 ? (purchasesTotal / scansTotal) * 100 : 0

      const metric = {
        storeId: store.id,
        date: dateStr,
        scansTotal,
        purchasesTotal,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        winRate: randomFloat(55, 75, 1),
        stockHealth: randomInt(70, 95),
        productPresence: randomInt(80, 98),
        avgPrice: randomFloat(4.99, 6.99)
      }

      const docRef = await addDoc(collection(db, 'store_metrics_daily'), metric)
      metrics.push({ id: docRef.id, ...metric })
    }
  }

  return metrics
}

async function seedCoverageStats(scans: any[], receipts: any[], winLossEvents: any[], days: number) {
  const stats: any[] = []

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day)
    const dateStr = date.toISOString().split('T')[0]

    const dayScans = scans.filter((s: any) => {
      const scanDate = s.timestamp.toDate().toISOString().split('T')[0]
      return scanDate === dateStr
    })

    const dayReceipts = receipts.filter((r: any) => {
      const receiptDate = r.timestamp.toDate().toISOString().split('T')[0]
      return receiptDate === dateStr
    })

    const dayWins = winLossEvents.filter((e: any) => {
      const eventDate = e.timestamp.toDate().toISOString().split('T')[0]
      return e.outcome === 'win' && eventDate === dateStr
    })

    const dayLosses = winLossEvents.filter((e: any) => {
      const eventDate = e.timestamp.toDate().toISOString().split('T')[0]
      return e.outcome === 'loss' && eventDate === dateStr
    })

    const totalScans = dayScans.length
    const totalReceipts = dayReceipts.length
    const uniqueShoppers = new Set(dayScans.map((s: any) => s.userId)).size
    const overallConversionRate = totalScans > 0 ? (totalReceipts / totalScans) * 100 : 0
    const totalWins = dayWins.length
    const totalLosses = dayLosses.length

    let revenueAttributed = 0
    for (const receipt of dayReceipts) {
      revenueAttributed += receipt.totalAmount
    }

    const lostRevenueToCompetitors = dayLosses.reduce((sum: number, loss: any) => {
      return sum + loss.yourPrice
    }, 0)

    const stat = {
      date: dateStr,
      totalScans,
      totalReceipts,
      uniqueShoppers,
      overallConversionRate: parseFloat(overallConversionRate.toFixed(1)),
      totalWins,
      totalLosses,
      revenueAttributed: parseFloat(revenueAttributed.toFixed(2)),
      lostRevenueToCompetitors: parseFloat(lostRevenueToCompetitors.toFixed(2))
    }

    const docRef = await addDoc(collection(db, 'coverage_stats_daily'), stat)
    stats.push({ id: docRef.id, ...stat })
  }

  return stats
}
