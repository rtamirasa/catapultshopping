'use client'

import Link from 'next/link'
import { ChevronDown, ScanLine, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useGroceryLists } from '@/lib/hooks/use-grocery-lists'

export function HomeHero() {
  const { lists, loading } = useGroceryLists()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Auto-select first list when loaded
  if (!selectedListId && lists.length > 0) {
    setSelectedListId(lists[0].id)
  }

  if (loading) {
    return (
      <section className="pb-4">
        <div className="rounded-2xl border border-border bg-card p-5 animate-pulse h-64" />
      </section>
    )
  }

  if (lists.length === 0) {
    return (
      <section className="pb-4">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-muted-foreground mb-4">No grocery lists yet</p>
          <Link
            href="/basket"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-bold text-sm transition-all hover:opacity-90"
          >
            Create Your First List
          </Link>
        </div>
      </section>
    )
  }

  const activeList = lists.find((l) => l.id === selectedListId) || lists[0]
  const savingsPct = ((activeList.estimatedSavings / activeList.totalCurrentPrice) * 100).toFixed(0)
  const barWidth = Math.min(100, Math.round((activeList.estimatedSavings / activeList.totalCurrentPrice) * 100))

  return (
    <section className="pb-4">
      {/* List selector */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active List</p>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            <span>{activeList.name}</span>
            <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => { setSelectedListId(list.id); setDropdownOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-secondary/60',
                    list.id === selectedListId && 'bg-primary/8 text-primary font-semibold'
                  )}
                >
                  <span>{list.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{list.itemCount} items</span>
                </button>
              ))}
              <div className="border-t border-border">
                <Link
                  href="/basket"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-primary font-semibold hover:bg-secondary/60"
                >
                  + New list
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live price meter card */}
      <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/4 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        {/* Total row */}
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Current basket total</p>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">
              ${activeList.totalCurrentPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">Cheapest possible</p>
            <p className="text-2xl font-bold text-success">${activeList.totalCheapestPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Savings bar */}
        <div className="mt-4 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="size-3.5 text-success" />
              <p className="text-xs font-semibold text-success">
                Save ${activeList.estimatedSavings.toFixed(2)} ({savingsPct}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{activeList.itemCount} items</p>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-500"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* Sub-stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-base font-extrabold text-foreground">{activeList.itemCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Items</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-base font-extrabold text-primary">{savingsPct}%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Potential off</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mt-0.5 mb-0.5">Updated</p>
            <p className="text-[11px] font-semibold text-foreground">
              {typeof activeList.lastUpdated === 'string'
                ? activeList.lastUpdated
                : new Date(activeList.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mt-3">
        <Link
          href="/scan"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-bold text-sm transition-all hover:opacity-90 active:scale-95"
        >
          <ScanLine className="size-4" />
          Scan Item
        </Link>
        <Link
          href="/basket"
          className="flex-1 flex items-center justify-center gap-2 bg-secondary border border-border text-foreground rounded-xl px-4 py-2.5 font-semibold text-sm transition-all hover:bg-secondary/80 active:scale-95"
        >
          Edit List
        </Link>
      </div>
    </section>
  )
}
