import { AppShell } from '@/components/aisle/app-shell'
import { ProductDetailScreen } from '@/components/aisle/product-detail-screen'

export default function ProductPage() {
  return (
    <AppShell title="Price Intelligence">
      <ProductDetailScreen />
    </AppShell>
  )
}
