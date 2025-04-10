"use client"

import { useState, useEffect, useRef } from "react"

export type CoinData = {
  symbol: string
  priceChange: number
  priceChangePercent: number
  lastPrice: number
  volume: number
  quoteVolume: number
  openTime: number
  closeTime: number
  highPrice: number
  lowPrice: number
  baseAsset: string
  quoteAsset: string
}

export type CryptoStatus = 0 | 1 | 2 | -1 // 0: closed, 1: open, 2: active, -1: error
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y"

export function useCryptoData(asset = "BTC") {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [status, setStatus] = useState<CryptoStatus>(0)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const cacheRef = useRef<Record<string, CoinData>>({})
  const lastUpdateRef = useRef<number>(0)
  const pendingUpdateRef = useRef<CoinData[] | null>(null)
  const chartDataCacheRef = useRef<Record<string, Record<TimeRange, number[]>>>({})
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Parse symbol into base and quote assets (e.g., "ETHBTC" -> { base: "ETH", quote: "BTC" })
  const parseSymbol = (symbol: string) => {
    const quoteAssets = [
      "BTC",
      "ETH",
      "BNB",
      "USDT",
      "USD",
      "BUSD",
      "TUSD",
      "USDC",
      "PAX",
      "BIDR",
      "DAI",
      "IDRT",
      "UAH",
      "NGN",
      "RUB",
      "TRY",
      "EUR",
      "GBP",
      "ZAR",
    ]

    // Sort by length descending to match longer quote assets first
    const sortedQuotes = [...quoteAssets].sort((a, b) => b.length - a.length)

    for (const quote of sortedQuotes) {
      if (symbol.endsWith(quote)) {
        const base = symbol.substring(0, symbol.length - quote.length)
        return { baseAsset: base, quoteAsset: quote }
      }
    }

    // Default fallback
    return { baseAsset: symbol.substring(0, 3), quoteAsset: symbol.substring(3) }
  }

  // Throttled update function to prevent too frequent UI updates
  const throttledUpdate = () => {
    const now = Date.now()
    const updateInterval = 1000 // Update at most once per second

    if (pendingUpdateRef.current && now - lastUpdateRef.current >= updateInterval) {
      setCoins(pendingUpdateRef.current)
      lastUpdateRef.current = now
      pendingUpdateRef.current = null
    }
  }

  // Initial data load using REST API
  const fetchInitialData = async () => {
    try {
      setStatus(1) // open (connecting)
      setError(null)

      // Use the 24hr ticker price change statistics endpoint
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr")

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        // Process each ticker
        const updatedCoins: CoinData[] = []

        data.forEach((ticker) => {
          const { baseAsset, quoteAsset } = parseSymbol(ticker.symbol)

          // Only process if it matches the selected asset as quote
          if (quoteAsset === asset) {
            const coinData: CoinData = {
              symbol: ticker.symbol,
              priceChange: Number.parseFloat(ticker.priceChange),
              priceChangePercent: Number.parseFloat(ticker.priceChangePercent),
              lastPrice: Number.parseFloat(ticker.lastPrice),
              volume: Number.parseFloat(ticker.volume),
              quoteVolume: Number.parseFloat(ticker.quoteVolume),
              openTime: ticker.openTime,
              closeTime: ticker.closeTime,
              highPrice: Number.parseFloat(ticker.highPrice),
              lowPrice: Number.parseFloat(ticker.lowPrice),
              baseAsset,
              quoteAsset,
            }

            // Update cache
            cacheRef.current[ticker.symbol] = coinData
            updatedCoins.push(coinData)
          }
        })

        // Sort by volume descending
        updatedCoins.sort((a, b) => b.quoteVolume - a.quoteVolume)

        // Update state
        setCoins(updatedCoins)
        lastUpdateRef.current = Date.now()

        // Now that we have initial data, connect to WebSocket
        connectWebSocket()
      }
    } catch (err) {
      console.error("Failed to fetch initial data:", err)
      setStatus(-1) // error
      setError(err instanceof Error ? err.message : "Failed to fetch data from Binance API")

      // Try to reconnect after 5 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      reconnectTimeoutRef.current = setTimeout(fetchInitialData, 5000)
    }
  }

  // Connect to WebSocket for real-time updates
  const connectWebSocket = () => {
    try {
      const endpoint = "wss://stream.binance.com:9443/ws/!ticker@arr"

      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close()
      }

      // Create new WebSocket connection
      const socket = new WebSocket(endpoint)
      socketRef.current = socket

      // Connection opened
      socket.addEventListener("open", () => {
        setStatus(1) // open
        setError(null)
        console.log("WebSocket connection established")
      })

      // Listen for messages
      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (Array.isArray(data)) {
            setStatus(2) // active

            // Process each ticker
            const updatedCoins: CoinData[] = []

            data.forEach((ticker) => {
              const { baseAsset, quoteAsset } = parseSymbol(ticker.s)

              // Only process if it matches the selected asset as quote
              if (quoteAsset === asset) {
                const coinData: CoinData = {
                  symbol: ticker.s,
                  priceChange: Number.parseFloat(ticker.p),
                  priceChangePercent: Number.parseFloat(ticker.P),
                  lastPrice: Number.parseFloat(ticker.c),
                  volume: Number.parseFloat(ticker.v),
                  quoteVolume: Number.parseFloat(ticker.q),
                  openTime: ticker.O,
                  closeTime: ticker.C,
                  highPrice: Number.parseFloat(ticker.h),
                  lowPrice: Number.parseFloat(ticker.l),
                  baseAsset,
                  quoteAsset,
                }

                // Update cache
                cacheRef.current[ticker.s] = coinData
                updatedCoins.push(coinData)
              }
            })

            // Sort by volume descending
            updatedCoins.sort((a, b) => b.quoteVolume - a.quoteVolume)

            // Store update for throttled application
            pendingUpdateRef.current = updatedCoins
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
        }
      })

      // Connection closed
      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed")
        setStatus(0) // closed

        // Try to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          // First try to fetch fresh data via API
          fetchInitialData()
        }, 5000)
      })

      // Connection error
      socket.addEventListener("error", (err) => {
        console.error("WebSocket error:", err)
        setStatus(-1) // error
        setError("Connection error. Retrying...")

        // Close socket
        socket.close()
      })
    } catch (err) {
      console.error("Failed to connect to WebSocket:", err)
      setStatus(-1) // error
      setError("Failed to connect to Binance WebSocket API")

      // Try to reconnect after 5 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      reconnectTimeoutRef.current = setTimeout(fetchInitialData, 5000)
    }
  }

  useEffect(() => {
    // Set up throttled update interval
    const updateIntervalId = setInterval(throttledUpdate, 200) // Check for updates every 200ms

    // Initial data load via REST API
    fetchInitialData()

    // Cleanup on unmount
    return () => {
      clearInterval(updateIntervalId)

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [asset])

  // Generate chart data based on time range
  const generateChartData = (coin: CoinData | undefined, symbol: string, timeRange: TimeRange = "1D") => {
    // Check if we already have chart data for this symbol and time range
    if (chartDataCacheRef.current[symbol]?.[timeRange] && coin) {
      const cachedData = chartDataCacheRef.current[symbol][timeRange]
      const lastCachedValue = cachedData[cachedData.length - 1]

      // Only regenerate if the price has changed significantly (more than 0.5%)
      if (Math.abs(lastCachedValue - coin.lastPrice) / coin.lastPrice < 0.005) {
        return cachedData
      }
    }

    if (!coin) return Array(25).fill(0)

    // Initialize cache for this symbol if it doesn't exist
    if (!chartDataCacheRef.current[symbol]) {
      chartDataCacheRef.current[symbol] = {} as Record<TimeRange, number[]>
    }

    const last = coin.lastPrice
    let high = coin.highPrice
    let low = coin.lowPrice
    let dataPoints = 25
    let volatility = 0.1 // Default volatility factor

    // Adjust parameters based on time range
    switch (timeRange) {
      case "1D":
        // Use 24h high/low from API
        high = coin.highPrice
        low = coin.lowPrice
        dataPoints = 24 // One point per hour
        volatility = 0.1
        break
      case "1W":
        // Increase range for weekly view
        high = last * 1.1
        low = last * 0.9
        dataPoints = 28 // 4 points per day for a week
        volatility = 0.15
        break
      case "1M":
        // Wider range for monthly view
        high = last * 1.2
        low = last * 0.8
        dataPoints = 30 // One point per day
        volatility = 0.2
        break
      case "3M":
        // Even wider range for 3 months
        high = last * 1.3
        low = last * 0.7
        dataPoints = 36 // 12 points per month
        volatility = 0.25
        break
      case "1Y":
        // Widest range for yearly view
        high = last * 1.5
        low = last * 0.5
        dataPoints = 52 // One point per week
        volatility = 0.3
        break
    }

    const range = high - low

    // Create realistic price data based on time range
    let chartData: number[] = []

    // Generate different patterns based on time range
    switch (timeRange) {
      case "1D": {
        // Daily pattern - start with opening price, end with current price
        const startPrice = last - coin.priceChange
        const step = coin.priceChange / (dataPoints - 1)

        // Create a base trend line from start to end
        chartData = Array(dataPoints)
          .fill(0)
          .map((_, i) => {
            // Add some randomness to make it look realistic
            const randomFactor = (Math.random() * 2 - 1) * range * volatility
            const basePrice = startPrice + step * i
            return Math.max(low, Math.min(high, basePrice + randomFactor))
          })

        // Ensure the last point is exactly the current price
        chartData[chartData.length - 1] = last
        break
      }

      case "1W": {
        // Weekly pattern with weekend dips

        chartData = Array(dataPoints)
          .fill(0)
          .map((_, i) => {
            const progress = i / (dataPoints - 1)
            // Create a slight upward trend
            const trend = low + range * (0.4 + progress * 0.3)

            // Add weekend effect (lower on weekends)
            const dayOfWeek = i % 7
            const weekendEffect = dayOfWeek === 0 || dayOfWeek === 6 ? -range * 0.1 : 0

            // Add randomness
            const randomFactor = (Math.random() * 2 - 1) * range * volatility

            return Math.max(low, Math.min(high, trend + weekendEffect + randomFactor))
          })

        // Ensure the last point is exactly the current price
        chartData[chartData.length - 1] = last
        break
      }

      case "1M": {
        // Monthly pattern with a trend and some volatility
        chartData = Array(dataPoints)
          .fill(0)
          .map((_, i) => {
            const progress = i / (dataPoints - 1)

            // Create a trend that rises and then has a correction
            let trend
            if (progress < 0.7) {
              // Rising trend for first 70%
              trend = low + range * (0.3 + progress * 0.5)
            } else {
              // Correction in last 30%
              trend = low + range * (0.65 - (progress - 0.7) * 0.2)
            }

            // Add randomness
            const randomFactor = (Math.random() * 2 - 1) * range * volatility

            return Math.max(low, Math.min(high, trend + randomFactor))
          })

        // Ensure the last point is exactly the current price
        chartData[chartData.length - 1] = last
        break
      }

      case "3M": {
        // Quarterly pattern with multiple cycles
        chartData = Array(dataPoints)
          .fill(0)
          .map((_, i) => {
            const progress = i / (dataPoints - 1)

            // Create a base trend
            const baseTrend = low + range * (0.3 + progress * 0.4)

            // Add cyclical pattern
            const cycle = Math.sin(progress * Math.PI * 2) * range * 0.2

            // Add randomness
            const randomFactor = (Math.random() * 2 - 1) * range * volatility

            return Math.max(low, Math.min(high, baseTrend + cycle + randomFactor))
          })

        // Ensure the last point is exactly the current price
        chartData[chartData.length - 1] = last
        break
      }

      case "1Y": {
        // Yearly pattern with seasonal trends
        chartData = Array(dataPoints)
          .fill(0)
          .map((_, i) => {
            const progress = i / (dataPoints - 1)

            // Create a long-term trend
            const longTermTrend = low + range * (0.2 + progress * 0.5)

            // Add seasonal pattern (4 seasons)
            const seasonal = Math.sin(progress * Math.PI * 2) * range * 0.15

            // Add randomness
            const randomFactor = (Math.random() * 2 - 1) * range * volatility

            return Math.max(low, Math.min(high, longTermTrend + seasonal + randomFactor))
          })

        // Ensure the last point is exactly the current price
        chartData[chartData.length - 1] = last
        break
      }
    }

    // Cache the generated chart data
    chartDataCacheRef.current[symbol][timeRange] = chartData
    return chartData
  }

  // Get data for a specific coin with time range
  const getCoinData = (symbol: string, timeRange: TimeRange = "1D") => {
    // First try to find in current coins array
    const coin = coins.find((c) => c.symbol === symbol)
    if (coin) return { coin, chartData: generateChartData(coin, symbol, timeRange) }

    // Then check cache
    const cachedCoin = cacheRef.current[symbol]
    if (cachedCoin) return { coin: cachedCoin, chartData: generateChartData(cachedCoin, symbol, timeRange) }

    // Return null if not found
    return { coin: null, chartData: generateChartData(undefined, symbol, timeRange) }
  }

  // Get date labels based on time range
  const getDateLabels = (timeRange: TimeRange = "1D") => {
    const labels: string[] = []

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    const formatMonth = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short" })
    }

    const formatHour = (date: Date) => {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true }).replace(/\s/g, "")
    }

    switch (timeRange) {
      case "1D": {
        // Show hours for 1D (oldest to newest)
        const now = new Date()
        for (let i = 24; i >= 0; i -= 6) {
          const date = new Date(now)
          date.setHours(now.getHours() - i)
          labels.push(formatHour(date))
        }
        break
      }
      case "1W": {
        // Show days for 1W (oldest to newest)
        for (let i = 6; i >= 0; i -= 2) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          labels.push(formatDate(date))
        }
        break
      }
      case "1M": {
        // Show weeks for 1M (oldest to newest)
        for (let i = 28; i >= 0; i -= 7) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          labels.push(formatDate(date))
        }
        break
      }
      case "3M": {
        // Show months for 3M (oldest to newest)
        for (let i = 3; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          labels.push(formatMonth(date))
        }
        break
      }
      case "1Y": {
        // Show quarters for 1Y (oldest to newest)
        for (let i = 12; i >= 0; i -= 3) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          labels.push(formatMonth(date))
        }
        break
      }
    }

    return labels
  }

  // Function to manually refresh data
  const refreshData = () => {
    // First try to fetch fresh data via API
    fetchInitialData()
  }

  return {
    coins,
    status,
    error,
    getCoinData,
    getDateLabels,
    refreshData,
  }
}
