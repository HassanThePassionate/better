/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"

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

export type ChartPoint = {
  price: number
  timestamp: number
}

export type CryptoStatus = 0 | 1 | 2 | -1 // 0: closed, 1: open, 2: active, -1: error
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y"

// API fallback sources
type ApiSource =
  | "coingecko"
  | "binance"
  | "bitstamp"
  | "bitfinex"
  | "kraken"
  | "kucoin"
  | "bybit"
  | "mexc"
  | "coinpaprika"
  | "fallback"

// Map symbols to different exchange formats
const EXCHANGE_SYMBOL_MAP_INITIAL: Record<string, Record<string, string>> = {
  binance: {
    BTCUSDT: "BTCUSDT",
    ETHUSDT: "ETHUSDT",
    BNBUSDT: "BNBUSDT",
    SOLUSDT: "SOLUSDT",
    XRPUSDT: "XRPUSDT",
    ADAUSDT: "ADAUSDT",
    DOGEUSDT: "DOGEUSDT",
    DOTUSDT: "DOTUSDT",
    MATICUSDT: "MATICUSDT",
    LTCUSDT: "LTCUSDT",
    SHIBUSDT: "SHIBUSDT", // Add SHIB mapping
    TRUMPUSDT: "TRUMPUSDT",
    // Add more mappings as needed
  },
  bitstamp: {
    BTCUSDT: "btcusd",
    ETHUSDT: "ethusd",
    XRPUSDT: "xrpusd",
    LTCUSDT: "ltcusd",
    // Add more mappings as needed
  },
  bitfinex: {
    BTCUSDT: "tBTCUSD",
    ETHUSDT: "tETHUSD",
    XRPUSDT: "tXRPUSD",
    LTCUSDT: "tLTCUSD",
    // Add more mappings as needed
  },
  kraken: {
    BTCUSDT: "XBTUSD",
    ETHUSDT: "ETHUSD",
    XRPUSDT: "XRPUSD",
    ADAUSDT: "ADAUSD",
    DOTUSDT: "DOTUSD",
    LTCUSDT: "LTCUSD",
    // Add more mappings as needed
  },
  kucoin: {
    BTCUSDT: "BTC-USDT",
    ETHUSDT: "ETH-USDT",
    BNBUSDT: "BNB-USDT",
    SOLUSDT: "SOL-USDT",
    XRPUSDT: "XRP-USDT",
    ADAUSDT: "ADA-USDT",
    DOGEUSDT: "DOGE-USDT",
    DOTUSDT: "DOT-USDT",
    MATICUSDT: "MATIC-USDT",
    LTCUSDT: "LTC-USDT",
    SHIBUSDT: "SHIB-USDT", // Add SHIB mapping
    TRUMPUSDT: "TRUMP-USDT",
    // Add more mappings as needed
  },
  bybit: {
    BTCUSDT: "BTCUSDT",
    ETHUSDT: "ETHUSDT",
    BNBUSDT: "BNBUSDT",
    SOLUSDT: "SOLUSDT",
    XRPUSDT: "XRPUSDT",
    ADAUSDT: "ADAUSDT",
    DOGEUSDT: "DOGEUSDT",
    DOTUSDT: "DOTUSDT",
    MATICUSDT: "MATICUSDT",
    LTCUSDT: "LTCUSDT",
    SHIBUSDT: "SHIBUSDT", // Add SHIB mapping
    TRUMPUSDT: "TRUMPUSDT",
    // Add more mappings as needed
  },
  mexc: {
    BTCUSDT: "BTCUSDT",
    ETHUSDT: "ETHUSDT",
    BNBUSDT: "BNBUSDT",
    SOLUSDT: "SOLUSDT",
    XRPUSDT: "XRPUSDT",
    ADAUSDT: "ADAUSDT",
    DOGEUSDT: "DOGEUSDT",
    DOTUSDT: "DOTUSDT",
    MATICUSDT: "MATICUSDT",
    LTCUSDT: "LTCUSDT",
    SHIBUSDT: "SHIBUSDT", // Add SHIB mapping
    TRUMPUSDT: "TRUMPUSDT",
    // Add more mappings as needed
  },
}

