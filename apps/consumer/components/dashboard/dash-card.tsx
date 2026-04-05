import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

export function DashCard({
  children, className, noPad,
}: { children: ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div className={cn(
      'bg-white border border-[#e5e7eb] rounded-xl',
      !noPad && 'p-5',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-[13px] font-semibold text-gray-900">{title}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function KpiBadge({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span className={cn(
      'text-[11px] font-semibold px-1.5 py-0.5 rounded',
      positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
    )}>
      {value}
    </span>
  )
}

export function StockBadge({ status }: { status: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    low:    'bg-red-50 text-red-600',
  }
  return (
    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded capitalize', map[status])}>
      {status}
    </span>
  )
}

export function SeverityDot({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  const map = { critical: 'bg-red-500', warning: 'bg-amber-400', info: 'bg-indigo-400' }
  return <span className={cn('inline-block size-2 rounded-full shrink-0', map[severity])} />
}

export function TrendPill({ pct, direction }: { pct: number; direction: 'up' | 'down' | 'flat' }) {
  const pos = direction === 'down' ? pct < 0 : direction === 'up' ? false : true
  const label = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`
  return (
    <span className={cn(
      'text-[11px] font-semibold px-1.5 py-0.5 rounded tabular-nums',
      direction === 'down' && pct < 0 ? 'bg-emerald-50 text-emerald-700' :
      direction === 'up' ? 'bg-red-50 text-red-600' :
      'bg-gray-100 text-gray-500'
    )}>
      {label}
    </span>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-semibold text-gray-900 mb-4">{children}</h2>
}
