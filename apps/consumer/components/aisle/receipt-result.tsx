'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Receipt, CheckCircle2, Package, ListChecks,
  Plus, ShoppingBasket, TrendingDown, RefreshCcw,
  ChevronDown, ChevronUp, Store, Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParsedReceipt, ReceiptLineItem } from '@/lib/mock-data'

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function ReceiptSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-3 w-48 bg-muted rounded" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="h-4 w-40 bg-muted rounded" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
            </div>
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="h-10 w-full bg-muted rounded-xl" />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface ReceiptResultProps {
  receipt: ParsedReceipt
  activeListName?: string
  onReset: () => void
  onAddNewItems?: (items: ReceiptLineItem[]) => void
}

export function ReceiptResult({ receipt, activeListName, onReset, onAddNewItems }: ReceiptResultProps) {
  const [expanded, setExpanded] = useState(false)
  const [newItemsAdded, setNewItemsAdded] = useState(false)

  const matchedItems = receipt.lineItems.filter(li => li.matchedToList)
  const newItems = receipt.lineItems.filter(li => li.isNewItem)

  const handleAddNewItems = () => {
    onAddNewItems?.(newItems)
    setNewItemsAdded(true)
  }

  return (
    <div className="space-y-4">
      {/* Success header */}
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 className="size-4" />
        <span className="text-sm font-semibold">Receipt processed</span>
      </div>

      {/* Store + summary card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Receipt className="size-6 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Store className="size-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground font-medium">{receipt.store}</p>
              </div>
              <p className="font-bold text-foreground leading-snug mt-0.5">
                {receipt.lineItems.length} items purchased
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{receipt.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-extrabold text-foreground tabular-nums">
                ${receipt.total.toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground">incl. ${receipt.tax.toFixed(2)} tax</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <div className="p-3 text-center">
            <p className="text-lg font-extrabold text-foreground tabular-nums">{receipt.itemsMatchedToList}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Matched to list</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-lg font-extrabold text-foreground tabular-nums">{receipt.newItemsDetected}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">New items</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-lg font-extrabold text-primary tabular-nums">{receipt.pricesUpdated}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Prices updated</p>
          </div>
        </div>

        {/* List match */}
        {(activeListName || receipt.matchedListName) && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ListChecks className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Updated your active list</p>
                <p className="text-sm font-bold text-foreground">{activeListName ?? receipt.matchedListName}</p>
              </div>
              <Link
                href="/basket"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View List
              </Link>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-600">
              <RefreshCcw className="size-3" />
              <span className="font-medium">
                {receipt.pricesUpdated} item price{receipt.pricesUpdated !== 1 ? 's' : ''} updated from this receipt
              </span>
            </div>
          </div>
        )}

        {/* Expandable line items */}
        <div className="px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Receipt details ({receipt.lineItems.length} items)</span>
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>

        {expanded && (
          <div className="px-4 pb-4 space-y-2">
            {receipt.lineItems.map(li => (
              <LineItemRow key={li.id} item={li} />
            ))}
            <div className="border-t border-border pt-3 mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tax</span>
                <span className="tabular-nums">${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total</span>
                <span className="tabular-nums">${receipt.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New items CTA */}
      {newItems.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <Plus className="size-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                {newItems.length} new item{newItems.length !== 1 ? 's' : ''} detected
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {newItems.map(i => i.matchedProduct?.name ?? i.rawText).join(', ')}
              </p>
              {!newItemsAdded ? (
                <button
                  onClick={handleAddNewItems}
                  className="mt-3 flex items-center justify-center gap-2 bg-amber-600 text-white rounded-lg px-4 py-2.5 text-xs font-bold transition-all hover:bg-amber-700 active:scale-[0.98]"
                >
                  <ShoppingBasket className="size-3.5" />
                  Add to {activeListName ?? 'your list'}
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  Added to {activeListName ?? 'your list'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchase stored confirmation */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
            <TrendingDown className="size-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Purchase stored</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Your purchase history helps AisleIQ improve price predictions and personalized recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Link
        href="/basket"
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
      >
        <ListChecks className="size-4" />
        View Updated List
      </Link>
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 bg-secondary border border-border text-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:bg-secondary/80 active:scale-95"
      >
        <Receipt className="size-4" />
        Scan Another Receipt
      </button>
    </div>
  )
}

// ─── Line Item Row ───────────────────────────────────────────────────────────

function LineItemRow({ item }: { item: ReceiptLineItem }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className={cn(
        'size-7 rounded-lg flex items-center justify-center shrink-0',
        item.matchedToList ? 'bg-emerald-500/10' : item.isNewItem ? 'bg-amber-500/10' : 'bg-secondary',
      )}>
        {item.matchedToList ? (
          <CheckCircle2 className="size-3.5 text-emerald-600" />
        ) : item.isNewItem ? (
          <Tag className="size-3.5 text-amber-600" />
        ) : (
          <Package className="size-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {item.matchedProduct?.name ?? item.rawText}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {item.quantity > 1 ? `${item.quantity} x $${item.unitPrice.toFixed(2)}` : item.matchedProduct?.brand ?? 'Unmatched'}
          {item.matchedToList && (
            <span className="text-emerald-600 ml-1.5 font-medium">matched</span>
          )}
          {item.isNewItem && !item.matchedToList && (
            <span className="text-amber-600 ml-1.5 font-medium">new</span>
          )}
        </p>
      </div>
      <span className="text-xs font-bold text-foreground tabular-nums shrink-0">
        ${item.lineTotal.toFixed(2)}
      </span>
    </div>
  )
}
