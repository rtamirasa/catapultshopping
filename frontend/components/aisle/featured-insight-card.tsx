'use client'

import Link from 'next/link'
import { ArrowRight, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { MOCK_PRICE_MOVEMENTS } from '@/lib/mock-data'
import type { PriceMovement } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function FeaturedInsightCard() {
  const drop = MOCK_PRICE_MOVEMENTS.find((m) => m.direction === 'down')!
  const spike = MOCK_PRICE_MOVEMENTS.find((m) => m.direction === 'up')!

  return (
    <section className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Today&apos;s Price Moves
      </p>
      <div className="grid grid-cols-2 gap-3">
        <MovementCard movement={drop} label="Biggest Drop" />
        <MovementCard movement={spike} label="Biggest Spike" />
      </div>
    </section>
  )
}

function MovementCard({ movement, label }: { movement: PriceMovement; label: string }) {
  const isDown = movement.direction === 'down'

  return (
    <Link href="/product">
      <div className={cn(
        'rounded-2xl border p-3.5 relative overflow-hidden transition-all hover:border-opacity-60 h-full',
        isDown
          ? 'border-success/30 bg-success/5'
          : 'border-danger/30 bg-danger/5'
      )}>
        {/* Icon */}
        <div className={cn(
          'size-8 rounded-full flex items-center justify-center mb-2',
          isDown ? 'bg-success/15' : 'bg-danger/15'
        )}>
          {isDown
            ? <TrendingDown className="size-4 text-success" />
            : <TrendingUp className="size-4 text-danger" />
          }
        </div>

        {/* Label */}
        <p className={cn(
          'text-[10px] font-bold uppercase tracking-wider mb-1',
          isDown ? 'text-success' : 'text-danger'
        )}>
          {label}
        </p>

        {/* Product name */}
        <p className="text-xs font-semibold text-foreground leading-snug mb-1 line-clamp-2">
          {movement.product.name}
        </p>
        <p className="text-[10px] text-muted-foreground mb-2">{movement.store}</p>

        {/* Price change */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-foreground">
            ${movement.currentPrice.toFixed(2)}
          </span>
          <span className={cn(
            'text-xs font-bold',
            isDown ? 'text-success' : 'text-danger'
          )}>
            {isDown ? '' : '+'}{movement.changePct}%
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground line-through">
          was ${movement.previousPrice.toFixed(2)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="size-2.5" />
            <span>{movement.verifiedBy} verified</span>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-primary font-semibold">
            <span>Details</span>
            <ArrowRight className="size-2.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
