"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { alerts, type Alert } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Package,
  Target,
  Store,
  CheckCircle2,
  ExternalLink,
  Filter,
  Lightbulb,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const alertTypeIcons: Record<string, React.ElementType> = {
  price_drop: TrendingDown,
  price_increase: TrendingUp,
  out_of_stock: Package,
  competitor_adjacency: Store,
  missing_product: AlertTriangle,
  low_stock: AlertTriangle,
  conversion_drop: Target,
  competitor_win_streak: TrendingDown,
  price_sensitivity: Lightbulb,
};

const alertTypeLabels: Record<string, string> = {
  price_drop: "Price Drop",
  price_increase: "Price Increase",
  out_of_stock: "Out of Stock",
  competitor_adjacency: "Placement",
  missing_product: "Missing Product",
  low_stock: "Low Stock",
  conversion_drop: "Conversion Alert",
  competitor_win_streak: "Competitive Loss",
  price_sensitivity: "Price Insight",
};

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const severityBgColors = {
  critical: "bg-destructive/5 border-l-destructive",
  warning: "bg-warning/5 border-l-warning",
  info: "bg-card border-l-primary",
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "competitive">("all");
  
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  const warningAlerts = alerts.filter((a) => a.severity === "warning").length;
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;
  const competitiveAlerts = alerts.filter(
    (a) => a.type === "competitor_win_streak" || a.type === "conversion_drop" || a.type === "price_sensitivity"
  ).length;

  const filteredAlerts =
    filter === "unread"
      ? alerts.filter((a) => !a.isRead)
      : filter === "competitive"
      ? alerts.filter(
          (a) => a.type === "competitor_win_streak" || a.type === "conversion_drop" || a.type === "price_sensitivity"
        )
      : alerts;

  return (
    <DashboardLayout title="Alerts">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4">
          <KpiCard
            title="Total Alerts"
            value={alerts.length}
            icon={<Bell className="h-5 w-5" />}
          />
          <KpiCard
            title="Critical"
            value={criticalAlerts}
            icon={<AlertTriangle className="h-5 w-5" />}
            valueClassName="text-destructive"
          />
          <KpiCard
            title="Warnings"
            value={warningAlerts}
            icon={<AlertTriangle className="h-5 w-5" />}
            valueClassName="text-warning"
          />
          <KpiCard
            title="Competitive"
            value={competitiveAlerts}
            subtitle="Win/Loss alerts"
            icon={<Target className="h-5 w-5" />}
            tooltip="Alerts about competitive wins and losses"
          />
          <KpiCard
            title="Unread"
            value={unreadAlerts}
            icon={<Bell className="h-5 w-5" />}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Alerts
            </Button>
            <Button
              variant={filter === "unread" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadAlerts})
            </Button>
            <Button
              variant={filter === "competitive" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("competitive")}
            >
              Competitive ({competitiveAlerts})
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
          {filteredAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12">
              <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
              <h3 className="text-lg font-semibold text-foreground">
                All caught up!
              </h3>
              <p className="text-sm text-muted-foreground">
                No alerts matching your filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const Icon = alertTypeIcons[alert.type] || AlertTriangle;

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-l-4 p-5 transition-all hover:shadow-lg",
        severityBgColors[alert.severity],
        !alert.isRead && "ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            alert.severity === "critical"
              ? "bg-destructive/10 text-destructive"
              : alert.severity === "warning"
                ? "bg-warning/10 text-warning"
                : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                {!alert.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alert.description}
              </p>
              {/* Actionable Recommendation */}
              {alert.actionable && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-primary">{alert.actionable}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn("capitalize", severityColors[alert.severity])}
              >
                {alert.severity}
              </Badge>
              {alert.productId && (
                <Link href={`/products/${alert.productId}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs font-normal">
              {alertTypeLabels[alert.type] || alert.type}
            </Badge>
            <span>{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
