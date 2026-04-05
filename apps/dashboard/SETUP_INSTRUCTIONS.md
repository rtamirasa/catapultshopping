# 🚀 Dashboard Setup - Quick Start

## You're Ready for Tomorrow! Here's What to Do:

### 1. Start the Dashboard (2 minutes)
```bash
cd /Users/ridhitamirasa/catapult/catapultshopping
npm run dev:dashboard
```

Wait for: `Ready in XXXms`

### 2. Seed the Data (3 minutes)
1. Open browser: **http://localhost:3001**
2. Go to: **http://localhost:3001/admin/seed**
3. Click: **"🌱 Seed Attribution Data"**
4. Wait for success message (2-3 minutes)

### 3. View Your Dashboard ✨
Navigate to these pages to see your data:

- **Overview** (`/`) - Attribution KPIs, conversions, win rates
- **Stores** (`/stores`) - Store performance metrics
- **Alerts** (`/alerts`) - Real-time notifications
- **Pricing** (`/pricing`) - Price movements

## What You'll See After Seeding:

### Overview Page
- ✅ ~700 scans (product views)
- ✅ ~250 purchases (38% conversion rate)
- ✅ ~210 win/loss events (65% win rate)
- ✅ Real revenue attribution
- ✅ Lost revenue to competitors

### Stores Page
- ✅ Real store locations
- ✅ Stock health metrics (70-95%)
- ✅ Product presence scores
- ✅ Scan frequency by store

### Alerts Page
- ✅ 6 real alerts:
  - Price spike warnings
  - Conversion drops
  - Competitor win streaks
  - Stock level alerts
  - Price opportunities

## That's It! 🎉

Your dashboard is fully functional with realistic demo data.

## Quick Troubleshooting

**Problem: "No data showing"**
→ Did you click the seed button at `/admin/seed`?

**Problem: "Failed to fetch"**
→ Check that dashboard dev server is running (`npm run dev:dashboard`)

**Problem: "Seed script taking forever"**
→ It's normal! Takes 2-3 minutes to create ~1500 records
→ Watch browser console for progress logs

---

## For the Presentation

**Key Points to Highlight:**
1. **Real Attribution** - We track scans (intent) → purchases (conversion)
2. **Competitive Intel** - Know when you win vs lose head-to-head
3. **Store Insights** - Performance varies by location
4. **Automated Alerts** - Proactive notifications for issues

**Demo Flow:**
1. Start at Overview → Show KPIs
2. Go to Stores → Show location performance
3. Check Alerts → Show notification system
4. Review Pricing → Show market intelligence

Good luck tomorrow! 🍀
