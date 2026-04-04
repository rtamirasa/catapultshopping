import { AppShell } from '@/components/aisle/app-shell'
import { ProductDetailScreen } from '@/components/aisle/product-detail-screen'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function ProductPage() {
  return (
    <AppShell title="Price Intelligence">
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <ProductDetailScreen />
      </Suspense>
    </AppShell>
  )
}
