"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { recentWinLossEvents } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import Link from "next/link";

export function WinLossFeed() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Live Win/Loss Feed</CardTitle>
          <Badge variant="outline" className="gap-1.5 text-xs font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Real-time
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          When shoppers chose you or a competitor
        </p>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-1 overflow-y-auto overflow-x-hidden">
        {recentWinLossEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              "group relative rounded-lg border p-3 transition-all hover:bg-muted/50",
              event.outcome === "win"
                ? "border-success/20 bg-success/5"
                : "border-destructive/20 bg-destructive/5"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    event.outcome === "win"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {event.outcome === "win" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${event.productId}`}
                    className="block truncate text-sm font-medium text-foreground hover:underline"
                  >
                    {event.productName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {event.outcome === "win" ? "Won vs" : "Lost to"}{" "}
                    <span className="font-medium">{event.competitorName}</span>
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 text-xs",
                  event.outcome === "win"
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                )}
              >
                {event.priceGap > 0 ? "+" : ""}
                ${event.priceGap.toFixed(2)}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{event.storeName}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.timestamp}
              </span>
            </div>
            {event.outcome === "loss" && Math.abs(event.priceGap) > 0.25 && (
              <div className="mt-2 rounded bg-destructive/10 px-2 py-1 text-xs text-destructive">
                Price was {event.priceGapPercentage.toFixed(1)}% higher than competitor
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
