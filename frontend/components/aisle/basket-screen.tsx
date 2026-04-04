'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingBasket, Plus, ChevronRight, Pencil, Trash2,
  ShoppingCart, Clock, Store, ArrowLeft, Check, X,
  TrendingDown, Zap, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadge } from './recommendation-badge'
import { StoreSelector } from './store-selector'
import { ProductSearchDialog } from './product-search-dialog'
import { useGroceryLists } from '@/lib/hooks/use-grocery-lists'
import { useStores } from '@/lib/hooks/use-stores'
import { calculatePricesForStore, calculateTotals } from '@/lib/utils/price-calculator'
import type { GroceryList, BasketItem, RecommendationAction } from '@/lib/mock-data'

type View = 'lists' | 'detail' | 'edit-item' | 'new-list'

export function BasketScreen() {
  const { lists, loading, createList: createListAPI, deleteList: deleteListAPI, updateList: updateListAPI } = useGroceryLists()
  const { stores, loading: storesLoading } = useStores()
  const [view, setView] = useState<View>('lists')
  const [activeListId, setActiveListId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<BasketItem | null>(null)
  const [newListName, setNewListName] = useState('')
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [switchingStore, setSwitchingStore] = useState(false)

  const activeList = lists.find((l) => l.id === activeListId) ?? null

  // Set initial store selection when list is loaded
  useEffect(() => {
    if (activeList?.currentStoreId && !selectedStoreId) {
      setSelectedStoreId(activeList.currentStoreId)
    }
  }, [activeList?.id, activeList?.currentStoreId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 h-20 animate-pulse" />
        <div className="rounded-2xl border border-border bg-card p-4 h-20 animate-pulse" />
        <div className="rounded-2xl border border-border bg-card p-4 h-20 animate-pulse" />
      </div>
    )
  }

  function openList(id: string) {
    setActiveListId(id)
    setView('detail')
  }

  async function deleteList(id: string) {
    await deleteListAPI(id)
  }

  async function removeItem(listId: string, itemId: string) {
    const list = lists.find(l => l.id === listId)
    if (!list) return

    const updatedItems = list.items.filter(i => i.id !== itemId)
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0)
    const newCheapest = updatedItems.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0)

    await updateListAPI(listId, {
      items: updatedItems,
      itemCount: updatedItems.length,
      totalCurrentPrice: newTotal,
      totalCheapestPrice: newCheapest,
      estimatedSavings: newTotal - newCheapest
    })
  }

  async function updateQty(listId: string, itemId: string, delta: number) {
    const list = lists.find(l => l.id === listId)
    if (!list) return

    const updatedItems = list.items.map(i =>
      i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    )

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.currentStorePrice * item.quantity), 0)
    const newCheapest = updatedItems.reduce((sum, item) => sum + (item.bestAlternatePrice * item.quantity), 0)

    await updateListAPI(listId, {
      items: updatedItems,
      totalCurrentPrice: newTotal,
      totalCheapestPrice: newCheapest,
      estimatedSavings: newTotal - newCheapest
    })
  }

  async function createList() {
    if (!newListName.trim()) return
    const newList = await createListAPI(newListName.trim(), '🛒')
    setNewListName('')
    setActiveListId(newList.id)
    setView('detail')
  }

  async function handleStoreChange(storeId: string) {
    if (!activeList || switchingStore) return

    console.log('Switching to store:', storeId)
    setSwitchingStore(true)
    setSelectedStoreId(storeId)

    try {
      // Fetch all products for items in the list
      const productIds = activeList.items.map(item => item.product.id || item.productId).filter(Boolean)
      console.log('Fetching products:', productIds)

      const productsDataResponses = await Promise.all(
        productIds.map(id => fetch(`/api/products/${id}`).then(r => r.json()))
      )

      // Transform the API response to match the expected format
      const productsData = productsDataResponses.map(response => ({
        id: response.product.id,
        name: response.product.name,
        brand: response.product.brand,
        category: response.product.category,
        storeComparisons: response.storeComparisons
      }))

      console.log('Products data:', productsData)

      // Recalculate prices for the new store
      const updatedItems = calculatePricesForStore(activeList.items, storeId, productsData)
      console.log('Updated items:', updatedItems)

      const totals = calculateTotals(updatedItems)
      console.log('New totals:', totals)

      // Update the list
      await updateListAPI(activeList.id, {
        items: updatedItems,
        currentStoreId: storeId,
        ...totals
      })
    } catch (error) {
      console.error('Error switching stores:', error)
      // Revert selection on error
      setSelectedStoreId(activeList.currentStoreId || null)
    } finally {
      setSwitchingStore(false)
    }
  }

  async function handleAddItem(productId: string, quantity: number) {
    if (!activeList) return

    try {
      // Fetch product details
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()

      const product = data.product
      const storeComparisons = data.storeComparisons || []

      console.log('Adding item:', product.name)
      console.log('Store comparisons:', storeComparisons)
      console.log('Selected store ID:', selectedStoreId)

      // If no store selected, use the first/cheapest store
      let currentStoreId = selectedStoreId
      if (!currentStoreId && storeComparisons.length > 0) {
        currentStoreId = storeComparisons[0].storeId
        setSelectedStoreId(currentStoreId)
        console.log('Auto-selected store:', currentStoreId)
      }

      // Get price at current store
      const currentStoreData = storeComparisons.find((sc: any) => sc.storeId === currentStoreId)
      const currentStorePrice = currentStoreData?.currentPrice || 0

      console.log('Current store data:', currentStoreData)
      console.log('Current store price:', currentStorePrice)

      // Find the absolute best price across ALL stores (including current)
      let bestAlternate
      if (storeComparisons.length > 0) {
        bestAlternate = storeComparisons.reduce((best: any, current: any) =>
          current.currentPrice < best.currentPrice ? current : best
        )
      } else {
        // No store data at all
        bestAlternate = { currentPrice: 0, storeName: 'N/A' }
      }

      // Determine recommendation
      let recommendation: RecommendationAction = 'buy_now'
      const priceDiff = currentStorePrice - bestAlternate.currentPrice
      if (priceDiff > 1.0) {
        recommendation = 'switch_stores'
      } else if (priceDiff > 0.25) {
        recommendation = 'wait'
      }

      // Create new basket item
      const newItem: BasketItem = {
        id: `bi_${Date.now()}`,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category
        },
        productId: product.id,
        quantity,
        currentStorePrice,
        bestAlternatePrice: bestAlternate.currentPrice,
        bestAlternateStore: bestAlternate.storeName,
        recommendation,
        potentialSavings: Math.max(0, priceDiff * quantity)
      }

      // Add to list
      const updatedItems = [...activeList.items, newItem]
      const totals = calculateTotals(updatedItems)

      await updateListAPI(activeList.id, {
        items: updatedItems,
        itemCount: updatedItems.length,
        currentStoreId,
        ...totals
      })

      setShowSearchDialog(false)
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  }

  if (view === 'new-list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setView('lists')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground">New List</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground mb-3">List name</p>
          <input
            autoFocus
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createList()}
            placeholder="e.g. Weekly Dinners, Bday Party..."
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
          <button
            onClick={createList}
            disabled={!newListName.trim()}
            className="mt-4 w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
          >
            Create List
          </button>
        </div>
      </div>
    )
  }

  if (view === 'detail' && activeList) {
    const savingsPct = activeList.totalCurrentPrice > 0
      ? ((activeList.estimatedSavings / activeList.totalCurrentPrice) * 100).toFixed(0)
      : '0'

    const selectedStore = stores.find(s => s.storeId === selectedStoreId)

    // Find which store(s) have the best prices
    const bestStoreNames = new Set(activeList.items.map(item => item.bestAlternateStore))
    const bestStoreName = bestStoreNames.size === 1
      ? Array.from(bestStoreNames)[0]
      : bestStoreNames.size > 1
        ? 'multiple stores'
        : selectedStore?.name

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('lists')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{activeList.name}</h2>
            <p className="text-xs text-muted-foreground">{activeList.itemCount} items · updated {activeList.lastUpdated}</p>
          </div>
        </div>

        {/* Store Selector */}
        {!storesLoading && stores.length > 0 && (
          <StoreSelector
            stores={stores}
            selectedStoreId={selectedStoreId}
            onStoreChange={handleStoreChange}
            disabled={switchingStore}
          />
        )}

        {/* Product Search Dialog */}
        <ProductSearchDialog
          open={showSearchDialog}
          onClose={() => setShowSearchDialog(false)}
          currentStoreId={selectedStoreId}
          onAddItem={handleAddItem}
        />

        {/* Summary */}
        {activeList.totalCurrentPrice > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {selectedStore ? `Total at ${selectedStore.name}` : 'Total at current stores'}
                </p>
                <p className="text-3xl font-extrabold text-foreground">${activeList.totalCurrentPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {activeList.estimatedSavings > 0.01
                    ? `Best at ${bestStoreName}`
                    : 'Best price!'}
                </p>
                <p className="text-xl font-bold text-success">${activeList.totalCheapestPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="size-3.5 text-success" />
                <p className="text-xs font-semibold text-success">Save ${activeList.estimatedSavings.toFixed(2)} ({savingsPct}%)</p>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: `${savingsPct}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Items</p>
          {activeList.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-2 text-center">
              <ShoppingBasket className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No items yet.</p>
              <p className="text-xs text-muted-foreground">Scan a product to add it to this list.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeList.items.map((item) => (
                <DetailItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(activeList.id, item.id)}
                  onQtyUp={() => updateQty(activeList.id, item.id, 1)}
                  onQtyDown={() => updateQty(activeList.id, item.id, -1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add item CTA */}
        <button
          onClick={() => setShowSearchDialog(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-3 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
          Add item (scan or search)
        </button>

        {/* Best window */}
        {activeList.items.length > 0 && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="size-4 text-primary" />
              <p className="text-sm font-semibold text-primary">Best Shopping Window</p>
            </div>
            <p className="text-base font-bold text-foreground">Monday, 8am – 11am</p>
            <p className="text-xs text-muted-foreground mt-0.5">Most items in this list hit weekly lows on Monday mornings.</p>
          </div>
        )}
      </div>
    )
  }

  // Lists overview
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Lists</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{lists.length} active {lists.length === 1 ? 'list' : 'lists'}</p>
        </div>
        <button
          onClick={() => setView('new-list')}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl px-3.5 py-2 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
        >
          <Plus className="size-4" />
          New List
        </button>
      </div>

      {/* Total savings across all lists */}
      {lists.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="size-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Across all lists</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-extrabold text-foreground">
                ${lists.reduce((s, l) => s + l.totalCurrentPrice, 0).toFixed(0)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total value</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-lg font-extrabold text-success">
                ${lists.reduce((s, l) => s + l.estimatedSavings, 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Potential savings</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-foreground">
                {lists.reduce((s, l) => s + l.itemCount, 0)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total items</p>
            </div>
          </div>
        </div>
      )}

      {/* List cards */}
      <div className="space-y-3">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onOpen={() => openList(list.id)}
            onDelete={() => deleteList(list.id)}
          />
        ))}
      </div>

      {lists.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 flex flex-col items-center gap-3 text-center">
          <ShoppingBasket className="size-10 text-muted-foreground/30" />
          <p className="font-semibold text-foreground">No lists yet</p>
          <p className="text-xs text-muted-foreground">Create your first list to start tracking prices.</p>
          <button
            onClick={() => setView('new-list')}
            className="mt-1 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            Create a List
          </button>
        </div>
      )}
    </div>
  )
}

function ListCard({
  list,
  onOpen,
  onDelete,
}: {
  list: GroceryList
  onOpen: () => void
  onDelete: () => void
}) {
  const savingsPct = list.totalCurrentPrice > 0
    ? ((list.estimatedSavings / list.totalCurrentPrice) * 100).toFixed(0)
    : '0'

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={onOpen} className="w-full text-left p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div>
              <p className="font-bold text-foreground text-base leading-tight">{list.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{list.itemCount} items · {list.lastUpdated}</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        </div>

        {/* Prices */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Current total</p>
            <p className="text-xl font-extrabold text-foreground">${list.totalCurrentPrice.toFixed(2)}</p>
          </div>
          {list.estimatedSavings > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Save up to</p>
              <p className="text-base font-bold text-success">-${list.estimatedSavings.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Savings bar */}
        {list.totalCurrentPrice > 0 && (
          <div className="space-y-1">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${savingsPct}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{savingsPct}% savings potential</p>
          </div>
        )}
      </button>

      {/* Actions */}
      <div className="border-t border-border flex">
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-danger hover:bg-danger/5 transition-colors"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}

const REC_ICON: Record<RecommendationAction, React.ComponentType<{ className?: string }>> = {
  buy_now: ShoppingCart,
  wait: Clock,
  switch_stores: Store,
}

function DetailItemCard({
  item,
  onRemove,
  onQtyUp,
  onQtyDown,
}: {
  item: BasketItem
  onRemove: () => void
  onQtyUp: () => void
  onQtyDown: () => void
}) {
  const Icon = REC_ICON[item.recommendation]
  const productName = item.product?.name ?? item.productId ?? 'Unknown product'

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-secondary p-2 shrink-0 mt-0.5">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground leading-snug">{productName}</p>
            <button onClick={onRemove} className="text-muted-foreground hover:text-danger transition-colors shrink-0">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-sm font-bold text-foreground">${item.currentStorePrice.toFixed(2)}</p>
            </div>
            {item.potentialSavings > 0 && (
              <>
                <div className="text-muted-foreground/40 text-xs">→</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.bestAlternateStore}</p>
                  <p className="text-sm font-bold text-success">${item.bestAlternatePrice.toFixed(2)}</p>
                </div>
              </>
            )}
            {/* Qty controls */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onQtyDown}
                className="size-6 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm hover:bg-secondary/80 transition-colors"
              >
                −
              </button>
              <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
              <button
                onClick={onQtyUp}
                className="size-6 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm hover:bg-secondary/80 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-2">
            <RecommendationBadge action={item.recommendation} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
