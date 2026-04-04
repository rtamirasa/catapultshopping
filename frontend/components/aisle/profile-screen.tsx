'use client'

import { useState } from 'react'
import {
  Shield, Store, TrendingDown, Star, ScanLine,
  CheckCircle2, Users, Award, Lock, Gift
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecommendationBadge } from './recommendation-badge'
import { MOCK_USER_PROFILE, MOCK_REWARDS } from '@/lib/mock-data'
import type { RecentScan, Reward } from '@/lib/mock-data'

export function ProfileScreen() {
  const profile = MOCK_USER_PROFILE

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <ProfileCard profile={profile} />

      {/* Stats grid */}
      <StatsGrid profile={profile} />

      {/* Community contribution */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="size-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Your Community Impact</p>
        </div>
        <p className="text-sm text-foreground font-medium">
          You helped verify 4 prices today
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          12 shoppers confirmed today&apos;s yogurt price thanks to your scan.
        </p>
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: '68%' }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">2,840 / 5,000 pts to Platinum</p>
          <p className="text-xs text-primary font-semibold">68%</p>
        </div>
      </div>

      {/* Rewards */}
      <RewardsSection scansCompleted={profile.totalVerified} />

      {/* Points / rewards */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-warning" />
            <p className="text-sm font-semibold">Contributor Points</p>
          </div>
          <span className="text-lg font-extrabold text-foreground">
            {profile.contributorPoints.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Per verified scan', pts: '+10 pts' },
            { label: 'Per confirmed sighting', pts: '+5 pts' },
            { label: 'First to report a price', pts: '+25 pts' },
          ].map(({ label, pts }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground">{label}</p>
              <p className="font-semibold text-primary">{pts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Recent Activity
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {profile.recentScans.map((scan, i) => (
            <RecentScanRow key={scan.id} scan={scan} isLast={i === profile.recentScans.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: typeof MOCK_USER_PROFILE }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="size-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-primary-sm shrink-0">
          <span className="text-xl font-extrabold text-primary">{profile.avatarInitials}</span>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base">{profile.displayName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Member since {profile.joinedDate}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-warning/10 border border-warning/20 text-warning text-xs font-bold px-2.5 py-0.5 rounded-full">
              <Star className="size-3 fill-current" />
              {profile.trustLevel}
            </span>
            <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              <CheckCircle2 className="size-3" />
              {profile.trustBadge}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsGrid({ profile }: { profile: typeof MOCK_USER_PROFILE }) {
  const stats = [
    {
      icon: ScanLine,
      label: 'Products Verified',
      value: profile.totalVerified,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Store,
      label: 'Stores Visited',
      value: profile.storesVisited,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: TrendingDown,
      label: 'Savings Unlocked',
      value: `$${profile.savingsUnlocked.toFixed(2)}`,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: Shield,
      label: 'Trust Score',
      value: '94%',
      color: 'text-foreground',
      bg: 'bg-secondary/80',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className={cn('rounded-lg p-2 w-fit mb-2', bg)}>
            <Icon className={cn('size-4', color)} />
          </div>
          <p className={cn('text-xl font-extrabold', color)}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}

function RewardsSection({ scansCompleted }: { scansCompleted: number }) {
  const [showAll, setShowAll] = useState(false)
  const rewards = MOCK_REWARDS
  const visible = showAll ? rewards : rewards.slice(0, 4)
  const claimedCount = rewards.filter(r => r.isClaimed).length
  const unclaimedUnlocked = rewards.filter(r => r.isUnlocked && !r.isClaimed)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="size-4 text-primary" />
            <p className="text-sm font-semibold">Scan Rewards</p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {claimedCount} / {rewards.length} earned
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.min(100, (scansCompleted / 200) * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{scansCompleted} aisles scanned</p>
          <p className="text-xs text-primary font-semibold">
            {unclaimedUnlocked.length > 0
              ? `${unclaimedUnlocked.length} ready to claim`
              : 'Next: 200 scans'}
          </p>
        </div>
      </div>

      {/* Reward tiles */}
      <div className="divide-y divide-border">
        {visible.map(reward => (
          <RewardTile key={reward.id} reward={reward} scansCompleted={scansCompleted} />
        ))}
      </div>

      {/* Show more */}
      {rewards.length > 4 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="w-full py-2.5 text-xs font-semibold text-primary border-t border-border hover:bg-secondary/50 transition-colors"
        >
          {showAll ? 'Show less' : `Show ${rewards.length - 4} more rewards`}
        </button>
      )}
    </div>
  )
}

function RewardTile({ reward, scansCompleted }: { reward: Reward; scansCompleted: number }) {
  const progress = Math.min(100, Math.round((scansCompleted / reward.requiredScans) * 100))

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3',
      !reward.isUnlocked && 'opacity-60'
    )}>
      {/* Icon */}
      <div className={cn(
        'size-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold',
        reward.isClaimed
          ? 'bg-primary/15 text-primary'
          : reward.isUnlocked
          ? 'bg-warning/15 text-warning'
          : 'bg-secondary text-muted-foreground'
      )}>
        {reward.isUnlocked
          ? <Award className="size-4" />
          : <Lock className="size-3.5" />
        }
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{reward.title}</p>
          {reward.isClaimed && (
            <CheckCircle2 className="size-3.5 text-primary shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{reward.description}</p>
        {!reward.isUnlocked && (
          <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden w-24">
            <div
              className="h-full bg-primary/50 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Value badge */}
      <div className={cn(
        'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
        reward.isClaimed
          ? 'bg-secondary text-muted-foreground line-through'
          : reward.isUnlocked
          ? 'bg-warning/15 text-warning border border-warning/30'
          : 'bg-secondary text-muted-foreground'
      )}>
        {reward.rewardValue}
      </div>
    </div>
  )
}

function RecentScanRow({ scan, isLast }: { scan: RecentScan; isLast: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-3',
      !isLast && 'border-b border-border'
    )}>
      <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <ScanLine className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{scan.productName}</p>
        <p className="text-xs text-muted-foreground">{scan.store} · ${scan.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <RecommendationBadge action={scan.action} size="sm" />
        <p className="text-[10px] text-muted-foreground">{scan.timestamp}</p>
      </div>
    </div>
  )
}
