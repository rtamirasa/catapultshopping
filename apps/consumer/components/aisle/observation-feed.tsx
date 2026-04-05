'use client'

import { CheckCircle2, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecentObservation } from '@/lib/mock-data'

interface ObservationFeedItemProps {
  observation: RecentObservation
}

export function ObservationFeedItem({ observation }: ObservationFeedItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Avatar */}
      <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <Store className="size-4 text-muted-foreground" />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-mono text-muted-foreground truncate">{observation.shopperAlias}</p>
          {observation.isVerified && (
            <CheckCircle2 className="size-3 text-primary shrink-0" />
          )}
        </div>
        <p className="text-sm font-medium text-foreground">
          ${observation.price.toFixed(2)} at {observation.store}
        </p>
        {observation.note && (
          <p className="text-xs text-muted-foreground mt-0.5">{observation.note}</p>
        )}
      </div>
      {/* Time */}
      <p className="text-xs text-muted-foreground shrink-0">{observation.timestamp}</p>
    </div>
  )
}

interface ObservationFeedProps {
  observations: RecentObservation[]
  className?: string
}

export function ObservationFeed({ observations, className }: ObservationFeedProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <p className="text-sm font-semibold mb-2">Recent Observations</p>
      <div>
        {observations.map((obs) => (
          <ObservationFeedItem key={obs.id} observation={obs} />
        ))}
      </div>
    </div>
  )
}
