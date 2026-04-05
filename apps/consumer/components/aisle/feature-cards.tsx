'use client'

import { Activity, Calendar, Store } from 'lucide-react'

const FEATURES = [
  {
    icon: Activity,
    title: 'Live Price Intelligence',
    description: 'Real-time price tracking across major stores, updated as shoppers scan.',
    accent: 'text-primary bg-primary/10',
  },
  {
    icon: Calendar,
    title: 'Best Time to Buy',
    description: 'AI-powered predictions for the cheapest day and time window.',
    accent: 'text-warning bg-warning/10',
  },
  {
    icon: Store,
    title: 'Cross-Store Savings',
    description: 'Instant comparison across nearby stores to find the best deal.',
    accent: 'text-success bg-success/10',
  },
]

export function FeatureCards() {
  return (
    <section className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">How it works</p>
      <div className="space-y-3">
        {FEATURES.map(({ icon: Icon, title, description, accent }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className={`rounded-lg p-2.5 shrink-0 ${accent}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
