'use client'

import { useState, useMemo } from 'react'
import {
  Sparkles, TrendingDown, Star, DollarSign,
  BarChart3, CheckCircle2, ShieldCheck, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AlternativeCard } from './alternative-card'
import type { CheaperAlternative, AlternativesScanData } from '@/lib/mock-data'

type SortMode = 'best' | 'cheapest' | 'rating'

const SORT_OPTIONS: { value: SortMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'best',     label: 'Best Overall', icon: Sparkles },
  { value: 'cheapest', label: 'Cheapest',     icon: DollarSign },
  { value: 'rating',   label: 'Best Rated',   icon: Star },
]

function sortAlternatives(items: CheaperAlternative[], mode: SortMode): CheaperAlternative[] {
  const sorted = [...items]
  switch (mode) {
    case 'cheapest':
      return sorted.sort((a, b) => a.currentPrice - b.currentPrice)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'best':
    default:
      return sorted.sort((a, b) => {
        const scoreA = a.savingsAmount * 0.4 + a.rating * 0.4 + (a.confidenceScore / 100) * 0.2
        const scoreB = b.savingsAmount * 0.4 + b.rating * 0.4 + (b.confidenceScore / 100) * 0.2
        return scoreB - scoreA
      })
  }
}

function AlternativeSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="size-14 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="size-3 bg-muted rounded-sm" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-14 bg-muted rounded" />
            <div className="h-5 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>
      <div className="h-3 w-full bg-muted rounded mt-3" />
      <div className="h-9 w-full bg-muted rounded-lg mt-3" />
    </div>
  )
}

interface AlternativesSectionProps {
  data: AlternativesScanData
  isLoading?: boolean
}

export function AlternativesSection({ data, isLoading }: AlternativesSectionProps) {
  const [sortMode, setSortMode] = useState<SortMode>('best')

  const sorted = useMemo(
    () => sortAlternatives(data.cheaperAlternatives.filter(a => a.inStock), sortMode),
    [data.cheaperAlternatives, sortMode],
  )

  const outOfStock = data.cheaperAlternatives.filter(a => !a.inStock)
  const topPickId = sorted[0]?.id

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        <div className="h-3 w-64 bg-muted rounded animate-pulse" />
        {[1, 2, 3].map(i => <AlternativeSkeleton key={i} />)}
      </div>
    )
  }

  if (data.isAlreadyCheapest) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Great choice!</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              {data.cheapestMessage}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (data.cheaperAlternatives.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Savings summary banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/15 p-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
            <TrendingDown className="size-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              Save up to ${data.savingsSummary.maxSavings.toFixed(2)} with a smart swap
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.savingsSummary.totalAlternatives} cheaper option{data.savingsSummary.totalAlternatives !== 1 ? 's' : ''} available in this store
            </p>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">Save More with Alternatives</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Smart substitutions based on price, rating, and product similarity
        </p>
      </div>

      {/* Sort toggles */}
      <div className="flex gap-1.5 bg-secondary/50 p-1 rounded-lg">
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSortMode(value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-md transition-all',
              sortMode === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map(alt => (
          <AlternativeCard
            key={alt.id}
            alternative={alt}
            isHighlighted={alt.id === topPickId}
          />
        ))}
        {outOfStock.map(alt => (
          <AlternativeCard
            key={alt.id}
            alternative={alt}
          />
        ))}
      </div>

      {/* Trust footer */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Eye className="size-3" />
          <span>{data.verificationStats.observationsToday} observations today</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <ShieldCheck className="size-3" />
          <span>Updated {data.verificationStats.lastRefreshed}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
        <BarChart3 className="size-2.5" />
        {data.verificationStats.dataSource}
      </p>
    </div>
  )
}
