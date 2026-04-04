'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, TrendingUp, Image,
  Swords, Store, Database, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Overview',             href: '/dashboard',                    icon: LayoutDashboard },
  { label: 'Products',             href: '/dashboard/products',           icon: Package },
  { label: 'Pricing Intelligence', href: '/dashboard/pricing',            icon: TrendingUp },
  { label: 'Shelf & Placement',    href: '/dashboard/shelf',              icon: Image },
  { label: 'Competitive Analysis', href: '/dashboard/competitive',        icon: Swords },
  { label: 'Store Performance',    href: '/dashboard/stores',             icon: Store },
  { label: 'Data Coverage',        href: '/dashboard/coverage',           icon: Database },
  { label: 'Alerts',               href: '/dashboard/alerts',             icon: Bell },
]

export function DashSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-[#e5e7eb] bg-white h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-indigo-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white tracking-tight">AI</span>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-gray-900 tracking-tight">AisleIQ</p>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Insights</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', active ? 'text-indigo-600' : 'text-gray-400')} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-700">JD</div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-800 truncate">Jane Doe</p>
            <p className="text-[11px] text-gray-400 truncate">Chobani LLC</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
