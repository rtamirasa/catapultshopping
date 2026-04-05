# ShelfSync Dashboard

**Retail Attribution Platform** for tracking shopper intent, competitive intelligence, and pricing optimization.

## Overview

The ShelfSync Dashboard is a business intelligence platform that transforms shopper behavior data into actionable retail insights. It tracks product scans (intent signals), receipt scans (conversion events), and competitive product comparisons to provide retailers with real-time attribution analytics and AI-powered pricing recommendations.

## Features

### 📊 Core Analytics
- **Coverage Dashboard** - Real-time metrics on scans, conversions, win rates, and attributed revenue
- **Product Performance** - Track individual product metrics, conversion funnels, and competitive positioning
- **Store Analytics** - Location-based performance, coverage density, and store comparisons
- **Competitive Intelligence** - Head-to-head win/loss analysis against competitors

### 🤖 ML-Powered Features
- **Price Simulator** - AI-driven price elasticity modeling using TinyTimeMixer forecasting
- **Optimal Price Recommendations** - Multi-objective optimization balancing revenue and win rate
- **Trend Prediction** - 7-day price trend forecasting with confidence intervals
- **Anomaly Detection** - Automatic detection of unusual pricing patterns

### 📈 Real-Time Insights
- **Price Movement Alerts** - Track sudden price spikes and drops across products
- **Win/Loss Events** - Monitor competitive purchase decisions in real-time
- **Conversion Tracking** - Measure attribution from scan to purchase
- **Revenue Attribution** - Calculate recovered and lost revenue by competitor

## Tech Stack

- **Framework:** Next.js 16.2.0 (App Router)
- **UI Library:** React 19 with Radix UI primitives
- **Styling:** Tailwind CSS 4.2 with custom design system
- **Charts:** Recharts 2.15
- **Database:** Firebase Firestore
- **ML Integration:** TinyTimeMixer model via FastAPI inference service
- **Type Safety:** TypeScript 5.7

## Project Structure

```
apps/dashboard/
├── app/
│   ├── page.tsx                 # Coverage overview dashboard
│   ├── competitive/             # Competitive analysis & price simulator
│   ├── pricing/                 # Price movements & alerts
│   ├── products/                # Product-level analytics
│   ├── stores/                  # Store performance tracking
│   ├── alerts/                  # Alert management
│   ├── admin/                   # Admin tools (seed data, etc.)
│   └── api/                     # API routes
│       ├── products/
│       ├── stores/
│       ├── price-movements/
│       ├── coverage-stats/
│       ├── win-loss/
│       ├── ml-predict/          # ML model inference proxy
│       └── ...
├── components/
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── dashboard-layout.tsx
│   │   ├── header.tsx
│   │   ├── kpi-card.tsx
│   │   ├── price-simulator-ml.tsx
│   │   └── ...
│   └── ui/                      # Reusable UI components (shadcn/ui)
├── lib/
│   ├── api.ts                   # Firebase query functions
│   ├── firebase.ts              # Firebase initialization
│   ├── seed-data.ts             # Data seeding utilities
│   ├── mock-data.ts             # Mock data for development
│   ├── hooks/                   # React hooks for data fetching
│   │   ├── use-products.ts
│   │   ├── use-stores.ts
│   │   ├── use-coverage-stats.ts
│   │   └── ...
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- (Optional) ML inference service running on port 8000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**

   Create `.env.local` in the dashboard root:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # ML API (optional - fallback mode available)
   ML_API_URL=http://localhost:8000
   ```

3. **Seed initial data (optional):**
   ```bash
   npm run dev
   # Navigate to http://localhost:3001/admin/seed
   # Click "Seed Database" to populate test data
   ```

### Development

```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Routes

### Data Fetching
- `GET /api/products` - Fetch all products from Firebase
- `GET /api/stores` - Fetch all store locations
- `GET /api/price-movements` - Get active price spikes and drops
- `GET /api/coverage-stats?days=7` - Get coverage metrics for date range
- `GET /api/product-metrics/:id` - Get product-specific metrics
- `GET /api/store-metrics/:id` - Get store-specific metrics
- `GET /api/win-loss` - Fetch win/loss events
- `GET /api/alerts` - Fetch active alerts

### ML Integration
- `POST /api/ml-predict` - Get price predictions from ML model
  ```json
  {
    "product": "eggs_grade_a_large",
    "days_ahead": 7
  }
  ```
- `GET /api/ml-predict` - Health check for ML service

## Firebase Collections

### Core Collections
- **`products`** - Product catalog with base pricing
- **`stores`** - Store locations and metadata
- **`scans`** - Product scan events (intent signals)
- **`receipts`** - Purchase confirmations from receipt scans
- **`win_loss_events`** - Competitive purchase decisions
- **`price_summaries`** - Price history and spike detection
- **`competitors`** - Competitive product catalog
- **`alerts`** - System-generated alerts and notifications

### Aggregated Metrics (Daily)
- **`product_metrics_daily`** - Product performance by day
- **`store_metrics_daily`** - Store performance by day
- **`coverage_stats_daily`** - Overall platform metrics by day

See `lib/api.ts` for query patterns and `lib/seed-data.ts` for schema examples.

## ML Model Integration

The dashboard integrates with a **TinyTimeMixer** time-series forecasting model for price prediction and optimization.

### Setup

1. **Start the ML inference service:**
   ```bash
   cd ../../../training
   python inference/api.py
   ```
   Service runs on `http://localhost:8000`

