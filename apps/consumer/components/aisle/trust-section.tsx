'use client'

import { useState } from 'react'
import { Zap, Store, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_SHOPPING_OPTIMIZATION } from '@/lib/mock-data'

type Mode = '1-store' | 'multi'

export function CheapestStoresSection() {
  const [mode, setMode] = useState<Mode>('1-store')
  const opt = MOCK_SHOPPING_OPTIMIZATION

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Shopping Plan
        </p>
        {/* Toggle */}
        <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-0.5">
          {(['1-store', 'multi'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold transition-all',
                mode === m
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {m === '1-store' ? '1 Store' : 'Multi-Stop'}
            </button>
          ))}
        </div>
      </div>

      {mode === '1-store' ? (
        <SingleStoreView opt={opt} />
      ) : (
        <MultiStoreView opt={opt} />
      )}
    </section>
  )
}

function SingleStoreView({ opt }: { opt: typeof MOCK_SHOPPING_OPTIMIZATION }) {
  const best = opt.singleStoreOptions.find(s => s.isBest)!

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Best pick header */}
      <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 text-primary" />
          <p className="text-xs font-semibold text-primary">Best single stop</p>
        </div>
        <p className="text-xs text-muted-foreground">vs. ${opt.baselineTotal.toFixed(2)} baseline</p>
      </div>

      {opt.singleStoreOptions.map((store, i) => {
        const isLast = i === opt.singleStoreOptions.length - 1
        return (
          <div
            key={store.storeId}
            className={cn(
              'flex items-center gap-3 px-4 py-3',
              !isLast && 'border-b border-border',
              store.isBest && 'bg-primary/3'
            )}
          >
            {/* Store icon */}
            <div className={cn(
              'size-8 rounded-lg flex items-center justify-center shrink-0',
              store.isBest ? 'bg-primary/15' : 'bg-secondary'
            )}>
              <Store className={cn('size-3.5', store.isBest ? 'text-primary' : 'text-muted-foreground')} />
            </div>

            {/* Name + savings bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <p className={cn('text-sm font-semibold', store.isBest ? 'text-foreground' : 'text-foreground')}>
                  {store.storeName}
                </p>
                {store.isBest && (
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    Best
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    store.isBest ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                  style={{ width: `${Math.max(10, store.savingsPct === 0 ? 8 : store.savingsPct * 3)}%` }}
                />
              </div>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className={cn('text-sm font-bold', store.isBest ? 'text-foreground' : 'text-muted-foreground')}>
                ${store.total.toFixed(2)}
              </p>
              {store.savings > 0 && (
                <p className="text-[10px] text-success font-semibold">-${store.savings.toFixed(2)}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MultiStoreView({ opt }: { opt: typeof MOCK_SHOPPING_OPTIMIZATION }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalSavings = opt.baselineTotal - opt.multiStoreTotal

  return (
    <div className="space-y-2">
      {/* Summary pill */}
      <div className="rounded-2xl border border-border bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">${opt.multiStoreTotal.toFixed(2)} total</p>
          <p className="text-xs text-success font-semibold">Save ${totalSavings.toFixed(2)} across {opt.multiStoreStops.length} stops</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{opt.multiStoreStops.length} stores</p>
          <p className="text-xs text-muted-foreground">
            {opt.multiStoreStops.reduce((acc, s) => acc + s.items.length, 0)} items
          </p>
        </div>
      </div>

      {/* Store stops */}
      {opt.multiStoreStops.map((stop, i) => {
        const isOpen = expanded === stop.storeName
        return (
          <div key={stop.storeName} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : stop.storeName)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              {/* Stop number */}
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-primary">{i + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{stop.storeName}</p>
                <p className="text-xs text-muted-foreground">{stop.items.length} items · ${stop.subtotal.toFixed(2)}</p>
              </div>

              <ChevronRight className={cn(
                'size-4 text-muted-foreground transition-transform shrink-0',
                isOpen && 'rotate-90'
              )} />
            </button>

            {isOpen && (
              <div className="border-t border-border divide-y divide-border">
                {stop.items.map(item => (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-2.5">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <p className="flex-1 text-sm text-foreground truncate">{item.name}</p>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</p>
                      {item.qty > 1 && (
                        <p className="text-[10px] text-muted-foreground">x{item.qty}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
