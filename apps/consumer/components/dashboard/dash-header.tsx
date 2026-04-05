'use client'

import { useState } from 'react'
import { ChevronDown, Download, Radio } from 'lucide-react'
import { VENDORS } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const DATE_RANGES = ['Last 24h', 'Last 7d', 'Last 30d']
const STORES_LIST = ['All Stores', 'Target Midtown', 'Kroger Buckhead', 'Whole Foods Lincoln Park', 'Aldi West Loop', 'Walmart Supercenter', 'Target Silver Lake']
const CATEGORIES = ['All Categories', 'Dairy', 'Dairy Alt', 'Snacks', 'Bakery', 'Pantry', 'Meat Alt']

export function DashHeader() {
  const [vendor, setVendor] = useState(VENDORS[0])
  const [range, setRange] = useState('Last 7d')
  const [store, setStore] = useState('All Stores')
  const [category, setCategory] = useState('All Categories')

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-[#e5e7eb] gap-3">
      {/* Left: vendor selector */}
      <div className="flex items-center gap-2">
        <Select value={vendor.name} onChange={(v) => setVendor(VENDORS.find(x => x.name === v) ?? VENDORS[0])}>
          {VENDORS.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </Select>
      </div>

      {/* Center: filters */}
      <div className="flex items-center gap-2">
        <Select value={range} onChange={setRange}>
          {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>
        <Select value={store} onChange={setStore}>
          {STORES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={category} onChange={setCategory}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      {/* Right: live badge + export */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          Updated 5 min ago
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
          <Download className="size-3.5" />
          Export
        </button>
      </div>
    </header>
  )
}

function Select({ value, onChange, children }: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none text-[12px] font-medium text-gray-700 border border-gray-200 rounded-md pl-3 pr-7 py-1.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
    </div>
  )
}
