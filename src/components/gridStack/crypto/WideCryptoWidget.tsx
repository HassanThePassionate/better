"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import {
  useCryptoData,
  type CryptoStatus,
  type TimeRange,
} from "@/hooks/use-crypto-data";
import EnhancedChart from "./CryptoChart";

export default function WideCryptoWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the crypto data hook to get real-time data
  const { status, error, getCoinData, getDateLabels } = useCryptoData("USDT");

  // Get ETH data with the selected time range
  const { coin: ethData, chartData: ethChartData } = getCoinData(
    "ETHUSDT",
    timeRange
  );

  // Get date labels based on time range
  const dateLabels = getDateLabels(timeRange);

  // Function to handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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
        return "text-red-500"; // error
      default:
        return "text-gray-500";
    }
  };

  // Handle chart hover with debouncing to prevent flickering
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
      }, 10); // Small delay to smooth out tooltip updates
    },
    []
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // Hide tooltip when changing time range
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Get current price and price change
  const currentPrice = ethData ? ethData.lastPrice : 0;
  const priceChangePercent = ethData ? ethData.priceChangePercent : 0;
  const isPriceUp = priceChangePercent >= 0;

  // Calculate price range based on chart data
  const chartMax = Math.max(...ethChartData);
  const chartMin = Math.min(...ethChartData);
  const chartMid = (chartMax + chartMin) / 2;

  return (
    <div className='w-full h-full bg-[#0f172a] text-white rounded-[20px] overflow-hidden p-3 border-0 font-sans'>
      <div className='flex justify-between items-start mb-2'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-[#e2e8f0] rounded-full flex items-center justify-center'>
            <svg
              width='16'
              height='26'
              viewBox='0 0 24 38'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M11.9978 0L11.8252 0.576379V24.0844L11.9978 24.2547L23.3725 18.0606L11.9978 0Z'
                fill='#343434'
              />
              <path
                d='M11.9978 0L0.623047 18.0606L11.9978 24.2547V12.9556V0Z'
                fill='#8C8C8C'
              />
              <path
                d='M11.9978 26.2856L11.9004 26.4044V35.1274L11.9978 35.4132L23.3771 19.9939L11.9978 26.2856Z'
                fill='#3C3C3B'
              />
              <path
                d='M11.9978 35.4132V26.2856L0.623047 19.9939L11.9978 35.4132Z'
                fill='#141414'
              />
              <path
                d='M11.9978 24.2547L23.3725 18.0606L11.9978 12.9556V24.2547Z'
                fill='#393939'
              />
              <path
                d='M0.623047 18.0606L11.9978 24.2547V12.9556L0.623047 18.0606Z'
                fill='#8C8C8C'
              />
            </svg>
          </div>
          <div>
            <h2 className='text-lg font-normal tracking-wide text-[#e2e8f0]'>
              Ethereum • ETH
            </h2>
            <div className='flex items-center gap-3 mb-2'>
              <div className='text-sm font-semibold text-[#f8fafc]'>
                ${currentPrice.toFixed(2)}
              </div>
              <div
                className={`text-sm ${
                  isPriceUp ? "text-[#22c55e]" : "text-red-500"
                } font-medium`}
              >
                {isPriceUp ? "+" : ""}
                {priceChangePercent.toFixed(2)}%
              </div>
              <div className='flex'>
                {(["1D", "1W", "1M"] as const).map((range) => (
                  <button
                    key={range}
                    className={`px-1.5 py-0.5 text-xs rounded-md ${
                      timeRange === range
                        ? "bg-[#334155] text-white"
                        : "text-gray-400 hover:bg-[#1e293b]"
                    }`}
                    onClick={() => handleTimeRangeChange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2 absolute top-2 right-2'>
        <div
          className={`flex items-center ${getStatusColor(status)}`}
          title={error || "Connection status"}
        >
          {status === 2 ? <Wifi size={14} /> : <WifiOff size={14} />}
        </div>
        <button
          onClick={handleRefresh}
          className='p-1 rounded-full bg-[#1e293b] hover:bg-[#334155]'
          aria-label='Refresh data'
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>
      <div className='mt-1 relative'>
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#64748b] py-1 font-medium'>
          <span>{chartMax.toFixed(1)}</span>
          <span>{chartMid.toFixed(1)}</span>
          <span>{chartMin.toFixed(1)}</span>
        </div>
        <div className='ml-9 relative' ref={containerRef}>
          <EnhancedChart
            data={ethChartData}
            width={260}
            height={80}
            lineColor='#4f8eff'
            fillColor='rgba(79, 142, 255, 0.2)'
            gridColor='#1a2635'
            isDarkMode={true}
            showGrid={true}
            showTooltip={true}
            animate={true}
            onHover={handleChartHover}
          />

          {tooltip.visible && (
            <div
              className='absolute bg-[#1e293b] text-white text-xs py-1 px-2 rounded pointer-events-none z-10 font-medium shadow-lg transition-all duration-100 ease-out'
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
              ${tooltip.value.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-between text-xs text-[#64748b] mt-1 px-1 font-medium'>
        {dateLabels.map((date, index) => (
          <div key={index} className='flex flex-col items-center'>
            <span>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
