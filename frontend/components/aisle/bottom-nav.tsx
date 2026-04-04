'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ScanLine, ShoppingBasket, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Scan', href: '/scan', icon: ScanLine },
  { label: 'Basket', href: '/basket', icon: ShoppingBasket },
  { label: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/60 pb-safe"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                'p-1.5 rounded-lg transition-all duration-200',
                isActive && 'bg-primary/15 glow-primary-sm'
              )}>
                <Icon className={cn('size-5', isActive && 'drop-shadow-[0_0_6px_oklch(0.78_0.16_175_/_0.6)]')} />
              </div>
              <span className={cn(
                'text-[10px] font-semibold tracking-wide',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
