'use client'

import { Package, Calendar, Clock, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadgeLarge } from './recommendation-badge'
import { TrustPanel } from './trust-badges'
import { PriceChart } from './price-chart'
import { StoreComparisonCard } from './store-comparison-card'
import { SavingsBreakdownCard } from './savings-card'
import { ObservationFeed } from './observation-feed'
import {
  MOCK_FEATURED_PRODUCT,
  MOCK_RECOMMENDATION,
  MOCK_BEST_TIME_TO_BUY,
  MOCK_VERIFICATION_STATS,
  MOCK_STORE_COMPARISONS,
  MOCK_SAVINGS_BREAKDOWN,
  MOCK_RECENT_OBSERVATIONS,
} from '@/lib/mock-data'

const CURRENT_PRICE = 5.49
const RECENT_AVG = 5.72
const PRICE_DELTA = CURRENT_PRICE - RECENT_AVG
const PCT_DELTA = ((PRICE_DELTA / RECENT_AVG) * 100).toFixed(1)

export function ProductDetailScreen() {
  const isDown = PRICE_DELTA < 0

  return (
    <div className="space-y-4">
      {/* Product header */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-4">
          {/* Image placeholder */}
          <div className="size-20 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Package className="size-10 text-muted-foreground/40" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {MOCK_FEATURED_PRODUCT.brand}
            </p>
            <p className="font-bold text-foreground text-base leading-snug mt-0.5">
              {MOCK_FEATURED_PRODUCT.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Whole Foods · Dairy</p>

            {/* Price + delta */}
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                ${CURRENT_PRICE.toFixed(2)}
              </span>
              <span className={cn(
                'flex items-center gap-0.5 text-sm font-semibold',
                isDown ? 'text-success' : 'text-danger'
              )}>
                {isDown ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
                {isDown ? '' : '+'}{PCT_DELTA}% vs avg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <RecommendationBadgeLarge
        action={MOCK_RECOMMENDATION.action}
        headline={MOCK_RECOMMENDATION.headline}
        explanation={MOCK_RECOMMENDATION.explanation}
      />

      {/* Price chart */}
      <PriceChart />

      {/* Best time to buy */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="size-4 text-primary" />
          <p className="text-sm font-semibold">Best Time to Buy</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Cheapest day</p>
            <p className="font-bold text-foreground text-sm">{MOCK_BEST_TIME_TO_BUY.cheapestDay}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Time window</p>
            <p className="font-bold text-foreground text-sm">{MOCK_BEST_TIME_TO_BUY.cheapestTimeWindow}</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Est. savings</p>
            <p className="font-bold text-success text-sm">-${MOCK_BEST_TIME_TO_BUY.estimatedSavings.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-secondary/40 rounded-lg p-2.5">
          <Clock className="size-3.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            Current projected low: <span className="text-success font-bold">${MOCK_BEST_TIME_TO_BUY.projectedLowPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Store comparison */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Store Comparison
        </p>
        <div className="space-y-3">
          {MOCK_STORE_COMPARISONS.map((store) => (
            <StoreComparisonCard
              key={store.storeId}
              store={store}
              currentPrice={CURRENT_PRICE}
            />
          ))}
        </div>
      </div>

      {/* Savings breakdown */}
      <SavingsBreakdownCard breakdown={MOCK_SAVINGS_BREAKDOWN} />

      {/* Trust panel */}
      <TrustPanel
        verifiedBy={MOCK_VERIFICATION_STATS.verifiedBy}
        lastUpdatedMinutesAgo={MOCK_VERIFICATION_STATS.lastUpdatedMinutesAgo}
        confidenceScore={MOCK_VERIFICATION_STATS.confidenceScore}
        totalObservations={MOCK_VERIFICATION_STATS.totalObservations}
      />

      {/* Recent observations */}
      <ObservationFeed observations={MOCK_RECENT_OBSERVATIONS} />
    </div>
  )
}
