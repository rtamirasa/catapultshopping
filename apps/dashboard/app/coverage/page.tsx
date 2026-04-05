"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { coverageStats, coverageTrendData, coverageGaps, categoryPerformance } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Users,
  Store,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Receipt,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CoveragePage() {
  return (
    <DashboardLayout title="Data Coverage">
      <div className="space-y-6">
        {/* Hero Stats - Data Moat with Attribution Focus */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your Retail Attribution Data Moat
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time purchase intent and conversion signals from real shoppers
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {coverageStats.totalScansToday.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Scans (Intent)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {coverageStats.totalReceiptsToday.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Receipts (Purchases)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {coverageStats.overallConversionRate}%
              </p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {coverageStats.uniqueShoppers.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Active Shoppers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {coverageStats.storesCovered}/{coverageStats.totalStores}
              </p>
              <p className="text-sm text-muted-foreground">Stores Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {coverageStats.coveragePercentage}%
              </p>
              <p className="text-sm text-muted-foreground">Coverage Rate</p>
            </div>
          </div>
        </div>

        {/* Attribution KPIs */}
        <div className="grid grid-cols-5 gap-4">
          <KpiCard
            title="Scans Today"
            value={coverageStats.totalScansToday.toLocaleString()}
            subtitle="Intent signals"
            change={8.5}
            changeLabel="vs yesterday"
            trend="up"
            icon={<ShoppingCart className="h-5 w-5" />}
            tooltip="Products scanned by shoppers (consideration)"
          />
          <KpiCard
            title="Receipts Today"
            value={coverageStats.totalReceiptsToday.toLocaleString()}
            subtitle="Purchase confirmations"
            change={12.3}
            changeLabel="vs yesterday"
            trend="up"
            icon={<Receipt className="h-5 w-5" />}
            tooltip="Receipt scans confirming purchases"
          />
          <KpiCard
            title="Revenue Attributed"
            value={`$${coverageStats.revenueAttributed.toLocaleString()}`}
            subtitle="From our data"
            icon={<DollarSign className="h-5 w-5" />}
            valueClassName="text-success"
            tooltip="Revenue tracked through scan-to-receipt attribution"
          />
          <KpiCard
            title="Win Rate Today"
            value={`${((coverageStats.totalWins / (coverageStats.totalWins + coverageStats.totalLosses)) * 100).toFixed(1)}%`}
            subtitle={`${coverageStats.totalWins}W / ${coverageStats.totalLosses}L`}
            icon={<Target className="h-5 w-5" />}
            tooltip="Head-to-head competitive decisions"
          />
          <KpiCard
            title="Lost Revenue"
            value={`$${coverageStats.lostRevenueToCompetitors.toLocaleString()}`}
            subtitle="To competitors"
            icon={<TrendingDown className="h-5 w-5" />}
            valueClassName="text-destructive"
            tooltip="Revenue lost when shoppers chose competitors"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Coverage Trend Chart with Conversions */}
          <div className="col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Attribution Funnel Trend</h3>
              <p className="text-xs text-muted-foreground">
                Scans, receipts, and conversions over time
              </p>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={coverageTrendData}>
                  <defs>
                    <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="receiptsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                    dx={-10}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const scans = payload.find((p) => p.dataKey === "scans")?.value as number;
                        const receipts = payload.find((p) => p.dataKey === "receipts")?.value as number;
                        const conversions = payload.find((p) => p.dataKey === "conversions")?.value as number;
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                            <p className="mb-2 text-xs text-muted-foreground">{label}</p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="text-primary">Scans:</span>{" "}
                                <span className="font-semibold text-foreground">{scans?.toLocaleString()}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-warning">Receipts:</span>{" "}
                                <span className="font-semibold text-foreground">{receipts?.toLocaleString()}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-success">Your Purchases:</span>{" "}
                                <span className="font-semibold text-foreground">{conversions?.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#scansGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="receipts"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    fill="url(#receiptsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-primary" />
                <span className="text-muted-foreground">Scans (Intent)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-warning" />
                <span className="text-muted-foreground">Receipts (All)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-success" />
                <span className="text-muted-foreground">Your Purchases</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Attribution Summary */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">Attribution Summary</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative mx-auto h-28 w-28">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--success))"
                        strokeWidth="3"
                        strokeDasharray={`${coverageStats.overallConversionRate}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-success">
                        {coverageStats.overallConversionRate}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Conversion Rate</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Wins Today</span>
                    <span className="font-medium text-success">{coverageStats.totalWins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Losses Today</span>
                    <span className="font-medium text-destructive">{coverageStats.totalLosses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold text-foreground">Category Performance</h3>
                <p className="text-xs text-muted-foreground">Conversion by category</p>
              </div>
              <div className="divide-y divide-border max-h-[260px] overflow-y-auto">
                {categoryPerformance.map((cat) => (
                  <div key={cat.category} className="px-5 py-3 transition-colors hover:bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{cat.category}</p>
                      <div className="flex items-center gap-1">
                        {cat.winRate > 55 ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : cat.winRate < 45 ? (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        ) : null}
                        <span className={cn(
                          "text-sm font-medium",
                          cat.winRate > 55 ? "text-success" : cat.winRate < 45 ? "text-destructive" : "text-foreground"
                        )}>
                          {cat.winRate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{cat.scans.toLocaleString()} scans</span>
                      <span>{cat.conversionRate}% CVR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Gaps */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Coverage Gaps</h3>
                <p className="text-xs text-muted-foreground">
                  Stores with below-average data collection - potential blind spots
                </p>
              </div>
              <Badge variant="outline" className="text-warning border-warning/20 bg-warning/5">
                {coverageGaps.length} stores need attention
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            {coverageGaps.map((gap) => (
              <div key={gap.storeId} className="px-5 py-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <p className="font-medium text-foreground">{gap.storeName}</p>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                    -{gap.gapPercentage}% below avg
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{gap.scansLast7d} scans last 7d</span>
                  <span>Expected: {gap.avgScans}</span>
                </div>
                <Progress value={(gap.scansLast7d / gap.avgScans) * 100} className="h-1.5 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
