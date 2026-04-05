'use client'

import { useState } from 'react'
import { seedAllAttributionData } from '@/lib/seed-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await seedAllAttributionData()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Seed Attribution Data">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Attribution Data Seeding</h2>
          <p className="text-muted-foreground mb-6">
            This will populate your Firebase with demo attribution data including scans, receipts,
            win/loss events, competitors, alerts, and daily metrics.
          </p>

          <Button
            onClick={handleSeed}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? 'Seeding Data...' : '🌱 Seed Attribution Data'}
          </Button>

          {loading && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                This may take a few minutes. Please wait...
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">Error:</p>
              <p className="text-sm text-destructive mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-medium text-success mb-2">✅ Successfully seeded!</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• {result.scans} scans</p>
                <p>• {result.receipts} receipts</p>
                <p>• {result.winLossEvents} win/loss events</p>
                <p>• {result.competitors} competitors</p>
                <p>• {result.alerts} alerts</p>
                <p>• {result.productMetrics} product metrics</p>
                <p>• {result.storeMetrics} store metrics</p>
                <p>• {result.coverageStats} coverage stats</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-muted/30">
          <h3 className="text-sm font-semibold mb-2">📝 Note</h3>
          <p className="text-sm text-muted-foreground">
            This seed script generates realistic demo data for the last 7 days. You can run this
            multiple times to generate more data, but be aware it will create duplicate entries.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
