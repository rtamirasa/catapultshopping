"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { shelfImages, products, stores } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  Eye,
  MapPin,
  AlertTriangle,
  ImageIcon,
  Package,
} from "lucide-react";
import { useState } from "react";

const positionLabels = {
  "eye-level": { label: "Eye Level", color: "bg-success/10 text-success border-success/20" },
  "upper-shelf": { label: "Upper Shelf", color: "bg-warning/10 text-warning border-warning/20" },
  "lower-shelf": { label: "Lower Shelf", color: "bg-destructive/10 text-destructive border-destructive/20" },
  endcap: { label: "Endcap", color: "bg-primary/10 text-primary border-primary/20" },
};

// Missing shelf alerts
const missingShelfAlerts = [
  { productId: "p3", productName: "Organic Granola Clusters", storeName: "Sunrise Market Denver", daysMissing: 3 },
  { productId: "p5", productName: "Protein Bar Variety Pack", storeName: "Central Foods Austin", daysMissing: 2 },
  { productId: "p8", productName: "Oat Milk Barista Edition", storeName: "Valley Foods SF", daysMissing: 1 },
];

// Placement insights
const placementInsights = [
  { label: "Next to Chobani", percentage: 78 },
  { label: "Eye Level Position", percentage: 68 },
  { label: "On Endcap", percentage: 12 },
  { label: "Bottom Shelf", percentage: 20 },
];

export default function ShelfPage() {
  const [storeFilter, setStoreFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const filteredImages = shelfImages.filter((img) => {
    if (storeFilter !== "all" && img.storeId !== storeFilter) return false;
    if (productFilter !== "all" && img.productId !== productFilter) return false;
    return true;
  });

  const eyeLevelPercentage = Math.round(
    (shelfImages.filter((s) => s.position === "eye-level").length / shelfImages.length) * 100
  );

  return (
    <DashboardLayout title="Shelf & Placement">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Total Shelf Images"
            value={shelfImages.length}
            change={15}
            changeLabel="vs last week"
            trend="up"
            icon={<ImageIcon className="h-5 w-5" />}
          />
          <KpiCard
            title="Eye Level Placement"
            value={`${eyeLevelPercentage}%`}
            change={5}
            changeLabel="vs last week"
            trend="up"
            icon={<Eye className="h-5 w-5" />}
            tooltip="Percentage of products placed at eye level"
          />
          <KpiCard
            title="Stores Mapped"
            value={stores.length}
            icon={<MapPin className="h-5 w-5" />}
          />
          <KpiCard
            title="Missing Alerts"
            value={missingShelfAlerts.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            tooltip="Products not seen in expected stores"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-48 bg-secondary border-0">
              <SelectValue placeholder="Filter by store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-48 bg-secondary border-0">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Shelf Images Grid */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Shelf Images</h3>
              <span className="text-sm text-muted-foreground">
                {filteredImages.length} images
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  {/* Image placeholder */}
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <LayoutGrid className="h-8 w-8" />
                      <span className="text-xs">Shelf scan image</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute top-3 right-3",
                        positionLabels[image.position].color
                      )}
                    >
                      {positionLabels[image.position].label}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {image.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {image.storeName}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {image.confidence}%
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Neighboring Products:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {image.neighbors.map((neighbor, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-normal">
                            {neighbor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {image.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Placement Insights */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">
                Placement Insights
              </h3>
              <div className="space-y-4">
                {placementInsights.map((insight) => (
                  <div key={insight.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{insight.label}</span>
                      <span className="font-medium text-foreground">
                        {insight.percentage}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${insight.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Shelf Alerts */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-semibold text-foreground">
                  Missing Shelf Alerts
                </h3>
                <p className="text-xs text-muted-foreground">
                  Products not seen in expected stores
                </p>
              </div>
              <div className="divide-y divide-border">
                {missingShelfAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                      <Package className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {alert.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.storeName}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                      {alert.daysMissing}d
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Distribution */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold text-foreground">
                Position Distribution
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(positionLabels).map(([key, { label, color }]) => {
                  const count = shelfImages.filter((s) => s.position === key).length;
                  const percentage = Math.round((count / shelfImages.length) * 100);
                  return (
                    <div
                      key={key}
                      className="rounded-lg bg-muted/50 p-3 text-center"
                    >
                      <p className="text-lg font-semibold text-foreground">
                        {percentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">{label}</p>
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
