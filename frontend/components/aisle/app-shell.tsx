'use client'

import { Radio, RefreshCw } from 'lucide-react'
import { BottomNav } from './bottom-nav'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  showLastSynced?: boolean
}

export function AppShell({ children, title, showLastSynced = true }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="flex items-center justify-between max-w-md mx-auto px-4 h-14">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Radio className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              AisleIQ
            </span>
          </div>

          {/* Live indicator + last synced */}
          <div className="flex items-center gap-3">
            {showLastSynced && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="size-3" />
                <span>2m ago</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-primary live-pulse" />
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Live</span>
            </div>
          </div>
        </div>

        {/* Page title */}
        {title && (
          <div className="max-w-md mx-auto px-4 pb-3">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-28">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
