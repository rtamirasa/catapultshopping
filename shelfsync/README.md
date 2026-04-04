# ShelfSync

A hackathon web app that helps users navigate grocery stores by providing exact aisle and shelf locations for products. Users verify their identity with World ID, earn points for finding products, and all interactions are logged for potential sale to retailers and delivery platforms.

## Features

- **World ID Verification**: Human verification using Worldcoin's IDKit
- **Store Selection**: Choose from available grocery stores
- **Product Search**: Search for items and get exact locations
- **Aisle Directions**: Get detailed navigation to products
- **Points & Rewards**: Earn 10 points for each product found
- **Data Logging**: All interactions logged to Firestore for analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth + World ID
- **State Management**: Zustand
- **Icons**: Lucide React
- **UI Components**: Radix UI

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (optional, for future enhancements)
4. Copy your Firebase config

### 3. Set Up World ID

1. Create a Worldcoin app at [https://developer.worldcoin.org](https://developer.worldcoin.org)
2. Get your App ID

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase and Worldcoin credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
shelfsync/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── verify/              # World ID verification
│   ├── store/               # Store selection
│   ├── search/              # Product search
│   ├── result/              # Aisle directions
│   ├── confirm/             # Product confirmation
│   ├── rewards/             # Points dashboard
│   └── api/                 # API routes
│       ├── verify/          # World ID verification endpoint
│       ├── search/          # Product search endpoint
│       └── confirm/         # Product confirmation endpoint
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   ├── db.ts               # Firestore helper functions
│   └── store.ts            # Zustand global state
├── data/
│   └── store.ts            # Demo store data
└── ...
```

## User Flow

1. **Landing** (`/`) - Introduction and CTA
2. **Verify** (`/verify`) - World ID verification
3. **Store Selection** (`/store`) - Choose a store
4. **Search** (`/search`) - Search for products
5. **Result** (`/result`) - View aisle directions
6. **Confirm** (`/confirm`) - Confirm found + optional photo
7. **Rewards** (`/rewards`) - View points and stats

## Database Schema

### Users Collection
```typescript
{
  id: string
  worldId: string
  verified: boolean
  points: number
  createdAt: Timestamp
}
```

### Events Collection
```typescript
{
  userId: string
  type: 'store_selected' | 'product_searched' | 'product_found' | 'photo_uploaded'
  storeId?: string
  productId?: string
  searchQuery?: string
  timestamp: Timestamp
  metadata?: Record<string, any>
}
```

## Demo Data

The app includes hardcoded demo data for "Target - West Lafayette" with 10 products across different aisles and sections. This can be extended or replaced with real data.

## Monetization Model

All user interactions (store selections, searches, product finds, photos) are logged as structured data in Firestore. This data can be valuable to:

- Retailers (foot traffic patterns, popular products, shelf effectiveness)
- Delivery platforms (product locations, store layouts)
- Market research firms (shopping behavior analytics)

## Next Steps

- [ ] Add more stores and products
- [ ] Implement photo verification
- [ ] Add rewards redemption
- [ ] Create admin dashboard for data export
- [ ] Implement real-time store maps
- [ ] Add user profiles and history

## License

Built for hackathon purposes.
