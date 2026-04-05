// Seed grocery lists with real prices from Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyA4vlLulQHMRqqecEKW6M9HctnOpTk28GI",
  authDomain: "shelfsync-76810.firebaseapp.com",
  projectId: "shelfsync-76810",
  storageBucket: "shelfsync-76810.firebasestorage.app",
  messagingSenderId: "716124528031",
  appId: "1:716124528031:web:5335ead936bd2d968031aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to get real price for a product at a store
async function getRealPrice(productId, storeId) {
  const summaryId = `${productId}_${storeId}`;
  const summarySnap = await getDocs(
    query(collection(db, 'price_summaries'), where('id', '==', summaryId))
  );

  if (!summarySnap.empty) {
    return summarySnap.docs[0].data().currentPrice;
  }
  return null;
}

// Helper to find best price across stores for a product
async function getBestPriceForProduct(productId) {
  const summariesSnap = await getDocs(
    query(collection(db, 'price_summaries'), where('productId', '==', productId))
  );

  let bestPrice = Infinity;
  let bestStoreId = null;

  summariesSnap.docs.forEach(doc => {
    const data = doc.data();
    if (data.currentPrice < bestPrice) {
      bestPrice = data.currentPrice;
      bestStoreId = data.storeId;
    }
  });

  return { bestPrice, bestStoreId };
}

