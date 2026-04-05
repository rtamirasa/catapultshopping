"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { stores } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Store,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";

// Underperforming stores
const underperformingStores = stores.filter(
  (s) => s.stockHealth < 70 || s.productPresence < 80 || s.avgPrice > 5.8
);

export default function StoresPage() {
  const avgStockHealth = Math.round(
    stores.reduce((acc, s) => acc + s.stockHealth, 0) / stores.length
  );
  const avgPresence = Math.round(
    stores.reduce((acc, s) => acc + s.productPresence, 0) / stores.length
  );
  const totalScans = stores.reduce((acc, s) => acc + s.scanFrequency, 0);

  return (
    <DashboardLayout title="Store Performance">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Total Stores"
            value={stores.length}
            icon={<Store className="h-5 w-5" />}
          />
          <KpiCard
            title="Avg Stock Health"
            value={`${avgStockHealth}%`}
            change={-3}
            changeLabel="vs last week"
            trend="down"
            icon={<Activity className="h-5 w-5" />}
            tooltip="Average stock health score across all stores"
          />
          <KpiCard
            title="Avg Product Presence"
            value={`${avgPresence}%`}
            change={2}
            changeLabel="vs last week"
            trend="up"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <KpiCard
            title="Underperforming"
            value={underperformingStores.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            tooltip="Stores with low stock, poor placement, or high prices"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Store Table */}
          <div className="col-span-2 rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">All Stores</h3>
              <p className="text-xs text-muted-foreground">
                Performance metrics by store location
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Store</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Stock Health</TableHead>
                  <TableHead className="text-right">Presence</TableHead>
                  <TableHead className="text-right">Scans</TableHead>
                  <TableHead className="text-right">Last Scan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {store.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {store.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-medium",
                          store.avgPrice > 5.8
                            ? "text-destructive"
                            : store.avgPrice < 5.3
                              ? "text-success"
                              : "text-foreground"
                        )}
                      >
                        ${store.avgPrice.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress
                          value={store.stockHealth}
                          className={cn(
                            "h-2 w-16",
                            store.stockHealth < 60 && "[&>div]:bg-destructive",
                            store.stockHealth >= 60 &&
                              store.stockHealth < 80 &&
                              "[&>div]:bg-warning",
                            store.stockHealth >= 80 && "[&>div]:bg-success"
                          )}
                        />
                        <span className="text-sm w-8">{store.stockHealth}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {store.productPresence}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {store.scanFrequency}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {store.lastScan}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">
                Store Coverage Map
              </h3>
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-sm">Interactive map</p>
                  <p className="text-xs">coming soon</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-lg font-semibold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Regions</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-lg font-semibold text-foreground">
                    {stores.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Stores</p>
                </div>
              </div>
            </div>

            {/* Underperforming Stores */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold text-foreground">
                  Underperforming Stores
                </h3>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </div>
              <div className="divide-y divide-border">
                {underperformingStores.length > 0 ? (
                  underperformingStores.map((store) => {
                    const issues = [];
                    if (store.stockHealth < 70) issues.push("Low stock");
                    if (store.productPresence < 80) issues.push("Poor placement");
                    if (store.avgPrice > 5.8) issues.push("High prices");

                    return (
                      <div
                        key={store.id}
                        className="px-5 py-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">
                            {store.name}
                          </p>
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {store.location}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {issues.map((issue) => (
                            <Badge
                              key={issue}
                              variant="outline"
                              className="text-[10px] bg-destructive/10 text-destructive border-destructive/20"
                            >
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2 px-5 py-4">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">
                      All stores performing well
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Regional Summary */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">
                Regional Summary
              </h3>
              <div className="space-y-3">
                {["Midwest", "Northeast", "West", "South"].map((region) => {
                  const regionStores = stores.filter(
                    (s) => s.region === region
                  );
                  const avgHealth = regionStores.length
                    ? Math.round(
                        regionStores.reduce((acc, s) => acc + s.stockHealth, 0) /
                          regionStores.length
                      )
                    : 0;

                  return (
                    <div
                      key={region}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{region}</span>
                        <Badge variant="secondary" className="text-xs">
                          {regionStores.length} stores
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={avgHealth}
                          className={cn(
                            "h-2 w-16",
                            avgHealth >= 80 && "[&>div]:bg-success",
                            avgHealth >= 60 && avgHealth < 80 && "[&>div]:bg-warning",
                            avgHealth < 60 && "[&>div]:bg-destructive"
                          )}
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {avgHealth}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
