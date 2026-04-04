'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ScanLine, Upload, Zap, CheckCircle2, Package,
  ArrowRight, Users, Info, Lock, ImagePlus, Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadge } from './recommendation-badge'
import { ConfidenceBadge, LastSeenBadge, VerificationBadge } from './trust-badges'
import { MOCK_SCAN_RESULT, MOCK_SHELF_CONTRIBUTION } from '@/lib/mock-data'

type ScanState = 'idle' | 'scanning' | 'done'

export function ScanScreen() {
  const [state, setState] = useState<ScanState>('idle')
  const [photosSubmitted, setPhotosSubmitted] = useState(
    MOCK_SHELF_CONTRIBUTION.shelfPhotosSubmitted
  )

  const { requiredToUnlock, totalListItems } = MOCK_SHELF_CONTRIBUTION
  const isUnlocked = photosSubmitted >= requiredToUnlock

  const handleSimulate = () => {
    setState('scanning')
    setTimeout(() => setState('done'), 2000)
  }

  const handleReset = () => setState('idle')
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

      {/* Scanner — always accessible */}
      {state === 'idle' && <ScanIdle onSimulate={handleSimulate} />}
      {state === 'scanning' && <ScanScanning />}
      {state === 'done' && (
        <ScanResult
          onReset={handleReset}
          isUnlocked={isUnlocked}
          remaining={requiredToUnlock - photosSubmitted}
        />
      )}
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
          href="/product"
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
