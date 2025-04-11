"use client";

import type React from "react";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Wifi, WifiOff } from "lucide-react";
import {
  useCryptoData,
  type CoinData,
  type CryptoStatus,
} from "@/hooks/use-crypto-data";
import CoinIcon from "./CoinIcon";
import CoinDetailModal from "./CoinDetailModal";

// Type definitions
type SortField = "price" | "change" | "volume" | "name";
type SortDirection = "asc" | "desc";
type CoinWithChart = CoinData;

// Constants
const CURRENCY_SYMBOL = "$";
const REFRESH_DELAY = 1000;

/**
 * Top Coins Widget Component
 * Displays a list of top cryptocurrencies with sorting and filtering options
 */
export default function TopCoinsWidget() {
  // State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<SortField>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [topCoins, setTopCoins] = useState<CoinWithChart[]>([]);
  const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);
  // Update the component to display the data source
  // First, add a new state to track the data source

  const [dataSource, setDataSource] = useState<string>("Binance");
  console.log(dataSource);
  // Add these state variables inside the TopCoinsWidget component, after the existing state declarations
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs
  const dataSourceRef = useRef<string>("Binance");
  const fetchingRef = useRef<boolean>(false);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch crypto data
  const { coins, status, error } = useCryptoData("USDT");

  /**
   * Sorts coins based on field and direction
   */
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
        }

        return direction === "asc" ? comparison : -comparison;
      });
    },
    []
  );

  /**
   * Update top coins when data changes
   */
  useEffect(() => {
    if (coins.length === 0) return;

    // Initial setup of coins
    if (topCoins.length === 0) {
      // Sort coins by volume first to get top 10
      const sortedByVolume = [...coins]
        .sort((a, b) => b.quoteVolume - a.quoteVolume)
        .slice(0, 10);

      // Sort according to current sort settings
      const fullySorted = sortCoins(sortedByVolume, sortField, sortDirection);
      setTopCoins(fullySorted);
      dataSourceRef.current = "Binance";
      setDataSource("Binance");
    } else {
      // Just update prices, keeping the same coins
      const updatedCoins = topCoins.map((existingCoin) => {
        // Find updated coin data
        const updatedCoin = coins.find((c) => c.symbol === existingCoin.symbol);
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

      // Sort according to current sort settings
      const fullySorted = sortCoins(updatedCoins, sortField, sortDirection);
      setTopCoins(fullySorted);
    }
  }, [coins, sortField, sortDirection, sortCoins, topCoins.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  /**
   * Handle sort change
   */
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        // Set new field and default direction
        setSortField(field);
        setSortDirection(field === "name" ? "asc" : "desc");
      }
    },
    [sortField, sortDirection]
  );

  /**
   * Handle refresh button click
   */
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || fetchingRef.current) return;

    fetchingRef.current = true;
    setIsRefreshing(true);

    // Force update on next data change
    lastUpdateTimeRef.current = 0;

    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      fetchingRef.current = false;
    }, REFRESH_DELAY);
  }, [isRefreshing]);

  /**
   * Get status indicator color
   */
  const getStatusColor = useCallback((status: CryptoStatus): string => {
    switch (status) {
      case 2:
        return "text-green-500"; // active
      case 1:
        return "text-yellow-500"; // open
      case 0:
        return "text-gray-500"; // closed
      case -1:
        return "text-red-500"; // error
      default:
        return "text-gray-500";
    }
  }, []);

  /**
   * Format large numbers for display
   */
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(1);
  }, []);

  /**
   * Format price with appropriate decimal places
   */
  const formatPrice = useCallback((price: number): string => {
    if (!price || isNaN(price)) return CURRENCY_SYMBOL + "0";

    // For BTC and high-value coins
    if (price > 1000) {
      return (
        CURRENCY_SYMBOL +
        price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      );
    }

    // For medium-value coins
    if (price > 1) {
      return (
        CURRENCY_SYMBOL +
        price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }

    // For low-value coins
    if (price > 0.01) {
      return (
        CURRENCY_SYMBOL +
        price.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      );
    }

    // For very low-value coins like PEPE
    if (price > 0.00001) {
      return (
        CURRENCY_SYMBOL +
        price.toLocaleString(undefined, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })
      );
    }

    // For extremely low-value coins
    if (price > 0.00000001) {
      return (
        CURRENCY_SYMBOL +
        price.toLocaleString(undefined, {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        })
      );
    }

    // For anything smaller, use scientific notation
    return CURRENCY_SYMBOL + price.toExponential(2);
  }, []);

  // Add a click handler function inside the TopCoinsWidget component, before the return statement
  const handleCoinClick = (coin: CoinData) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  // Memoized column header components
  const ColumnHeaders = useMemo(
    () => (
      <div className='flex text-xs text-[#64748b] mb-2 border-b border-[#1e293b] pb-2 px-1'>
        <SortButton
          field='name'
          currentField={sortField}
          direction={sortDirection}
          onClick={handleSort}
          className='w-[110px]'
        >
          Asset
        </SortButton>
        <div className='flex-grow'></div>
        <SortButton
          field='price'
          currentField={sortField}
          direction={sortDirection}
          onClick={handleSort}
          className='w-[80px]'
        >
          Price
        </SortButton>
        <SortButton
          field='change'
          currentField={sortField}
          direction={sortDirection}
          onClick={handleSort}
          className='w-[70px]'
        >
          24h Change
        </SortButton>
        <SortButton
          field='volume'
          currentField={sortField}
          direction={sortDirection}
          onClick={handleSort}
          className='w-[80px]'
        >
          Volume
        </SortButton>
      </div>
    ),
    [sortField, sortDirection, handleSort]
  );

  // Render component
  return (
    <div className='w-[300px] h-[300px] bg-[#0f172a] text-white rounded-[20px] overflow-hidden p-3 border-0 font-sans'>
      {/* Header */}
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-lg font-medium tracking-wide text-[#e2e8f0]'>
          Top Cryptocurrencies
        </h2>
        <div className='flex gap-2'>
          <div
            className={`flex items-center ${getStatusColor(status)}`}
            title={error || "Connection status"}
          >
            {status === 2 ? <Wifi size={14} /> : <WifiOff size={14} />}
          </div>
          <button
            onClick={handleRefresh}
            className='p-1 rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors duration-200'
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

      {/* Column Headers */}
      {ColumnHeaders}

      {/* Coin list */}
      <div
        className='overflow-y-auto h-[210px] pr-1'
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>

        {isRefreshing ? (
          <LoadingSpinner />
        ) : topCoins.length > 0 ? (
          topCoins.map((coin) => (
            <CoinRow
              key={coin.symbol}
              coin={coin}
              isHovered={hoveredCoin === coin.symbol}
              onHoverChange={(isHovered) =>
                setHoveredCoin(isHovered ? coin.symbol : null)
              }
              formatPrice={formatPrice}
              formatNumber={formatNumber}
              onClick={() => handleCoinClick(coin)}
            />
          ))
        ) : (
          <div className='flex items-center justify-center h-full text-[#64748b]'>
            No data available
          </div>
        )}
      </div>

      {/* Footer hidden as requested */}
      {/* Coin Detail Modal */}
      <CoinDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCoin={selectedCoin}
        allCoins={coins}
        onSelectCoin={(coin) => {
          setSelectedCoin(coin);
          // You might want to update other state here if needed
        }}
      />
    </div>
  );
}

