"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PriceTrendChart } from "@/components/dashboard/price-trend-chart";
import { PriceDistribution } from "@/components/dashboard/price-distribution";
import { products, shelfImages, stockSignals, competitors, recentWinLossEvents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  MapPin,
  AlertTriangle,
  Lightbulb,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stockStatusColors = {
  high: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-destructive/10 text-destructive border-destructive/20",
};

const positionLabels = {
  "eye-level": "Eye Level",
  "upper-shelf": "Upper Shelf",
  "lower-shelf": "Lower Shelf",
  endcap: "Endcap",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id) || products[0];
  const productShelfImages = shelfImages.filter((s) => s.productId === id);
  const productStockSignals = stockSignals.filter((s) => s.productId === id);
  const productWinLoss = recentWinLossEvents.filter((e) => e.productId === id);
  
  const winRate = (
    (product.winsVsCompetitor / (product.winsVsCompetitor + product.lossesToCompetitor)) * 100
  ).toFixed(1);
  
  const mainCompetitor = competitors.find((c) => c.category === product.category);

  return (
    <DashboardLayout title="Product Intelligence">
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link href="/products">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  {product.name}
                </h1>
                <Badge variant="secondary">{product.category}</Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    parseFloat(winRate) > 50
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {parseFloat(winRate) > 50 ? "Winning" : "Losing"} vs competitors
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>SKU: {product.sku}</span>
                <span>Last seen: {product.lastSeen}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">
              ${product.avgPrice.toFixed(2)}
            </p>
            <p
              className={cn(
                "text-sm font-medium",
                product.competitorDelta < 0 ? "text-success" : "text-destructive"
              )}
            >
              {product.competitorDelta > 0 ? "+" : ""}${product.competitorDelta.toFixed(2)}{" "}
              vs competitors
            </p>
          </div>
        </div>

        {/* Primary KPIs - Attribution Focused */}
        <div className="grid grid-cols-6 gap-4">
          <KpiCard
            title="Scans Today"
            value={product.scansToday.toLocaleString()}
            subtitle="Intent signals"
            icon={<ShoppingCart className="h-5 w-5" />}
            tooltip="Shoppers who considered this product today"
          />
          <KpiCard
            title="Purchases"
            value={product.purchasesToday.toLocaleString()}
            subtitle="From receipts"
            icon={<DollarSign className="h-5 w-5" />}
            valueClassName="text-success"
          />
          <KpiCard
            title="Conversion Rate"
            value={`${product.conversionRate}%`}
            subtitle="Scan to buy"
            icon={<Target className="h-5 w-5" />}
            tooltip="What percentage of scanners actually bought"
          />
          <KpiCard
            title="Win Rate"
            value={`${winRate}%`}
            subtitle={`${product.winsVsCompetitor}W / ${product.lossesToCompetitor}L`}
            icon={parseFloat(winRate) > 50 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            valueClassName={parseFloat(winRate) > 50 ? "text-success" : "text-destructive"}
            tooltip="When compared directly to competitors"
          />
          <KpiCard
            title="Avg Win Price Gap"
            value={`$${product.avgPriceGapAtWin.toFixed(2)}`}
            subtitle="When you won"
            icon={<TrendingDown className="h-5 w-5" />}
            valueClassName="text-success"
            tooltip="Average price gap when shopper chose you"
          />
          <KpiCard
            title="Avg Loss Price Gap"
            value={`+$${product.avgPriceGapAtLoss.toFixed(2)}`}
            subtitle="When you lost"
            icon={<TrendingUp className="h-5 w-5" />}
            valueClassName="text-destructive"
            tooltip="Average price gap when shopper chose competitor"
          />
        </div>

        {/* Attribution Insight Banner */}
        <div className={cn(
          "rounded-xl border p-4",
          parseFloat(winRate) > 50
            ? "border-success/30 bg-success/5"
            : "border-destructive/30 bg-destructive/5"
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              parseFloat(winRate) > 50 ? "bg-success/10" : "bg-destructive/10"
            )}>
              <Lightbulb className={cn(
                "h-5 w-5",
                parseFloat(winRate) > 50 ? "text-success" : "text-destructive"
              )} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {parseFloat(winRate) > 50
                  ? "This product is winning! Here's why:"
                  : "This product needs attention. Here's what's happening:"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {parseFloat(winRate) > 50
                  ? `Shoppers choose ${product.name} over competitors when you're priced ${Math.abs(product.avgPriceGapAtWin).toFixed(2)} below them. Your current ${product.competitorDelta < 0 ? "lower" : "higher"} pricing is ${product.competitorDelta < 0 ? "driving wins" : "still competitive due to brand preference"}.`
                  : `Shoppers switch to competitors when you're priced +$${product.avgPriceGapAtLoss.toFixed(2)} or more above them. Consider testing a price point ${Math.abs(product.avgPriceGapAtLoss).toFixed(2)} lower to recover ${product.lossesToCompetitor} lost sales.`}
              </p>
              {parseFloat(winRate) <= 50 && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    Recommended: Test ${(product.avgPrice - product.avgPriceGapAtLoss).toFixed(2)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          <PriceTrendChart />
          <PriceDistribution />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Win/Loss Events */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-foreground">Recent Decisions</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {productWinLoss.length > 0 ? (
                productWinLoss.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg p-3",
                      event.outcome === "win" ? "bg-success/5" : "bg-destructive/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {event.outcome === "win" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {event.outcome === "win" ? "Won vs" : "Lost to"} {event.competitorName}
                        </span>
                      </div>
                      <Badge variant="secondary" className={cn(
                        "text-xs",
                        event.outcome === "win" ? "text-success" : "text-destructive"
                      )}>
                        {event.priceGap > 0 ? "+" : ""}${event.priceGap.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.timestamp} at {event.storeName}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent competitive decisions</p>
              )}
            </div>
            {mainCompetitor && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Main Competitor</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{mainCompetitor.name}</span>
                  <span className="text-sm">${mainCompetitor.avgPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Shelf Placement Section */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-foreground">Shelf Placement</h3>
            {productShelfImages.length > 0 ? (
              <div className="space-y-3">
                {productShelfImages.slice(0, 3).map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {positionLabels[image.position]}
                        </p>
                        <p className="text-xs text-muted-foreground">{image.storeName}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {image.confidence}% conf
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No shelf images available</p>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold text-foreground">68%</p>
                <p className="text-xs text-muted-foreground">Eye Level</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold text-foreground">45%</p>
                <p className="text-xs text-muted-foreground">Near Competitor</p>
              </div>
            </div>
          </div>

          {/* Stock & Conversion Insights */}
          <div className="space-y-4">
            {/* Conversion Insights */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">Conversion Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Conversion Time</span>
                  <span className="text-sm font-medium">2-4 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Best Converting Store</span>
                  <span className="text-sm font-medium">FreshMart Oak Park</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shelf Presence</span>
                  <div className="flex items-center gap-2">
                    <Progress value={product.shelfPresence} className="h-2 w-16" />
                    <span className="text-sm font-medium">{product.shelfPresence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Signals */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">Stock Signals</h3>
              {productStockSignals.length > 0 ? (
                <div className="space-y-2">
                  {productStockSignals.map((signal) => (
                    <div
                      key={signal.id}
                      className="flex items-center justify-between rounded-lg bg-destructive/5 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {signal.storeName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {signal.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", stockStatusColors[signal.level])}
                      >
                        {signal.level}
                      </Badge>
                    </div>
                  ))}
                  <p className="text-xs text-destructive mt-2">
                    Low stock may be causing lost conversions
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-success/5 p-3">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">All stores reporting healthy stock</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
