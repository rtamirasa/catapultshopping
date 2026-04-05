"use client";

import { cn } from "@/lib/utils";
import { dailyMovers } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Store } from "lucide-react";
import Link from "next/link";

export function DailyMovers() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Daily Movers</h3>
        <p className="text-xs text-muted-foreground">
          Products with largest price changes today
        </p>
      </div>
      <div className="divide-y divide-border">
        {dailyMovers.map((mover) => (
          <Link
            key={mover.productId}
            href={`/products/${mover.productId}`}
            className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  mover.direction === "down"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {mover.direction === "down" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {mover.productName}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Store className="h-3 w-3" />
                  <span>{mover.storesImpacted} stores impacted</span>
                </div>
              </div>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                mover.direction === "down" ? "text-success" : "text-destructive"
              )}
            >
              {mover.direction === "down" ? "" : "+"}
              {mover.change}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
