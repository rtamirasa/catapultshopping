"use client";

import { coverageStats } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Database, Users, Store, LayoutGrid } from "lucide-react";

const stats = [
  {
    label: "Stores Covered",
    value: coverageStats.storesCovered,
    total: coverageStats.totalStores,
    icon: Store,
  },
  {
    label: "Scans Today",
    value: coverageStats.totalScansToday.toLocaleString(),
    icon: Database,
  },
  {
    label: "Active Shoppers",
    value: coverageStats.uniqueShoppers.toLocaleString(),
    icon: Users,
  },
  {
    label: "Shelves Mapped",
    value: coverageStats.shelvesMapped.toLocaleString(),
    icon: LayoutGrid,
  },
];

export function CoverageMini() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Data Coverage</h3>
        <p className="text-xs text-muted-foreground">
          Today&apos;s data collection metrics
        </p>
      </div>
      <div className="p-5">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Coverage Rate</span>
            <span className="font-semibold text-foreground">
              {coverageStats.coveragePercentage}%
            </span>
          </div>
          <Progress value={coverageStats.coveragePercentage} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{stat.label}</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {typeof stat.value === "number" && stat.total
                  ? `${stat.value}/${stat.total}`
                  : stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
