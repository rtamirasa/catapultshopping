'use client'

import { Shield, Users, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ConfidenceBadgeProps {
  score: number // 0-100
  className?: string
  showLabel?: boolean
}

export function ConfidenceBadge({ score, className, showLabel = true }: ConfidenceBadgeProps) {
  const color =
    score >= 85 ? 'text-success' :
    score >= 65 ? 'text-warning' :
    'text-danger'

  const bgColor =
    score >= 85 ? 'bg-success/10 border-success/20' :
    score >= 65 ? 'bg-warning/10 border-warning/20' :
    'bg-danger/10 border-danger/20'

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border cursor-default',
            bgColor, color, className
          )}>
            <Shield className="size-3" />
            {showLabel && <span>{score}% confidence</span>}
            {!showLabel && <span>{score}%</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-48">
          <p className="font-semibold mb-1">Confidence Score: {score}%</p>
          <p>Based on number of verifications, recency, and cross-store agreement. Higher = more reliable.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface VerificationBadgeProps {
  count: number
  className?: string
}

export function VerificationBadge({ count, className }: VerificationBadgeProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary cursor-default',
            className
          )}>
            <Users className="size-3" />
            <span>Verified by {count} today</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-48">
          <p className="font-semibold mb-1">Crowd Verified</p>
          <p>{count} shoppers confirmed this price today via photo or scan submission.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface LastSeenBadgeProps {
  timestamp: string
  className?: string
}

export function LastSeenBadge({ timestamp, className }: LastSeenBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-xs text-muted-foreground',
      className
    )}>
      <Clock className="size-3" />
      <span>Last seen {timestamp}</span>
    </span>
  )
}

interface TrustPanelProps {
  verifiedBy: number
  lastUpdatedMinutesAgo: number
  confidenceScore: number
  totalObservations: number
}

export function TrustPanel({ verifiedBy, lastUpdatedMinutesAgo, confidenceScore, totalObservations }: TrustPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="size-4 text-primary" />
        <span className="text-sm font-semibold">Crowd-Verified Intelligence</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-0.5">Verified today</p>
          <p className="text-lg font-bold text-foreground">{verifiedBy} shoppers</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-0.5">Last updated</p>
          <p className="text-lg font-bold text-foreground">{lastUpdatedMinutesAgo}m ago</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-0.5">Confidence</p>
          <p className={cn(
            'text-lg font-bold',
            confidenceScore >= 85 ? 'text-success' : confidenceScore >= 65 ? 'text-warning' : 'text-danger'
          )}>{confidenceScore}%</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-0.5">Total sightings</p>
          <p className="text-lg font-bold text-foreground">{totalObservations.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
