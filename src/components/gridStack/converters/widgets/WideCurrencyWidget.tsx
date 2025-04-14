"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { RefreshCw, ArrowUpDown, X } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import UnitConverter from "../UnitConverter";

// Add the CurrencyIcon component
interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string | null;
  rate: number;
  type?: "fiat" | "crypto";
}

// Update the CurrencyIcon component to show 2 characters as fallback
const CurrencyIcon = ({ currency }: { currency: Currency }) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const apiUrls = [
    `https://cryptoicons.org/api/icon/${currency.code.toLowerCase()}/200`,
    `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${currency.code.toLowerCase()}.svg`,
    `https://sideshift.ai/api/v2/coins/icon/${currency.code}`,
  ];

  const handleIconError = () => {
    if (currentIconIndex < apiUrls.length - 1) {
      setCurrentIconIndex(currentIconIndex + 1);
    } else {
      setHasError(true);
    }
  };

  if (currency.type === "fiat" && currency.flag && !hasError) {
    return (
      <div className='relative overflow-hidden rounded shadow-sm flex-shrink-0'>
        <img
          src={currency.flag || "/placeholder.svg"}
          alt={`${currency.code} flag`}
          className='object-cover w-full h-full'
          onError={() => setHasError(true)}
        />
      </div>
    );
  } else if (currency.type === "crypto" && !hasError) {
    return (
      <div className='relative overflow-hidden rounded-full shadow-sm flex-shrink-0 bg-gray-100'>
        <img
          src={apiUrls[currentIconIndex] || "/placeholder.svg"}
          alt={`${currency.code} icon`}
          className='object-cover w-full h-full'
          onError={handleIconError}
        />
      </div>
    );
  }

  // Fallback for currencies without icons or when images fail to load
  return (
    <div className='flex items-center justify-center rounded-full bg-gray-200 flex-shrink-0'>
      <span className='text-xs font-bold text-gray-500'>
        {currency.code.substring(0, 2)}
      </span>
    </div>
  );
};

