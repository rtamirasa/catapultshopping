import type { ReactNode } from 'react'
import { DashSidebar } from '@/components/dashboard/dash-sidebar'
import { DashHeader } from '@/components/dashboard/dash-header'

export const metadata = {
  title: 'AisleIQ Insights — B2B Analytics',
  description: 'Enterprise retail intelligence powered by crowd-sourced shelf data.',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fb] font-sans">
      <DashSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <DashHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
