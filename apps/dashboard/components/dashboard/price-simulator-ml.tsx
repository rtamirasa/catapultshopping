'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, DollarSign, Target, ShoppingCart, Lightbulb, Zap, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'

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

interface PriceSimulatorMLProps {
  product: Product
}

// Price elasticity constants
const PRICE_ELASTICITY = {
  winRate: 0.15,
  conversion: -0.08,
  demand: -0.12,
}

interface MLPrediction {
  trend: string
  confidence: number
  anomaly_score: number
  using_fallback?: boolean
}

function calculateMetrics(currentPrice: number, testPrice: number, product: Product, mlPrediction?: MLPrediction) {
  const priceChange = testPrice - currentPrice
  const priceChangePercent = (priceChange / currentPrice) * 100

  // Apply ML confidence to elasticity if available
  const mlConfidenceMultiplier = mlPrediction?.confidence || 0.85

  // Win Rate calculation
  const predictedWinRate = Math.min(95, Math.max(5,
    product.baseWinRate + (product.competitorPrice - testPrice) * PRICE_ELASTICITY.winRate * 100 * mlConfidenceMultiplier
  ))

  // Conversion Rate
  const conversionMultiplier = 1 + (priceChangePercent / 100) * PRICE_ELASTICITY.conversion
  const predictedConversion = Math.min(60, Math.max(10,
    product.baseConversion * conversionMultiplier
  ))

  // Traffic
  const trafficMultiplier = 1 + (priceChangePercent / 100) * PRICE_ELASTICITY.demand
  const predictedTraffic = Math.max(0, product.dailyTraffic * trafficMultiplier)

  // Revenue
  const currentRevenue = (product.baseConversion / 100) * currentPrice * product.dailyTraffic
  const predictedRevenue = (predictedConversion / 100) * testPrice * predictedTraffic

  // Lost Revenue
  const currentLossRate = (100 - product.baseWinRate) / 100
  const predictedLossRate = (100 - predictedWinRate) / 100
  const currentLostRevenue = currentLossRate * currentPrice * product.dailyTraffic * 0.3
  const predictedLostRevenue = predictedLossRate * testPrice * predictedTraffic * 0.3

  return {
    winRate: { current: product.baseWinRate, predicted: predictedWinRate, change: predictedWinRate - product.baseWinRate },
    conversion: { current: product.baseConversion, predicted: predictedConversion, change: predictedConversion - product.baseConversion },
    revenue: { current: currentRevenue, predicted: predictedRevenue, change: predictedRevenue - currentRevenue },
    lostRevenue: { current: currentLostRevenue, predicted: predictedLostRevenue, change: predictedLostRevenue - currentLostRevenue }
  }
}

// Friendly product name mapping
const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  'eggs_grade_a_large': 'Grade A Large Eggs',
  'milk_whole': 'Whole Milk',
  'cheese_cheddar': 'Cheddar Cheese',
  'chicken_breast': 'Chicken Breast',
  'ground_beef': 'Ground Beef',
  'bread_white': 'White Bread',
  'coffee': 'Ground Coffee',
  'butter': 'Butter',
  'bacon': 'Bacon',
  'bananas': 'Bananas',
  'apples_red_delicious': 'Red Delicious Apples',
  'orange_juice': 'Orange Juice',
  'potatoes': 'Potatoes',
  'rice_white': 'White Rice',
  'sugar': 'Sugar',
  'tomatoes': 'Tomatoes'
}

