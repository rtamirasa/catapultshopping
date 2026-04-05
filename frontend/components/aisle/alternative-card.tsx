'use client'

import { Package, Star, TrendingDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheaperAlternative, AlternativeBadge } from '@/lib/mock-data'

const BADGE_STYLES: Record<AlternativeBadge, string> = {
  'Best Value':    'bg-emerald-500/15 text-emerald-600 border-emerald-500/25',
  'Similar Taste': 'bg-blue-500/15 text-blue-600 border-blue-500/25',
  'Highest Rated': 'bg-amber-500/15 text-amber-600 border-amber-500/25',
  'Cheapest Swap': 'bg-violet-500/15 text-violet-600 border-violet-500/25',
  'Staff Pick':    'bg-rose-500/15 text-rose-600 border-rose-500/25',
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            className={cn(
              'size-3',
              s <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : s - 0.5 <= rating
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-muted text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground/60">
        ({count.toLocaleString()})
      </span>
    </div>
  )
}

interface AlternativeCardProps {
  alternative: CheaperAlternative
  isHighlighted?: boolean
}

export function AlternativeCard({ alternative, isHighlighted }: AlternativeCardProps) {
  const {
    name, brand, currentPrice, savingsAmount,
    rating, reviewCount, badge, recommendationReason,
    inStock, confidenceScore,
  } = alternative

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-4 transition-all duration-300',
        isHighlighted
          ? 'border-primary/40 ring-1 ring-primary/20 shadow-sm'
          : 'border-border hover:border-primary/20',
        !inStock && 'opacity-60',
      )}
    >
      {isHighlighted && (
        <div className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
          Top Pick
        </div>
      )}

      <div className="flex gap-3">
        <div className="size-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Package className="size-6 text-muted-foreground/40" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground font-medium">{brand}</p>
              <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{name}</p>
            </div>
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0',
              BADGE_STYLES[badge],
            )}>
              {badge}
            </span>
          </div>

          <StarRating rating={rating} count={reviewCount} />

          <div className="flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-foreground tabular-nums">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                <TrendingDown className="size-3" />
                Save ${savingsAmount.toFixed(2)}
              </span>
            </div>
            {confidenceScore >= 85 && (
              <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                {confidenceScore}% conf.
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mt-2.5 pl-0.5">
        {recommendationReason}
      </p>

      {!inStock && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
          <AlertCircle className="size-3" />
          <span className="font-medium">Low stock — may be unavailable</span>
        </div>
      )}
    </div>
  )
}
