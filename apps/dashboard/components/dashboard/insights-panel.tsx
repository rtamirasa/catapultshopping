"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { insightSummaries } from "@/lib/mock-data";
import {
  DollarSign,
  Target,
  TrendingUp,
  Package,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "pricing":
      return <DollarSign className="h-4 w-4" />;
    case "conversion":
      return <Target className="h-4 w-4" />;
    case "competitive":
      return <TrendingUp className="h-4 w-4" />;
    case "placement":
      return <Package className="h-4 w-4" />;
    case "attribution":
      return <Lightbulb className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function InsightsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1.5 text-xs font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Updated live
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Actionable recommendations from your data
        </p>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto overflow-x-hidden">
        {insightSummaries.map((insight) => (
          <div
            key={insight.id}
            className="group rounded-lg border border-border p-3 transition-all hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  insight.impact === "high"
                    ? "bg-destructive/10 text-destructive"
                    : insight.impact === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {getCategoryIcon(insight.category)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-foreground">
                  {insight.text}
                </p>
                {insight.metric && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs font-mono"
                    >
                      {insight.metric}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getImpactColor(insight.impact))}
                    >
                      {insight.impact} impact
                    </Badge>
                  </div>
                )}
                {insight.recommendation && (
                  <div className="mt-2 flex items-start gap-1 text-xs text-primary">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="break-words">{insight.recommendation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
