"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { RefreshCw, WifiOff, Wifi } from "lucide-react";
import {
  useCryptoData,
  type CryptoStatus,
  type TimeRange,
} from "@/hooks/use-crypto-data";
import EnhancedChart from "./CryptoChart";

export default function CryptoWidget() {
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
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div className='w-full h-full bg-[#0f172a] text-white rounded-[16px] overflow-hidden p-3 border-0  relative'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 bg-[#e2e8f0] rounded-full flex items-center justify-center'>
            <svg
              width='14'
              height='22'
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
            <h2 className='text-sm font-normal tracking-wide text-[#e2e8f0]'>
              Ethereum • ETH
            </h2>
            <div className='text-xs flex font-semibold text-[#f8fafc]'>
              ${currentPrice.toFixed(2)}
              <div
                className={`text-xs ml-2 ${
                  isPriceUp ? "text-[#22c55e]" : "text-red-500"
                } font-medium`}
              >
                {isPriceUp ? "+" : ""}
                {priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex gap-1 absolute top-[30px] right-2'>
        <div
          className={`flex items-center ${getStatusColor(status)}`}
          title={error || "Connection status"}
        >
          {status === 2 ? <Wifi size={12} /> : <WifiOff size={12} />}
        </div>
        <button
          onClick={handleRefresh}
          className='p-1 rounded-full bg-[#1e293b] hover:bg-[#334155]'
          aria-label='Refresh data'
        >
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>
      <div className='flex justify-between items-center mb-2'></div>

      <div className='mt-4 relative'>
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-[#64748b] py-1 font-medium'>
          <span>{chartMax.toFixed(1)}</span>
          <span>{chartMin.toFixed(1)}</span>
        </div>
        <div className='ml-8 relative' ref={containerRef}>
          <EnhancedChart
            data={ethChartData}
            width={170}
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
              className='absolute bg-[#1e293b] text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none z-10 font-medium transition-all duration-100 ease-out'
              style={{
                left: `${tooltip.x}px`,
                top:
                  tooltip.y > 40 ? `${tooltip.y - 20}px` : `${tooltip.y + 8}px`,
                transform: "translateX(-50%)",
                boxShadow:
                  "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              ${tooltip.value.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-between text-[10px] text-[#64748b] mt-1 px-1 font-medium'>
        {dateLabels.slice(0, 3).map((date, index) => (
          <span key={index}>{date}</span>
        ))}
      </div>

      {/* Expanded view overlay */}
      {isExpanded && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
          onClick={() => setIsExpanded(false)}
        >
          <div
            className='w-[300px] h-[300px] bg-[#0f172a] text-white rounded-[20px] overflow-hidden p-4 border-0 font-sans'
            onClick={(e) => e.stopPropagation()}
          >
            {/* This would be a larger version of the widget with more details */}
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-10 h-10 bg-[#e2e8f0] rounded-full flex items-center justify-center'>
                <svg
                  width='20'
                  height='32'
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
                <h2 className='text-xl font-normal tracking-wide text-[#e2e8f0]'>
                  Ethereum • ETH
                </h2>
              </div>
            </div>

            <div className='flex justify-between items-center mb-3'>
              <div className='text-2xl font-semibold text-[#f8fafc]'>
                ${currentPrice.toFixed(2)}
              </div>
              <div
                className={`text-base ${
                  isPriceUp ? "text-[#22c55e]" : "text-red-500"
                } font-medium`}
              >
                {isPriceUp ? "+" : ""}
                {priceChangePercent.toFixed(2)}%
              </div>
            </div>

            <div className='flex gap-1 mb-3'>
              {(["1D", "1W", "1M", "3M", "1Y"] as const).map((range) => (
                <button
                  key={range}
                  className={`px-2 py-1 text-xs rounded-md ${
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

            <div className='mb-4'>
              <EnhancedChart
                data={ethChartData}
                width={270}
                height={100}
                lineColor='#4f8eff'
                fillColor='rgba(79, 142, 255, 0.2)'
                gridColor='#1a2635'
                isDarkMode={true}
                showGrid={true}
                showTooltip={true}
                animate={true}
                onHover={() => {}}
              />
            </div>

            <div className='grid grid-cols-2 gap-3 mb-4'>
              <div className='bg-[#1e293b] p-2 rounded-lg'>
                <div className='text-xs text-[#64748b] mb-1'>24H HIGH</div>
                <div className='text-sm text-[#e2e8f0]'>
                  ${ethData ? ethData.highPrice.toFixed(2) : "0.00"}
                </div>
              </div>
              <div className='bg-[#1e293b] p-2 rounded-lg'>
                <div className='text-xs text-[#64748b] mb-1'>24H LOW</div>
                <div className='text-sm text-[#e2e8f0]'>
                  ${ethData ? ethData.lowPrice.toFixed(2) : "0.00"}
                </div>
              </div>
              <div className='bg-[#1e293b] p-2 rounded-lg'>
                <div className='text-xs text-[#64748b] mb-1'>24H VOLUME</div>
                <div className='text-sm text-[#e2e8f0]'>
                  $
                  {ethData
                    ? (ethData.quoteVolume / 1000000).toFixed(2)
                    : "0.00"}
                  M
                </div>
              </div>
              <div className='bg-[#1e293b] p-2 rounded-lg'>
                <div className='text-xs text-[#64748b] mb-1'>PRICE CHANGE</div>
                <div
                  className={`text-sm ${
                    isPriceUp ? "text-[#22c55e]" : "text-red-500"
                  }`}
                >
                  ${ethData ? ethData.priceChange.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>

            <button
              className='w-full py-2 bg-[#4f8eff] hover:bg-[#3b7dff] text-white rounded-lg font-medium transition-colors'
              onClick={() => setIsExpanded(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