// Add state and event listener to keep displayed currencies in sync
export default function CurrencyWidgetMedium() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [localDisplayedCurrencies, setLocalDisplayedCurrencies] = useState<
    string[]
  >([]);

  const {
    baseCurrency,
    baseValue,
    currencyData,
    displayedCurrencies,
    isLoading,
    isRefreshing,
    setBaseValue,
    refreshRates,
    formatValue,
  } = useCurrency();

  // Listen for displayed currencies changes
  useEffect(() => {
    setLocalDisplayedCurrencies(displayedCurrencies);

    const handleDisplayedCurrenciesChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.displayedCurrencies) {
        setLocalDisplayedCurrencies(customEvent.detail.displayedCurrencies);
      } else {
        // Fallback to localStorage if event detail is missing
        const savedDisplayed = localStorage.getItem("displayedCurrencies");
        if (savedDisplayed) {
          try {
            setLocalDisplayedCurrencies(JSON.parse(savedDisplayed));
          } catch (e) {
            console.error("Failed to parse displayed currencies:", e);
          }
        }
      }
    };

    window.addEventListener(
      "displayedCurrenciesChanged",
      handleDisplayedCurrenciesChanged
    );

    return () => {
      window.removeEventListener(
        "displayedCurrenciesChanged",
        handleDisplayedCurrenciesChanged
      );
    };
  }, [displayedCurrencies]);

  // Update to use displayed currencies instead of favorites
  const getDisplayedCurrencies = () => {
    return localDisplayedCurrencies
      .filter((code) => currencyData[code] && code !== baseCurrency.code) // Exclude base currency
      .map((code) => currencyData[code]);
  };

  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue)) {
      setBaseValue(numValue);
    } else if (value === "" || value === "-") {
      setBaseValue(0);
    }
  };

  const handleRefresh = () => {
    refreshRates();
  };

  const openConverter = () => {
    setIsPopupOpen(true);
  };

  const closeConverter = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Widget */}
      <div
        className='h-full w-full rounded-xl overflow-hidden shadow-lg bg-card text-text transition-shadow cursor-pointer'
        onClick={openConverter}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3'>
          <h2 className='text-base font-medium'>Currency Converter</h2>
          <div className='flex space-x-2'>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening the converter
                handleRefresh();
              }}
              className='text-text opacity-80 hover:opacity-100 p-1 rounded-full hover:bg-hover transition-colors'
              disabled={isRefreshing}
              title='Refresh rates'
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Base Currency */}
        <div
          className='px-4 py-3 bg-hover mx-3 rounded-lg mb-3 relative'
          onClick={(e) => e.stopPropagation()} // Prevent opening the converter when clicking this section
        >
          <div className='flex items-center justify-between mb-1'>
            <div className='text-xs text-text'>Base Currency</div>
          </div>

          {/* Base Currency Section - no longer clickable */}
          <div className='flex items-center p-1 -ml-1'>
            <div className='mr-2 w-6 h-6 relative overflow-hidden rounded flex-shrink-0'>
              <CurrencyIcon currency={baseCurrency} />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='text-sm font-medium truncate'>
                {baseCurrency.code}
              </div>
              <div className='text-xs text-tex opacity-70 truncate'>
                {baseCurrency.name}
              </div>
            </div>
            <div className='ml-auto flex items-center flex-shrink-0'>
              <span className='text-sm mr-1'>{baseCurrency.symbol}</span>
              <input
                value={baseValue.toString()}
                onChange={handleBaseValueChange}
                className='w-16 h-8 text-right text-sm input'
              />
            </div>
          </div>
        </div>

        {/* Displayed Currencies - Added scrollbar hiding */}
        <div
          className='px-3 overflow-y-auto h-[170px]'
          style={{
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <div className='text-xs text-foreground mb-2 px-1'>Currencies</div>

          {isLoading ? (
            <div className='grid grid-cols-2 gap-2'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-hover animate-pulse h-12 rounded-lg'
                ></div>
              ))}
            </div>
          ) : getDisplayedCurrencies().length > 0 ? (
            <div className='grid grid-cols-2 gap-2'>
              {getDisplayedCurrencies().map((currency) => (
                <div key={currency.code} className='bg-hover p-2 rounded-lg'>
                  <div className='flex items-center mb-1'>
                    <div className='mr-2 w-4 h-4 relative overflow-hidden rounded flex-shrink-0'>
                      <CurrencyIcon currency={currency} />
                    </div>
                    <div className='text-xs font-medium truncate'>
                      {currency.code}
                    </div>
                    {currency.type === "crypto" && (
                      <span className='ml-1 px-1 py-0.5 text-[0.6rem] bg-brand text-text-primary rounded-full'>
                        Crypto
                      </span>
                    )}
                  </div>
                  <div className='text-sm font-medium truncate'>
                    {currency.symbol} {formatValue(baseValue * currency.rate)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center text-xs text-foreground py-4'>
              No currencies selected. Add some in the converter.
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300'>
            {/* Custom title bar for popup */}
            <div className='bg-card px-4 py-2 flex items-center justify-between border-b border-border'>
              <div className='flex items-center'>
                <div className='bg-brand w-8 h-8 rounded-xl flex items-center justify-center shadow-sm mr-2'>
                  <ArrowUpDown className='w-5 h-5' />
                </div>
                <h1 className='text-lg font-semibold'>Currency Converter</h1>
              </div>
              <button
                onClick={closeConverter}
                className='w-8 h-8 rounded-full bg-badge flex items-center justify-center hover:bg-error transition-colors'
                aria-label='Close converter'
              >
                <X className='w-4 h-4 ' />
              </button>
            </div>

            {/* Converter content */}
            <div
              className='flex-1 overflow-auto'
              style={{
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <UnitConverter initialTool='currency' />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
