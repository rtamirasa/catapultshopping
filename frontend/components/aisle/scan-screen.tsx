'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ScanLine, Upload, Zap, CheckCircle2, Package,
  ArrowRight, Users, Info, Lock, ImagePlus, Camera, Receipt
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadge } from './recommendation-badge'
import { ConfidenceBadge, LastSeenBadge, VerificationBadge } from './trust-badges'
import { AlternativesSection } from './alternatives-section'
import { ReceiptResult, ReceiptSkeleton } from './receipt-result'
import { useGroceryLists } from '@/lib/hooks/use-grocery-lists'
import {
  MOCK_SCAN_RESULT, MOCK_SHELF_CONTRIBUTION, MOCK_ALTERNATIVES_SCAN_DATA,
  MOCK_PARSED_RECEIPT,
} from '@/lib/mock-data'

type ScanMode = 'product' | 'receipt'
type ScanState = 'idle' | 'scanning' | 'done'

export function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('product')
  const [state, setState] = useState<ScanState>('idle')
  const [photosSubmitted, setPhotosSubmitted] = useState(
    MOCK_SHELF_CONTRIBUTION.shelfPhotosSubmitted
  )
  const [alternativesLoading, setAlternativesLoading] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  const { lists } = useGroceryLists()
  const activeList = lists[0]

  const { requiredToUnlock, totalListItems } = MOCK_SHELF_CONTRIBUTION
  const isUnlocked = photosSubmitted >= requiredToUnlock

  const handleSimulate = () => {
    setState('scanning')
    setShowAlternatives(false)
    setAlternativesLoading(false)
    setReceiptLoading(false)
    setShowReceipt(false)

    if (mode === 'receipt') {
      setReceiptLoading(true)
      setTimeout(() => {
        setReceiptLoading(false)
        setShowReceipt(true)
        setState('done')
      }, 2500)
    } else {
      setTimeout(() => setState('done'), 2000)
    }
  }

  useEffect(() => {
    if (state !== 'done' || !isUnlocked || mode !== 'product') return
    setAlternativesLoading(true)
    const t1 = setTimeout(() => {
      setAlternativesLoading(false)
      setShowAlternatives(true)
    }, 1200)
    return () => clearTimeout(t1)
  }, [state, isUnlocked, mode])

  const handleReset = () => {
    setState('idle')
    setShowAlternatives(false)
    setAlternativesLoading(false)
    setReceiptLoading(false)
    setShowReceipt(false)
  }

  const handleModeSwitch = (m: ScanMode) => {
    if (state === 'scanning') return
    if (state === 'done') {
      handleReset()
    }
    setMode(m)
  }

  const handleSubmitPhoto = () =>
    setPhotosSubmitted(prev => Math.min(prev + 1, totalListItems))

  return (
    <div className="space-y-5">
      {/* Contribution banner */}
      <ContributionBanner
        submitted={photosSubmitted}
        required={requiredToUnlock}
        total={totalListItems}
        isUnlocked={isUnlocked}
        onSubmitPhoto={handleSubmitPhoto}
      />

      {/* Mode toggle — always visible so user can switch to receipt after product scan */}
      <ScanModeToggle mode={mode} onSwitch={handleModeSwitch} disabled={state === 'scanning'} />

      {/* Product scan flow */}
      {mode === 'product' && (
        <>
          {state === 'idle' && <ScanIdle onSimulate={handleSimulate} />}
          {state === 'scanning' && <ScanScanning />}
          {state === 'done' && (
            <>
              <ScanResult
                onReset={handleReset}
                isUnlocked={isUnlocked}
                remaining={requiredToUnlock - photosSubmitted}
              />
              {isUnlocked && (alternativesLoading || showAlternatives) && (
                <div
                  className={cn(
                    'transition-all duration-500',
                    showAlternatives
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4',
                  )}
                >
                  <AlternativesSection
                    data={MOCK_ALTERNATIVES_SCAN_DATA}
                    isLoading={alternativesLoading}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Receipt scan flow */}
      {mode === 'receipt' && (
        <>
          {state === 'idle' && <ReceiptIdle onSimulate={handleSimulate} />}
          {state === 'scanning' && (receiptLoading ? <ReceiptScanning /> : null)}
          {state === 'done' && showReceipt && (
            <div className="transition-all duration-500 opacity-100 translate-y-0">
              <ReceiptResult receipt={MOCK_PARSED_RECEIPT} activeListName={activeList?.name} onReset={handleReset} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Mode Toggle ─────────────────────────────────────────────────────────────

function ScanModeToggle({ mode, onSwitch, disabled }: { mode: ScanMode; onSwitch: (m: ScanMode) => void; disabled?: boolean }) {
  return (
    <div className={cn('flex gap-1.5 bg-secondary/50 p-1 rounded-lg', disabled && 'opacity-50 pointer-events-none')}>
      <button
        onClick={() => onSwitch('product')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-md transition-all',
          mode === 'product'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <ScanLine className="size-4" />
        Product
      </button>
      <button
        onClick={() => onSwitch('receipt')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-md transition-all',
          mode === 'receipt'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Receipt className="size-4" />
        Receipt
      </button>
    </div>
  )
}

// ─── Receipt Idle ────────────────────────────────────────────────────────────

function ReceiptIdle({ onSimulate }: { onSimulate: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Scan or upload your receipt after shopping to store your purchase and automatically update your lists.
      </p>

      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-secondary/30 flex flex-col items-center justify-center gap-4">
        <div className="absolute top-3 left-3 size-6 border-t-2 border-l-2 border-primary rounded-tl-sm" />
        <div className="absolute top-3 right-3 size-6 border-t-2 border-r-2 border-primary rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-primary rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-primary rounded-br-sm" />
        <div className="rounded-2xl bg-secondary/80 p-5 backdrop-blur-sm">
          <Receipt className="size-10 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">Position your receipt here</p>
      </div>

      <button
        onClick={onSimulate}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
      >
        <Zap className="size-4" />
        Simulate Receipt Scan
      </button>
      <label className="w-full flex items-center justify-center gap-2 bg-secondary border border-border text-foreground rounded-xl px-4 py-3.5 font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-secondary/80 active:scale-95">
        <Upload className="size-4" />
        Upload Receipt Photo
        <input type="file" accept="image/*" className="sr-only" />
      </label>

      <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Receipt scanning stores your purchase, updates prices in your lists, and detects new items to track.
        </p>
      </div>
    </div>
  )
}

// ─── Receipt Scanning ────────────────────────────────────────────────────────

function ReceiptScanning() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800)
    const t2 = setTimeout(() => setStep(2), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const steps = [
    'Reading receipt text',
    'Matching products',
    'Updating your lists',
  ]

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative size-40">
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/30" />
        <div className="absolute top-2 left-2 size-8 border-t-2 border-l-2 border-primary rounded-tl-sm" />
        <div className="absolute top-2 right-2 size-8 border-t-2 border-r-2 border-primary rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 size-8 border-b-2 border-l-2 border-primary rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 size-8 border-b-2 border-r-2 border-primary rounded-br-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Receipt className="size-10 text-primary live-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-bold text-foreground">Processing receipt...</p>
        <p className="text-sm text-muted-foreground mt-1">Extracting items and matching to your lists</p>
      </div>
      <div className="w-full space-y-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={cn(
              'size-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300',
              i <= step ? 'bg-primary' : 'bg-secondary border border-border'
            )}>
              {i <= step && <CheckCircle2 className="size-3 text-primary-foreground" />}
            </div>
            <p className={cn('text-sm transition-colors duration-300', i <= step ? 'text-foreground font-medium' : 'text-muted-foreground')}>
              {s}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Contribution Banner ──────────────────────────────────────────────────────

function ContributionBanner({
  submitted, required, total, isUnlocked, onSubmitPhoto,
}: {
  submitted: number
  required: number
  total: number
  isUnlocked: boolean
  onSubmitPhoto: () => void
}) {
  const progressPct = Math.min(100, Math.round((submitted / required) * 100))

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-colors',
      isUnlocked ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'size-7 rounded-lg flex items-center justify-center',
            isUnlocked ? 'bg-primary/15' : 'bg-secondary'
          )}>
            {isUnlocked
              ? <CheckCircle2 className="size-3.5 text-primary" />
              : <Camera className="size-3.5 text-muted-foreground" />
            }
          </div>
          <p className="text-sm font-semibold text-foreground">
            {isUnlocked ? 'Insights unlocked' : 'Shelf photos needed'}
          </p>
        </div>
        <span className="text-xs font-bold tabular-nums text-muted-foreground">
          {submitted} / {required}
        </span>
      </div>

      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isUnlocked ? 'bg-primary' : 'bg-primary/50'
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {isUnlocked
          ? `You submitted ${submitted} shelf photo${submitted !== 1 ? 's' : ''} — price intelligence is active.`
          : `Submit ${required - submitted} more shelf photo${required - submitted !== 1 ? 's' : ''} to unlock price insights on your next scans.`
        }
      </p>

      {!isUnlocked && (
        <button
          onClick={onSubmitPhoto}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-primary/50 text-primary bg-primary/5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all hover:bg-primary/10 active:scale-95"
        >
          <ImagePlus className="size-3.5" />
          Submit a shelf photo ({total - submitted} aisles still need photos)
        </button>
      )}
    </div>
  )
}

// ─── Idle ─────────────────────────────────────────────────────────────────────

function ScanIdle({ onSimulate }: { onSimulate: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Point your camera at a shelf tag or barcode, or upload a photo to get live price intelligence.
      </p>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-secondary/30 flex flex-col items-center justify-center gap-4">
        <div className="absolute top-3 left-3 size-6 border-t-2 border-l-2 border-primary rounded-tl-sm" />
        <div className="absolute top-3 right-3 size-6 border-t-2 border-r-2 border-primary rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-primary rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-primary rounded-br-sm" />
        <div className="absolute inset-x-6 h-px bg-primary/40 top-1/2 -translate-y-1/2" />
        <div className="rounded-2xl bg-secondary/80 p-5 backdrop-blur-sm">
          <ScanLine className="size-10 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">Align shelf tag or barcode here</p>
      </div>

      <button
        onClick={onSimulate}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
      >
        <Zap className="size-4" />
        Simulate Scan
      </button>
      <label className="w-full flex items-center justify-center gap-2 bg-secondary border border-border text-foreground rounded-xl px-4 py-3.5 font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-secondary/80 active:scale-95">
        <Upload className="size-4" />
        Upload Image
        <input type="file" accept="image/*" className="sr-only" />
      </label>

      <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Crowd-verified store intelligence. Prices are confirmed by real shoppers and updated in near real-time.
        </p>
      </div>
    </div>
  )
}

// ─── Scanning ────────────────────────────────────────────────────────────────

function ScanScanning() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative size-40">
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/30" />
        <div className="absolute top-2 left-2 size-8 border-t-2 border-l-2 border-primary rounded-tl-sm" />
        <div className="absolute top-2 right-2 size-8 border-t-2 border-r-2 border-primary rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 size-8 border-b-2 border-l-2 border-primary rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 size-8 border-b-2 border-r-2 border-primary rounded-br-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScanLine className="size-10 text-primary live-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-bold text-foreground">Analyzing...</p>
        <p className="text-sm text-muted-foreground mt-1">Matching product and fetching price data</p>
      </div>
      <div className="w-full space-y-2">
        {['Detecting product', 'Fetching store prices', 'Calculating recommendation'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={cn(
              'size-5 rounded-full flex items-center justify-center shrink-0',
              i === 0 ? 'bg-primary' : 'bg-secondary border border-border'
            )}>
              {i === 0 && <CheckCircle2 className="size-3 text-primary-foreground" />}
            </div>
            <p className={cn('text-sm', i === 0 ? 'text-foreground font-medium' : 'text-muted-foreground')}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Result ──────────────────────────────────────────────────────────────────

function ScanResult({
  onReset,
  isUnlocked,
  remaining,
}: {
  onReset: () => void
  isUnlocked: boolean
  remaining: number
}) {
  const result = MOCK_SCAN_RESULT

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-success">
        <CheckCircle2 className="size-4" />
        <span className="text-sm font-semibold">Product detected</span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Product header — always visible */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Package className="size-8 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{result.product.brand}</p>
              <p className="font-bold text-foreground leading-snug">{result.product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">at {result.store}</p>
            </div>
          </div>
        </div>

        {/* Price + recommendation + trust — gated */}
        {isUnlocked ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Current price</p>
                  <p className="text-3xl font-extrabold text-foreground">${result.currentPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.unitPrice}</p>
                </div>
                {result.isPromo && result.promoLabel && (
                  <span className="bg-warning/20 text-warning border border-warning/30 text-xs font-bold px-2.5 py-1 rounded-full">
                    {result.promoLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recommendation</p>
                <RecommendationBadge action={result.recommendation.action} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation.explanation}</p>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <ConfidenceBadge score={result.confidenceScore} />
                <VerificationBadge count={result.verifiedBy} />
                <LastSeenBadge timestamp={result.lastSeen} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                <Users className="size-3" />
                Crowd-verified store intelligence
              </p>
            </div>
          </>
        ) : (
          /* Locked insight state */
          <div className="p-5 flex flex-col items-center gap-3 text-center">
            <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
              <Lock className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Insights locked</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Submit <span className="font-bold text-foreground">{remaining} more shelf photo{remaining !== 1 ? 's' : ''}</span> from your list aisles to unlock price intelligence for this product.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1.5">
              <Users className="size-3 shrink-0" />
              Your photos keep prices accurate for everyone
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {isUnlocked && (
        <Link
          href={`/product?id=${result.product.id}`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
        >
          View Full Intelligence
          <ArrowRight className="size-4" />
        </Link>
      )}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 bg-secondary border border-border text-foreground rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-200 hover:bg-secondary/80 active:scale-95"
      >
        <ScanLine className="size-4" />
        Scan Another
      </button>
    </div>
  )
}
