/**
 * Seed script for Dashboard Attribution Data (Phase 2)
 *
 * This script populates Firestore with realistic demo data for:
 * - Scans (product consideration signals)
 * - Receipts (purchase confirmations)
 * - Win/Loss Events (competitive decisions)
 * - Competitors
 * - Alerts
 * - Product Metrics (daily aggregates)
 * - Store Metrics (daily aggregates)
 * - Coverage Stats (daily aggregates)
 *
 * Run with: node scripts/seed-attribution-data.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../../../serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomChoice(array) {
  return array[randomInt(0, array.length - 1)];
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9);
}

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Main seeding function
async function seedAttributionData() {
  console.log('🌱 Starting attribution data seeding...\n');

  try {
    // Fetch existing products and stores
    console.log('📦 Fetching existing products...');
    const productsSnap = await db.collection('products').get();
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`  Found ${products.length} products\n`);

    console.log('🏪 Fetching existing stores...');
    const storesSnap = await db.collection('stores').get();
    const stores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`  Found ${stores.length} stores\n`);

    if (products.length === 0 || stores.length === 0) {
      console.error('❌ No products or stores found. Please seed products and stores first.');
      process.exit(1);
    }

    // 1. Seed Competitors
    console.log('🥊 Seeding competitors...');
    const competitors = await seedCompetitors(products);
    console.log(`  ✅ Created ${competitors.length} competitors\n`);

    // 2. Seed Scans (last 7 days)
    console.log('👁️  Seeding product scans...');
    const scans = await seedScans(products, stores, 7);
    console.log(`  ✅ Created ${scans.length} scans\n`);

    // 3. Seed Receipts (last 7 days)
    console.log('🧾 Seeding receipts...');
    const receipts = await seedReceipts(products, stores, scans, 7);
    console.log(`  ✅ Created ${receipts.length} receipts\n`);

    // 4. Seed Win/Loss Events
    console.log('⚔️  Seeding win/loss events...');
    const winLossEvents = await seedWinLossEvents(products, competitors, stores, scans, 7);
    console.log(`  ✅ Created ${winLossEvents.length} win/loss events\n`);

    // 5. Seed Alerts
    console.log('🚨 Seeding alerts...');
    const alerts = await seedAlerts(products, stores);
    console.log(`  ✅ Created ${alerts.length} alerts\n`);

    // 6. Seed Product Metrics (daily aggregates)
    console.log('📊 Seeding product metrics...');
    const productMetrics = await seedProductMetrics(products, scans, receipts, winLossEvents, 7);
    console.log(`  ✅ Created ${productMetrics.length} product metric records\n`);

    // 7. Seed Store Metrics (daily aggregates)
    console.log('🏬 Seeding store metrics...');
    const storeMetrics = await seedStoreMetrics(stores, scans, receipts, 7);
    console.log(`  ✅ Created ${storeMetrics.length} store metric records\n`);

    // 8. Seed Coverage Stats (daily aggregates)
    console.log('📈 Seeding coverage stats...');
    const coverageStats = await seedCoverageStats(scans, receipts, winLossEvents, 7);
    console.log(`  ✅ Created ${coverageStats.length} coverage stat records\n`);

    console.log('✨ Attribution data seeding complete!\n');
    console.log('Summary:');
    console.log(`  - ${scans.length} scans`);
    console.log(`  - ${receipts.length} receipts`);
    console.log(`  - ${winLossEvents.length} win/loss events`);
    console.log(`  - ${competitors.length} competitors`);
    console.log(`  - ${alerts.length} alerts`);
    console.log(`  - ${productMetrics.length} product metrics`);
    console.log(`  - ${storeMetrics.length} store metrics`);
    console.log(`  - ${coverageStats.length} coverage stats`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Seed individual collections

async function seedCompetitors(products) {
  const competitors = [];
  const batch = db.batch();

  // Create 1-2 competitors per product category
  const categories = [...new Set(products.map(p => p.category))];

  for (const category of categories) {
    const categoryProducts = products.filter(p => p.category === category);
    const numCompetitors = randomInt(3, 6);

    for (let i = 0; i < numCompetitors; i++) {
      const competitorRef = db.collection('competitors').doc();
      const competitor = {
        id: competitorRef.id,
        name: `Competitor ${category} Brand ${i + 1}`,
        brand: `CompBrand ${i + 1}`,
        category,
        competesWithProductIds: categoryProducts.slice(0, randomInt(1, 3)).map(p => p.id),
        avgPrice: randomFloat(3.99, 12.99),
        imageUrl: `/placeholder-competitor-${i}.jpg`
      };

      batch.set(competitorRef, competitor);
      competitors.push(competitor);
    }
  }

  await batch.commit();
  return competitors;
}

async function seedScans(products, stores, days) {
  const scans = [];
  const batch = db.batch();
  let batchCount = 0;

  // Generate 50-150 scans per day
  for (let day = 0; day < days; day++) {
    const numScans = randomInt(50, 150);
    const date = getDateDaysAgo(day);

    for (let i = 0; i < numScans; i++) {
      const scanRef = db.collection('scans').doc();
      const timestamp = new Date(date);
      timestamp.setHours(randomInt(8, 21), randomInt(0, 59), randomInt(0, 59));

      const scan = {
        id: scanRef.id,
        productId: randomChoice(products).id,
        storeId: randomChoice(stores).id,
        userId: generateUserId(),
        timestamp: Timestamp.fromDate(timestamp),
        sessionId: generateSessionId()
      };

      batch.set(scanRef, scan);
      scans.push(scan);
      batchCount++;

      // Firestore batch limit is 500
      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  return scans;
}

async function seedReceipts(products, stores, scans, days) {
  const receipts = [];
  const batch = db.batch();
  let batchCount = 0;

  // Convert ~35-45% of scans into purchases (conversion rate)
  const conversionRate = randomFloat(0.35, 0.45);
  const scansToConvert = Math.floor(scans.length * conversionRate);

  // Group scans by session
  const sessionScans = scans.reduce((acc, scan) => {
    if (!acc[scan.sessionId]) acc[scan.sessionId] = [];
    acc[scan.sessionId].push(scan);
    return acc;
  }, {});

  const sessions = Object.keys(sessionScans);
  const sessionsToConvert = sessions.slice(0, Math.floor(sessions.length * conversionRate));

  for (const sessionId of sessionsToConvert) {
    const sessionScanList = sessionScans[sessionId];
    const firstScan = sessionScanList[0];

    const receiptRef = db.collection('receipts').doc();
    const items = [];
    let totalAmount = 0;

    // Add 1-3 items from the scanned products
    const numItems = Math.min(randomInt(1, 3), sessionScanList.length);
    const selectedScans = sessionScanList.slice(0, numItems);

    for (const scan of selectedScans) {
      const product = products.find(p => p.id === scan.productId);
      const price = randomFloat(3.99, 15.99);
      const quantity = randomInt(1, 3);

      items.push({
        productId: scan.productId,
        productName: product?.name || 'Unknown Product',
        price,
        quantity
      });

      totalAmount += price * quantity;
    }

    const receipt = {
      id: receiptRef.id,
      userId: firstScan.userId,
      storeId: firstScan.storeId,
      timestamp: firstScan.timestamp,
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    };

    batch.set(receiptRef, receipt);
    receipts.push(receipt);
    batchCount++;

    if (batchCount >= 500) {
      await batch.commit();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  return receipts;
}

async function seedWinLossEvents(products, competitors, stores, scans, days) {
  const events = [];
  const batch = db.batch();
  let batchCount = 0;

  // Generate win/loss events for ~30% of scans (head-to-head comparisons)
  const comparisonRate = 0.30;
  const scansToCompare = Math.floor(scans.length * comparisonRate);

  // Roughly 65% win rate
  const winRate = 0.65;

  for (let i = 0; i < scansToCompare; i++) {
    const scan = scans[randomInt(0, scans.length - 1)];
    const product = products.find(p => p.id === scan.productId);

    // Find a competitor for this product
    const matchingCompetitors = competitors.filter(c =>
      c.competesWithProductIds.includes(scan.productId)
    );

    if (matchingCompetitors.length === 0) continue;

    const competitor = randomChoice(matchingCompetitors);
    const isWin = Math.random() < winRate;

    const yourPrice = randomFloat(4.99, 12.99);
    const competitorPrice = isWin
      ? yourPrice + randomFloat(0.50, 2.00)  // Win: competitor is more expensive
      : yourPrice - randomFloat(0.50, 2.00); // Loss: competitor is cheaper

    const priceGap = Math.abs(yourPrice - competitorPrice);
    const priceGapPercentage = (priceGap / competitorPrice) * 100;

    const eventRef = db.collection('win_loss_events').doc();
    const event = {
      id: eventRef.id,
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
    };

    batch.set(eventRef, event);
    events.push(event);
    batchCount++;

    if (batchCount >= 500) {
      await batch.commit();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  return events;
}

async function seedAlerts(products, stores) {
  const alerts = [];
  const batch = db.batch();

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
  ];

  for (const alertData of alertTypes) {
    const alertRef = db.collection('alerts').doc();
    const alert = {
      id: alertRef.id,
      ...alertData,
      timestamp: Timestamp.fromDate(getDateDaysAgo(randomInt(0, 3))),
      isRead: Math.random() > 0.5
    };

    batch.set(alertRef, alert);
    alerts.push(alert);
  }

  await batch.commit();
  return alerts;
}

async function seedProductMetrics(products, scans, receipts, winLossEvents, days) {
  const metrics = [];
  const batch = db.batch();

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day);
    const dateStr = date.toISOString().split('T')[0];

    for (const product of products) {
      // Filter data for this product and day
      const dayScans = scans.filter(s => {
        const scanDate = s.timestamp.toDate().toISOString().split('T')[0];
        return s.productId === product.id && scanDate === dateStr;
      });

      const dayReceipts = receipts.filter(r => {
        const receiptDate = r.timestamp.toDate().toISOString().split('T')[0];
        return r.items.some(item => item.productId === product.id) && receiptDate === dateStr;
      });

      const dayWins = winLossEvents.filter(e => {
        const eventDate = e.timestamp.toDate().toISOString().split('T')[0];
        return e.yourProductId === product.id && e.outcome === 'win' && eventDate === dateStr;
      });

      const dayLosses = winLossEvents.filter(e => {
        const eventDate = e.timestamp.toDate().toISOString().split('T')[0];
        return e.yourProductId === product.id && e.outcome === 'loss' && eventDate === dateStr;
      });

      const scansTotal = dayScans.length;
      const purchasesTotal = dayReceipts.length;
      const conversionRate = scansTotal > 0 ? (purchasesTotal / scansTotal) * 100 : 0;
      const winsVsCompetitor = dayWins.length;
      const lossesToCompetitor = dayLosses.length;
      const winRate = (winsVsCompetitor + lossesToCompetitor) > 0
        ? (winsVsCompetitor / (winsVsCompetitor + lossesToCompetitor)) * 100
        : 0;

      // Calculate revenue
      let revenueAttributed = 0;
      for (const receipt of dayReceipts) {
        const item = receipt.items.find(i => i.productId === product.id);
        if (item) {
          revenueAttributed += item.price * item.quantity;
        }
      }

      const metricRef = db.collection('product_metrics_daily').doc();
      const metric = {
        id: metricRef.id,
        productId: product.id,
        date: dateStr,
        scansTotal,
        purchasesTotal,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        winsVsCompetitor,
        lossesToCompetitor,
        winRate: parseFloat(winRate.toFixed(1)),
        revenueAttributed: parseFloat(revenueAttributed.toFixed(2))
      };

      batch.set(metricRef, metric);
      metrics.push(metric);
    }
  }

  await batch.commit();
  return metrics;
}

async function seedStoreMetrics(stores, scans, receipts, days) {
  const metrics = [];
  const batch = db.batch();

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day);
    const dateStr = date.toISOString().split('T')[0];

    for (const store of stores) {
      const dayScans = scans.filter(s => {
        const scanDate = s.timestamp.toDate().toISOString().split('T')[0];
        return s.storeId === store.id && scanDate === dateStr;
      });

      const dayReceipts = receipts.filter(r => {
        const receiptDate = r.timestamp.toDate().toISOString().split('T')[0];
        return r.storeId === store.id && receiptDate === dateStr;
      });

      const scansTotal = dayScans.length;
      const purchasesTotal = dayReceipts.length;
      const conversionRate = scansTotal > 0 ? (purchasesTotal / scansTotal) * 100 : 0;

      const metricRef = db.collection('store_metrics_daily').doc();
      const metric = {
        id: metricRef.id,
        storeId: store.id,
        date: dateStr,
        scansTotal,
        purchasesTotal,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        winRate: randomFloat(55, 75, 1), // Mock for now
        stockHealth: randomInt(70, 95),
        productPresence: randomInt(80, 98),
        avgPrice: randomFloat(4.99, 6.99)
      };

      batch.set(metricRef, metric);
      metrics.push(metric);
    }
  }

  await batch.commit();
  return metrics;
}

async function seedCoverageStats(scans, receipts, winLossEvents, days) {
  const stats = [];
  const batch = db.batch();

  for (let day = 0; day < days; day++) {
    const date = getDateDaysAgo(day);
    const dateStr = date.toISOString().split('T')[0];

    const dayScans = scans.filter(s => {
      const scanDate = s.timestamp.toDate().toISOString().split('T')[0];
      return scanDate === dateStr;
    });

    const dayReceipts = receipts.filter(r => {
      const receiptDate = r.timestamp.toDate().toISOString().split('T')[0];
      return receiptDate === dateStr;
    });

    const dayWins = winLossEvents.filter(e => {
      const eventDate = e.timestamp.toDate().toISOString().split('T')[0];
      return e.outcome === 'win' && eventDate === dateStr;
    });

    const dayLosses = winLossEvents.filter(e => {
      const eventDate = e.timestamp.toDate().toISOString().split('T')[0];
      return e.outcome === 'loss' && eventDate === dateStr;
    });

    const totalScans = dayScans.length;
    const totalReceipts = dayReceipts.length;
    const uniqueShoppers = new Set(dayScans.map(s => s.userId)).size;
    const overallConversionRate = totalScans > 0 ? (totalReceipts / totalScans) * 100 : 0;
    const totalWins = dayWins.length;
    const totalLosses = dayLosses.length;

    let revenueAttributed = 0;
    for (const receipt of dayReceipts) {
      revenueAttributed += receipt.totalAmount;
    }

    const lostRevenueToCompetitors = dayLosses.reduce((sum, loss) => {
      return sum + loss.yourPrice;
    }, 0);

    const statRef = db.collection('coverage_stats_daily').doc();
    const stat = {
      id: statRef.id,
      date: dateStr,
      totalScans,
      totalReceipts,
      uniqueShoppers,
      overallConversionRate: parseFloat(overallConversionRate.toFixed(1)),
      totalWins,
      totalLosses,
      revenueAttributed: parseFloat(revenueAttributed.toFixed(2)),
      lostRevenueToCompetitors: parseFloat(lostRevenueToCompetitors.toFixed(2))
    };

    batch.set(statRef, stat);
    stats.push(stat);
  }

  await batch.commit();
  return stats;
}

// Run the seeding
seedAttributionData()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
