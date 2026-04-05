'use client'

import { TrendingDown, Clock, ArrowRightLeft, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecommendationAction } from '@/lib/mock-data'

interface RecommendationBadgeProps {
  action: RecommendationAction
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const CONFIG: Record<RecommendationAction, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  classes: string
  dotClass: string
}> = {
  buy_now: {
    label: 'Buy Now',
    icon: ShoppingCart,
    classes: 'bg-success/15 text-success border border-success/30',
    dotClass: 'bg-success',
  },
  wait: {
    label: 'Wait',
    icon: Clock,
    classes: 'bg-warning/15 text-warning border border-warning/30',
    dotClass: 'bg-warning',
  },
  switch_stores: {
    label: 'Switch Stores',
    icon: ArrowRightLeft,
    classes: 'bg-primary/15 text-primary border border-primary/30',
    dotClass: 'bg-primary',
  },
}

const SIZES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
}

const ICON_SIZES = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
}

export function RecommendationBadge({ action, size = 'md', className }: RecommendationBadgeProps) {
  const config = CONFIG[action]
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold tracking-wide',
        config.classes,
        SIZES[size],
        className
      )}
    >
      <Icon className={ICON_SIZES[size]} />
      {config.label}
    </span>
  )
}

export function RecommendationBadgeLarge({ action, headline, explanation }: {
  action: RecommendationAction
  headline: string
  explanation: string
}) {
  const config = CONFIG[action]
  const Icon = config.icon
  return (
    <div className={cn(
      'rounded-xl p-4 flex items-start gap-3',
      action === 'buy_now' && 'bg-success/10 border border-success/20',
      action === 'wait' && 'bg-warning/10 border border-warning/20',
      action === 'switch_stores' && 'bg-primary/10 border border-primary/20',
    )}>
      <div className={cn(
        'rounded-lg p-2 shrink-0',
        action === 'buy_now' && 'bg-success/20 text-success',
        action === 'wait' && 'bg-warning/20 text-warning',
        action === 'switch_stores' && 'bg-primary/20 text-primary',
      )}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className={cn(
          'font-bold text-base',
          action === 'buy_now' && 'text-success',
          action === 'wait' && 'text-warning',
          action === 'switch_stores' && 'text-primary',
        )}>{headline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{explanation}</p>
      </div>
    </div>
  )
}
