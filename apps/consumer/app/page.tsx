import { AppShell } from '@/components/aisle/app-shell'
import { HomeHero } from '@/components/aisle/home-hero'
import { FeaturedInsightCard } from '@/components/aisle/featured-insight-card'
import { CheapestStoresSection } from '@/components/aisle/trust-section'

export default function HomePage() {
  return (
    <AppShell showLastSynced>
      <HomeHero />
      <FeaturedInsightCard />
      <CheapestStoresSection />
    </AppShell>
  )
}
