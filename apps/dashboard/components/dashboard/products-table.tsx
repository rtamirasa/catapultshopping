"use client";

import { products, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, ExternalLink, Target } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProductsTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Scans</TableHead>
            <TableHead className="text-right">Purchases</TableHead>
            <TableHead className="text-right">Conversion</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">vs Competitor</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const winRate = (
    (product.winsVsCompetitor / (product.winsVsCompetitor + product.lossesToCompetitor)) * 100
  ).toFixed(1);

  const isWinning = parseFloat(winRate) > 50;
  const isConverting = product.conversionRate > 35;

  return (
    <TableRow className="group cursor-pointer">
      <TableCell>
        <Link href={`/products/${product.id}`} className="block">
          <div className="flex flex-col">
            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </span>
            <span className="text-xs text-muted-foreground">{product.sku}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {product.category}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <span className="font-medium">{product.scansToday.toLocaleString()}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Products scanned (intent signals)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <span className="font-medium text-success">{product.purchasesToday.toLocaleString()}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Confirmed purchases from receipts</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <div className="flex items-center gap-1.5">
                  <Target className={cn(
                    "h-3.5 w-3.5",
                    isConverting ? "text-success" : "text-warning"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isConverting ? "text-success" : "text-warning"
                  )}>
                    {product.conversionRate}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Scan to purchase rate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isWinning ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={cn(
            "font-medium",
            isWinning ? "text-success" : "text-destructive"
          )}>
            {winRate}%
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {product.winsVsCompetitor}W / {product.lossesToCompetitor}L
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        ${product.avgPrice.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <span
          className={cn(
            "font-medium",
            product.competitorDelta < 0 ? "text-success" : "text-destructive"
          )}
        >
          {product.competitorDelta > 0 ? "+" : ""}
          ${product.competitorDelta.toFixed(2)}
        </span>
      </TableCell>
      <TableCell>
        <Link
          href={`/products/${product.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Link>
      </TableCell>
    </TableRow>
  );
}