/**
 * Sort Button Component
 */
function SortButton({
  field,
  currentField,
  direction,
  onClick,
  className,
  children,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const isActive = currentField === field;

  return (
    <button
      className={`flex items-center gap-0.5 hover:text-white transition-colors duration-200 ${
        isActive ? "text-white" : ""
      } ${className || ""}`}
      onClick={() => onClick(field)}
    >
      {children}
      {isActive &&
        (direction === "asc" ? (
          <ChevronUp size={12} />
        ) : (
          <ChevronDown size={12} />
        ))}
    </button>
  );
}

/**
 * Loading Spinner Component
 */
function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
    </div>
  );
}

/**
 * Coin Row Component
 */
function CoinRow({
  coin,
  isHovered,
  onHoverChange,
  formatPrice,
  formatNumber,
  onClick,
}: {
  coin: CoinWithChart;
  isHovered: boolean;
  onHoverChange: (isHovered: boolean) => void;
  formatPrice: (price: number) => string;
  formatNumber: (num: number) => string;
  onClick?: () => void;
}) {
  const isPriceUp = coin.priceChangePercent >= 0;

  return (
    <div
      className={`flex items-center justify-between py-2 border-b border-[#1e293b] last:border-0 transition-colors duration-200 ${
        isHovered ? "bg-[#1e293b]" : "hover:bg-[#1e293b]/50"
      } cursor-pointer rounded px-1`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onClick}
    >
      <div className='flex items-center gap-2 w-[110px]'>
        <CoinIcon symbol={coin.symbol} size={24} />
        <div>
          <div className='text-sm font-medium truncate'>{coin.baseAsset}</div>
          <div className='text-xs text-[#64748b] truncate'>
            {coin.quoteAsset}
          </div>
        </div>
      </div>

      <div className='text-sm font-medium w-[80px]'>
        {formatPrice(coin.lastPrice)}
      </div>

      <div
        className={`text-xs font-medium w-[70px] ${
          isPriceUp ? "text-[#22c55e]" : "text-[#ef4444]"
        }`}
      >
        {isPriceUp ? "+" : ""}
        {coin.priceChangePercent.toFixed(2)}%
      </div>

      <div className='w-[80px]'>
        <div className='text-xs text-[#64748b]'>
          ${formatNumber(coin.quoteVolume)}
        </div>
      </div>
    </div>
  );
}
