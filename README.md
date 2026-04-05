# AisleIQ

**Smart grocery shopping platform** with real-time price tracking and retail attribution analytics.

## Overview

ShelfSync is a dual-platform system:
- **Consumer App** - Mobile-first shopping app for price comparison, product scanning, and grocery lists
- **Dashboard** - Retail analytics platform for attribution tracking, competitive intelligence, and ML-powered pricing optimization

Both apps share a Firebase backend and use TinyTimeMixer ML model for price forecasting.

## Quick Start

npm install

# Run both apps
npm run dev

# Or run individually
npm run dev:consumer    # http://localhost:3000
npm run dev:dashboard   # http://localhost:3001
```

## Apps

### Consumer App (Port 3000)
Mobile-optimized shopping experience with:
- **Product scanning** - Barcode/QR code scanning
- **Price comparison** - Real-time prices across stores
- **Smart lists** - AI-suggested grocery lists
- **Price history** - Track price trends over time
- **Receipt scanning** - Automatic purchase tracking

**Key Features:**
- Firebase auth & Firestore data
- Mobile-first responsive design
- Real-time price alerts
- Store location mapping

### Dashboard (Port 3001)
Retail attribution analytics with:
- **Coverage metrics** - Scans, conversions, win rates
- **Competitive analysis** - Head-to-head performance vs competitors
- **ML price simulator** - AI-powered pricing recommendations
- **Product/store analytics** - Detailed performance tracking
- **Alerts** - Automated insights and warnings

**Key Features:**
- TinyTimeMixer ML integration for price forecasting
- Multi-objective price optimization (70% revenue, 30% win rate)
- Real-time Firebase data aggregation
- Interactive Recharts visualizations

## Tech Stack

- **Framework:** Next.js 16.2.0, React 19
- **Database:** Firebase Firestore
- **ML Model:** TinyTimeMixer (PyTorch) via FastAPI
- **UI:** Tailwind CSS 4.2, Radix UI, shadcn/ui
- **Charts:** Recharts 2.15
- **Type Safety:** TypeScript 5.7

## Environment Setup

Create `.env.local` in project root with:

```env
# Firebase (shared by both apps)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ML API (optional - dashboard has fallback)
ML_API_URL=http://localhost:8000
```

# Model Info
The dashboard uses a TinyTimeMixer based  model for price forecasting. Start the inference service:

```bash
cd training
python inference/api.py
```

**Without ML:** Dashboard automatically uses statistical fallback mode.

## Development

```bash
# Build both apps
npm run build

# Production mode
npm start

# Lint all workspaces
npm run lint

# Clean install
npm run clean && npm install
```

## Monorepo Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both apps |
| `npm run dev:consumer` | Consumer only |
| `npm run dev:dashboard` | Dashboard only |
| `npm run build` | Build all apps |
| `npm run build:consumer` | Build consumer |
| `npm run build:dashboard` | Build dashboard |

## Data Flow

```
Consumer App (Scan Product)
    ↓
Firebase Firestore (scans, receipts)
    ↓
Dashboard (Real-time Analytics)
    ↓
Retailer Insights & Pricing Decisions
```

## Key Features

### Consumer Side
- Scan products to track prices
- Compare across multiple stores
- Build smart grocery lists
- Track purchase history
- Get price drop alerts

### Dashboard Side
- Track shopper intent (scans)
- Measure conversions (receipts)
- Competitive win/loss analysis
- ML-powered price optimization
- Revenue attribution
