'use client'

import { useState } from 'react'
import { Search, X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/lib/hooks/use-products'
import type { Product } from '@/lib/hooks/use-products'

interface ProductSearchDialogProps {
  open: boolean
  onClose: () => void
  currentStoreId: string | null
  onAddItem: (productId: string, quantity: number) => Promise<void>
}

export function ProductSearchDialog({
  open,
  onClose,
  currentStoreId,
  onAddItem
}: ProductSearchDialogProps) {
  const { products, loading, searchProducts } = useProducts()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [adding, setAdding] = useState<string | null>(null)

  if (!open) return null

  const handleAddItem = async (productId: string) => {
    const quantity = quantities[productId] || 1
    setAdding(productId)
    try {
      await onAddItem(productId, quantity)
      setQuantities(prev => ({ ...prev, [productId]: 1 }))
    } finally {
      setAdding(null)
    }
  }

  const getQuantity = (productId: string) => quantities[productId] || 1

  const setQuantity = (productId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, qty) }))
  }

  const getCurrentPrice = (product: Product) => {
    // Prices will be fetched when adding the item
    // For now, just show a placeholder
    return undefined
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground">Add Item</h2>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            onChange={(e) => searchProducts(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-foreground">No products found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(product => {
              const currentPrice = getCurrentPrice(product)
              const quantity = getQuantity(product.id)
              const isAdding = adding === product.id

              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.brand} · {product.category}
                      </p>
                    </div>

                    {/* Quantity & Add */}
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="size-7 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm hover:bg-secondary/80 transition-colors"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="size-7 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm hover:bg-secondary/80 transition-colors"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddItem(product.id)}
                        disabled={isAdding}
                        className={cn(
                          "flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-bold transition-all",
                          isAdding && "opacity-50 cursor-not-allowed",
                          !isAdding && "hover:opacity-90 active:scale-95"
                        )}
                      >
                        <ShoppingCart className="size-3.5" />
                        {isAdding ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
