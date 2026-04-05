"use client";

import { useState } from "react";
import { priceTrendData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const timeRanges = ["24h", "7d", "30d"] as const;
type TimeRange = (typeof timeRanges)[number];

export function PriceTrendChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const data = priceTrendData[timeRange];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Price Trend</h3>
          <p className="text-xs text-muted-foreground">
            Min, max, and average price over time
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 text-xs",
                timeRange === range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
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
                      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold text-foreground">
                        ${payload[0].value?.toFixed(2)}
                      </p>
                      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                        <span>Min: ${payload[1]?.value?.toFixed(2)}</span>
                        <span>Max: ${payload[2]?.value?.toFixed(2)}</span>
                      </div>
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
              fill="url(#priceGradient)"
            />
            <Area
              type="monotone"
              dataKey="min"
              stroke="oklch(0.65 0.18 155)"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="max"
              stroke="oklch(0.55 0.22 25)"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-primary" />
          <span className="text-muted-foreground">Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-success" />
          <span className="text-muted-foreground">Minimum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-destructive" />
          <span className="text-muted-foreground">Maximum</span>
        </div>
      </div>
    </div>
  );
}
