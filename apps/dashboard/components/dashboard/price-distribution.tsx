"use client";

import { priceDistributionData } from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export function PriceDistribution() {
  const avgPrice =
    priceDistributionData.reduce((acc, d) => acc + d.price, 0) /
    priceDistributionData.length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Price Distribution</h3>
        <p className="text-xs text-muted-foreground">
          Price variation across stores
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={priceDistributionData}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              domain={[4, 7]}
            />
            <YAxis
              dataKey="store"
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
                  const diff = data.price - avgPrice;
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                      <p className="mb-1 text-xs text-muted-foreground">
                        {data.store}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ${data.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${diff < 0 ? "text-success" : "text-destructive"}`}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff.toFixed(2)} vs avg
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="price" radius={[0, 4, 4, 0]}>
              {priceDistributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.price < avgPrice
                      ? "oklch(0.65 0.18 155)"
                      : entry.price > avgPrice + 0.3
                        ? "oklch(0.55 0.22 25)"
                        : "oklch(0.65 0.19 250)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-muted-foreground">Below Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-primary" />
          <span className="text-muted-foreground">Near Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Above Average</span>
        </div>
      </div>
    </div>
  );
}
