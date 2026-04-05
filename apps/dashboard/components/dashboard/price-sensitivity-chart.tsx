"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { priceSensitivityData } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PriceSensitivityChart() {
  // Find the key insights
  const breakEvenRange = priceSensitivityData.find((d) => d.winRate >= 50 && d.winRate <= 55);
  const sweetSpot = priceSensitivityData.find((d) => d.priceGapRange === "-$0.25 to -$0.50");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">
              Price Sensitivity Analysis
            </CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Shows your win rate at different price gaps vs competitors. Use this
                    to find the optimal pricing that maximizes wins while protecting margin.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              Based on {priceSensitivityData.reduce((acc, d) => acc + d.totalDecisions, 0).toLocaleString()} decisions
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Win rate by price gap vs competitors - find your optimal pricing sweet spot
        </p>
      </CardHeader>
      <CardContent>
        {/* Key Insights */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-success/20 bg-success/5 p-3">
            <p className="text-xs text-muted-foreground">Sweet Spot</p>
            <p className="text-lg font-semibold text-success">
              {sweetSpot?.priceGapRange || "-$0.25 to -$0.50"}
            </p>
            <p className="text-xs text-success">
              {sweetSpot?.winRate || 67}% win rate
            </p>
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
            <p className="text-xs text-muted-foreground">Break-Even Point</p>
            <p className="text-lg font-semibold text-warning">Price Parity</p>
            <p className="text-xs text-warning">
              ~52% win rate
            </p>
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs text-muted-foreground">Danger Zone</p>
            <p className="text-lg font-semibold text-destructive">+$0.50+</p>
            <p className="text-xs text-destructive">
              Below 25% win rate
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceSensitivityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="priceGapRange"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string, props: { payload: { wins: number; losses: number; totalDecisions: number } }) => [
                  `${value}% (${props.payload.wins} wins / ${props.payload.losses} losses)`,
                  "Win Rate",
                ]}
                labelFormatter={(label) => `Price Gap: ${label}`}
              />
              <ReferenceLine x={50} stroke="hsl(var(--warning))" strokeDasharray="5 5" />
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

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-success" />
            <span className="text-muted-foreground">Winning (&gt;65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-warning" />
            <span className="text-muted-foreground">Competitive (50-65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-destructive" />
            <span className="text-muted-foreground">Losing (&lt;50%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