// API endpoints for different time ranges
const API_ENDPOINTS: Record<string, Record<TimeRange, string>> = {
  binance: {
    "1D": "https://api.binance.com/api/v3/klines?symbol={symbol}&interval=15m&limit=96",
    "1W": "https://api.binance.com/api/v3/klines?symbol={symbol}&interval=4h&limit=42",
    "1M": "https://api.binance.com/api/v3/klines?symbol={symbol}&interval=1d&limit=30",
    "3M": "https://api.binance.com/api/v3/klines?symbol={symbol}&interval=3d&limit=30",
    "1Y": "https://api.binance.com/api/v3/klines?symbol={symbol}&interval=1w&limit=52",
  },
  bitstamp: {
    "1D": "https://www.bitstamp.net/api/v2/ohlc/{symbol}/?step=900&limit=96",
    "1W": "https://www.bitstamp.net/api/v2/ohlc/{symbol}/?step=3600&limit=168",
    "1M": "https://www.bitstamp.net/api/v2/ohlc/{symbol}/?step=86400&limit=30",
    "3M": "https://www.bitstamp.net/api/v2/ohlc/{symbol}/?step=86400&limit=90",
    "1Y": "https://www.bitstamp.net/api/v2/ohlc/{symbol}/?step=86400&limit=365",
  },
  bitfinex: {
    "1D": "https://api-pub.bitfinex.com/v2/candles/trade:15m:{symbol}/hist?limit=96",
    "1W": "https://api-pub.bitfinex.com/v2/candles/trade:4h:{symbol}/hist?limit=42",
    "1M": "https://api-pub.bitfinex.com/v2/candles/trade:1D:{symbol}/hist?limit=30",
    "3M": "https://api-pub.bitfinex.com/v2/candles/trade:1D:{symbol}/hist?limit=90",
    "1Y": "https://api-pub.bitfinex.com/v2/candles/trade:1W:{symbol}/hist?limit=52",
  },
  kraken: {
    "1D": "https://api.kraken.com/0/public/OHLC?pair={symbol}&interval=15",
    "1W": "https://api.kraken.com/0/public/OHLC?pair={symbol}&interval=240",
    "1M": "https://api.kraken.com/0/public/OHLC?pair={symbol}&interval=1440&limit=30",
    "3M": "https://api.kraken.com/0/public/OHLC?pair={symbol}&interval=1440&limit=90",
    "1Y": "https://api.kraken.com/0/public/OHLC?pair={symbol}&interval=10080&limit=52",
  },
  kucoin: {
    "1D": "https://api.kucoin.com/api/v1/market/candles?type=15min&symbol={symbol}&limit=96",
    "1W": "https://api.kucoin.com/api/v1/market/candles?type=4hour&symbol={symbol}&limit=42",
    "1M": "https://api.kucoin.com/api/v1/market/candles?type=1day&symbol={symbol}&limit=30",
    "3M": "https://api.kucoin.com/api/v1/market/candles?type=1day&symbol={symbol}&limit=90",
    "1Y": "https://api.kucoin.com/api/v1/market/candles?type=1week&symbol={symbol}&limit=52",
  },
  bybit: {
    "1D": "https://api.bybit.com/v5/market/kline?category=spot&symbol={symbol}&interval=15&limit=96",
    "1W": "https://api.bybit.com/v5/market/kline?category=spot&symbol={symbol}&interval=240&limit=42",
    "1M": "https://api.bybit.com/v5/market/kline?category=spot&symbol={symbol}&interval=D&limit=30",
    "3M": "https://api.bybit.com/v5/market/kline?category=spot&symbol={symbol}&interval=D&limit=90",
    "1Y": "https://api.bybit.com/v5/market/kline?category=spot&symbol={symbol}&interval=W&limit=52",
  },
  mexc: {
    "1D": "https://api.mexc.com/api/v3/klines?symbol={symbol}&interval=15m&limit=96",
    "1W": "https://api.mexc.com/api/v3/klines?symbol={symbol}&interval=4h&limit=42",
    "1M": "https://api.mexc.com/api/v3/klines?symbol={symbol}&interval=1d&limit=30",
    "3M": "https://api.mexc.com/api/v3/klines?symbol={symbol}&interval=1d&limit=90",
    "1Y": "https://api.mexc.com/api/v3/klines?symbol={symbol}&interval=1w&limit=52",
  },
  coinpaprika: {
    "1D": "https://api.coinpaprika.com/v1/tickers/{coinId}/historical?start={startDate}&interval=15m",
    "1W": "https://api.coinpaprika.com/v1/tickers/{coinId}/historical?start={startDate}&interval=4h",
    "1M": "https://api.coinpaprika.com/v1/tickers/{coinId}/historical?start={startDate}&interval=1d",
    "3M": "https://api.coinpaprika.com/v1/tickers/{coinId}/historical?start={startDate}&interval=1d",
    "1Y": "https://api.coinpaprika.com/v1/tickers/{coinId}/historical?start={startDate}&interval=1d",
  },
}

// Rate limit tracking for each API
const API_RATE_LIMITS: Record<string, { limited: boolean; resetTime: number }> = {
  coingecko: { limited: false, resetTime: 0 },
  binance: { limited: false, resetTime: 0 },
  bitstamp: { limited: false, resetTime: 0 },
  bitfinex: { limited: false, resetTime: 0 },
  kraken: { limited: false, resetTime: 0 },
  kucoin: { limited: false, resetTime: 0 },
  bybit: { limited: false, resetTime: 0 },
  mexc: { limited: false, resetTime: 0 },
  coinpaprika: { limited: false, resetTime: 0 },
}

// Rate limit reset times in milliseconds
const RATE_LIMIT_RESET_TIMES: Record<string, number> = {
  coingecko: 60000, // 1 minute
  binance: 60000, // 1 minute
  bitstamp: 30000, // 30 seconds
  bitfinex: 60000, // 1 minute
  kraken: 30000, // 30 seconds
  kucoin: 30000, // 30 seconds
  bybit: 60000, // 1 minute
  mexc: 60000, // 1 minute
  coinpaprika: 60000, // 1 minute
}

// CoinGecko API endpoints
// Replace the static COIN_IDS mapping with a dynamic approach
// Keep a minimal set of known mappings for popular coins as fallback
const BASE_COIN_IDS: Record<string, string> = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  BNBUSDT: "binancecoin",
  SOLUSDT: "solana",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  DOGEUSDT: "dogecoin",
  DOTUSDT: "polkadot",
  MATICUSDT: "matic-network",
  LTCUSDT: "litecoin",
  SHIBUSDT: "shiba-inu",
  AVAXUSDT: "avalanche-2",
  UNIUSDT: "uniswap",
  LINKUSDT: "chainlink",
  ATOMUSDT: "cosmos",
  ETCUSDT: "ethereum-classic",
  ALGOUSDT: "algorand",
  ICPUSDT: "internet-computer",
  FILUSDT: "filecoin",
  VETUSDT: "vechain",
  XTZUSDT: "tezos",
}

// Dynamic coin mappings that will be populated from WebSocket data
const dynamicCoinIds: Record<string, string> = { ...BASE_COIN_IDS }
const dynamicExchangeSymbols: Record<string, Record<string, string>> = {
  binance: {},
  bitstamp: {},
  bitfinex: {},
  kraken: {},
  kucoin: {},
  bybit: {},
  mexc: {},
}

