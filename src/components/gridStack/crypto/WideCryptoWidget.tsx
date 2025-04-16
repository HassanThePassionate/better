"use client";

import type React from "react";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronDown,
  Search,
  X,
  Flame,
} from "lucide-react";
import {
  useCryptoData,
  type CryptoStatus,
  type TimeRange,
  type CoinData,
} from "@/hooks/use-crypto-data";
import EnhancedChart from "./CryptoChart";
import CoinIcon from "./CoinIcon";
type coin = {
  symbol: string;
  name: string;
  shortName: string;
  iconColor: string;
  baseAsset?: string;
};
// Replace the AVAILABLE_COINS constant with a smaller set of featured coins
const FEATURED_COINS = [
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    shortName: "ETH",
    iconColor: "#627eea",
  },
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    shortName: "BTC",
    iconColor: "#f7931a",
  },
  {
    symbol: "BNBUSDT",
    name: "Binance Coin",
    shortName: "BNB",
    iconColor: "#f3ba2f",
  },
  { symbol: "SOLUSDT", name: "Solana", shortName: "SOL", iconColor: "#00ffbd" },
];

// Add a function to get coin icon color based on symbol
const getCoinIconColor = (symbol: string): string => {
  const baseAsset = symbol.replace("USDT", "").toLowerCase();

  // Common coin colors
  const coinColors: Record<string, string> = {
    btc: "#f7931a",
    eth: "#627eea",
    bnb: "#f3ba2f",
    sol: "#00ffbd",
    ada: "#0033ad",
    doge: "#c3a634",
    xrp: "#23292f",
    dot: "#e6007a",
    matic: "#8247e5",
    avax: "#e84142",
    link: "#2a5ada",
    ltc: "#345d9d",
    uni: "#ff007a",
    atom: "#2e3148",
    etc: "#328332",
    algo: "#000000",
    icp: "#3b00b9",
    fil: "#0090ff",
    vet: "#15bdff",
    xtz: "#a6e000",
  };

  return coinColors[baseAsset] || "#64748b";
};
type selectedCoin = {
  symbol: string;
  name: string | undefined;
  shortName: string | undefined;
  iconColor: string;
};

