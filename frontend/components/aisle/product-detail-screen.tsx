'use client'

import { Package, Calendar, Clock, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadgeLarge } from './recommendation-badge'
import { TrustPanel } from './trust-badges'
import { PriceChart } from './price-chart'
import { StoreComparisonCard } from './store-comparison-card'
import { SavingsBreakdownCard } from './savings-card'
import { ObservationFeed } from './observation-feed'
import { useProduct } from '@/lib/hooks/use-product'

// Use the first spike product as default
const DEFAULT_PRODUCT_ID = 'prod-eggs-large'
const DEFAULT_STORE_ID = 'walmart-lafayette-1'

export function ProductDetailScreen() {
  const { data, loading } = useProduct(DEFAULT_PRODUCT_ID)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 h-32 animate-pulse" />
        <div className="rounded-2xl border border-border bg-card p-4 h-20 animate-pulse" />
        <div className="rounded-2xl border border-border bg-card p-4 h-64 animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-center text-muted-foreground">Product not found</div>
      </div>
    )
  }

  const { product, storeComparisons, recommendation } = data

  // Get current store comparison (default to first one)
  const currentStore = storeComparisons.find(s => s.storeId === DEFAULT_STORE_ID) || storeComparisons[0]
  const CURRENT_PRICE = currentStore?.currentPrice || 0
  const RECENT_AVG = 0 // TODO: Get from price summary
  const PRICE_DELTA = 0
  const PCT_DELTA = '0'
  const isDown = PRICE_DELTA < 0

  return (
    <div className="space-y-4">
      {/* Product header */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-4">
          {/* Image placeholder */}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="size-20 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="size-20 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Package className="size-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {product.brand}
            </p>
            <p className="font-bold text-foreground text-base leading-snug mt-0.5">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStore?.storeName} · {product.category}
            </p>

            {/* Price + delta */}
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                ${CURRENT_PRICE.toFixed(2)}
              </span>
              {PRICE_DELTA !== 0 && (
                <span className={cn(
                  'flex items-center gap-0.5 text-sm font-semibold',
                  isDown ? 'text-success' : 'text-danger'
                )}>
                  {isDown ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
                  {isDown ? '' : '+'}{PCT_DELTA}% vs avg
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <RecommendationBadgeLarge
        action={recommendation.action}
        headline={recommendation.headline}
        explanation={recommendation.explanation}
      />

      {/* Price chart */}
      <PriceChart productId={DEFAULT_PRODUCT_ID} storeId={DEFAULT_STORE_ID} />

      {/* Store comparison */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Store Comparison
        </p>
        <div className="space-y-3">
          {storeComparisons.map((store) => (
            <StoreComparisonCard
              key={store.storeId}
              store={store}
              currentPrice={CURRENT_PRICE}
            />
          ))}
        </div>
      </div>

      {/* Trust panel - simplified for now */}
      <TrustPanel
        verifiedBy={storeComparisons[0]?.confidence || 0}
        lastUpdatedMinutesAgo={5}
        confidenceScore={storeComparisons[0]?.confidence || 0}
        totalObservations={15}
      />
    </div>
  )
}