export function PriceSimulatorML({ product }: PriceSimulatorMLProps) {
  const minPrice = product.currentPrice * 0.7
  const maxPrice = product.currentPrice * 1.3
  const [testPrice, setTestPrice] = useState(product.currentPrice)
  const [mlPrediction, setMLPrediction] = useState<MLPrediction | null>(null)
  const [isLoadingML, setIsLoadingML] = useState(false)
  const [displayName, setDisplayName] = useState('')

  // Initialize displayName on client to avoid hydration mismatch
  useEffect(() => {
    setDisplayName(PRODUCT_DISPLAY_NAMES[product.name] || product.name)
  }, [product.name])

  // Fetch ML prediction when price changes
  useEffect(() => {
    const fetchMLPrediction = async () => {
      setIsLoadingML(true)
      try {
        const response = await fetch('/api/ml-predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: product.name, // Already in correct format
            days_ahead: 7
          })
        })
        const data = await response.json()
        setMLPrediction(data)
      } catch (error) {
        console.error('ML prediction error:', error)
        setMLPrediction({
          trend: 'stable',
          confidence: 0.85,
          anomaly_score: 0.0,
          using_fallback: true
        })
      } finally {
        setIsLoadingML(false)
      }
    }

    const debounceTimer = setTimeout(fetchMLPrediction, 500)
    return () => clearTimeout(debounceTimer)
  }, [testPrice, product.name])

  const metrics = useMemo(() =>
    calculateMetrics(product.currentPrice, testPrice, product, mlPrediction || undefined),
    [testPrice, product, mlPrediction]
  )

  // Generate chart data for price range
  const chartData = useMemo(() => {
    const data = []
    const step = (maxPrice - minPrice) / 20
    for (let price = minPrice; price <= maxPrice; price += step) {
      const m = calculateMetrics(product.currentPrice, price, product, mlPrediction || undefined)
      data.push({
        price: parseFloat(price.toFixed(2)),
        winRate: parseFloat(m.winRate.predicted.toFixed(1)),
        conversion: parseFloat(m.conversion.predicted.toFixed(1)),
        revenue: parseFloat(m.revenue.predicted.toFixed(0))
      })
    }
    return data
  }, [minPrice, maxPrice, product, mlPrediction])

  // Intelligent price optimization: Balances win rate, revenue, and ML predictions
  const optimalPrice = useMemo(() => {
    if (chartData.length === 0) return null

    const maxRevenue = Math.max(...chartData.map(p => p.revenue))
    const maxWinRate = Math.max(...chartData.map(p => p.winRate))

    // Multi-objective optimization with ML-informed weights
    const calculateScore = (point: typeof chartData[0]) => {
      // Normalize to 0-1 scale
      const normalizedRevenue = point.revenue / maxRevenue
      const normalizedWinRate = point.winRate / maxWinRate

      // Base weights: Prioritize revenue significantly over win rate
      let revenueWeight = 0.338
      let winRateWeight = 0.30

      // ML-informed adjustment
      if (mlPrediction && !mlPrediction.using_fallback) {
        const confidence = mlPrediction.confidence

        // If prices are trending up, balance slightly more toward win rate (but still favor revenue)
        if (mlPrediction.trend === 'increasing') {
          revenueWeight = 0.60 * confidence
          winRateWeight = 0.40 * confidence
        }
        // If prices are trending down, heavily prioritize revenue to protect margins
        else if (mlPrediction.trend === 'decreasing') {
          revenueWeight = 0.75 * confidence
          winRateWeight = 0.25 * confidence
        }

        // Penalize anomalous prices
        const anomalyPenalty = (mlPrediction.anomaly_score || 0) > 0.3 ? 0.9 : 1.0

        return (normalizedRevenue * revenueWeight + normalizedWinRate * winRateWeight) * anomalyPenalty
      }

      return normalizedRevenue * revenueWeight + normalizedWinRate * winRateWeight
    }

    // Find optimal point
    let bestScore = -Infinity
    let optimal = chartData[0].price
    let optimalRevenue = 0

    chartData.forEach(point => {
      const score = calculateScore(point)
      if (score > bestScore) {
        bestScore = score
        optimal = point.price
        optimalRevenue = point.revenue
      }
    })

    const optimalMetrics = calculateMetrics(product.currentPrice, optimal, product, mlPrediction || undefined)

    // Generate smart recommendation
    const revenueChange = optimalMetrics.revenue.predicted - optimalMetrics.revenue.current
    const winRateChange = optimalMetrics.winRate.predicted - optimalMetrics.winRate.current

    let recommendation = `Optimal: $${optimal.toFixed(2)} `

    if (revenueChange > 0 && winRateChange > 0) {
      recommendation += `→ +$${revenueChange.toFixed(0)}/day revenue & +${winRateChange.toFixed(1)}% win rate`
    } else if (revenueChange > 0) {
      recommendation += `→ +$${revenueChange.toFixed(0)}/day revenue (${winRateChange > 0 ? '+' : ''}${winRateChange.toFixed(1)}% win rate)`
    } else {
      recommendation += `→ Current price is near-optimal`
    }

    if (mlPrediction && !mlPrediction.using_fallback) {
      recommendation += ` | ML Trend: ${mlPrediction.trend}`
    }

    return {
      price: optimal,
      revenue: optimalRevenue,
      metrics: optimalMetrics,
      score: bestScore,
      recommendation
    }
  }, [chartData, product, mlPrediction])

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
    <div className="space-y-6">
      {/* Header with ML Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">ML-Powered Price Simulator</h3>
              {mlPrediction && !mlPrediction.using_fallback && (
                <Badge variant="default" className="gap-1">
                  <Zap className="h-3 w-3" />
                  TinyTimeMixer Active
                </Badge>
              )}
              {mlPrediction?.using_fallback && (
                <Badge variant="secondary" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Fallback Mode
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Adjust price to see AI-predicted impact on competitive performance
            </p>
            {mlPrediction?.using_fallback && (
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ ML model unavailable - Using statistical fallback. Start the ML API with:
                <code className="block mt-1 bg-black/50 p-2 rounded text-white font-mono text-[10px]">
                  cd /training && python inference/api.py
                </code>
              </div>
            )}
          </div>

          {mlPrediction && !mlPrediction.using_fallback && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ML Confidence</p>
                <p className="text-lg font-semibold text-foreground">
                  {(mlPrediction.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Anomaly Score</p>
                <p className={cn(
                  "text-lg font-semibold",
                  (mlPrediction.anomaly_score || 0) > 0.5 ? "text-destructive" : "text-success"
                )}>
                  {((mlPrediction.anomaly_score || 0) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Trend</p>
                <Badge variant={
                  mlPrediction.trend === 'increasing' ? 'default' :
                  mlPrediction.trend === 'decreasing' ? 'destructive' : 'secondary'
                }>
                  {mlPrediction.trend}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Product Info & Slider */}
        <div className="mb-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">{displayName}</h4>
              <p className="text-sm text-muted-foreground">
                Competitor avg: ${product.competitorPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold text-foreground">${product.currentPrice.toFixed(2)}</p>
            </div>
          </div>

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

            {/* Optimal Price Display */}
            {optimalPrice && (
              <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">ML-Optimized Price</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-success">${optimalPrice.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Max revenue: ${optimalPrice.revenue.toFixed(0)}/day
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-success/20 text-success hover:bg-success/10"
                  onClick={() => setTestPrice(optimalPrice.price)}
                >
                  Jump to Optimal Price
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* AI Price Optimization Recommendation */}
      
      </Card>

      {/* Interactive Charts */}
      <Card className="p-6">
        <div className="mb-4">
          <h4 className="font-semibold text-foreground mb-1">Price Elasticity Curves</h4>
          <p className="text-sm text-muted-foreground">
            How key metrics change across price range
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Rate Chart */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Win Rate vs Price</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 250)" />
                <XAxis
                  dataKey="price"
                  tickFormatter={(v) => `$${v.toFixed(2)}`}
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.005 250)',
                    border: '1px solid oklch(0.22 0.005 250)',
                    borderRadius: '8px'
                  }}
                />
                <ReferenceLine x={testPrice} stroke="oklch(0.65 0.19 250)" strokeDasharray="3 3" label={{ value: "Current", fontSize: 10 }} />
                {optimalPrice && (
                  <ReferenceLine
                    x={optimalPrice.price}
                    stroke="oklch(0.65 0.18 155)"
                    strokeDasharray="5 5"
                    label={{ value: "Optimal", fill: "oklch(0.65 0.18 155)", fontSize: 10 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="oklch(0.65 0.18 155)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Revenue vs Price</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 250)" />
                <XAxis
                  dataKey="price"
                  tickFormatter={(v) => `$${v.toFixed(2)}`}
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.005 250)',
                    border: '1px solid oklch(0.22 0.005 250)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <ReferenceLine x={testPrice} stroke="oklch(0.65 0.19 250)" strokeDasharray="3 3" label={{ value: "Current", fontSize: 10 }} />
                {optimalPrice && (
                  <ReferenceLine
                    x={optimalPrice.price}
                    stroke="oklch(0.65 0.18 155)"
                    strokeDasharray="5 5"
                    label={{ value: "Optimal", fill: "oklch(0.65 0.18 155)", fontSize: 10 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.65 0.19 250)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  )
}
