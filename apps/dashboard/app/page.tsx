"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { WinLossFeed } from "@/components/dashboard/win-loss-feed";
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { PriceSensitivityChart } from "@/components/dashboard/price-sensitivity-chart";
import { useProducts } from "@/lib/hooks/use-products";
import { useCoverageStats } from "@/lib/hooks/use-coverage-stats";
import { useProductMetrics } from "@/lib/hooks/use-product-metrics";
import { products as mockProducts, coverageStats as mockCoverageStats } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function OverviewPage() {
  const { products: firebaseProducts, loading: loadingProducts, error: errorProducts } = useProducts();
  const { stats: coverageStats, loading: loadingStats, error: errorStats } = useCoverageStats();
  const { metrics: productMetrics, loading: loadingMetrics, error: errorMetrics } = useProductMetrics();

  const loading = loadingProducts || loadingStats || loadingMetrics;
  const error = errorProducts || errorStats || errorMetrics;

  // Use Firebase data if available, otherwise fall back to mock data
  const products = firebaseProducts.length > 0 ? firebaseProducts : mockProducts;
  const stats = coverageStats || mockCoverageStats;

  // Calculate KPIs from real data
  const totalScans = stats.totalScans || 0;
  const totalPurchases = stats.totalReceipts || 0;
  const overallConversion = stats.overallConversionRate?.toFixed(1) || '0.0';
  const totalWins = stats.totalWins || 0;
  const totalLosses = stats.totalLosses || 0;
  const winRate = totalWins + totalLosses > 0
    ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <DashboardLayout title="Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading attribution data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Overview">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-destructive">Error loading data: {error.message}</div>
          <p className="text-sm text-muted-foreground">
            Have you seeded the attribution data? Visit{' '}
            <a href="/admin/seed" className="text-primary hover:underline">/admin/seed</a> to seed data.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        {/* Attribution KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            title="Scans Today"
            value={totalScans.toLocaleString()}
            subtitle="Products considered"
            change={12.5}
            changeLabel="vs yesterday"
            trend="up"
            icon={<ShoppingCart className="h-5 w-5" />}
            tooltip="Number of products scanned by shoppers (intent/consideration signals)"
          />
          <KpiCard
            title="Purchases"
            value={totalPurchases.toLocaleString()}
            subtitle="From receipt scans"
            change={8.3}
            changeLabel="vs yesterday"
            trend="up"
            icon={<DollarSign className="h-5 w-5" />}
            tooltip="Number of your products confirmed purchased via receipt scans"
          />
          <KpiCard
            title="Conversion Rate"
            value={`${overallConversion}%`}
            subtitle="Scan to purchase"
            change={2.1}
            changeLabel="vs last week"
            trend="up"
            icon={<Target className="h-5 w-5" />}
            tooltip="Percentage of scanned products that were actually purchased"
          />
          <KpiCard
            title="Win Rate"
            value={`${winRate}%`}
            subtitle="vs competitors"
            change={3.4}
            changeLabel="vs last week"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
            tooltip="When shoppers compared your product to competitors, how often they chose you"
          />
          <KpiCard
            title="Revenue Attributed"
            value={`$${(stats.revenueAttributed || 0).toLocaleString()}`}
            subtitle="Today"
            change={15.2}
            changeLabel="vs yesterday"
            trend="up"
            icon={<DollarSign className="h-5 w-5" />}
            tooltip="Revenue from purchases where shopper scanned your product before buying"
            valueClassName="text-success"
          />
          <KpiCard
            title="Lost to Competitors"
            value={`$${(stats.lostRevenueToCompetitors || 0).toLocaleString()}`}
            subtitle="Recoverable"
            change={-8.7}
            changeLabel="vs yesterday"
            trend="down"
            icon={<TrendingDown className="h-5 w-5" />}
            tooltip="Revenue lost when shoppers scanned your product but bought a competitor"
            valueClassName="text-destructive"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Left Column - AI Insights */}
          <div className="min-w-0">
            <InsightsPanel />
          </div>

          {/* Center Column - Win/Loss Feed */}
          <div className="min-w-0">
            <WinLossFeed />
          </div>

          {/* Right Column - Conversion Funnel */}
          <div className="min-w-0">
            <ConversionFunnel />
          </div>
        </div>

        {/* Price Sensitivity Chart - Full Width */}
        <PriceSensitivityChart />

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            title="Unique Shoppers"
            value={(stats.uniqueShoppers || 0).toLocaleString()}
            change={5.2}
            changeLabel="vs yesterday"
            trend="up"
            icon={<Users className="h-5 w-5" />}
            tooltip="Unique shoppers who scanned at least one of your products today"
          />
          <KpiCard
            title="Head-to-Head Decisions"
            value={(totalWins + totalLosses).toLocaleString()}
            change={18.3}
            changeLabel="vs yesterday"
            trend="up"
            icon={<Target className="h-5 w-5" />}
            tooltip="Times shoppers compared your product directly against a competitor"
          />
          <KpiCard
            title="Wins Today"
            value={totalWins.toLocaleString()}
            change={12.1}
            changeLabel="vs yesterday"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
            tooltip="Times shoppers chose your product over a competitor"
            valueClassName="text-success"
          />
          <KpiCard
            title="Losses Today"
            value={totalLosses.toLocaleString()}
            change={-5.4}
            changeLabel="vs yesterday"
            trend="down"
            icon={<TrendingDown className="h-5 w-5" />}
            tooltip="Times shoppers chose a competitor over your product"
            valueClassName="text-destructive"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
