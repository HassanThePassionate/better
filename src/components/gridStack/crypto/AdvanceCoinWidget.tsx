/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  useCryptoData,
  type CoinData,
  type CryptoStatus,
} from "@/hooks/use-crypto-data";
import MiniChart from "./MiniChart";
import CoinIcon from "./CoinIcon";
import CoinDetailModal from "./CoinDetailModal";

type ViewMode = "top" | "bookmarked";

type SortField = "price" | "change" | "volume" | "name" | "marketCap";
type SortDirection = "asc" | "desc";

type CoinWithChart = CoinData & {
  chartData: number[];
  lastUpdated: number;
  isBookmarked: boolean;
};

export default function AdvancedCoinsWidget() {
  const [allCoins, setAllCoins] = useState<CoinWithChart[]>([]);
  const [displayedCoins, setDisplayedCoins] = useState<CoinWithChart[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<SortField>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("top");
  const [bookmarkedCount, setBookmarkedCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<CoinWithChart[]>([]);
  const [dataSource, setDataSource] = useState<string>("Loading...");
  const [realtimePriceData, setRealtimePriceData] = useState<
    Record<string, number[]>
  >({});
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataSourceRef = useRef<string>("Binance");
  const fetchingRef = useRef<boolean>(false);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const priceUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const currency = "USD" as const;
  const currencySymbol = "$";
  const numberOfCoins = 10;
  const showVolume = false;
  const showMarketCap = true;
  const showSparklines = true;
  const priceUpdateFrequency = "1s" as const;
  const chartUpdateFrequency = "5s" as const;

  const { coins, status, error, getCoinData } = useCryptoData("USDT");

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("cryptoWidgetBookmarks");

      if (savedBookmarks) {
        const bookmarkedSymbols = JSON.parse(savedBookmarks) as string[];
        console.log("Loaded bookmarks:", bookmarkedSymbols);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const bookmarkedSymbols = allCoins
        .filter((coin) => coin.isBookmarked)
        .map((coin) => coin.symbol);
      localStorage.setItem(
        "cryptoWidgetBookmarks",
        JSON.stringify(bookmarkedSymbols)
      );

      setBookmarkedCount(bookmarkedSymbols.length);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [allCoins]);

  // Update the generateChartData function to use 12 data points instead of 48
  const generateChartData = useCallback((coin: CoinData): number[] => {
    // Generate 12 data points for the last 24 hours (2-hour intervals)
    const trend = coin.priceChangePercent;
    const volatility = Math.abs(trend) / 10 + 0.02;
    const points = 12; // 12 points representing 2-hour intervals for the last 24 hours
    const basePrice = coin.lastPrice * (1 - trend / 100);

    return Array(points)
      .fill(0)
      .map((_, i) => {
        const progress = i / (points - 1);
        const seed =
          coin.symbol.charCodeAt(0) +
          coin.symbol.charCodeAt(coin.symbol.length - 1);
        const pseudoRandom = Math.sin(seed * i) * 0.5 + 0.5;
        const randomFactor = (pseudoRandom * 2 - 1) * volatility;

        // Create a more realistic price movement pattern
        // Early hours have less impact on the final price
        const trendFactor = Math.pow(progress, 1.2) * (trend / 100);

        return (
          basePrice * (1 + trendFactor + randomFactor * (1 - progress * 0.7))
        );
      });
  }, []);

  // Add this new effect to handle real-time price updates
  useEffect(() => {
    if (coins.length === 0) return;

    // Initialize price data arrays if needed
    const newRealtimeData: Record<string, number[]> = { ...realtimePriceData };

    coins.forEach((coin) => {
      if (!newRealtimeData[coin.symbol]) {
        newRealtimeData[coin.symbol] = [];
      }

      // Add the latest price to the array
      newRealtimeData[coin.symbol].push(coin.lastPrice);

      // Keep only the last 60 data points (representing ~1 hour with updates every minute)
      if (newRealtimeData[coin.symbol].length > 60) {
        newRealtimeData[coin.symbol] = newRealtimeData[coin.symbol].slice(-60);
      }
    });

    setRealtimePriceData(newRealtimeData);
  }, [coins]);

  // Update the fetchCoinChartData function to prioritize 24-hour data
  const fetchCoinChartData = useCallback(
    (coin: CoinData): number[] => {
      try {
        // Use real-time data if we have enough points
        if (
          realtimePriceData[coin.symbol] &&
          realtimePriceData[coin.symbol].length >= 10
        ) {
          dataSourceRef.current = "Binance WebSocket";
          setDataSource("Binance WebSocket");
          return [...realtimePriceData[coin.symbol]]; // Return a copy to avoid mutation issues
        }

        // Fall back to generated data
        const chartData = generateChartData(coin);
        dataSourceRef.current = "Generated";
        setDataSource("Generated");
        return chartData;
      } catch (error) {
        console.error(`Error generating chart data for ${coin.symbol}:`, error);
        dataSourceRef.current = "Fallback";
        setDataSource("Fallback");
        return generateChartData(coin);
      }
    },
    [generateChartData, realtimePriceData]
  );

  // Add these utility functions for rate limiting
  const rateLimitedAPIs = useRef<
    Record<string, { limited: boolean; resetTime: number }>
  >({
    binance: { limited: false, resetTime: 0 },
    bybit: { limited: false, resetTime: 0 },
    kucoin: { limited: false, resetTime: 0 },
    bitfinex: { limited: false, resetTime: 0 },
    bitstamp: { limited: false, resetTime: 0 },
    kraken: { limited: false, resetTime: 0 },
  });

  const isRateLimited = useCallback((source: string) => {
    const now = Date.now();
    if (
      rateLimitedAPIs.current[source]?.limited &&
      now >= rateLimitedAPIs.current[source].resetTime
    ) {
      // Reset if the time has passed
      rateLimitedAPIs.current[source].limited = false;
    }
    return rateLimitedAPIs.current[source]?.limited || false;
  }, []);

  const markRateLimited = useCallback((source: string) => {
    const resetTimes: Record<string, number> = {
      binance: 60000, // 1 minute
      bybit: 60000, // 1 minute
      kucoin: 30000, // 30 seconds
      bitfinex: 60000, // 1 minute
      bitstamp: 30000, // 30 seconds
      kraken: 30000, // 30 seconds
    };

    const resetTime = resetTimes[source] || 60000;
    rateLimitedAPIs.current[source] = {
      limited: true,
      resetTime: Date.now() + resetTime,
    };

    // Set a timeout to reset the rate limit flag
    setTimeout(() => {
      rateLimitedAPIs.current[source].limited = false;
    }, resetTime);
  }, []);

  useEffect(() => {
    if (coins.length === 0) return;

    const setupCoins = () => {
      if (allCoins.length > 0) {
        const updatedCoins: CoinWithChart[] = allCoins.map((existingCoin) => {
          const updatedCoin = coins.find(
            (c) => c.symbol === existingCoin.symbol
          );
          if (updatedCoin) {
            return {
              ...existingCoin,
              lastPrice: updatedCoin.lastPrice,
              priceChangePercent: updatedCoin.priceChangePercent,
              highPrice: updatedCoin.highPrice,
              lowPrice: updatedCoin.lowPrice,
              quoteVolume: updatedCoin.quoteVolume,
            };
          }
          return existingCoin;
        });

        if (isMountedRef.current) {
          setAllCoins(updatedCoins);
        }
      } else {
        let bookmarkedSymbols: string[] = [];
        try {
          const savedBookmarks = localStorage.getItem("cryptoWidgetBookmarks");
          if (savedBookmarks) {
            bookmarkedSymbols = JSON.parse(savedBookmarks);
          }
        } catch (error) {
          console.error("Error loading bookmarks:", error);
        }

        const processedCoins: CoinWithChart[] = [];

        for (const coin of coins) {
          try {
            const chartData = fetchCoinChartData(coin);
            processedCoins.push({
              ...coin,
              chartData,
              lastUpdated: Date.now(),
              isBookmarked: bookmarkedSymbols.includes(coin.symbol),
            });
          } catch (error) {
            console.error(`Error processing coin ${coin.symbol}:`, error);
          }
        }

        if (isMountedRef.current) {
          setAllCoins(processedCoins);
          setBookmarkedCount(
            processedCoins.filter((coin) => coin.isBookmarked).length
          );
          dataSourceRef.current = "Binance";
        }
      }
    };

    setupCoins();
  }, [coins, fetchCoinChartData]);

  useEffect(() => {
    if (allCoins.length === 0) return;

    if (isSearchActive && searchQuery.trim() !== "") {
      return;
    }

    let coinsToDisplay: CoinWithChart[] = [];

    switch (viewMode) {
      case "top":
        coinsToDisplay = [...allCoins]
          .sort((a, b) => b.quoteVolume - a.quoteVolume)
          .slice(0, numberOfCoins);
        break;

      case "bookmarked":
        coinsToDisplay = allCoins.filter((coin) => coin.isBookmarked);
        break;
    }

    const sortedCoins = sortCoins(coinsToDisplay, sortField, sortDirection);
    setDisplayedCoins(sortedCoins);
  }, [
    allCoins,
    viewMode,
    sortField,
    sortDirection,
    isSearchActive,
    searchQuery,
    numberOfCoins,
  ]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allCoins.filter(
      (coin) =>
        coin.baseAsset.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    );

    setSearchResults(results);

    if (isSearchActive) {
      setDisplayedCoins(results);
    }
  }, [searchQuery, allCoins, isSearchActive]);

  useEffect(() => {
    const updateCharts = () => {
      if (allCoins.length === 0 || !isMountedRef.current) return;

      const now = Date.now();
      const updatedCoins: CoinWithChart[] = [];

      for (const coin of allCoins) {
        if (now - coin.lastUpdated < 20000) {
          updatedCoins.push(coin);
          continue;
        }

        lastUpdateTimeRef.current = now;

        try {
          if (now - coin.lastUpdated < 60000) {
            updatedCoins.push(coin);
            continue;
          }

          try {
            const chartData = fetchCoinChartData(coin);
            updatedCoins.push({
              ...coin,
              chartData,
              lastUpdated: now,
            });
          } catch (error) {
            console.error(`Error updating chart for ${coin.symbol}:`, error);
            updatedCoins.push(coin);
          }
        } catch (error) {
          console.error("Error updating charts:", error);
          updatedCoins.push(coin);
        }
      }

      if (isMountedRef.current) {
        setAllCoins(updatedCoins);
      }
    };

    const interval = setInterval(updateCharts, 20000);
    chartUpdateIntervalRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [fetchCoinChartData, allCoins]);

  const sortCoins = useCallback(
    (
      coinsToSort: CoinWithChart[],
      field: SortField,
      direction: SortDirection
    ): CoinWithChart[] => {
      return [...coinsToSort].sort((a, b) => {
        let comparison = 0;

        switch (field) {
          case "price":
            comparison = a.lastPrice - b.lastPrice;
            break;
          case "change":
            comparison = a.priceChangePercent - b.priceChangePercent;
            break;
          case "volume":
            comparison = a.quoteVolume - b.quoteVolume;
            break;
          case "name":
            comparison = a.baseAsset.localeCompare(b.baseAsset);
            break;
          case "marketCap": {
            const marketCapA = calculateMarketCap(a, 0);
            const marketCapB = calculateMarketCap(b, 0);
            comparison = marketCapA - marketCapB;
            break;
          }
        }

        return direction === "asc" ? comparison : -comparison;
      });
    },
    []
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc");
    }
  };

  const toggleBookmark = (symbol: string) => {
    setAllCoins((prev) =>
      prev.map((coin) =>
        coin.symbol === symbol
          ? { ...coin, isBookmarked: !coin.isBookmarked }
          : coin
      )
    );
  };

  const handleRefresh = async () => {
    if (isRefreshing || fetchingRef.current) return;

    fetchingRef.current = true;
    setIsRefreshing(true);

    lastUpdateTimeRef.current = 0;

    setTimeout(() => {
      setIsRefreshing(false);
      fetchingRef.current = false;
    }, 1000);
  };

  const getStatusColor = (status: CryptoStatus) => {
    switch (status) {
      case 2:
        return "text-green-500";
      case 1:
        return "text-yellow-500";
      case 0:
        return "text-gray-500";
      case -1:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatNumber = (num: number): string => {
    if (!num || isNaN(num)) return "0";
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(1);
  };

  const formatPrice = (price: number): string => {
    return currencySymbol + Number.parseFloat(price.toString());
  };

  const calculateMarketCap = (coin: CoinWithChart, index: number): number => {
    const topMarketCaps: Record<string, number> = {
      BTCUSDT: 1200,
      ETHUSDT: 350,
      BNBUSDT: 60,
      SOLUSDT: 50,
      XRPUSDT: 30,
      ADAUSDT: 15,
      DOGEUSDT: 12,
      DOTUSDT: 8,
      MATICUSDT: 7,
      LTCUSDT: 6,
    };

    if (topMarketCaps[coin.symbol]) {
      return topMarketCaps[coin.symbol] * 1e9;
    }

    const volumeRank = displayedCoins.findIndex(
      (c) => c.symbol === coin.symbol
    );
    const rank = volumeRank >= 0 ? volumeRank : index;
    const baseMarketCap = 5e9 * Math.pow(0.8, rank);
    const priceAdjustment =
      coin.lastPrice > 100
        ? 2
        : coin.lastPrice > 10
        ? 1.5
        : coin.lastPrice > 1
        ? 1
        : 0.5;

    return baseMarketCap * priceAdjustment;
  };

  // Handle coin click to open modal
  const handleCoinClick = (coin: CoinData) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  return (
    <div className='w-full h-full bg-[#0f172a] text-white rounded-[20px] overflow-hidden border-0 font-sans relative'>
      {/* Update the header section for a more ISO-style look with smaller fonts */}
      <div className='flex items-center justify-between p-2 px-3 border-b border-[#1a1a1a]'>
        <div className='flex items-center gap-1.5 '>
          <h2 className='text-lg font-medium tracking-wide text-[#e2e8f0]'>
            Cryptocurrency Market
          </h2>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='relative flex'>
            <div
              className={`flex items-center  mr-2 ${getStatusColor(status)}`}
              title={error || "Connection status"}
            >
              {status === 2 ? <Wifi size={12} /> : <WifiOff size={12} />}
            </div>
            {isSearchActive ? (
              <div className='flex items-center bg-[#1a1a1a] rounded w-[180px]'>
                <input
                  type='text'
                  className='bg-transparent border-none outline-none px-2 py-1 text-xs w-full'
                  placeholder='Search coins...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  className='text-gray-400 hover:text-white px-1.5'
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery("");
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                className='p-1 rounded bg-[#1a1a1a] hover:bg-[#252525]'
                onClick={() => setIsSearchActive(true)}
              >
                <Search size={12} />
              </button>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className='p-1 rounded bg-[#1a1a1a] hover:bg-[#252525]'
            aria-label='Refresh data'
            disabled={isRefreshing}
          >
            <RefreshCw
              size={12}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      <div className='flex border-b border-[#1a1a1a]'>
        <button
          className={`px-3 py-1.5 text-xs ${
            viewMode === "top"
              ? "text-white border-b border-gray-500"
              : "text-gray-400"
          }`}
          onClick={() => setViewMode("top")}
        >
          Top Coins
        </button>
        <button
          className={`px-3 py-1.5 text-xs flex items-center gap-1 ${
            viewMode === "bookmarked"
              ? "text-white border-b border-gray-500"
              : "text-gray-400"
          }`}
          onClick={() => setViewMode("bookmarked")}
        >
          Bookmarked
          {bookmarkedCount > 0 && (
            <span className='bg-gray-800 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center'>
              {bookmarkedCount}
            </span>
          )}
        </button>
      </div>

      <div className='flex items-center text-[10px] text-gray-500 px-3 py-1.5 border-b border-[#1a1a1a]'>
        <div className='w-[24px]'></div>
        <div className='w-[110px]'>
          <button
            className={`flex items-center gap-0.5 ${
              sortField === "name" ? "text-white" : ""
            }`}
            onClick={() => handleSort("name")}
          >
            Asset
            {sortField === "name" &&
              (sortDirection === "asc" ? (
                <ChevronUp size={10} />
              ) : (
                <ChevronDown size={10} />
              ))}
          </button>
        </div>
        <div className='flex-grow'></div>
        <div className='w-[100px] text-left'>
          <button
            className={`flex items-center gap-0.5 ${
              sortField === "price" ? "text-white" : ""
            }`}
            onClick={() => handleSort("price")}
          >
            Price
            {sortField === "price" &&
              (sortDirection === "asc" ? (
                <ChevronUp size={10} />
              ) : (
                <ChevronDown size={10} />
              ))}
          </button>
        </div>
        <div className='w-[70px] text-left'>
          <button
            className={`flex items-center gap-0.5 ${
              sortField === "change" ? "text-white" : ""
            }`}
            onClick={() => handleSort("change")}
          >
            24h Change
            {sortField === "change" &&
              (sortDirection === "asc" ? (
                <ChevronUp size={10} />
              ) : (
                <ChevronDown size={10} />
              ))}
          </button>
        </div>
        {showMarketCap && (
          <div className='w-[90px] text-left'>
            <button
              className={`flex items-center gap-0.5 ${
                sortField === "marketCap" ? "text-white" : ""
              }`}
              onClick={() => handleSort("marketCap")}
            >
              Market Cap
              {sortField === "marketCap" &&
                (sortDirection === "asc" ? (
                  <ChevronUp size={10} />
                ) : (
                  <ChevronDown size={10} />
                ))}
            </button>
          </div>
        )}
        {showSparklines && <div className='w-[70px]'></div>}
      </div>

      <div className='overflow-y-auto h-[190px] scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-transparent'>
        {isRefreshing ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
          </div>
        ) : displayedCoins.length > 0 ? (
          // Update the coin row rendering for a more ISO-style look with smaller fonts
          displayedCoins.map((coin, index) => {
            const isPriceUp = coin.priceChangePercent >= 0;
            const chartColor = isPriceUp ? "#22c55e" : "#ef4444";

            return (
              <div
                key={coin.symbol}
                className='flex items-center px-3 py-1.5 border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] cursor-pointer'
                onClick={() => handleCoinClick(coin)}
              >
                <div className='w-[24px]'>
                  <button
                    className={`text-${
                      coin.isBookmarked ? "yellow-400" : "gray-500"
                    } hover:text-yellow-400`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(coin.symbol);
                    }}
                  >
                    <Star
                      size={12}
                      fill={coin.isBookmarked ? "#facc15" : "none"}
                    />
                  </button>
                </div>

                <div className='flex items-center gap-1.5 w-[110px]'>
                  <CoinIcon symbol={coin.symbol} size={18} />
                  <div>
                    <div className='text-xs font-medium'>{coin.baseAsset}</div>
                    <div className='text-[10px] text-gray-500'>
                      {coin.symbol}
                    </div>
                  </div>
                </div>

                <div className='flex-grow'></div>

                <div className='text-xs font-medium w-[100px] text-left'>
                  ${Number.parseFloat(coin.lastPrice.toString())}
                </div>

                <div
                  className={`text-[10px] font-medium w-[70px] text-left ${
                    isPriceUp ? "text-[#22c55e]" : "text-[#ef4444]"
                  }`}
                >
                  {isPriceUp ? "+" : ""}
                  {coin.priceChangePercent.toFixed(2)}%
                </div>

                {showMarketCap && (
                  <div className='text-[10px] text-gray-500 w-[90px] text-left'>
                    ${formatNumber(calculateMarketCap(coin, index))}
                  </div>
                )}

                {showSparklines && (
                  <div className='ml-auto w-[70px] h-[24px] relative'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <MiniChart
                        data={coin.chartData}
                        width={70}
                        height={24}
                        color={isPriceUp ? "#22c55e" : "#ef4444"}
                        animate={false}
                      />
                    </div>
                    {/* Add a subtle label */}
                    <div className='absolute top-0 right-0 text-[8px] text-gray-500 opacity-50'>
                      24h
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-[#64748b] p-4'>
            {viewMode === "bookmarked" ? (
              <>
                <Star size={24} className='mb-2' />
                <p>No bookmarked coins yet.</p>
                <p className='text-xs'>
                  Click the star icon to bookmark coins.
                </p>
              </>
            ) : (
              <p>No coins found matching your search.</p>
            )}
          </div>
        )}
      </div>

      {/* Coin Detail Modal */}
      <CoinDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCoin={selectedCoin}
        allCoins={coins}
        onSelectCoin={(coin) => {
          // Handle coin selection - in a real app, you might switch to that coin's view
          const coinWithChart =
            allCoins.find((c) => c.symbol === coin.symbol) || null;
          if (coinWithChart) {
            setSelectedCoin(coin);
            // Additional actions you might want to take when a coin is selected
            console.log(`Selected coin: ${coin.baseAsset}`);
          }
        }}
      />
    </div>
  );
}