2. **Verify ML connection:**
   - Navigate to Competitive page in dashboard
   - Check for "TinyTimeMixer Active" badge
   - If showing "Fallback Mode", the service isn't running (statistical fallback is used)

### Model Features
- **Price Forecasting:** 7-30 day ahead predictions
- **Trend Detection:** Identifies increasing/decreasing/stable trends
- **Anomaly Scoring:** Flags unusual price patterns
- **Confidence Intervals:** Provides prediction confidence scores

### Fallback Mode
If the ML service is unavailable, the dashboard automatically uses statistical fallback with:
- Fixed 85% confidence score
- Stable trend assumption
- Price elasticity calculations only

## Data Flow Architecture

```
User Action (Consumer App)
    ↓
Firebase Firestore
    ↓
Dashboard API Routes (/api/*)
    ↓
React Hooks (use-*.ts)
    ↓
Dashboard UI Components
```

### Example: Coverage Stats
1. User selects date range in header
2. `use-coverage-stats.ts` hook fetches data via API
3. `/api/coverage-stats` queries Firebase (scans, receipts, win_loss_events)
4. API aggregates metrics and returns JSON
5. Dashboard displays KPI cards and charts

## Date Range Filtering

The dashboard supports dynamic date range filtering using localStorage + custom events:

```typescript
// Set date range (in header.tsx)
localStorage.setItem('dashboard-date-range', '7')
window.dispatchEvent(new CustomEvent('date-range-changed', { detail: '7' }))

// Listen for changes (in hooks)
useEffect(() => {
  const handleChange = (e: CustomEvent) => {
    refetchData(e.detail)
  }
  window.addEventListener('date-range-changed', handleChange)
}, [])
```

## Price Simulator Algorithm

The ML-powered price simulator uses multi-objective optimization:

### Optimization Weights
- **Base:** 70% revenue, 30% win rate
- **Increasing trend:** 60% revenue, 40% win rate (capture market share)
- **Decreasing trend:** 75% revenue, 25% win rate (protect margins)

### Factors Considered
1. Price elasticity of demand
2. Competitor pricing gap
3. ML trend predictions
4. Anomaly scores (penalizes unusual prices)
5. Conversion rate impact
6. Win/loss rate impact

## Development Tips

### Adding a New Dashboard Page

1. Create route in `app/your-page/page.tsx`
2. Add data fetching hook in `lib/hooks/use-your-data.ts`
3. Create API route in `app/api/your-data/route.ts`
4. Add Firebase query function in `lib/api.ts`
5. Update navigation in `components/dashboard/dashboard-layout.tsx`

### Mock Data vs Real Data

- **Development:** Use `lib/mock-data.ts` for rapid prototyping
- **Production:** Connect to Firebase via hooks
- Toggle between mock and real data by importing from different sources

### Performance Optimization

- Daily metrics collections are pre-aggregated for speed
- API routes use Firestore query optimization (indexes, limits)
- Date range filtering reduces data transfer
- Charts use memoization to prevent unnecessary re-renders

## Deployment

### Build Check
```bash
npm run build
# Verify no TypeScript or build errors
```

### Environment Variables
Ensure all `NEXT_PUBLIC_*` variables are set in your deployment environment (Vercel, Railway, etc.)

### Firebase Security Rules
The dashboard requires read access to all collections. Update Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Dashboard shows all zeros
- Check Firebase connection in browser console
- Verify data exists in Firebase collections
- Check date range filter (data may be outside range)
- Run seed script if database is empty: `/admin/seed`

### ML features not working
- Verify ML API is running: `curl http://localhost:8000/health`
- Check `ML_API_URL` environment variable
- Fallback mode will activate automatically if ML API is down

### Store dropdown shows wrong stores
- Verify `useStores()` hook is being used instead of mock imports
- Check Firebase `stores` collection has data
- Clear localStorage and refresh

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript with strict mode enabled
3. Add proper error handling to all API routes
4. Document new Firebase queries in `lib/api.ts`
5. Keep components small and focused (single responsibility)

## License

Proprietary - ShelfSync Platform

---

**Built with ❤️ for retail attribution**
