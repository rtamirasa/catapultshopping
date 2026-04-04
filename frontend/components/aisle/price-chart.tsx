'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import { cn } from '@/lib/utils'
import { usePriceHistory } from '@/lib/hooks/use-price-history'

type Range = '7D' | '30D'

function formatLabel(timestamp: string, range: Range): string {
  const d = new Date(timestamp)
  if (range === '24H') {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (range === '7D') {
    return d.toLocaleDateString([], { weekday: 'short' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: { label: string } }>
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-muted-foreground text-xs mb-0.5">{payload[0]?.payload?.label}</p>
      <p className="font-bold text-foreground">${payload[0]?.value?.toFixed(2)}</p>
    </div>
  )
}

interface PriceChartProps {
  productId: string
  storeId: string
}

export function PriceChart({ productId, storeId }: PriceChartProps) {
  const [range, setRange] = useState<Range>('30D')
  const days = range === '7D' ? 7 : 30

  const { data: rawData, loading } = usePriceHistory(productId, storeId, days)

  const chartData = useMemo(() => rawData.map((p) => ({
    label: formatLabel(p.timestamp, range),
    price: p.price,
  })), [rawData, range])

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading price history...</div>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">No price history available</div>
        </div>
      </div>
    )
  }

  const prices = chartData.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const currentPrice = prices[prices.length - 1]

  const minIdx = prices.indexOf(minPrice)
  const maxIdx = prices.indexOf(maxPrice)
  const yDomain = [Math.floor(minPrice - 0.5), Math.ceil(maxPrice + 0.5)]

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price Trend</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">
            ${currentPrice.toFixed(2)}
            <span className={cn(
              'ml-2 text-sm font-medium',
              currentPrice <= minPrice ? 'text-success' : currentPrice >= maxPrice ? 'text-danger' : 'text-muted-foreground'
            )}>
              {currentPrice <= minPrice ? 'At low' : currentPrice >= maxPrice ? 'At high' : `vs $${minPrice.toFixed(2)} low`}
            </span>
          </p>
        </div>
        {/* Range toggle */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(['7D', '30D'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-md transition-all',
                range === r
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Low</p>
          <p className="text-sm font-bold text-success">${minPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">High</p>
          <p className="text-sm font-bold text-danger">${maxPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-sm font-bold text-foreground">${currentPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.58 0.16 175)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="oklch(0.58 0.16 175)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.14 0 0 / 0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)', fontFamily: 'var(--font-sans)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)', fontFamily: 'var(--font-sans)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={minPrice}
              stroke="oklch(0.72 0.17 155)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceLine
              y={maxPrice}
              stroke="oklch(0.62 0.22 27)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="oklch(0.58 0.16 175)"
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'oklch(0.58 0.16 175)', strokeWidth: 0 }}
            />
            {/* Low marker */}
            <ReferenceDot
              x={chartData[minIdx]?.label}
              y={minPrice}
              r={4}
              fill="oklch(0.52 0.17 155)"
              stroke="oklch(1 0 0)"
              strokeWidth={2}
            />
            {/* High marker */}
            <ReferenceDot
              x={chartData[maxIdx]?.label}
              y={maxPrice}
              r={4}
              fill="oklch(0.55 0.22 27)"
              stroke="oklch(1 0 0)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Lowest</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-danger" />
          <span className="text-xs text-muted-foreground">Highest</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
      </div>
    </div>
  )
}
