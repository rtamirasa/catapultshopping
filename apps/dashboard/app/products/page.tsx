"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductsTable } from "@/components/dashboard/products-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { products } from "@/lib/mock-data";
import { Package, Target, TrendingUp, TrendingDown, ShoppingCart, DollarSign } from "lucide-react";

export default function ProductsPage() {
  const totalProducts = products.length;
  const totalScans = products.reduce((acc, p) => acc + p.scansToday, 0);
  const totalPurchases = products.reduce((acc, p) => acc + p.purchasesToday, 0);
  const avgConversion = ((totalPurchases / totalScans) * 100).toFixed(1);
  
  const totalWins = products.reduce((acc, p) => acc + p.winsVsCompetitor, 0);
  const totalLosses = products.reduce((acc, p) => acc + p.lossesToCompetitor, 0);
  const winRate = ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1);
  
  const bestPerformer = products.reduce((best, p) => 
    p.conversionRate > best.conversionRate ? p : best
  , products[0]);
  
  const worstPerformer = products.reduce((worst, p) => 
    p.conversionRate < worst.conversionRate ? p : worst
  , products[0]);

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-4">
          <KpiCard
            title="Total Products"
            value={totalProducts}
            icon={<Package className="h-5 w-5" />}
          />
          <KpiCard
            title="Scans Today"
            value={totalScans.toLocaleString()}
            subtitle="Intent signals"
            change={12.5}
            changeLabel="vs yesterday"
            trend="up"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <KpiCard
            title="Purchases"
            value={totalPurchases.toLocaleString()}
            subtitle="Confirmed sales"
            change={8.3}
            changeLabel="vs yesterday"
            trend="up"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KpiCard
            title="Avg Conversion"
            value={`${avgConversion}%`}
            subtitle="Scan to buy"
            change={2.1}
            changeLabel="vs last week"
            trend="up"
            icon={<Target className="h-5 w-5" />}
          />
          <KpiCard
            title="Win Rate"
            value={`${winRate}%`}
            subtitle="vs competitors"
            change={3.4}
            changeLabel="vs last week"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KpiCard
            title="Losses Today"
            value={totalLosses.toLocaleString()}
            subtitle="To competitors"
            change={-5.4}
            changeLabel="vs yesterday"
            trend="down"
            icon={<TrendingDown className="h-5 w-5" />}
            valueClassName="text-destructive"
          />
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Performer</p>
                <p className="text-sm font-semibold text-foreground">{bestPerformer.name}</p>
                <p className="text-xs text-success">
                  {bestPerformer.conversionRate}% conversion &bull; {((bestPerformer.winsVsCompetitor / (bestPerformer.winsVsCompetitor + bestPerformer.lossesToCompetitor)) * 100).toFixed(0)}% win rate
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
                <p className="text-sm font-semibold text-foreground">{worstPerformer.name}</p>
                <p className="text-xs text-destructive">
                  {worstPerformer.conversionRate}% conversion &bull; {((worstPerformer.winsVsCompetitor / (worstPerformer.winsVsCompetitor + worstPerformer.lossesToCompetitor)) * 100).toFixed(0)}% win rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">All Products</h2>
              <p className="text-sm text-muted-foreground">
                Click on a product to view detailed attribution intelligence
              </p>
            </div>
          </div>
          <ProductsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