// Function to generate CoinGecko ID from base asset (best-effort approach)
const generateCoinGeckoId = (baseAsset: string): string => {
  // Convert to lowercase
  const base = baseAsset.toLowerCase()

  // Special cases for coins with different naming conventions
  const specialCases: Record<string, string> = {
    btc: "bitcoin",
    eth: "ethereum",
    bnb: "binancecoin",
    sol: "solana",
    xrp: "ripple",
    ada: "cardano",
    doge: "dogecoin",
    dot: "polkadot",
    matic: "matic-network",
    ltc: "litecoin",
    shib: "shiba-inu",
    avax: "avalanche-2",
    uni: "uniswap",
    link: "chainlink",
    atom: "cosmos",
    etc: "ethereum-classic",
    algo: "algorand",
    icp: "internet-computer",
    fil: "filecoin",
    vet: "vechain",
    xtz: "tezos",
  }

  // Check if we have a special case mapping
  if (specialCases[base]) {
    return specialCases[base]
  }

  // For most coins, the ID is just the lowercase name
  return base
}

// Function to generate Coinpaprika ID from base asset (best-effort approach)
// const generateCoinpaprikaId = (baseAsset: string): string => {
//   // Convert to lowercase
//   const base = baseAsset.toLowerCase()

//   // Special cases
//   const specialCases: Record<string, string> = {
//     btc: "btc-bitcoin",
//     eth: "eth-ethereum",
//     bnb: "bnb-binance-coin",
//     sol: "sol-solana",
//     xrp: "xrp-xrp",
//     ada: "ada-cardano",
//     doge: "doge-dogecoin",
//     dot: "dot-polkadot",
//     matic: "matic-polygon",
//     ltc: "ltc-litecoin",
//     shib: "shib-shiba-inu",
//   }

//   if (specialCases[base]) {
//     return specialCases[base]
//   }

//   // For most coins, the ID follows the pattern: lowercase-symbol-lowercase-name
//   return `${base}-${base}`
// }

// Function to update exchange mappings based on a new coin
const updateExchangeMappings = (symbol: string, baseAsset: string, quoteAsset: string) => {
  // Skip if we already have this symbol
  if (dynamicCoinIds[symbol]) return

  // Generate CoinGecko ID
  dynamicCoinIds[symbol] = generateCoinGeckoId(baseAsset)

  // Update exchange mappings
  dynamicExchangeSymbols.binance[symbol] = symbol
  dynamicExchangeSymbols.bybit[symbol] = symbol
  dynamicExchangeSymbols.mexc[symbol] = symbol

  // KuCoin uses a different format with hyphens
  dynamicExchangeSymbols.kucoin[symbol] = `${baseAsset}-${quoteAsset}`

  // Bitstamp, Bitfinex, and Kraken have more specific formats
  // Only add for major coins as these exchanges have fewer pairs
  if (["BTC", "ETH", "XRP", "LTC", "BCH", "ADA", "DOT", "LINK", "MATIC", "SOL", "DOGE", "SHIB"].includes(baseAsset)) {
    dynamicExchangeSymbols.bitstamp[symbol] = `${baseAsset.toLowerCase()}${quoteAsset.toLowerCase()}`
    dynamicExchangeSymbols.bitfinex[symbol] = `t${baseAsset}${quoteAsset}`

    // Kraken has special cases
    if (baseAsset === "BTC") {
      dynamicExchangeSymbols.kraken[symbol] = `XBT${quoteAsset}`
    } else {
      dynamicExchangeSymbols.kraken[symbol] = `${baseAsset}${quoteAsset}`
    }
  }
}

// Let's also check the initialization of the EXCHANGE_SYMBOL_MAP to ensure it's properly populated

// Replace the static EXCHANGE_SYMBOL_MAP with our dynamic version
// We'll keep the structure but populate it from WebSocket data
const EXCHANGE_SYMBOL_MAP = { ...EXCHANGE_SYMBOL_MAP_INITIAL, ...dynamicExchangeSymbols }

// Make sure we're initializing the dynamic mappings with the initial values
Object.keys(EXCHANGE_SYMBOL_MAP_INITIAL).forEach((exchange) => {
  if (!dynamicExchangeSymbols[exchange as keyof typeof dynamicExchangeSymbols]) {
    dynamicExchangeSymbols[exchange as keyof typeof dynamicExchangeSymbols] = {}
  }

  Object.entries(EXCHANGE_SYMBOL_MAP_INITIAL[exchange]).forEach(([symbol, value]) => {
    dynamicExchangeSymbols[exchange as keyof typeof dynamicExchangeSymbols][symbol] = value
  })
})

// Add a function to debug the exchange mappings
const debugExchangeMappings = (symbol: string) => {
  console.log(`Exchange mappings for ${symbol}:`)
  Object.keys(EXCHANGE_SYMBOL_MAP).forEach((exchange) => {
    console.log(`  ${exchange}: ${EXCHANGE_SYMBOL_MAP[exchange]?.[symbol] || "Not mapped"}`)
  })
}

// Replace the static COIN_IDS reference with our dynamic version
const COIN_IDS = dynamicCoinIds

const QUOTE_ASSETS = [
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
].sort((a, b) => b.length - a.length) // Sort by length descending to match longer quote assets first

const COINPAPRIKA_IDS: Record<string, string> = {
  BTCUSDT: "btc-bitcoin",
  ETHUSDT: "eth-ethereum",
  BNBUSDT: "bnb-binance-coin",
  SOLUSDT: "sol-solana",
  XRPUSDT: "xrp-xrp",
  ADAUSDT: "ada-cardano",
  DOGEUSDT: "doge-dogecoin",
  DOTUSDT: "dot-polkadot",
  MATICUSDT: "matic-polygon",
  LTCUSDT: "ltc-litecoin",
  SHIBUSDT: "shib-shiba-inu", // Add SHIB mapping
  // Add more mappings as needed
}

