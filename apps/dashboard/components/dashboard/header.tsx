"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, RefreshCw } from "lucide-react";
import { useStores } from "@/lib/hooks/use-stores";

const categories = [
  "All Categories",
  "Dairy",
  "Dairy Alternatives",
  "Breakfast",
  "Beverages",
  "Snacks",
  "Condiments",
];

const dateRanges = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Overview" }: HeaderProps) {
  const { stores, loading: loadingStores } = useStores();
  const [dateRange, setDateRange] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  const handleStoreToggle = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Live
            </span>
            <span className="text-xs text-muted-foreground">
              Updated 5 min ago
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-36 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Store Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-9 gap-2 border-0">
                <span className="text-sm">
                  {selectedStores.length === 0
                    ? "All Stores"
                    : `${selectedStores.length} Stores`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {loadingStores ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Loading stores...
                </div>
              ) : stores.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No stores found
                </div>
              ) : (
                stores.map((store) => (
                  <DropdownMenuCheckboxItem
                    key={store.id}
                    checked={selectedStores.includes(store.id)}
                    onCheckedChange={() => handleStoreToggle(store.id)}
                  >
                    {store.name}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 w-40 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Export Button */}
          <Button variant="secondary" className="h-9 gap-2 border-0">
            <Download className="h-4 w-4" />
            <span className="text-sm">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
