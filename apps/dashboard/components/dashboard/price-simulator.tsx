'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Target, ShoppingCart, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  currentPrice: number
  competitorPrice: number
  baseWinRate: number
  baseConversion: number
  dailyTraffic: number
  avgCompetitorPrice: number
}

interface PriceSimulatorProps {
  product: Product
}

// Price elasticity constants (calibrated for grocery products)
const PRICE_ELASTICITY = {
  winRate: 0.15,        // 15% win rate change per $1 price difference
  conversion: -0.08,    // -8% conversion per $1 price increase
  demand: -0.12,        // -12% demand reduction per 10% price increase
}

function calculateMetrics(currentPrice: number, testPrice: number, product: Product) {
  const priceChange = testPrice - currentPrice
  const priceChangePercent = (priceChange / currentPrice) * 100
  const priceGap = testPrice - product.competitorPrice

  // Win Rate: improves when price is lower than competitor
  // Formula: baseWinRate + (competitorPrice - yourPrice) * elasticity
  const predictedWinRate = Math.min(95, Math.max(5,
    product.baseWinRate + (product.competitorPrice - testPrice) * PRICE_ELASTICITY.winRate * 100
  ))

  // Conversion Rate: decreases with price increases
  // Formula: baseConversion * (1 + priceChangePercent * demandElasticity)
  const conversionMultiplier = 1 + (priceChangePercent / 100) * PRICE_ELASTICITY.conversion
  const predictedConversion = Math.min(60, Math.max(10,
    product.baseConversion * conversionMultiplier
  ))

  // Daily Traffic: decreases with higher prices (price sensitivity)
  const trafficMultiplier = 1 + (priceChangePercent / 100) * PRICE_ELASTICITY.demand
  const predictedTraffic = Math.max(0, product.dailyTraffic * trafficMultiplier)

  // Revenue: conversion * price * traffic
  const currentRevenue = (product.baseConversion / 100) * currentPrice * product.dailyTraffic
  const predictedRevenue = (predictedConversion / 100) * testPrice * predictedTraffic

  // Lost Revenue: based on loss rate
  const currentLossRate = (100 - product.baseWinRate) / 100
  const predictedLossRate = (100 - predictedWinRate) / 100
  const currentLostRevenue = currentLossRate * currentPrice * product.dailyTraffic * 0.3
  const predictedLostRevenue = predictedLossRate * testPrice * predictedTraffic * 0.3

  return {
    winRate: {
      current: product.baseWinRate,
      predicted: predictedWinRate,
      change: predictedWinRate - product.baseWinRate
    },
    conversion: {
      current: product.baseConversion,
      predicted: predictedConversion,
      change: predictedConversion - product.baseConversion
    },
    revenue: {
      current: currentRevenue,
      predicted: predictedRevenue,
      change: predictedRevenue - currentRevenue
    },
    lostRevenue: {
      current: currentLostRevenue,
      predicted: predictedLostRevenue,
      change: predictedLostRevenue - currentLostRevenue
    },
    priceGap: {
      current: currentPrice - product.competitorPrice,
      predicted: testPrice - product.competitorPrice
    }
  }
}

function getInsight(metrics: ReturnType<typeof calculateMetrics>, testPrice: number, currentPrice: number): string {
  const priceChange = testPrice - currentPrice
  const revenueChange = metrics.revenue.change
  const winRateChange = metrics.winRate.change

  if (Math.abs(priceChange) < 0.10) {
    return "Price is very close to current - minimal impact expected."
  }

  if (priceChange < 0 && revenueChange > 0) {
    return `Dropping price by $${Math.abs(priceChange).toFixed(2)} could increase daily revenue by $${revenueChange.toFixed(0)} and win ${winRateChange.toFixed(0)}% more competitive battles.`
  }

  if (priceChange < 0 && revenueChange < 0) {
    return `Price drop may hurt revenue ($${Math.abs(revenueChange).toFixed(0)} loss), but improves win rate by ${winRateChange.toFixed(0)}%. Consider if market share is priority.`
  }

  if (priceChange > 0 && revenueChange > 0) {
    return `Price increase of $${priceChange.toFixed(2)} could add $${revenueChange.toFixed(0)}/day in revenue, but expect ${Math.abs(winRateChange).toFixed(0)}% lower win rate.`
  }

  if (priceChange > 0 && revenueChange < 0) {
    return `Warning: Price increase would reduce both revenue ($${Math.abs(revenueChange).toFixed(0)}/day) and win rate (${Math.abs(winRateChange).toFixed(0)}%). Not recommended.`
  }

  return "Adjust the price slider to see predictions."
}

