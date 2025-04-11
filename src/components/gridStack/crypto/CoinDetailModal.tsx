"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Star } from "lucide-react";
import {
  useCryptoData,
  type CoinData,
  type TimeRange,
} from "@/hooks/use-crypto-data";

import CoinIcon from "./CoinIcon";
import EnhancedChart from "./CryptoChart";

type CoinDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialCoin: CoinData | null;
  allCoins: CoinData[];
  onSelectCoin?: (coin: CoinData) => void;
};

type ExtendedTimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "2Y";

export default function CoinDetailModal({
  isOpen,
  onClose,
  initialCoin,
  allCoins,
  onSelectCoin,
}: CoinDetailModalProps) {
  // State
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(
    initialCoin
  );
  // Change the default time range from "YTD" to "1D"
  const [timeRange, setTimeRange] = useState<ExtendedTimeRange>("1D");
  const [chartData, setChartData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>("Loading...");
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
  // Change the default chart type from "line" to "area" to match the image

  const [conversionAmount, setConversionAmount] = useState("1");
  const [exchangesVisible, setExchangesVisible] = useState(false);
  // Update the currency state to include a proper handler
  const [currency, setCurrency] = useState<
    "USD" | "EUR" | "GBP" | "JPY" | "CNY"
  >("USD");
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
  };
  const conversionRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 149.5,
    CNY: 7.2,
  };
  // Update the tab state to remove "about" option
  const [tab, setTab] = useState<"chart" | "stats">("chart");
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Add a state for bookmarked coins
  const [bookmarkedCoins, setBookmarkedCoins] = useState<CoinData[]>([]);
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [chartMax, setChartMax] = useState(0);
  const [chartMin, setChartMin] = useState(0);
  const [requestStatus, setRequestStatus] = useState<string>("");
  console.log(requestStatus);
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const { getCoinData } = useCryptoData("USDT");

  // Convert ExtendedTimeRange to TimeRange for API calls
  const getApiTimeRange = (range: ExtendedTimeRange): TimeRange => {
    switch (range) {
      case "1D":
      case "1W":
      case "1M":
      case "3M":
      case "1Y":
        return range;
      case "6M":
      case "YTD":
      case "2Y":
        return "1Y"; // Fallback to 1Y for ranges we don't have specific API endpoints for
      default:
        return "1M";
    }
  };

  // Add this function to generate fallback data when API calls fail

  // Improve the fetchData function with better error handling and loading state management
  const fetchData = useCallback(
    async (manualRefresh = false) => {
      if (!selectedCoin) return;

      // Only show loading indicator on initial load or manual refresh
      const shouldShowLoading = chartData.length === 0 || manualRefresh;
      if (shouldShowLoading) {
        setIsLoading(true);
      }

      try {
        const apiTimeRange = getApiTimeRange(timeRange);
        const {
          chartData: data,
          success,
          source,
        } = await getCoinData(selectedCoin.symbol, apiTimeRange, manualRefresh);

        if (success && data.length > 0) {
          // Calculate chart min and max values for vertical scale
          const max = Math.max(...data);
          const min = Math.min(...data);
          // Add some padding to the min/max values for better visualization
          setChartMax(max + (max - min) * 0.05);
          setChartMin(min - (max - min) * 0.05);

          // Set the chart data
          setChartData(data);
          setDataSource(source);
          setRequestStatus(`✓ Data loaded from ${source}`);
        } else {
          // Don't generate fallback data if API fails
          setChartData([]);
          setDataSource("None");
          setRequestStatus("⚠️ No historical data available");
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Don't generate fallback data on error
        setChartData([]);
        setDataSource("None");
        setRequestStatus("⚠️ Error loading data, no historical data available");
      } finally {
        if (shouldShowLoading) {
          setIsLoading(false);
        }
      }
    },
    [selectedCoin, timeRange, getCoinData]
  );

  // Load chart data when coin or time range changes
  useEffect(() => {
    if (!selectedCoin) return;
    fetchData(false);
  }, [selectedCoin, timeRange, fetchData]);

  // Update selected coin when initialCoin changes
  useEffect(() => {
    if (initialCoin) {
      setSelectedCoin(initialCoin);
    }
  }, [initialCoin]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Clean up tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      try {
        const savedBookmarks = localStorage.getItem("cryptoWidgetBookmarks");
        if (savedBookmarks) {
          const bookmarkedSymbols = JSON.parse(savedBookmarks) as string[];
          setIsBookmarked(bookmarkedSymbols.includes(selectedCoin.symbol));
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    }
  }, [selectedCoin]);

  // Add this useEffect to load bookmarked coins
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("cryptoWidgetBookmarks");
      if (savedBookmarks) {
        const bookmarkedSymbols = JSON.parse(savedBookmarks) as string[];
        const bookmarked = allCoins.filter((coin) =>
          bookmarkedSymbols.includes(coin.symbol)
        );
        setBookmarkedCoins(bookmarked);
      }

      // Set top coins by volume
      const sorted = [...allCoins]
        .sort((a, b) => b.quoteVolume - a.quoteVolume)
        .slice(0, 10);
      setTopCoins(sorted);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, [allCoins]);

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

  // Format large numbers with commas
  const formatNumber = (num: number, decimals = 2): string => {
    if (!num && num !== 0) return "-";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Update the formatPrice function to use the selected currency
  const formatPrice = (price: number): string => {
    const convertedPrice = price * conversionRates[currency];
    return currencySymbols[currency] + formatNumber(convertedPrice);
  };

  // Calculate market cap (estimated)
  const calculateMarketCap = (coin: CoinData): number => {
    // This is a rough estimate - in a real app you'd get this from an API
    const circulatingSupply =
      {
        BTC: 19500000,
        ETH: 120000000,
        BNB: 155000000,
        SOL: 430000000,
        XRP: 53000000000,
        ADA: 35000000000,
        DOGE: 140000000000,
        DOT: 1200000000,
        MATIC: 9000000000,
        AVAX: 350000000,
        SHIB: 58900000000000,
      }[coin.baseAsset] || 0;

    return coin.lastPrice * circulatingSupply;
  };

  // Toggle bookmark function
  const toggleBookmark = useCallback(() => {
    if (!selectedCoin) return;

    try {
      const savedBookmarks =
        localStorage.getItem("cryptoWidgetBookmarks") || "[]";
      let bookmarkedSymbols = JSON.parse(savedBookmarks) as string[];

      if (isBookmarked) {
        bookmarkedSymbols = bookmarkedSymbols.filter(
          (symbol) => symbol !== selectedCoin.symbol
        );
      } else {
        bookmarkedSymbols.push(selectedCoin.symbol);
      }

      localStorage.setItem(
        "cryptoWidgetBookmarks",
        JSON.stringify(bookmarkedSymbols)
      );
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  }, [selectedCoin, isBookmarked]);

  // Conversion calculator function
  const calculateConversion = useCallback(
    (amount: string, price: number, currency: string): string => {
      const numAmount = Number.parseFloat(amount);
      if (isNaN(numAmount)) return "0";

      const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 149.5,
        CNY: 7.2,
      };

      const convertedValue =
        numAmount * price * rates[currency as keyof typeof rates];
      return convertedValue.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    },
    []
  );

  // Share function
  const shareCoin = useCallback(() => {
    if (!selectedCoin) return;

    // In a real app, this would use the Web Share API or create a sharable link
    const shareText = `Check out ${selectedCoin.baseAsset} (${selectedCoin.symbol}) - currently priced at $${selectedCoin.lastPrice}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${selectedCoin.baseAsset} Price Info`,
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => alert("Share text copied to clipboard"))
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  }, [selectedCoin]);

  // Download chart function
  const downloadChart = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas || !selectedCoin) return;

    // Create a temporary link to download the chart
    const link = document.createElement("a");
    link.download = `${selectedCoin.baseAsset}-chart.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [selectedCoin]);

  // If modal is not open or no coin is selected, don't render
  if (!isOpen || !selectedCoin) return null;

  // Calculate price change values
  // const priceChange = selectedCoin.priceChange;
  const priceChangePercent = selectedCoin.priceChangePercent;
  const isPriceUp = priceChangePercent >= 0;

  // Calculate market cap
  const marketCap = calculateMarketCap(selectedCoin);
  const marketCapFormatted =
    marketCap >= 1e9
      ? `${(marketCap / 1e9).toFixed(1)}B`
      : `${(marketCap / 1e6).toFixed(1)}M`;

  // Calculate 52-week high and low (simulated)
  const weekHigh = selectedCoin.lastPrice * 2.5;
  const weekLow = selectedCoin.lastPrice * 0.7;

  // Calculate average volume (simulated)
  const avgVolume = selectedCoin.quoteVolume * 0.8;

  // Get dates for x-axis (simulated for 1M view)

  // Replace the entire return statement with this ISO-style version
  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center  bg-black bg-opacity-75'
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        ref={modalRef}
        className='relative bg-[#0a0a0a] text-white max-h-[580px] overflow-y-auto rounded-xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-800/30'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Improved with better spacing and visual hierarchy */}
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-800/50 bg-gradient-to-r from-[#0f0f0f] to-[#111]'>
          <div className='flex items-center gap-3'>
            <CoinIcon
              symbol={selectedCoin.symbol}
              size={36}
              className='rounded-full'
            />
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl font-semibold tracking-tight text-white'>
                  {selectedCoin.baseAsset}/{selectedCoin.quoteAsset}
                </h2>
                <button
                  onClick={toggleBookmark}
                  className={`text-${
                    isBookmarked ? "yellow-400" : "gray-500"
                  } hover:text-yellow-400 focus:outline-none transition-colors duration-200`}
                  title={
                    isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                  }
                >
                  <Star size={18} fill={isBookmarked ? "#facc15" : "none"} />
                </button>
              </div>
              <span className='text-gray-400 text-sm'>
                {selectedCoin.baseAsset} {selectedCoin.quoteAsset}
              </span>
            </div>
          </div>
          {/* Update the header section to include a loading state for the refresh button */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() => fetchData(true)}
              className='p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700'
              aria-label='Refresh data'
              title='Refresh data'
              disabled={isLoading}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`text-gray-400 hover:text-white ${
                  isLoading ? "animate-spin" : ""
                }`}
              >
                <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
                <path d='M3 3v5h5' />
                <path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' />
                <path d='M16 21h5v-5' />
              </svg>
            </button>
            <button
              onClick={onClose}
              className='p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700'
              aria-label='Close modal'
            >
              <X size={20} className='text-gray-400' />
            </button>
          </div>
        </div>

        {/* Tabs - Improved with better visual feedback */}
        <div className='flex border-b border-gray-800/50 px-6 bg-[#0c0c0c]'>
          <button
            className={`px-4 py-3 text-sm font-medium relative ${
              tab === "chart"
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                : "text-gray-400 hover:text-gray-200"
            } transition-colors duration-200`}
            onClick={() => setTab("chart")}
          >
            Chart
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium relative ${
              tab === "stats"
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                : "text-gray-400 hover:text-gray-200"
            } transition-colors duration-200`}
            onClick={() => setTab("stats")}
          >
            Statistics
          </button>
        </div>

        {/* Price and Market Cap - Improved with better visual hierarchy */}
        <div className='flex items-start justify-between px-6 pt-4 pb-2'>
          <div className='flex flex-col'>
            <div className='text-2xl font-bold'>
              {formatPrice(selectedCoin.lastPrice)}
            </div>
            <div
              className={`flex items-center text-sm ${
                isPriceUp ? "text-green-500" : "text-red-500"
              } mt-0.5`}
            >
              <span className='flex items-center'>
                {isPriceUp ? (
                  <svg
                    className='w-4 h-4 mr-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 5L19 12L17.6 13.4L13 8.8V19H11V8.8L6.4 13.4L5 12L12 5Z'
                      fill='currentColor'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-4 h-4 mr-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 19L5 12L6.4 10.6L11 15.2V5H13V15.2L17.6 10.6L19 12L12 19Z'
                      fill='currentColor'
                    />
                  </svg>
                )}
                {Math.abs(priceChangePercent).toFixed(2)}%
              </span>
              <span className='text-gray-400 text-xs ml-2'>24h</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={downloadChart}
              className='p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors'
              title='Download Chart'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                <polyline points='7 10 12 15 17 10'></polyline>
                <line x1='12' y1='15' x2='12' y2='3'></line>
              </svg>
            </button>
            <button
              onClick={shareCoin}
              className='p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors'
              title='Share'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='18' cy='5' r='3'></circle>
                <circle cx='6' cy='12' r='3'></circle>
                <circle cx='18' cy='19' r='3'></circle>
                <line x1='8.59' y1='13.51' x2='15.42' y2='17.49'></line>
                <line x1='15.41' y1='6.51' x2='8.59' y2='10.49'></line>
              </svg>
            </button>
          </div>
        </div>

        {tab === "chart" && (
          <>
            {/* Chart Controls - Improved with better visual design */}
            <div className='flex justify-between items-center px-6 mt-2'>
              <div className='flex gap-1 bg-[#111] p-1 rounded-lg'>
                {(
                  [
                    "1D",
                    "1W",
                    "1M",
                    "3M",
                    "6M",
                    "YTD",
                    "1Y",
                    "2Y",
                  ] as ExtendedTimeRange[]
                ).map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      timeRange === range
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    }`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart - Improved with better styling */}
            <div className='relative h-[280px] px-6 mt-3'>
              <div className='absolute inset-0 bg-[#0f0f0f] rounded-lg overflow-hidden border border-gray-800/20'>
                {isLoading ? (
                  <div className='absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/80 backdrop-blur-sm z-10'>
                    <div className='flex flex-col items-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                      <div className='mt-2 text-sm text-gray-400'>
                        Loading chart data...
                      </div>
                    </div>
                  </div>
                ) : chartData.length > 0 ? (
                  <>
                    {/* Vertical price labels on the left side */}
                    <div className='absolute left-4 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 py-2 font-medium'>
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
                        {(chartMax + chartMin) / 2 > 1000
                          ? ((chartMax + chartMin) / 2).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )
                          : (chartMax + chartMin) / 2 > 1
                          ? ((chartMax + chartMin) / 2).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }
                            )
                          : ((chartMax + chartMin) / 2).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 6,
                              }
                            )}
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

                    <div className='ml-12 pr-4 pt-2 pb-8 w-full h-full'>
                      {/* Update the EnhancedChart's onReload prop to use the improved fetchData function */}
                      <EnhancedChart
                        data={chartData}
                        width={700}
                        height={220}
                        lineColor={isPriceUp ? "#22c55e" : "#ef4444"}
                        fillColor={
                          isPriceUp
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(239, 68, 68, 0.15)"
                        }
                        gridColor='#1a1a1a'
                        isDarkMode={true}
                        showGrid={true}
                        showTooltip={true}
                        animate={false}
                        onHover={handleChartHover}
                        onReload={() => fetchData(false)}
                        refreshInterval={60000} // Match the widget refresh interval
                      />

                      {tooltip.visible && (
                        <div
                          className={`absolute bg-[#1e293b]/90 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-lg pointer-events-none z-50 font-medium shadow-xl transition-all duration-100 ease-out border ${
                            isPriceUp
                              ? "border-green-500/30"
                              : "border-red-500/30"
                          }`}
                          style={{
                            left: `${tooltip.x}px`,
                            top:
                              tooltip.y > 60
                                ? `${tooltip.y - 25}px`
                                : `${tooltip.y + 10}px`,
                            transform: "translateX(-50%)",
                            boxShadow:
                              "0 4px 20px -1px rgba(0, 0, 0, 0.3), 0 2px 10px -1px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {currencySymbols[currency]}
                          {tooltip.value * conversionRates[currency] > 1000
                            ? (
                                tooltip.value * conversionRates[currency]
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              })
                            : tooltip.value * conversionRates[currency] > 1
                            ? (
                                tooltip.value * conversionRates[currency]
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 4,
                              })
                            : (
                                tooltip.value * conversionRates[currency]
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 8,
                              })}
                        </div>
                      )}
                    </div>

                    {/* Horizontal time labels at the bottom of the chart */}
                    <div className='absolute bottom-0 left-12 right-4 flex justify-between text-[10px] text-gray-500 pb-1'>
                      {(() => {
                        // Generate appropriate date labels based on time range
                        const today = new Date();
                        const labels = [];
                        const currentYear = today.getFullYear();

                        switch (timeRange) {
                          case "1D":
                            // Show hours for 1D with AM/PM format - 5 evenly spaced points
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setHours(today.getHours() - 24 + i * 6);
                              // Format as 1AM, 7AM, 1PM, 7PM, 1AM
                              labels.push(
                                date
                                  .toLocaleTimeString([], {
                                    hour: "numeric",
                                    hour12: true,
                                  })
                                  .replace(" ", "")
                              );
                            }
                            break;
                          case "1W":
                            // Show days for 1W
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() - 7 + i * 1.75);
                              labels.push(
                                date.toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })
                              );
                            }
                            break;
                          case "1M":
                            // Show weeks for 1M
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() - 30 + i * 7.5);
                              labels.push(
                                date.toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })
                              );
                            }
                            break;
                          case "3M":
                            // Show months for 3M
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setMonth(today.getMonth() - 3 + i * 0.75);
                              labels.push(
                                date.toLocaleDateString([], { month: "short" })
                              );
                            }
                            break;
                          case "6M":
                            // Show months for 6M
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setMonth(today.getMonth() - 6 + i * 1.5);
                              labels.push(
                                date.toLocaleDateString([], { month: "short" })
                              );
                            }
                            break;
                          case "YTD": {
                            // Show months from January to current month
                            const currentMonth = today.getMonth();
                            const monthsToShow = 5;
                            for (let i = 0; i < monthsToShow; i++) {
                              const month = Math.floor(
                                i * (currentMonth / (monthsToShow - 1))
                              );
                              const date = new Date(currentYear, month, 1);
                              labels.push(
                                date.toLocaleDateString([], { month: "short" })
                              );
                            }
                            break;
                          }
                          case "1Y":
                            // Show quarters for 1Y
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setMonth(today.getMonth() - 12 + i * 3);
                              labels.push(
                                date.toLocaleDateString([], { month: "short" })
                              );
                            }
                            break;
                          case "2Y":
                            // Show half years for 2Y
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setMonth(today.getMonth() - 24 + i * 6);
                              labels.push(
                                date.toLocaleDateString([], {
                                  month: "short",
                                  year: "2-digit",
                                })
                              );
                            }
                            break;
                          default:
                            // Default to showing days
                            for (let i = 0; i < 5; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() - 5 + i);
                              labels.push(
                                date.toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })
                              );
                            }
                        }

                        return labels.map((label, index) => (
                          <div key={index} className='text-center'>
                            {label}
                          </div>
                        ));
                      })()}
                    </div>
                  </>
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-gray-500 text-sm'>
                    <div className='flex flex-col items-center'>
                      <svg
                        className='w-12 h-12 mb-2 text-gray-700'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                      <p>No chart data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {tab === "stats" && (
          <div className='p-6'>
            {/* Conversion Calculator - Improved with better styling */}
            <div className='mb-5 p-3 bg-[#111] rounded-lg border border-gray-800/30'>
              <div className='text-sm font-medium mb-2 text-gray-300'>
                Conversion Calculator
              </div>
              <div className='flex gap-3 items-center'>
                <input
                  type='number'
                  className='w-24 bg-[#1a1a1a] text-white border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Amount'
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                />
                <span className='text-sm flex items-center text-gray-300'>
                  {selectedCoin.baseAsset} =
                </span>
                <div className='flex-1 text-sm flex items-center font-medium'>
                  <span className='text-white'>
                    {calculateConversion(
                      conversionAmount,
                      selectedCoin.lastPrice,
                      currency
                    )}
                  </span>
                  <select
                    className='ml-2 bg-[#1a1a1a] border border-gray-800 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        e.target.value as "USD" | "EUR" | "GBP" | "JPY" | "CNY"
                      )
                    }
                  >
                    <option value='USD'>USD</option>
                    <option value='EUR'>EUR</option>
                    <option value='GBP'>GBP</option>
                    <option value='JPY'>JPY</option>
                    <option value='CNY'>CNY</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Grid - Improved with better styling */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Open</div>
                <div className='font-medium'>
                  {formatPrice(selectedCoin.lastPrice * 1.05)}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>High (24h)</div>
                <div className='font-medium'>
                  {formatPrice(selectedCoin.highPrice)}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Low (24h)</div>
                <div className='font-medium'>
                  {formatPrice(selectedCoin.lowPrice)}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Volume (24h)</div>
                <div className='font-medium'>
                  ${(selectedCoin.quoteVolume / 1e9).toFixed(2)}B
                </div>
              </div>

              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>52W High</div>
                <div className='font-medium'>{formatPrice(weekHigh)}</div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>52W Low</div>
                <div className='font-medium'>{formatPrice(weekLow)}</div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Avg Volume</div>
                <div className='font-medium'>
                  ${(avgVolume / 1e9).toFixed(2)}B
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Market Cap</div>
                <div className='font-medium'>${marketCapFormatted}</div>
              </div>

              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>
                  Circulating Supply
                </div>
                <div className='font-medium'>
                  {(marketCap / selectedCoin.lastPrice).toFixed(0)}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>Max Supply</div>
                <div className='font-medium'>
                  {selectedCoin.baseAsset === "BTC" ? "21,000,000" : "∞"}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>All-Time High</div>
                <div className='font-medium'>
                  {formatPrice(selectedCoin.lastPrice * 2.5)}
                </div>
              </div>
              <div className='bg-[#111] p-3 rounded-lg border border-gray-800/20 hover:border-gray-700/40 transition-colors'>
                <div className='text-gray-500 mb-1 text-xs'>All-Time Low</div>
                <div className='font-medium'>
                  {formatPrice(selectedCoin.lastPrice * 0.05)}
                </div>
              </div>
            </div>

            {/* Trading Volume by Exchange - Improved with better styling */}
            <div className='mt-5'>
              <button
                className='flex justify-between items-center w-full px-4 py-3 bg-[#111] rounded-lg text-sm font-medium border border-gray-800/20 hover:border-gray-700/40 transition-colors'
                onClick={() => setExchangesVisible(!exchangesVisible)}
              >
                <span>Trading Volume by Exchange</span>
                <span className='text-gray-400'>
                  {exchangesVisible ? "▲" : "▼"}
                </span>
              </button>

              {exchangesVisible && (
                <div className='mt-3 bg-[#0f0f0f] rounded-lg p-3 border border-gray-800/20'>
                  <div className='flex justify-between text-xs text-gray-500 mb-2 px-2 pb-2 border-b border-gray-800/30'>
                    <span>Exchange</span>
                    <span>Volume (24h)</span>
                  </div>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded-md transition-colors'>
                      <div className='flex items-center'>
                        <div className='w-5 h-5 bg-[#F0B90B] rounded-full mr-2 flex items-center justify-center text-[8px] font-bold text-black'>
                          B
                        </div>
                        <span>Binance</span>
                      </div>
                      <span>
                        ${((selectedCoin.quoteVolume * 0.4) / 1e9).toFixed(2)}B
                      </span>
                    </div>
                    <div className='flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded-md transition-colors'>
                      <div className='flex items-center'>
                        <div className='w-5 h-5 bg-[#0052FF] rounded-full mr-2 flex items-center justify-center text-[8px] font-bold text-white'>
                          C
                        </div>
                        <span>Coinbase</span>
                      </div>
                      <span>
                        ${((selectedCoin.quoteVolume * 0.25) / 1e9).toFixed(2)}B
                      </span>
                    </div>
                    <div className='flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded-md transition-colors'>
                      <div className='flex items-center'>
                        <div className='w-5 h-5 bg-[#5741D9] rounded-full mr-2 flex items-center justify-center text-[8px] font-bold text-white'>
                          K
                        </div>
                        <span>Kraken</span>
                      </div>
                      <span>
                        ${((selectedCoin.quoteVolume * 0.15) / 1e9).toFixed(2)}B
                      </span>
                    </div>
                    <div className='flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded-md transition-colors'>
                      <div className='flex items-center'>
                        <div className='w-5 h-5 bg-[#31D7A0] rounded-full mr-2 flex items-center justify-center text-[8px] font-bold text-white'>
                          K
                        </div>
                        <span>KuCoin</span>
                      </div>
                      <span>
                        ${((selectedCoin.quoteVolume * 0.1) / 1e9).toFixed(2)}B
                      </span>
                    </div>
                    <div className='flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded-md transition-colors'>
                      <div className='flex items-center'>
                        <div className='w-5 h-5 bg-[#444] rounded-full mr-2 flex items-center justify-center text-[8px] font-bold text-white'>
                          +
                        </div>
                        <span>Others</span>
                      </div>
                      <span>
                        ${((selectedCoin.quoteVolume * 0.1) / 1e9).toFixed(2)}B
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Currency selector and other coins - Improved with better styling */}
        <div className='mt-auto border-t border-gray-800/50'>
          <div className='flex justify-between px-6 py-3 bg-[#0c0c0c]'>
            <div className='flex gap-1'>
              {(
                Object.keys(currencySymbols) as Array<
                  keyof typeof currencySymbols
                >
              ).map((curr) => (
                <button
                  key={curr}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    currency === curr
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                  onClick={() => setCurrency(curr)}
                >
                  {curr}
                </button>
              ))}
            </div>
            <div className='text-xs text-gray-500 flex items-center'>
              <span className='mr-1'>Data source:</span>
              <span className='text-gray-300 font-medium'>{dataSource}</span>
            </div>
          </div>

          {/* Related coins section - Improved with better styling */}
          <div className='px-6 py-3 bg-[#0a0a0a]'>
            <div className='flex justify-between items-center mb-2'>
              <div className='text-sm font-medium text-gray-300'>
                Also check
              </div>
              {bookmarkedCoins.length > 0 && (
                <div className='text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full'>
                  {bookmarkedCoins.length} bookmarked
                </div>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              {/* Bookmarked coins section */}
              {bookmarkedCoins.length > 0 && (
                <div className='flex gap-2 overflow-x-auto py-1 no-scrollbar'>
                  {bookmarkedCoins
                    .filter((c) => c.symbol !== selectedCoin.symbol)
                    .slice(0, 5)
                    .map((coin) => (
                      <button
                        key={`bookmarked-${coin.symbol}`}
                        className='flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg whitespace-nowrap border border-yellow-800/20 transition-colors'
                        onClick={() => {
                          setSelectedCoin(coin);
                          if (onSelectCoin) onSelectCoin(coin);
                        }}
                      >
                        <CoinIcon symbol={coin.symbol} size={16} />
                        <span className='text-sm font-medium'>
                          {coin.baseAsset}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            coin.priceChangePercent >= 0
                              ? "bg-green-900/20 text-green-500"
                              : "bg-red-900/20 text-red-500"
                          }`}
                        >
                          {coin.priceChangePercent >= 0 ? "+" : ""}
                          {coin.priceChangePercent.toFixed(1)}%
                        </span>
                        <Star
                          size={10}
                          className='text-yellow-500'
                          fill='#eab308'
                        />
                      </button>
                    ))}
                </div>
              )}

              {/* Top coins section */}
              <div className='flex gap-2 flex-wrap py-1'>
                {topCoins
                  .filter(
                    (c) =>
                      c.symbol !== selectedCoin.symbol &&
                      !bookmarkedCoins.some((b) => b.symbol === c.symbol)
                  )
                  .slice(0, 10)
                  .map((coin) => (
                    <button
                      key={`top-${coin.symbol}`}
                      className='flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg whitespace-nowrap transition-colors'
                      onClick={() => {
                        setSelectedCoin(coin);
                        if (onSelectCoin) onSelectCoin(coin);
                      }}
                    >
                      <CoinIcon symbol={coin.symbol} size={16} />
                      <span className='text-sm font-medium'>
                        {coin.baseAsset}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          coin.priceChangePercent >= 0
                            ? "bg-green-900/20 text-green-500"
                            : "bg-red-900/20 text-red-500"
                        }`}
                      >
                        {coin.priceChangePercent >= 0 ? "+" : ""}
                        {coin.priceChangePercent.toFixed(1)}%
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
