"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conversionFunnelData, products } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ConversionFunnel() {
  // Calculate totals
  const totalScans = products.reduce((acc, p) => acc + p.scansToday, 0);
  const totalPurchases = products.reduce((acc, p) => acc + p.purchasesToday, 0);
  const conversionRate = ((totalPurchases / totalScans) * 100).toFixed(1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
        <p className="text-xs text-muted-foreground">
          Scan to purchase throughout the day
        </p>
      </CardHeader>
      <CardContent>
        {/* Funnel Summary */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary/80" />
              <span className="text-sm text-muted-foreground">Scans (Intent)</span>
            </div>
            <span className="text-sm font-medium">{totalScans.toLocaleString()}</span>
          </div>
          <div className="relative">
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-success" />
              <span className="text-sm text-muted-foreground">Purchases</span>
            </div>
            <span className="text-sm font-medium">{totalPurchases.toLocaleString()}</span>
          </div>
          <div className="relative">
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-success"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-sm font-medium">Conversion Rate</span>
            <span className="text-lg font-semibold text-success">{conversionRate}%</span>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conversionFunnelData}>
              <defs>
                <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="period"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="hsl(var(--primary))"
                fill="url(#scansGradient)"
                strokeWidth={2}
                name="Scans"
              />
              <Area
                type="monotone"
                dataKey="purchased"
                stroke="hsl(var(--success))"
                fill="url(#purchasesGradient)"
                strokeWidth={2}
                name="Purchased"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