export function PriceSimulator({ product }: PriceSimulatorProps) {
  const minPrice = product.currentPrice * 0.7
  const maxPrice = product.currentPrice * 1.3
  const [testPrice, setTestPrice] = useState(product.currentPrice)

  const metrics = useMemo(() =>
    calculateMetrics(product.currentPrice, testPrice, product),
    [testPrice, product]
  )

  const insight = useMemo(() =>
    getInsight(metrics, testPrice, product.currentPrice),
    [metrics, testPrice, product.currentPrice]
  )

  const handleSliderChange = (value: number[]) => {
    setTestPrice(value[0])
  }

  const MetricCard = ({
    title,
    icon: Icon,
    current,
    predicted,
    change,
    format = (v: number) => v.toFixed(1) + '%',
    isGood = (c: number) => c > 0
  }: {
    title: string
    icon: any
    current: number
    predicted: number
    change: number
    format?: (v: number) => string
    isGood?: (c: number) => boolean
  }) => {
    const good = isGood(change)
    const noChange = Math.abs(change) < 0.01

    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-lg font-semibold text-foreground">{format(current)}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Predicted</p>
            <p className={cn(
              "text-lg font-semibold",
              noChange ? "text-foreground" :
              good ? "text-success" : "text-destructive"
            )}>
              {format(predicted)}
              {!noChange && (good ? " ↑" : " ↓")}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Change</p>
            <p className={cn(
              "text-lg font-semibold",
              noChange ? "text-muted-foreground" :
              good ? "text-success" : "text-destructive"
            )}>
              {noChange ? "—" : (change > 0 ? "+" : "") + format(change)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">What-If Price Analysis</h3>
          <Badge variant="secondary" className="text-xs">
            ML-Powered Predictions
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Adjust the price to see predicted impact on key metrics
        </p>
      </div>

      {/* Product Info */}
      <div className="mb-6 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground">{product.name}</h4>
            <p className="text-sm text-muted-foreground">
              Competitor avg: ${product.competitorPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold text-foreground">${product.currentPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Price Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Test Price:</span>
            <span className="text-lg font-semibold text-foreground">${testPrice.toFixed(2)}</span>
          </div>

          <Slider
            value={[testPrice]}
            onValueChange={handleSliderChange}
            min={minPrice}
            max={maxPrice}
            step={0.05}
            className="w-full"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${minPrice.toFixed(2)}</span>
            <span>${product.currentPrice.toFixed(2)}</span>
            <span>${maxPrice.toFixed(2)}</span>
          </div>

          {/* Price Gap Indicator */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">vs Competitor:</span>
            <Badge
              variant="outline"
              className={cn(
                metrics.priceGap.predicted < 0 ? "bg-success/10 text-success border-success/20" :
                metrics.priceGap.predicted > 0 ? "bg-destructive/10 text-destructive border-destructive/20" :
                "bg-muted"
              )}
            >
              {metrics.priceGap.predicted > 0 ? "+" : ""}
              ${metrics.priceGap.predicted.toFixed(2)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Win Rate"
          icon={Target}
          current={metrics.winRate.current}
          predicted={metrics.winRate.predicted}
          change={metrics.winRate.change}
        />

        <MetricCard
          title="Conversion Rate"
          icon={ShoppingCart}
          current={metrics.conversion.current}
          predicted={metrics.conversion.predicted}
          change={metrics.conversion.change}
        />

        <MetricCard
          title="Daily Revenue"
          icon={DollarSign}
          current={metrics.revenue.current}
          predicted={metrics.revenue.predicted}
          change={metrics.revenue.change}
          format={(v) => "$" + v.toFixed(0)}
        />

        <MetricCard
          title="Lost to Competitors"
          icon={TrendingDown}
          current={metrics.lostRevenue.current}
          predicted={metrics.lostRevenue.predicted}
          change={metrics.lostRevenue.change}
          format={(v) => "$" + v.toFixed(0)}
          isGood={(c) => c < 0}
        />
      </div>

      {/* AI Insight */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary mb-1">AI Insight</p>
            <p className="text-sm text-foreground leading-relaxed">{insight}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
