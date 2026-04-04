'use client'

import { ShoppingCart, Clock, ArrowRightLeft, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SavingsBreakdown } from '@/lib/mock-data'

interface SavingsBreakdownCardProps {
  breakdown: SavingsBreakdown
  className?: string
}

export function SavingsBreakdownCard({ breakdown, className }: SavingsBreakdownCardProps) {
  const options = [
    {
      icon: ShoppingCart,
      label: breakdown.buyNow.label,
      price: breakdown.buyNow.price,
      savings: breakdown.buyNow.savings,
      highlight: false,
      note: null,
    },
    {
      icon: Clock,
      label: breakdown.waitOption.label,
      price: breakdown.waitOption.price,
      savings: breakdown.waitOption.savings,
      highlight: false,
      note: breakdown.waitOption.targetWindow,
    },
    {
      icon: ArrowRightLeft,
      label: breakdown.switchStore.label,
      price: breakdown.switchStore.price,
      savings: breakdown.switchStore.savings,
      highlight: true,
      note: 'Best option',
    },
  ]

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="size-4 text-primary" />
        <p className="text-sm font-semibold">Savings Breakdown</p>
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const Icon = opt.icon
          return (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-lg p-3',
                opt.highlight
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/50'
              )}
            >
              <Icon className={cn('size-4 shrink-0', opt.highlight ? 'text-primary' : 'text-muted-foreground')} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', opt.highlight ? 'text-primary' : 'text-foreground')}>
                  {opt.label}
                </p>
                {opt.note && (
                  <p className="text-xs text-muted-foreground">{opt.note}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">${opt.price.toFixed(2)}</p>
                {opt.savings > 0 && (
                  <p className="text-xs text-success font-semibold">-${opt.savings.toFixed(2)}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