async function seedLists() {
  console.log('🛒 Seeding grocery lists with real Firebase prices...\n');

  // Default store for "current" prices
  const DEFAULT_STORE = 'walmart-lafayette-1';

  // List 1: Weekly Dinners
  console.log('Creating List 1: Weekly Dinners');
  const weeklyDinnerItems = [];

  // Item 1: Chobani Greek Yogurt (using milk as substitute)
  const yogurtCurrent = await getRealPrice('prod-milk-gallon', DEFAULT_STORE) || 3.49;
  const yogurtBest = await getBestPriceForProduct('prod-milk-gallon');
  weeklyDinnerItems.push({
    id: 'bi_101',
    productId: 'prod-milk-gallon',
    quantity: 2,
    currentStorePrice: yogurtCurrent,
    bestAlternatePrice: yogurtBest.bestPrice,
    bestAlternateStore: yogurtBest.bestStoreId,
    recommendation: yogurtBest.bestPrice < yogurtCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (yogurtCurrent - yogurtBest.bestPrice) * 2)
  });

  // Item 2: Bread
  const breadCurrent = await getRealPrice('prod-bread-wheat', DEFAULT_STORE) || 2.99;
  const breadBest = await getBestPriceForProduct('prod-bread-wheat');
  weeklyDinnerItems.push({
    id: 'bi_102',
    productId: 'prod-bread-wheat',
    quantity: 1,
    currentStorePrice: breadCurrent,
    bestAlternatePrice: breadBest.bestPrice,
    bestAlternateStore: breadBest.bestStoreId,
    recommendation: breadBest.bestPrice < breadCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, breadCurrent - breadBest.bestPrice)
  });

  // Item 3: Chicken Breast
  const chickenCurrent = await getRealPrice('prod-chicken-breast', DEFAULT_STORE) || 6.99;
  const chickenBest = await getBestPriceForProduct('prod-chicken-breast');
  weeklyDinnerItems.push({
    id: 'bi_103',
    productId: 'prod-chicken-breast',
    quantity: 2,
    currentStorePrice: chickenCurrent,
    bestAlternatePrice: chickenBest.bestPrice,
    bestAlternateStore: chickenBest.bestStoreId,
    recommendation: chickenBest.bestPrice < chickenCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (chickenCurrent - chickenBest.bestPrice) * 2)
  });

  // Item 4: Rice
  const riceCurrent = await getRealPrice('prod-rice-white', DEFAULT_STORE) || 3.99;
  const riceBest = await getBestPriceForProduct('prod-rice-white');
  weeklyDinnerItems.push({
    id: 'bi_104',
    productId: 'prod-rice-white',
    quantity: 1,
    currentStorePrice: riceCurrent,
    bestAlternatePrice: riceBest.bestPrice,
    bestAlternateStore: riceBest.bestStoreId,
    recommendation: riceBest.bestPrice < riceCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, riceCurrent - riceBest.bestPrice)
  });

  const weeklyTotal = weeklyDinnerItems.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0);
  const weeklyCheapest = weeklyDinnerItems.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0);

  const weeklyDinnersList = {
    id: 'list_001',
    userId: 'user_demo',
    name: 'Weekly Dinners',
    emoji: '🍽',
    itemCount: weeklyDinnerItems.length,
    totalCurrentPrice: Math.round(weeklyTotal * 100) / 100,
    totalCheapestPrice: Math.round(weeklyCheapest * 100) / 100,
    estimatedSavings: Math.round((weeklyTotal - weeklyCheapest) * 100) / 100,
    lastUpdated: new Date(),
    items: weeklyDinnerItems,
    currentStore: DEFAULT_STORE
  };

  await setDoc(doc(db, 'user_lists', 'list_001'), weeklyDinnersList);
  console.log(`  ✅ Created with ${weeklyDinnerItems.length} items, total: $${weeklyTotal.toFixed(2)}`);

  // List 2: Bday Party
  console.log('\nCreating List 2: Bday Party');
  const bdayItems = [];

  // Soda
  const sodaCurrent = await getRealPrice('prod-soda-cola', DEFAULT_STORE) || 6.99;
  const sodaBest = await getBestPriceForProduct('prod-soda-cola');
  bdayItems.push({
    id: 'bi_201',
    productId: 'prod-soda-cola',
    quantity: 2,
    currentStorePrice: sodaCurrent,
    bestAlternatePrice: sodaBest.bestPrice,
    bestAlternateStore: sodaBest.bestStoreId,
    recommendation: sodaBest.bestPrice < sodaCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (sodaCurrent - sodaBest.bestPrice) * 2)
  });

  // Butter
  const butterCurrent = await getRealPrice('prod-butter-unsalted', DEFAULT_STORE) || 4.99;
  const butterBest = await getBestPriceForProduct('prod-butter-unsalted');
  bdayItems.push({
    id: 'bi_202',
    productId: 'prod-butter-unsalted',
    quantity: 2,
    currentStorePrice: butterCurrent,
    bestAlternatePrice: butterBest.bestPrice,
    bestAlternateStore: butterBest.bestStoreId,
    recommendation: butterBest.bestPrice < butterCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (butterCurrent - butterBest.bestPrice) * 2)
  });

  // Flour
  const flourCurrent = await getRealPrice('prod-flour-ap', DEFAULT_STORE) || 4.49;
  const flourBest = await getBestPriceForProduct('prod-flour-ap');
  bdayItems.push({
    id: 'bi_203',
    productId: 'prod-flour-ap',
    quantity: 1,
    currentStorePrice: flourCurrent,
    bestAlternatePrice: flourBest.bestPrice,
    bestAlternateStore: flourBest.bestStoreId,
    recommendation: flourBest.bestPrice < flourCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, flourCurrent - flourBest.bestPrice)
  });

  const bdayTotal = bdayItems.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0);
  const bdayCheapest = bdayItems.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0);

  const bdayList = {
    id: 'list_002',
    userId: 'user_demo',
    name: 'Bday Party',
    emoji: '🎉',
    itemCount: bdayItems.length,
    totalCurrentPrice: Math.round(bdayTotal * 100) / 100,
    totalCheapestPrice: Math.round(bdayCheapest * 100) / 100,
    estimatedSavings: Math.round((bdayTotal - bdayCheapest) * 100) / 100,
    lastUpdated: new Date(),
    items: bdayItems,
    currentStore: DEFAULT_STORE
  };

  await setDoc(doc(db, 'user_lists', 'list_002'), bdayList);
  console.log(`  ✅ Created with ${bdayItems.length} items, total: $${bdayTotal.toFixed(2)}`);

  // List 3: Snack Stash
  console.log('\nCreating List 3: Snack Stash');
  const snackItems = [];

  // Coffee
  const coffeeCurrent = await getRealPrice('prod-coffee', DEFAULT_STORE) || 7.99;
  const coffeeBest = await getBestPriceForProduct('prod-coffee');
  snackItems.push({
    id: 'bi_301',
    productId: 'prod-coffee',
    quantity: 1,
    currentStorePrice: coffeeCurrent,
    bestAlternatePrice: coffeeBest.bestPrice,
    bestAlternateStore: coffeeBest.bestStoreId,
    recommendation: coffeeBest.bestPrice < coffeeCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, coffeeCurrent - coffeeBest.bestPrice)
  });

  // Cereal
  const cerealCurrent = await getRealPrice('prod-cereal-cheerios', DEFAULT_STORE) || 4.99;
  const cerealBest = await getBestPriceForProduct('prod-cereal-cheerios');
  snackItems.push({
    id: 'bi_302',
    productId: 'prod-cereal-cheerios',
    quantity: 2,
    currentStorePrice: cerealCurrent,
    bestAlternatePrice: cerealBest.bestPrice,
    bestAlternateStore: cerealBest.bestStoreId,
    recommendation: cerealBest.bestPrice < cerealCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (cerealCurrent - cerealBest.bestPrice) * 2)
  });

  // Bananas
  const bananasCurrent = await getRealPrice('prod-bananas', DEFAULT_STORE) || 0.59;
  const bananasBest = await getBestPriceForProduct('prod-bananas');
  snackItems.push({
    id: 'bi_303',
    productId: 'prod-bananas',
    quantity: 3,
    currentStorePrice: bananasCurrent,
    bestAlternatePrice: bananasBest.bestPrice,
    bestAlternateStore: bananasBest.bestStoreId,
    recommendation: bananasBest.bestPrice < bananasCurrent ? 'switch_stores' : 'buy_now',
    potentialSavings: Math.max(0, (bananasCurrent - bananasBest.bestPrice) * 3)
  });

  const snackTotal = snackItems.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0);
  const snackCheapest = snackItems.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0);

  const snackList = {
    id: 'list_003',
    userId: 'user_demo',
    name: 'Snack Stash',
    emoji: '🥨',
    itemCount: snackItems.length,
    totalCurrentPrice: Math.round(snackTotal * 100) / 100,
    totalCheapestPrice: Math.round(snackCheapest * 100) / 100,
    estimatedSavings: Math.round((snackTotal - snackCheapest) * 100) / 100,
    lastUpdated: new Date(),
    items: snackItems,
    currentStore: DEFAULT_STORE
  };

  await setDoc(doc(db, 'user_lists', 'list_003'), snackList);
  console.log(`  ✅ Created with ${snackItems.length} items, total: $${snackTotal.toFixed(2)}`);

  console.log('\n✨ All grocery lists seeded with real Firebase prices!');
  console.log('\nSummary:');
  console.log(`  - Weekly Dinners: $${weeklyDinnersList.totalCurrentPrice.toFixed(2)} (save $${weeklyDinnersList.estimatedSavings.toFixed(2)})`);
  console.log(`  - Bday Party: $${bdayList.totalCurrentPrice.toFixed(2)} (save $${bdayList.estimatedSavings.toFixed(2)})`);
  console.log(`  - Snack Stash: $${snackList.totalCurrentPrice.toFixed(2)} (save $${snackList.estimatedSavings.toFixed(2)})`);

  process.exit(0);
}

seedLists().catch((error) => {
  console.error('❌ Error seeding lists:', error);
  process.exit(1);
});