export default function WideCryptoWidget() {
  // ===== STATE & REFS =====
  // UI state
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    value: 0,
    visible: false,
  });
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  console.log(setTimeRange);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasValidData, setHasValidData] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<selectedCoin>(
    FEATURED_COINS[0]
  );
  // Update the component state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  console.log(isSearchFocused);

  const [filteredCoins, setFilteredCoins] = useState<CoinData[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Data state
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartSize, setChartSize] = useState({ width: 260, height: 65 });

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth > 1600) {
        setChartSize({ width: 390, height: 75 });
      } else {
        setChartSize({ width: 260, height: 65 });
      }
    };

    updateSize(); // initial run
    window.addEventListener("resize", updateSize); // on resize

    return () => window.removeEventListener("resize", updateSize);
  }, []);
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataSourceRef = useRef<string>("CoinGecko");
  const fetchingRef = useRef<boolean>(false);
  const initialLoadDoneRef = useRef<boolean>(false);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastSuccessfulChartDataRef = useRef<
    Record<string, Record<TimeRange, number[]>>
  >({});
  const chartDataCacheRef = useRef<Record<string, Record<TimeRange, number[]>>>(
    {}
  ); // Add chartDataCacheRef

  // Hook for crypto data
  const { coins, status, error, getCoinData, getDateLabels } =
    useCryptoData("USDT");

  // Initialize cache for the selected coin
  useEffect(() => {
    if (!lastSuccessfulChartDataRef.current[selectedCoin.symbol]) {
      lastSuccessfulChartDataRef.current[selectedCoin.symbol] = {
        "1D": [],
        "1W": [],
        "1M": [],
        "3M": [],
        "1Y": [],
      };
    }
    if (!chartDataCacheRef.current[selectedCoin.symbol]) {
      chartDataCacheRef.current[selectedCoin.symbol] = {
        "1D": [],
        "1W": [],
        "1M": [],
        "3M": [],
        "1Y": [],
      };
    }
  }, [selectedCoin]);

  // Update the component to display the data source
  // First, add a new state to track the data source
  const [dataSource, setDataSource] = useState<string>("Loading...");
  console.log(dataSource);
  // Add a new state for tracking request status
  const [requestStatus, setRequestStatus] = useState<string>("");

  // ===== DATA FETCHING =====
  // Fetch data function
  const fetchData = async (isMounted: boolean) => {
    if (!isMounted || fetchingRef.current) return;

    // Throttle updates to every 20 seconds
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 20000) return;

    lastUpdateTimeRef.current = now;
    fetchingRef.current = true;
    setIsRefreshing(true);

    // Define the order of APIs to try
    const apiSources = [
      "Binance",
      "CoinGecko",
      "Bybit",
      "KuCoin",
      "Bitfinex",
      "Bitstamp",
      "Kraken",
    ];
    let success = false;
    const triedApis: string[] = [];

    try {
      for (const apiSource of apiSources) {
        if (!isMounted) return;

        // Add this API to the list of tried APIs
        triedApis.push(apiSource);

        // Update request status to show all APIs being tried
        setRequestStatus(`Trying: ${triedApis.join(" → ")}...`);

        const {
          chartData: coinChartData,
          success: apiSuccess,
          source,
        } = await getCoinData(selectedCoin.symbol, timeRange);

        if (!isMounted) return;

        if (apiSuccess && coinChartData && coinChartData.length > 0) {
          // Valid data received
          setChartData(coinChartData);
          if (!lastSuccessfulChartDataRef.current[selectedCoin.symbol]) {
            lastSuccessfulChartDataRef.current[selectedCoin.symbol] =
              {} as Record<TimeRange, number[]>;
          }
          lastSuccessfulChartDataRef.current[selectedCoin.symbol][timeRange] =
            coinChartData;
          dataSourceRef.current = source || "Unknown";
          setDataSource(source || "Unknown");
          setHasValidData(true);
          setRequestStatus(
            `✓ Data loaded from ${source} (tried: ${triedApis.join(", ")})`
          );
          success = true;
          break;
        } else {
          // This API failed, update status to show we're falling back
          setRequestStatus(`${apiSource} failed, trying next API...`);
        }
      }

      if (!success) {
        // If all APIs failed, don't generate fallback data
        setChartData([]);
        dataSourceRef.current = "None";
        setDataSource("None");
        setHasValidData(false);
        setRequestStatus(`✗ All APIs failed (${triedApis.join(", ")})`);
      }

      initialLoadDoneRef.current = true;
    } catch (error) {
      console.error("Error fetching chart data:", error);

      if (!isMounted) return;

      if (
        lastSuccessfulChartDataRef.current[selectedCoin.symbol]?.[timeRange]
          ?.length > 0
      ) {
        // Use cached data if available
        setChartData(
          lastSuccessfulChartDataRef.current[selectedCoin.symbol][timeRange]
        );
        dataSourceRef.current = "Cached";
        setDataSource("Cached");
        setHasValidData(true);
        setRequestStatus(
          `⚠️ Error with APIs (${triedApis.join(", ")}). Using cached data.`
        );
      } else {
        // Don't generate fallback data
        setChartData([]);
        dataSourceRef.current = "None";
        setDataSource("None");
        setHasValidData(false);
        setRequestStatus(`⚠️ No historical data found`);
      }
    } finally {
      if (isMounted) {
        setIsRefreshing(false);
        fetchingRef.current = false;
      }
    }
  };

  // Initial data fetch and auto-refresh
  useEffect(() => {
    let isMounted = true;

    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) return;

    fetchData(isMounted);

    // Auto-refresh interval
    const refreshInterval = setInterval(() => {
      if (!fetchingRef.current && initialLoadDoneRef.current) {
        fetchData(isMounted);
      }
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, [timeRange, selectedCoin]);

  // ===== EVENT HANDLERS =====
  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing || fetchingRef.current) return;

    fetchingRef.current = true;
    setIsRefreshing(true);

    // Clear cached data for this symbol and time range to force a fresh API fetch
    if (chartDataCacheRef.current[selectedCoin.symbol]) {
      chartDataCacheRef.current[selectedCoin.symbol][timeRange] = [];
    }

    try {
      const {
        chartData: coinChartData,
        success,
        source,
      } = await getCoinData(selectedCoin.symbol, timeRange, true); // Pass true to force refresh

      if (success && coinChartData && coinChartData.length > 0) {
        setChartData(coinChartData);
        if (!lastSuccessfulChartDataRef.current[selectedCoin.symbol]) {
          lastSuccessfulChartDataRef.current[selectedCoin.symbol] =
            {} as Record<TimeRange, number[]>;
        }
        lastSuccessfulChartDataRef.current[selectedCoin.symbol][timeRange] =
          coinChartData;
        dataSourceRef.current = source || "Unknown";
        setDataSource(source || "Unknown");
        setHasValidData(true);
      } else {
        // If API fetch fails, fall back to cached data
        if (
          lastSuccessfulChartDataRef.current[selectedCoin.symbol]?.[timeRange]
            ?.length > 0
        ) {
          setChartData(
            lastSuccessfulChartDataRef.current[selectedCoin.symbol][timeRange]
          );
          dataSourceRef.current = "Cached";
          setDataSource("Cached");
          setHasValidData(true);
        } else {
          setHasValidData(false);
        }
      }
    } catch (error) {
      console.error("Error refreshing chart data:", error);
      if (
        lastSuccessfulChartDataRef.current[selectedCoin.symbol]?.[timeRange]
          ?.length > 0
      ) {
        setChartData(
          lastSuccessfulChartDataRef.current[selectedCoin.symbol][timeRange]
        );
        dataSourceRef.current = "Cached";
        setDataSource("Cached");
        setHasValidData(true);
      } else {
        setHasValidData(false);
      }
    } finally {
      if (hasValidData) {
        setIsRefreshing(false);
      }
      fetchingRef.current = false;
    }
  };

  // Handle chart hover with debouncing
  const handleChartHover = useCallback(
    (value: number | null, x: number, y: number) => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      tooltipTimeoutRef.current = setTimeout(() => {
        if (value === null) {
          setTooltip((prev) => ({ ...prev, visible: false }));
        } else {
          setTooltip({
            x,
            y,
            value,
            visible: true,
          });
        }
      }, 10);
    },
    []
  );

  // Clean up tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // ===== UTILITY FUNCTIONS =====
  // Status indicator color
  const getStatusColor = (status: CryptoStatus) => {
    switch (status) {
      case 2:
        return "text-green-500"; // active
      case 1:
        return "text-yellow-500"; // open
      case 0:
        return "text-gray-500"; // closed
      case -1:
        return "text-error"; // error
      default:
        return "text-gray-500";
    }
  };

  // ===== DATA PROCESSING =====
  // Get date labels based on time range
  const dateLabels = getDateLabels(timeRange);

  // Get coin data
  const coinData = coins.find((c) => c.symbol === selectedCoin.symbol);

  // Calculate price and chart metrics
  const currentPrice = coinData ? coinData.lastPrice : 0;
  const priceChangePercent = coinData ? coinData.priceChangePercent : 0;
  const isPriceUp = priceChangePercent >= 0;

  // Calculate chart range values
  const chartMax = chartData.length > 0 ? Math.max(...chartData) : 3100;
  const chartMin = chartData.length > 0 ? Math.min(...chartData) : 2900;
  const chartMid = (chartMax + chartMin) / 2;

  // Add a useEffect to handle clicking outside the search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add a function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCoins([]);
      return;
    }

    // Filter coins from the WebSocket data - this already contains real-time price data
    const results = coins
      .filter(
        (coin) =>
          coin.symbol.toLowerCase().includes(query) ||
          coin.baseAsset.toLowerCase().includes(query)
      )
      .sort((a, b) => b.quoteVolume - a.quoteVolume) // Sort by volume (highest first)
      .slice(0, 50); // Limit to 50 results for performance

    setFilteredCoins(results);
  };

  // Add a function to format coin for display
  const formatCoinForDisplay = (coin: CoinData) => {
    return {
      symbol: coin.symbol,
      name: coin.baseAsset,
      shortName: coin.baseAsset,
      iconColor: getCoinIconColor(coin.symbol),
    };
  };

  // Update the handleCoinChange function
  const handleCoinChange = (coin: coin) => {
    // Create a standardized coin object
    const standardizedCoin = {
      symbol: coin.symbol,
      name: coin.name || coin.baseAsset,
      shortName: coin.shortName || coin.baseAsset,
      iconColor: coin.iconColor || getCoinIconColor(coin.symbol),
    };

    setSelectedCoin(standardizedCoin);
    setShowCoinDropdown(false);
    setSearchQuery("");
    setFilteredCoins([]);
    setIsRefreshing(true);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // ===== RENDER =====
  return (
    <div className='w-full h-full bg-card text-text rounded-[20px] overflow-hidden p-3 border-0 font-sans'>
      {/* Header */}
      <div className='flex justify-between items-start mb-2'>
        {/* Replace the coin dropdown UI in the render section with this improved version */}
        <div className='flex items-center gap-2 relative'>
          <button
            onClick={() => setShowCoinDropdown(!showCoinDropdown)}
            className='flex items-center gap-2 hover:bg-hover rounded-full p-1'
          >
            <CoinIcon symbol={selectedCoin.symbol} size={24} />
            <div>
              <h2 className='text-base font-normal tracking-wide text-text'>
                {selectedCoin.shortName}
              </h2>
            </div>
            <ChevronDown size={14} />
          </button>

          {showCoinDropdown && (
            <div className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center'>
              <div className='bg-background rounded-lg shadow-xl w-[90%] max-w-md max-h-[80vh] overflow-hidden'>
                <div className='p-4 border-b border-border flex justify-between items-center'>
                  <h3 className='text-lg font-medium text-text'>
                    Select Cryptocurrency
                  </h3>
                  <button onClick={() => setShowCoinDropdown(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className='p-4'>
                  <div className='relative mb-4'>
                    <Search
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground'
                      size={18}
                    />
                    <input
                      ref={searchInputRef}
                      type='text'
                      placeholder='Search all coins...'
                      className='w-full  border-none rounded-md pl-10 pr-10 py-3 text-base input'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setIsSearchFocused(true)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-text'
                        onClick={() => setSearchQuery("")}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <div className='border-b border-border pb-2 mb-2'>
                    <h4 className='text-sm font-medium text-text flex items-center'>
                      <Flame className='mr-1 ' size={16} />
                      Trending Crypto
                    </h4>
                  </div>

                  <div className='max-h-[50vh] overflow-y-auto'>
                    {searchQuery.trim() === "" ? (
                      // Show featured coins when no search query
                      <>
                        {FEATURED_COINS.map((coin) => (
                          <button
                            key={coin.symbol}
                            className='flex items-center justify-between px-4 py-3 text-sm w-full text-left hover:bg-hover border-b border-border last:border-b-0 rounded-md'
                            onClick={() => {
                              handleCoinChange(coin);
                              setShowCoinDropdown(false);
                            }}
                          >
                            <div className='flex items-center gap-2'>
                              <CoinIcon symbol={coin.symbol} size={24} />
                              <div>
                                <div className='font-medium'>{coin.name}</div>
                                <div className='text-xs text-foreground'>
                                  {coin.shortName}
                                </div>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='font-medium'>
                                $
                                {(() => {
                                  const coinInfo = coins.find(
                                    (c) => c.symbol === coin.symbol
                                  );
                                  return coinInfo
                                    ? Number.parseFloat(
                                        coinInfo.lastPrice.toString()
                                      ).toFixed(2)
                                    : "0";
                                })()}
                              </div>
                              <div
                                className={`text-xs ${
                                  (() => {
                                    const coinInfo = coins.find(
                                      (c) => c.symbol === coin.symbol
                                    );
                                    return coinInfo
                                      ? coinInfo.priceChangePercent >= 0
                                      : isPriceUp;
                                  })()
                                    ? "text-[#22c55e]"
                                    : "text-error"
                                }`}
                              >
                                {(() => {
                                  const coinInfo = coins.find(
                                    (c) => c.symbol === coin.symbol
                                  );
                                  return coinInfo
                                    ? (coinInfo.priceChangePercent >= 0
                                        ? "+"
                                        : "") +
                                        coinInfo.priceChangePercent.toFixed(2)
                                    : "+0.00";
                                })()}
                                %
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : filteredCoins.length > 0 ? (
                      // Show search results
                      <>
                        <div className='px-4 py-2 text-xs text-foreground'>
                          {filteredCoins.length} results found
                        </div>
                        {filteredCoins.map((coin) => {
                          const formattedCoin = formatCoinForDisplay(coin);
                          const coinPriceChange = coin.priceChangePercent;
                          const isCoinPriceUp = coinPriceChange >= 0;

                          return (
                            <button
                              key={coin.symbol}
                              className='flex items-center justify-between px-4 py-3 text-sm w-full text-left hover:bg-hover border-b border-border last:border-b-0 rounded-md'
                              onClick={() => {
                                handleCoinChange(formattedCoin);
                                setShowCoinDropdown(false);
                              }}
                            >
                              <div className='flex items-center gap-2'>
                                <CoinIcon symbol={coin.symbol} size={24} />
                                <div>
                                  <div className='font-medium'>
                                    {formattedCoin.name}
                                  </div>
                                  <div className='text-xs text-foreground'>
                                    {coin.symbol}
                                  </div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='font-medium'>
                                  $
                                  {Number.parseFloat(coin.lastPrice.toString())}
                                </div>
                                <div
                                  className={`text-xs ${
                                    isCoinPriceUp
                                      ? "text-[#22c55e]"
                                      : "text-error"
                                  }`}
                                >
                                  {isCoinPriceUp ? "+" : ""}
                                  {coinPriceChange.toFixed(2)}%
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </>
                    ) : (
                      // No results found
                      <div className='px-4 py-6 text-sm text-foreground text-center'>
                        No coins found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center ${getStatusColor(status)}`}
            title={error || "Connection status"}
          >
            {status === 2 ? <Wifi size={14} /> : <WifiOff size={14} />}
          </div>
          <button
            onClick={handleRefresh}
            className='p-1 rounded-full bg-badge hover:bg-hover'
            aria-label='Refresh data'
            disabled={isRefreshing}
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Price and Change */}
      <div className='flex items-center gap-3 mb-2'>
        <div className='text-lg font-semibold text-text'>
          ${Number.parseFloat(currentPrice.toString())}
        </div>
        <div
          className={`text-xs ${
            isPriceUp ? "text-[#22c55e]" : "text-error"
          } font-medium`}
        >
          {isPriceUp ? "+" : ""}
          {priceChangePercent.toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <div className='mt-1 relative'>
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-foreground py-1 font-medium'>
          <span>
            {chartMax > 1000
              ? chartMax.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : chartMax > 1
              ? chartMax.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : chartMax.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                })}
          </span>
          <span>
            {chartMid > 1000
              ? chartMid.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : chartMid > 1
              ? chartMid.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : chartMid.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                })}
          </span>
          <span>
            {chartMin > 1000
              ? chartMin.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : chartMin > 1
              ? chartMin.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : chartMin.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                })}
          </span>
        </div>
        <div className='ml-6 relative' ref={containerRef}>
          {isRefreshing ? (
            <div className='flex items-center justify-center h-[80px]'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-border'></div>
            </div>
          ) : !hasValidData || chartData.length === 0 ? (
            <div className='flex items-center justify-center h-[80px] text-center'>
              <div className='text-foreground text-sm'>
                No historical data found
              </div>
            </div>
          ) : (
            <EnhancedChart
              data={chartData}
              width={chartSize.width}
              height={chartSize.height}
              lineColor={isPriceUp ? "#22c55e" : "#ef4444"}
              fillColor={
                isPriceUp ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"
              }
              gridColor='#1a2635'
              isDarkMode={true}
              showGrid={true}
              showTooltip={true}
              animate={true}
              onHover={handleChartHover}
            />
          )}

          {tooltip.visible && hasValidData && !isRefreshing && (
            <div
              className={`absolute bg-card text-text text-xs py-1 px-2 rounded pointer-events-none z-50 font-medium shadow-lg transition-all duration-100 ease-out border ${
                isPriceUp ? "border-[#22c55e]" : "border-error"
              }`}
              style={{
                left: `${tooltip.x}px`,
                top:
                  tooltip.y > 40
                    ? `${tooltip.y - 25}px`
                    : `${tooltip.y + 10}px`,
                transform: "translateX(-50%)",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              $
              {tooltip.value > 1000
                ? tooltip.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : tooltip.value > 1
                ? tooltip.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })
                : tooltip.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 8,
                  })}
            </div>
          )}
        </div>
      </div>

      {/* Date Labels */}
      <div className='flex justify-between text-[10px] text-foreground mt-1 px-1 font-medium'>
        {dateLabels.map((date, index) => (
          <div key={index} className='flex flex-col items-center'>
            <span>{date}</span>
          </div>
        ))}
      </div>

      {/* Footer hidden as requested */}
      {/* Footer with request status */}
      <div className='mt-1 text-[9px] text-foreground text-center border-t border-border pt-1'>
        {requestStatus}
      </div>
    </div>
  );
}
