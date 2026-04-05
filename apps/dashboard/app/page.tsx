"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { WinLossFeed } from "@/components/dashboard/win-loss-feed";
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { PriceSensitivityChart } from "@/components/dashboard/price-sensitivity-chart";
import { products, coverageStats } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function OverviewPage() {
  // Calculate attribution KPIs from mock data
  const totalScans = products.reduce((acc, p) => acc + p.scansToday, 0);
  const totalPurchases = products.reduce((acc, p) => acc + p.purchasesToday, 0);
  const overallConversion = ((totalPurchases / totalScans) * 100).toFixed(1);
  
  const totalWins = products.reduce((acc, p) => acc + p.winsVsCompetitor, 0);
  const totalLosses = products.reduce((acc, p) => acc + p.lossesToCompetitor, 0);
  const winRate = ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1);

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
            value={`$${coverageStats.revenueAttributed.toLocaleString()}`}
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
            value={`$${coverageStats.lostRevenueToCompetitors.toLocaleString()}`}
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
            value={coverageStats.uniqueShoppers.toLocaleString()}
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
