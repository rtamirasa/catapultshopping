'use client'

import { MapPin, CheckCircle2, AlertCircle, XCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfidenceBadge, LastSeenBadge } from './trust-badges'
import type { StoreComparison } from '@/lib/mock-data'

interface StoreComparisonCardProps {
  store: StoreComparison
  currentPrice?: number
}

const STOCK_CONFIG = {
  in_stock: { label: 'In Stock', icon: CheckCircle2, class: 'text-success' },
  low_stock: { label: 'Low Stock', icon: AlertCircle, class: 'text-warning' },
  out_of_stock: { label: 'Out of Stock', icon: XCircle, class: 'text-danger' },
}

export function StoreComparisonCard({ store, currentPrice }: StoreComparisonCardProps) {
  const stock = STOCK_CONFIG[store.stockStatus]
  const StockIcon = stock.icon
  const savings = currentPrice ? currentPrice - store.currentPrice : 0

  return (
    <div className={cn(
      'rounded-xl border bg-card p-4 relative transition-all duration-200',
      store.isBestValue
        ? 'border-primary/50 shadow-[0_0_16px_oklch(0.78_0.16_175_/_0.12)]'
        : 'border-border hover:border-border/80'
    )}>
      {store.isBestValue && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Star className="size-3 fill-current" />
            Best Value
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-foreground text-base">{store.storeName}</p>
          {store.distance && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="size-3" />
              {store.distance}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">${store.currentPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{store.unitPrice}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <ConfidenceBadge score={store.confidence} />
        <LastSeenBadge timestamp={store.lastVerified} />
        <span className={cn('inline-flex items-center gap-1 text-xs font-medium', stock.class)}>
          <StockIcon className="size-3" />
          {stock.label}
        </span>
      </div>

      {currentPrice && savings > 0.01 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-success font-semibold">
            Save ${savings.toFixed(2)} vs your current store
          </p>
        </div>
      )}
    </div>
  )
}
