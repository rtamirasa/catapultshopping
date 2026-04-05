"use client";

import { cn } from "@/lib/utils";
import { priceObservations, type PriceObservation } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function getConfidenceColor(confidence: number) {
  if (confidence >= 95) return "text-success";
  if (confidence >= 85) return "text-warning";
  return "text-destructive";
}

function getPriceChangeIndicator(current: number, previous: number) {
  if (current < previous) return { text: "Price drop", color: "bg-success/10 text-success" };
  if (current > previous) return { text: "Price increase", color: "bg-destructive/10 text-destructive" };
  return { text: "No change", color: "bg-muted text-muted-foreground" };
}

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Store Activity</h3>
          <p className="text-xs text-muted-foreground">Real-time shopper scans</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Live
        </Badge>
      </div>
      <ScrollArea className="h-[360px]">
        <div className="divide-y divide-border">
          {priceObservations.map((observation) => (
            <ActivityItem key={observation.id} observation={observation} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ActivityItem({ observation }: { observation: PriceObservation }) {
  const priceChange = getPriceChangeIndicator(observation.price, observation.previousPrice);
  
  return (
    <div className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
        ${observation.price.toFixed(2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {observation.productName}
            </p>
            <p className="text-sm text-muted-foreground">{observation.storeName}</p>
          </div>
          <Badge className={cn("shrink-0 text-xs", priceChange.color)}>
            {priceChange.text}
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className={cn("font-medium", getConfidenceColor(observation.confidence))}>
            {observation.confidence}% confidence
          </span>
          <span>Verified by {observation.verifiedBy} shoppers</span>
          <span>{observation.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
