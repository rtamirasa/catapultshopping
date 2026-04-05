"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { products, competitors, lostRevenueBreakdown, priceSensitivityData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CompetitivePage() {
  const totalWins = products.reduce((acc, p) => acc + p.winsVsCompetitor, 0);
  const totalLosses = products.reduce((acc, p) => acc + p.lossesToCompetitor, 0);
  const winRate = ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1);
  const totalLostRevenue = lostRevenueBreakdown.reduce((acc, c) => acc + c.lostRevenue, 0);

  return (
    <DashboardLayout title="Competitive Analysis">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4">
          <KpiCard
            title="Win Rate"
            value={`${winRate}%`}
            subtitle="vs all competitors"
            change={3.4}
            changeLabel="vs last week"
            trend="up"
            icon={<Target className="h-5 w-5" />}
            tooltip="When shoppers compared you to competitors, how often they chose you"
          />
          <KpiCard
            title="Total Wins"
            value={totalWins.toLocaleString()}
            subtitle="Today"
            change={12.1}
            changeLabel="vs yesterday"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
            valueClassName="text-success"
          />
          <KpiCard
            title="Total Losses"
            value={totalLosses.toLocaleString()}
            subtitle="Today"
            change={-5.4}
            changeLabel="vs yesterday"
            trend="down"
            icon={<TrendingDown className="h-5 w-5" />}
            valueClassName="text-destructive"
          />
          <KpiCard
            title="Lost Revenue"
            value={`$${totalLostRevenue.toLocaleString()}`}
            subtitle="Recoverable"
            icon={<DollarSign className="h-5 w-5" />}
            tooltip="Revenue lost when shoppers chose competitors over you"
            valueClassName="text-destructive"
          />
          <KpiCard
            title="Competitors Tracked"
            value={competitors.length}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Lost Revenue Breakdown */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Who You&apos;re Losing To</h3>
                <p className="text-xs text-muted-foreground">
                  Competitors taking your sales - sorted by lost revenue
                </p>
              </div>
              <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5">
                ${totalLostRevenue.toLocaleString()} at risk
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border">
            {lostRevenueBreakdown.map((item, index) => (
              <div
                key={item.competitor}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.competitor}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category} &bull; {item.lostSales} lost sales
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Price Gap</p>
                    <p className={cn(
                      "text-sm font-medium",
                      item.avgPriceGap > 0 ? "text-destructive" : "text-success"
                    )}>
                      {item.avgPriceGap > 0 ? "+" : ""}${item.avgPriceGap.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-muted-foreground">Lost Revenue</p>
                    <p className="text-sm font-semibold text-destructive">
                      ${item.lostRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Battle Cards */}
        <div>
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            Head-to-Head Performance
            <Badge variant="secondary" className="font-normal">By category</Badge>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {competitors.slice(0, 6).map((competitor) => {
              const yourProduct = products.find((p) => p.category === competitor.category);
              const winRateVsThis = yourProduct 
                ? ((yourProduct.winsVsCompetitor / (yourProduct.winsVsCompetitor + yourProduct.lossesToCompetitor)) * 100).toFixed(0)
                : "50";
              const isWinning = parseInt(winRateVsThis) > 50;

              return (
                <div
                  key={competitor.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all hover:shadow-md",
                    isWinning 
                      ? "border-success/30 bg-success/5" 
                      : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        vs {competitor.name}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {competitor.category}
                      </Badge>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-sm font-semibold",
                      isWinning ? "text-success" : "text-destructive"
                    )}>
                      {isWinning ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {winRateVsThis}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Price Gap</span>
                      <span className={cn(
                        "font-medium",
                        competitor.avgPriceGap > 0 ? "text-success" : "text-destructive"
                      )}>
                        You&apos;re ${Math.abs(competitor.avgPriceGap).toFixed(2)} {competitor.avgPriceGap > 0 ? "cheaper" : "higher"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Their Conversion</span>
                      <span className="font-medium text-foreground">{competitor.conversionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Wins/Losses</span>
                      <span className="font-medium">
                        <span className="text-success">{competitor.lossesToYou}</span>
                        {" / "}
                        <span className="text-destructive">{competitor.winsAgainstYou}</span>
                      </span>
                    </div>
                  </div>

                  {!isWinning && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Consider price adjustment</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Sensitivity by Win Rate */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">
              Win Rate by Price Gap
            </h3>
            <p className="text-xs text-muted-foreground">
              How pricing affects your competitive win rate
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceSensitivityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="priceGapRange"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, _name: string, props: { payload: { wins: number; losses: number } }) => [
                    `${value}% (${props.payload.wins}W / ${props.payload.losses}L)`,
                    "Win Rate",
                  ]}
                />
                <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
                  {priceSensitivityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.winRate >= 65
                          ? "hsl(var(--success))"
                          : entry.winRate >= 50
                          ? "hsl(var(--warning))"
                          : "hsl(var(--destructive))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