// Declare COINCAP_IDS
// const COINCAP_IDS: Record<string, string> = {
//   BTCUSDT: "bitcoin",
//   ETHUSDT: "ethereum",
//   // Add more mappings as needed
// }

// CoinGecko API base URL
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

export function useCryptoData(asset = "BTC") {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [status, setStatus] = useState<CryptoStatus>(0)
  const [error, setError] = useState<string | null>(null)

  // Refs for managing state and caching
  const socketRef = useRef<WebSocket | null>(null)
  const cacheRef = useRef<Record<string, CoinData>>({})
  const lastUpdateRef = useRef<number>(0)
  const pendingUpdateRef = useRef<CoinData[] | null>(null)
  const chartDataCacheRef = useRef<Record<string, Record<TimeRange, number[]>>>({})
  // const coinGeckoRateLimitRef = useRef<boolean>(false)
  // const lastUpdateTimeRef = useRef<number>(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Parse symbol into base and quote assets (e.g., "ETHBTC" -> { base: "ETH", quote: "BTC" })
  const parseSymbol = useCallback((symbol: string) => {
    for (const quote of QUOTE_ASSETS) {
      if (symbol.endsWith(quote)) {
        const base = symbol.substring(0, symbol.length - quote.length)
        return { baseAsset: base, quoteAsset: quote }
      }
    }

    // Default fallback
    return { baseAsset: symbol.substring(0, 3), quoteAsset: symbol.substring(3) }
  }, [])

  // Throttled update function to prevent too frequent UI updates
  const throttledUpdate = useCallback(() => {
    const now = Date.now()
    // Update prices every 1 second
    const updateInterval = 1000

    if (pendingUpdateRef.current && now - lastUpdateRef.current >= updateInterval) {
      setCoins(pendingUpdateRef.current)
      lastUpdateRef.current = now
      pendingUpdateRef.current = null
    }
  }, [])

  // Process WebSocket message
  const processWebSocketMessage = useCallback(
    (data: any[]) => {
      if (!Array.isArray(data)) return []

      const updatedCoins: CoinData[] = []
      const processedSymbols = new Set<string>()

      for (const ticker of data) {
        try {
          // Skip if we've already processed this symbol
          if (processedSymbols.has(ticker.s)) continue

          const { baseAsset, quoteAsset } = parseSymbol(ticker.s)

          // Only process if it matches the selected asset as quote
          if (quoteAsset === asset) {
            // Ensure all numeric values are valid numbers
            const priceChange = Number.parseFloat(ticker.p) || 0
            const priceChangePercent = Number.parseFloat(ticker.P) || 0
            const lastPrice = Number.parseFloat(ticker.c) || 0
            const volume = Number.parseFloat(ticker.v) || 0
            const quoteVolume = Number.parseFloat(ticker.q) || 0
            const highPrice = Number.parseFloat(ticker.h) || 0
            const lowPrice = Number.parseFloat(ticker.l) || 0

            // Skip coins with zero price or volume
            if (lastPrice <= 0 || quoteVolume <= 0) continue

            const coinData: CoinData = {
              symbol: ticker.s,
              priceChange,
              priceChangePercent,
              lastPrice,
              volume,
              quoteVolume,
              openTime: ticker.O || Date.now() - 86400000, // Default to 24h ago
              closeTime: ticker.C || Date.now(),
              highPrice,
              lowPrice,
              baseAsset,
              quoteAsset,
            }

            // Update our dynamic mappings with this coin
            updateExchangeMappings(ticker.s, baseAsset, quoteAsset)

            // Update cache
            cacheRef.current[ticker.s] = coinData
            updatedCoins.push(coinData)
            processedSymbols.add(ticker.s)
          }
        } catch (err) {
          console.error("Error processing ticker:", err)
        }
      }

      // Sort by volume descending
      return updatedCoins.sort((a, b) => b.quoteVolume - a.quoteVolume)
    },
    [asset, parseSymbol],
  )

  // Connect to Binance WebSocket for real-time price updates
  useEffect(() => {
    const endpoint = "wss://stream.binance.com:9443/ws/!ticker@arr"

    // Set up interval for throttled updates
    updateIntervalRef.current = setInterval(throttledUpdate, 100)

    const connect = () => {
      try {
        // Clean up any existing connection
        if (socketRef.current) {
          socketRef.current.close()
        }

        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }

        setStatus(0) // closed

        // Create new WebSocket connection
        const socket = new WebSocket(endpoint)
        socketRef.current = socket

        // Connection opened
        socket.addEventListener("open", () => {
          setStatus(1) // open
          setError(null)
        })

        // Listen for messages
        socket.addEventListener("message", (event) => {
          try {
            const data = JSON.parse(event.data)

            if (Array.isArray(data)) {
              setStatus(2) // active

              // Process the data and store for throttled update
              const updatedCoins = processWebSocketMessage(data)
              pendingUpdateRef.current = updatedCoins
            }
          } catch (err) {
            console.error("Error parsing message:", err)
          }
        })

        // Connection closed
        socket.addEventListener("close", () => {
          setStatus(0) // closed

          // Try to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (socketRef.current?.readyState !== 1) {
              connect()
            }
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
        console.error("Failed to connect:", err)
        setStatus(-1) // error
        setError("Failed to connect to Binance API")

        // Try to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000)
      }
    }

    // Initial connection
    connect()

    // Cleanup on unmount
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
        updateIntervalRef.current = null
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [asset, processWebSocketMessage, throttledUpdate])

  // Generate fallback chart data based on time range
  // const generateFallbackChartData = useCallback(
  //   (coin: CoinData | undefined, timeRange: TimeRange = "1D"): ChartPoint[] => {
  //     if (!coin) return Array(25).fill({ price: 0, timestamp: Date.now() })

  //     const last = coin.lastPrice || 100 // Default to 100 if lastPrice is not available
  //     let high = coin.highPrice || last * 1.05 // Default to 5% above last price
  //     let low = coin.lowPrice || last * 0.95 // Default to 5% below last price
  //     let dataPoints = 25
  //     let volatility = 0.1 // Default volatility factor

  //     // Ensure high is always greater than low
  //     if (high <= low) {
  //       high = last * 1.05
  //       low = last * 0.95
  //     }

  //     // Adjust parameters based on time range
  //     switch (timeRange) {
  //       case "1D":
  //         high = coin.highPrice || last * 1.05
  //         low = coin.lowPrice || last * 0.95
  //         dataPoints = 24 // One point per hour
  //         volatility = 0.1
  //         break
  //       case "1W":
  //         high = last * 1.1
  //         low = last * 0.9
  //         dataPoints = 28 // 4 points per day for a week
  //         volatility = 0.15
  //         break
  //       case "1M":
  //         high = last * 1.2
  //         low = last * 0.8
  //         dataPoints = 30 // One point per day
  //         volatility = 0.2
  //         break
  //       case "3M":
  //         high = last * 1.3
  //         low = last * 0.7
  //         dataPoints = 36 // 12 points per month
  //         volatility = 0.25
  //         break
  //       case "1Y":
  //         high = last * 1.5
  //         low = last * 0.5
  //         dataPoints = 52 // One point per week
  //         volatility = 0.3
  //         break
  //     }

  //     const range = high - low
  //     const now = Date.now()

  //     // Use a seed based on the coin symbol for consistent randomness
  //     const seed = coin.symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 12345

  //     // Generate different patterns based on time range
  //     switch (timeRange) {
  //       case "1D": {
  //         // Daily pattern - start with opening price, end with current price
  //         const startPrice = last - (coin.priceChange || 0)
  //         const step = (coin.priceChange || 0) / (dataPoints - 1)
  //         const msPerPoint = (24 * 60 * 60 * 1000) / dataPoints

  //         // Create a base trend line from start to end
  //         const chartPoints = Array(dataPoints)
  //           .fill(0)
  //           .map((_, i) => {
  //             // Add some randomness to make it look realistic
  //             const randomFactor = (Math.sin(i * seed) * 2 - 1) * range * volatility
  //             const basePrice = startPrice + step * i
  //             const timestamp = now - (dataPoints - 1 - i) * msPerPoint

  //             return {
  //               price: Math.max(low, Math.min(high, basePrice + randomFactor)),
  //               timestamp,
  //             }
  //           })

  //         // Ensure the last point is exactly the current price
  //         chartPoints[chartPoints.length - 1] = { price: last, timestamp: now }
  //         return chartPoints
  //       }

  //       case "1W": {
  //         // Weekly pattern with weekend dips
  //         const msPerPoint = (7 * 24 * 60 * 60 * 1000) / dataPoints

  //         const chartPoints = Array(dataPoints)
  //           .fill(0)
  //           .map((_, i) => {
  //             const progress = i / (dataPoints - 1)
  //             // Create a slight upward trend
  //             const trend = low + range * (0.4 + progress * 0.3)

  //             // Add weekend effect (lower on weekends)
  //             const dayOfWeek = i % 7
  //             const weekendEffect = dayOfWeek === 0 || dayOfWeek === 6 ? -range * 0.1 : 0

  //             // Add randomness
  //             const randomFactor = (Math.sin(i * seed) * 2 - 1) * range * volatility
  //             const timestamp = now - (dataPoints - 1 - i) * msPerPoint

  //             return {
  //               price: Math.max(low, Math.min(high, trend + weekendEffect + randomFactor)),
  //               timestamp,
  //             }
  //           })

  //         // Ensure the last point is exactly the current price
  //         chartPoints[chartPoints.length - 1] = { price: last, timestamp: now }
  //         return chartPoints
  //       }

  //       case "1M": {
  //         // Monthly pattern with a trend and some volatility
  //         const msPerPoint = (30 * 24 * 60 * 60 * 1000) / dataPoints

  //         const chartPoints = Array(dataPoints)
  //           .fill(0)
  //           .map((_, i) => {
  //             const progress = i / (dataPoints - 1)

  //             // Create a trend that rises and then has a correction
  //             let trend
  //             if (progress < 0.7) {
  //               // Rising trend for first 70%
  //               trend = low + range * (0.3 + progress * 0.5)
  //             } else {
  //               // Correction in last 30%
  //               trend = low + range * (0.65 - (progress - 0.7) * 0.2)
  //             }

  //             // Add randomness
  //             const randomFactor = (Math.sin(i * seed) * 2 - 1) * range * volatility
  //             const timestamp = now - (dataPoints - 1 - i) * msPerPoint

  //             return {
  //               price: Math.max(low, Math.min(high, trend + randomFactor)),
  //               timestamp,
  //             }
  //           })

  //         // Ensure the last point is exactly the current price
  //         chartPoints[chartPoints.length - 1] = { price: last, timestamp: now }
  //         return chartPoints
  //       }

  //       case "3M": {
  //         // Quarterly pattern with multiple cycles
  //         const msPerPoint = (90 * 24 * 60 * 60 * 1000) / dataPoints

  //         const chartPoints = Array(dataPoints)
  //           .fill(0)
  //           .map((_, i) => {
  //             const progress = i / (dataPoints - 1)

  //             // Create a base trend
  //             const baseTrend = low + range * (0.3 + progress * 0.4)

  //             // Add cyclical pattern
  //             const cycle = Math.sin(progress * Math.PI * 2) * range * 0.2

  //             // Add randomness
  //             const randomFactor = (Math.sin(i * seed) * 2 - 1) * range * volatility
  //             const timestamp = now - (dataPoints - 1 - i) * msPerPoint

  //             return {
  //               price: Math.max(low, Math.min(high, baseTrend + cycle + randomFactor)),
  //               timestamp,
  //             }
  //           })

  //         // Ensure the last point is exactly the current price
  //         chartPoints[chartPoints.length - 1] = { price: last, timestamp: now }
  //         return chartPoints
  //       }

  //       case "1Y": {
  //         // Yearly pattern with seasonal trends
  //         const msPerPoint = (365 * 24 * 60 * 60 * 1000) / dataPoints

  //         const chartPoints = Array(dataPoints)
  //           .fill(0)
  //           .map((_, i) => {
  //             const progress = i / (dataPoints - 1)

  //             // Create a long-term trend
  //             const longTermTrend = low + range * (0.2 + progress * 0.5)

  //             // Add seasonal pattern (4 seasons)
  //             const seasonal = Math.sin(progress * Math.PI * 2) * range * 0.15

  //             // Add randomness
  //             const randomFactor = (Math.sin(i * seed) * 2 - 1) * range * volatility
  //             const timestamp = now - (dataPoints - 1 - i) * msPerPoint

  //             return {
  //               price: Math.max(low, Math.min(high, longTermTrend + seasonal + randomFactor)),
  //               timestamp,
  //             }
  //           })

  //         // Ensure the last point is exactly the current price
  //         chartPoints[chartPoints.length - 1] = { price: last, timestamp: now }
  //         return chartPoints
  //       }

  //       default:
  //         return Array(25).fill({ price: 0, timestamp: Date.now() })
  //     }
  //   },
  //   [],
  // )

  // Get data for a specific coin with time range
  const getDateLabels = useCallback((timeRange: TimeRange = "1D") => {
    const labels: string[] = []

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    const formatMonth = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short" })
    }

    const formatHour = (date: Date) => {
      return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).replace(/\s/g, "")
    }

    const now = new Date()

    switch (timeRange) {
      case "1D": {
        // Show hours for 1D (oldest to newest)
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
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          labels.push(formatDate(date))
        }
        break
      }
      case "1M": {
        // Show weeks for 1M (oldest to newest)
        for (let i = 28; i >= 0; i -= 7) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          labels.push(formatDate(date))
        }
        break
      }
      case "3M": {
        // Show months for 3M (oldest to newest)
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now)
          date.setMonth(date.getMonth() - i)
          labels.push(formatMonth(date))
        }
        break
      }
    }

    return labels
  }, [])

  // Update the getCoinData function to provide more detailed information about API attempts
  const getCoinData = useCallback(
    async (symbol: string, timeRange: TimeRange = "1D", forceRefresh = false) => {
      // First try to find in current coins array or cache
      const coin = coins.find((c) => c.symbol === symbol) || cacheRef.current[symbol] || null

      // Debug the exchange mappings for this symbol
      debugExchangeMappings(symbol)

      // If we have the coin data but no mapping, try to create one
      if (coin && !dynamicCoinIds[symbol]) {
        updateExchangeMappings(symbol, coin.baseAsset, coin.quoteAsset)
      }

      // Check if we have cached chart data for this symbol and time range
      if (!forceRefresh && chartDataCacheRef.current[symbol]?.[timeRange]?.length > 0) {
        // Return cached data if available and not forcing refresh
        return {
          coin,
          chartData: chartDataCacheRef.current[symbol][timeRange],
          success: true,
          source: "Cache" as ApiSource,
        }
      }

      // Define the order of APIs to try - prioritize more reliable sources first
      const apiSources: ApiSource[] = [
        "binance",
        "bybit",
        "kucoin",
        "mexc",
        "bitfinex",
        "bitstamp",
        "kraken",
        "coingecko",
        "coinpaprika",
      ]

      // Make sure we're properly logging which API we're trying
      // Add more detailed logging to help debug the issue
      for (const source of apiSources) {
        // Skip if rate limited
        if (API_RATE_LIMITS[source].limited) {
          console.log(
            `Skipping ${source} API due to rate limiting until ${new Date(API_RATE_LIMITS[source].resetTime).toISOString()}`,
          )
          continue
        }

        try {
          console.log(`Attempting to fetch data from ${source} API for ${symbol} with timeRange ${timeRange}`)
          let chartData: number[] = []
          let success = false

          // Try to fetch from the current API source
          if (source === "coingecko") {
            // CoinGecko implementation
            const result = await fetchFromCoinGecko(symbol, timeRange)
            chartData = result.chartData
            success = result.success
            console.log(`CoinGecko API result: success=${success}, data points=${chartData.length}`)
          } else if (source === "coinpaprika") {
            // Coinpaprika implementation
            const result = await fetchFromCoinpaprika(symbol, timeRange)
            chartData = result.chartData
            success = result.success
            console.log(`Coinpaprika API result: success=${success}, data points=${chartData.length}`)
          } else {
            // Try other API sources
            const result = await fetchFromExchange(source, symbol, timeRange)
            chartData = result.chartData
            success = result.success
            console.log(`${source} API result: success=${success}, data points=${chartData.length}`)
          }

          if (success && chartData.length > 0) {
            // Cache the successful chart data
            if (!chartDataCacheRef.current[symbol]) {
              chartDataCacheRef.current[symbol] = {} as Record<TimeRange, number[]>
            }
            chartDataCacheRef.current[symbol][timeRange] = chartData

            // Capitalize the first letter of the source for display
            const displaySource = source.charAt(0).toUpperCase() + source.slice(1)
            console.log(`Successfully fetched data from ${displaySource}`)
            return { coin, chartData, success: true, source: displaySource }
          } else {
            console.log(`${source} API returned no valid data, trying next API`)
          }
        } catch (error:any) {
          console.error(`Error fetching chart data from ${source} for ${symbol}:`, error)

          // Mark as rate limited if appropriate
          if (error.toString().includes("429") || error.toString().includes("rate limit")) {
            console.log(`Rate limit detected for ${source}, marking as limited`)
            API_RATE_LIMITS[source].limited = true
            API_RATE_LIMITS[source].resetTime = Date.now() + RATE_LIMIT_RESET_TIMES[source]

            // Set a timeout to reset the rate limit flag
            setTimeout(() => {
              API_RATE_LIMITS[source].limited = false
              console.log(`Rate limit for ${source} has been reset`)
            }, RATE_LIMIT_RESET_TIMES[source])
          }
        }
      }

      // If all APIs failed, return empty data instead of generating fallback data
      console.warn(`All APIs failed for ${symbol}, no data available`)
      return {
        coin,
        chartData: [],
        success: false,
        source: "None" as ApiSource,
      }
    },
    [coins, getDateLabels],
  )

  // Update the fetchFromExchange function to remove coincap and gateio
  const fetchFromExchange = async (exchange: ApiSource, symbol: string, timeRange: TimeRange) => {
    if (exchange === "coingecko" || exchange === "coinpaprika" || exchange === "fallback") {
      return { chartData: [], success: false }
    }

    // Get the exchange-specific symbol
    const exchangeSymbol = EXCHANGE_SYMBOL_MAP[exchange]?.[symbol]

    if (!exchangeSymbol) {
      console.warn(`No ${exchange} symbol mapping found for ${symbol}`)
      return { chartData: [], success: false }
    }

    // Get the API endpoint for this exchange and time range
    let endpoint = API_ENDPOINTS[exchange][timeRange]

    if (!endpoint) {
      console.warn(`No ${exchange} endpoint found for ${timeRange}`)
      return { chartData: [], success: false }
    }

    // Replace the symbol placeholder
    endpoint = endpoint.replace("{symbol}", exchangeSymbol)
    console.log(`Fetching from ${exchange} with endpoint: ${endpoint}`)

    try {
      // Add a timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      // Fetch data from the exchange with timeout
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "CryptoWidget/1.0",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited
          API_RATE_LIMITS[exchange].limited = true
          API_RATE_LIMITS[exchange].resetTime = Date.now() + RATE_LIMIT_RESET_TIMES[exchange]

          setTimeout(() => {
            API_RATE_LIMITS[exchange].limited = false
          }, RATE_LIMIT_RESET_TIMES[exchange])

          throw new Error(`Rate limited by ${exchange} API`)
        }
        throw new Error(`${exchange} API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received response from ${exchange}`)

      // Parse the response based on the exchange format
      let chartData: number[] = []

      switch (exchange) {
        case "binance":
        case "mexc":
          // Binance/MEXC format: [[time, open, high, low, close, volume, ...], ...]
          // We want the close price (index 4)
          if (Array.isArray(data) && data.length > 0) {
            chartData = data.map((candle) => Number.parseFloat(candle[4]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break

        case "bitstamp":
          // Bitstamp format: { data: { ohlc: [[timestamp, open, high, low, close, volume], ...] } }
          if (data?.data?.ohlc && Array.isArray(data.data.ohlc) && data.data.ohlc.length > 0) {
            chartData = data.data.ohlc.map((candle:any) => Number.parseFloat(candle[4]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break

        case "bitfinex":
          // Bitfinex format: [[timestamp, open, close, high, low, volume], ...]
          if (Array.isArray(data) && data.length > 0) {
            // Bitfinex returns newest first, so reverse the array
            chartData = [...data].reverse().map((candle) => Number.parseFloat(candle[2]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break

        case "kraken":
          // Kraken format: { result: { XXBTZUSD: [[time, open, high, low, close, ...], ...] } }
          { const krakenPair = Object.keys(data?.result || {})[0]
          if (krakenPair && Array.isArray(data.result[krakenPair]) && data.result[krakenPair].length > 0) {
            chartData = data.result[krakenPair].map((candle) => Number.parseFloat(candle[4]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break }

        case "kucoin":
          // KuCoin format: { data: [[timestamp, open, close, high, low, volume, ...], ...] }
          if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
            // KuCoin returns newest first, so reverse the array
            chartData = [...data.data].reverse().map((candle) => Number.parseFloat(candle[2]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break

        case "bybit":
          // Bybit format: { result: { list: [[timestamp, open, high, low, close, volume, ...], ...] } }
          if (data?.result?.list && Array.isArray(data.result.list) && data.result.list.length > 0) {
            // Bybit returns newest first, so reverse the array
            chartData = [...data.result.list].reverse().map((candle) => Number.parseFloat(candle[4]))
            console.log(`Parsed ${chartData.length} data points from ${exchange}`)
          }
          break

        default:
          console.warn(`Unknown exchange: ${exchange}`)
          return { chartData: [], success: false }
      }

      if (chartData.length === 0) {
        console.warn(`No valid chart data returned from ${exchange}`)
        return { chartData: [], success: false }
      }

      return { chartData, success: true }
    } catch (error) {
      console.error(`Error in fetchFromExchange for ${exchange}:`, error)
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`Request to ${exchange} timed out`)
      }
      return { chartData: [], success: false }
    }
  }

  /**
   * Fetch chart data from Coincap
   */
  // const fetchFromCoincap = async (symbol: string, timeRange: TimeRange) => {
  //   // Get Coincap ID for the symbol
  //   const coinId = COINCAP_IDS[symbol]

  //   if (!coinId) {
  //     console.warn(`No Coincap ID found for ${symbol}`)
  //     return { chartData: [], success: false }
  //   }

  //   // Get the API endpoint for this time range
  //   let endpoint = API_ENDPOINTS.coincap[timeRange]

  //   // Replace the coinId placeholder
  //   endpoint = endpoint.replace("{coinId}", coinId)

  //   // Check if we're rate limited
  //   if (API_RATE_LIMITS.coincap.limited) {
  //     throw new Error("Coincap rate limit reached")
  //   }

  //   // Fetch data from Coincap
  //   const response = await fetch(endpoint)

  //   if (!response.ok) {
  //     if (response.status === 429) {
  //       // Rate limited
  //       API_RATE_LIMITS.coincap.limited = true
  //       API_RATE_LIMITS.coincap.resetTime = Date.now() + RATE_LIMIT_RESET_TIMES.coincap

  //       setTimeout(() => {
  //         API_RATE_LIMITS.coincap.limited = false
  //       }, RATE_LIMIT_RESET_TIMES.coincap)

  //       throw new Error("Rate limited by Coincap API")
  //     }
  //     throw new Error(`Coincap API error: ${response.status}`)
  //   }

  //   const data = await response.json()

  //   if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
  //     throw new Error("Invalid data format from Coincap API")
  //   }

  //   // Extract price data from the response
  //   // Coincap returns prices in the format { data: [{ priceUsd, time }, ...] }
  //   const chartData = data.data.map((item: { priceUsd: string }) => Number.parseFloat(item.priceUsd))

  //   return { chartData, success: true }
  // }

  /**
   * Fetch chart data from Coinpaprika
   */
  const fetchFromCoinpaprika = async (symbol: string, timeRange: TimeRange) => {
    // Get Coinpaprika ID for the symbol
    const coinId = COINPAPRIKA_IDS[symbol]

    if (!coinId) {
      console.warn(`No Coinpaprika ID found for ${symbol}`)
      return { chartData: [], success: false }
    }

    // Calculate start date based on time range
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case "1D":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "1W":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "1M":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "3M":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1Y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Format date as YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split("T")[0]

    // Get the API endpoint for this time range
    let endpoint = API_ENDPOINTS.coinpaprika[timeRange]

    // Replace the placeholders
    endpoint = endpoint.replace("{coinId}", coinId).replace("{startDate}", formattedStartDate)

    // Check if we're rate limited
    if (API_RATE_LIMITS.coinpaprika.limited) {
      throw new Error("Coinpaprika rate limit reached")
    }

    // Fetch data from Coinpaprika
    const response = await fetch(endpoint)

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited
        API_RATE_LIMITS.coinpaprika.limited = true
        API_RATE_LIMITS.coinpaprika.resetTime = Date.now() + RATE_LIMIT_RESET_TIMES.coinpaprika

        setTimeout(() => {
          API_RATE_LIMITS.coinpaprika.limited = false
        }, RATE_LIMIT_RESET_TIMES.coinpaprika)

        throw new Error("Rate limited by Coinpaprika API")
      }
      throw new Error(`Coinpaprika API error: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data format from Coinpaprika API")
    }

    // Extract price data from the response
    // Coinpaprika returns prices in the format [{ price, timestamp }, ...]
    const chartData = data.map((item: { price: number }) => item.price)

    return { chartData, success: true }
  }

  // Add this to the useEffect that resets rate limits
  useEffect(() => {
    // Reset rate limits that have expired
    const checkRateLimits = () => {
      const now = Date.now()
      Object.keys(API_RATE_LIMITS).forEach((api) => {
        if (API_RATE_LIMITS[api].limited && now >= API_RATE_LIMITS[api].resetTime) {
          API_RATE_LIMITS[api].limited = false
        }
      })
    }

    const intervalId = setInterval(checkRateLimits, 10000) // Check every 10 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      coins,
      status,
      error,
      getCoinData,
      getDateLabels,
    }),
    [coins, status, error, getCoinData, getDateLabels],
  )

  return returnValue
}

// Improve the fetchFromCoinGecko function with better error handling
const fetchFromCoinGecko = async (symbol: string, timeRange: TimeRange) => {
  // Get the coin ID from the COIN_IDS map
  const coinId = COIN_IDS[symbol]

  if (!coinId) {
    console.warn(`No CoinGecko ID found for ${symbol}`)
    return { chartData: [], success: false }
  }

  // Determine the appropriate number of days based on the time range
  let days = 1
  switch (timeRange) {
    case "1D":
      days = 1
      break
    case "1W":
      days = 7
      break
    case "1M":
      days = 30
      break
    case "3M":
      days = 90
      break
    case "1Y":
      days = 365
      break
    default:
      days = 1
  }

  // Construct the CoinGecko API URL
  const url = `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`

  try {
    // Check if we're already rate limited
    if (API_RATE_LIMITS.coingecko.limited) {
      return { chartData: [], success: false }
    }

    // Add a timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    // Fetch data from CoinGecko with timeout
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "CryptoWidget/1.0",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.warn("CoinGecko rate limit reached")
        API_RATE_LIMITS.coingecko.limited = true
        API_RATE_LIMITS.coingecko.resetTime = Date.now() + RATE_LIMIT_RESET_TIMES.coingecko

        // Set a timeout to reset the rate limit flag
        setTimeout(() => {
          API_RATE_LIMITS.coingecko.limited = false
        }, RATE_LIMIT_RESET_TIMES.coingecko)
      }

      return { chartData: [], success: false }
    }

    const data = await response.json()

    // Validate the data structure
    if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
      console.warn(`Invalid data format from CoinGecko for ${symbol}`)
      return { chartData: [], success: false }
    }

    // Extract the price data from the response
    const chartData = data.prices.map((price: [number, number]) => price[1])

    return { chartData, success: true }
  } catch (error) {
    console.error(`Error fetching CoinGecko data for ${symbol}:`, error)

    // If the error is due to an abort (timeout), log it differently
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn(`CoinGecko request for ${symbol} timed out`)
    }

    return { chartData: [], success: false }
  }
}
