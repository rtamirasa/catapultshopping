'use client'

import { Store, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Store as StoreType } from '@/lib/hooks/use-stores'

interface StoreSelectorProps {
  stores: StoreType[]
  selectedStoreId: string | null
  onStoreChange: (storeId: string) => void
  disabled?: boolean
}

export function StoreSelector({
  stores,
  selectedStoreId,
  onStoreChange,
  disabled = false
}: StoreSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedStore = stores.find(s => s.storeId === selectedStoreId)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (stores.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 text-center">
        <p className="text-sm text-muted-foreground">No stores available</p>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 transition-colors",
          !disabled && "hover:border-primary/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
            <Store className="size-4 text-primary" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs text-muted-foreground">Viewing prices at</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {selectedStore?.name || 'Select a store'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          "size-4 text-muted-foreground transition-transform shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => {
                console.log('Store clicked:', store.name, 'storeId:', store.storeId)
                onStoreChange(store.storeId)
                setIsOpen(false)
              }}
              className={cn(
                "w-full text-left px-4 py-3 transition-colors",
                store.storeId === selectedStoreId
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary text-foreground"
              )}
            >
              <p className="text-sm font-semibold">{store.name}</p>
              {store.distance && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {store.distance}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
