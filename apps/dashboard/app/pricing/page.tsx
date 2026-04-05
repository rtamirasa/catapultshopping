"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { usePriceMovements } from "@/lib/hooks/use-price-movements";
import { useProducts } from "@/lib/hooks/use-products";
import { useStores } from "@/lib/hooks/use-stores";
import { volatilityLeaderboard, products as mockProducts, stores as mockStores, priceTrendData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Activity,
  TrendingDown,
  TrendingUp,
  Store,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Heatmap data for price changes by day/time
const heatmapData = [
  { day: "Mon", morning: 2, afternoon: -3, evening: 1 },
  { day: "Tue", morning: -5, afternoon: -2, evening: 0 },
  { day: "Wed", morning: 1, afternoon: 4, evening: -1 },
  { day: "Thu", morning: -2, afternoon: -4, evening: 2 },
  { day: "Fri", morning: 3, afternoon: 1, evening: -3 },
  { day: "Sat", morning: -1, afternoon: 2, evening: 1 },
  { day: "Sun", morning: 0, afternoon: -1, evening: -2 },
];

export default function PricingPage() {
  const { movements, loading: loadingMovements, error: errorMovements } = usePriceMovements();
  const { products: firebaseProducts, loading: loadingProducts, error: errorProducts } = useProducts();
  const { stores: firebaseStores, loading: loadingStores, error: errorStores } = useStores();

  // Use Firebase data if available, otherwise fall back to mock
  const products = firebaseProducts.length > 0 ? firebaseProducts : mockProducts;
  const stores = firebaseStores.length > 0 ? firebaseStores : mockStores;

  const loading = loadingMovements || loadingProducts || loadingStores;
  const error = errorMovements || errorProducts || errorStores;

  const avgVolatility = Math.round(
    mockProducts.reduce((acc, p) => acc + p.volatilityScore, 0) / mockProducts.length
  );

  const priceDroppingProducts = movements.drops?.length || mockProducts.filter((p) => p.priceChange < 0).length;
  const priceIncreasingProducts = movements.spikes?.length || mockProducts.filter((p) => p.priceChange > 0).length;

  // Store competitiveness data - use Firebase stores with mock competitiveness metrics
  const storeCompetitiveness = stores.map((store) => ({
    ...store,
    competitiveness: Math.round(Math.random() * 40 + 60),
    priceIndex: (Math.random() * 0.4 + 0.8).toFixed(2),
  }));

  if (loading) {
    return (
      <DashboardLayout title="Pricing Intelligence">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Pricing Intelligence">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error loading data: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Pricing Intelligence">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Avg Volatility Score"
            value={avgVolatility}
            change={-8}
            changeLabel="vs last week"
            trend="down"
            icon={<Activity className="h-5 w-5" />}
            tooltip="Average price volatility across all products. Lower is more stable."
          />
          <KpiCard
            title="Prices Dropping"
            value={priceDroppingProducts}
            changeLabel="products today"
            icon={<TrendingDown className="h-5 w-5" />}
          />
          <KpiCard
            title="Prices Increasing"
            value={priceIncreasingProducts}
            changeLabel="products today"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KpiCard
            title="Avg Price Movement"
            value="-2.3%"
            change={-2.3}
            changeLabel="vs yesterday"
            trend="down"
            icon={<DollarSign className="h-5 w-5" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Volatility Leaderboard */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">
                Price Volatility Leaderboard
              </h3>
              <p className="text-xs text-muted-foreground">
                Products with most frequent price changes
              </p>
            </div>
            <div className="divide-y divide-border">
              {volatilityLeaderboard.map((item, index) => (
                <Link
                  key={item.productId}
                  href={`/products/${item.productId}`}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                        index === 0
                          ? "bg-destructive/10 text-destructive"
                          : index === 1
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.changes} price changes this week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.volatility} className="h-2 w-20" />
                    <span className="text-sm font-semibold text-foreground">
                      {item.volatility}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Price Movement Trends */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">
                Average Price Movement
              </h3>
              <p className="text-xs text-muted-foreground">
                Overall price trend across all products
              </p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceTrendData["7d"]}>
                  <defs>
                    <linearGradient id="priceGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="oklch(0.65 0.19 250)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.65 0.19 250)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0.005 250)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                    domain={["dataMin - 0.5", "dataMax + 0.5"]}
                    dx={-10}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                            <p className="mb-1 text-xs text-muted-foreground">
                              {label}
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              ${payload[0].value?.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="oklch(0.65 0.19 250)"
                    strokeWidth={2}
                    fill="url(#priceGradient2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Price Change Heatmap */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">
                Price Changes by Day/Time
              </h3>
              <p className="text-xs text-muted-foreground">
                When prices typically change
              </p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div></div>
                <div className="text-center">Morning</div>
                <div className="text-center">Afternoon</div>
                <div className="text-center">Evening</div>
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="grid grid-cols-4 gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {row.day}
                  </div>
                  {["morning", "afternoon", "evening"].map((time) => {
                    const value = row[time as keyof typeof row] as number;
                    return (
                      <div
                        key={time}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-lg text-sm font-medium",
                          value < -3
                            ? "bg-success/30 text-success"
                            : value < 0
                              ? "bg-success/10 text-success"
                              : value === 0
                                ? "bg-muted text-muted-foreground"
                                : value < 3
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-destructive/30 text-destructive"
                        )}
                      >
                        {value > 0 ? "+" : ""}
                        {value}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Store Competitiveness */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">
                Store Price Competitiveness
              </h3>
              <p className="text-xs text-muted-foreground">
                Best and worst performing stores by price
              </p>
            </div>
            <div className="h-[280px] p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={storeCompetitiveness.slice(0, 6)}
                  layout="vertical"
                  margin={{ left: 0, right: 20 }}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
                    domain={[50, 100]}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                    width={140}
                  />
                  <Tooltip
                    cursor={{ fill: "oklch(0.18 0.005 250)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                            <p className="mb-1 text-xs text-muted-foreground">
                              {data.name}
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {data.competitiveness}% competitive
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Price Index: {data.priceIndex}x
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="competitiveness" radius={[0, 4, 4, 0]}>
                    {storeCompetitiveness.slice(0, 6).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.competitiveness >= 85
                            ? "oklch(0.65 0.18 155)"
                            : entry.competitiveness >= 70
                              ? "oklch(0.65 0.19 250)"
                              : "oklch(0.55 0.22 25)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
