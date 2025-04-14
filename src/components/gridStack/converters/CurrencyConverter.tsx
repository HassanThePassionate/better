"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

import { RefreshCw, Search, X, Plus, ArrowUpDown } from "lucide-react";
import {
  useCurrency,
  CURRENCIES_LIST_URL,
  type Currency,
} from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import CustomNumberInput from "@/components/ui/CustomNumberInput";

export default function CurrencyConverter() {
  const {
    baseCurrency,
    baseValue,
    currencyData,
    favoriteCurrencies,
    displayedCurrencies,
    isLoading,
    isRefreshing,
    setBaseCurrency,
    setBaseValue,
    addCurrency,
    removeCurrency,
    refreshRates,
    formatValue,
  } = useCurrency();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Currency[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isChangingBase, setIsChangingBase] = useState<boolean>(false);
  const [baseSearchQuery, setBaseSearchQuery] = useState<string>("");
  const [baseSearchResults, setBaseSearchResults] = useState<Currency[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [isBaseInputActive, setIsBaseInputActive] = useState(false);
  const baseInputRef = useRef<HTMLInputElement>(null);

  // Add filter state
  const [currencyFilter, setCurrencyFilter] = useState<
    "all" | "fiat" | "crypto"
  >("all");

  // Fetch currency names on component mount
  useEffect(() => {
    fetchCurrencyNames();
  }, []);

  // Update search results when search query changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // List of top currencies to prioritize
    const topCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "HKD",
      "NZD",
    ];

    const results = Object.values(currencyData).filter((currency) => {
      // Basic filtering (not in displayed currencies and not the base currency)
      const basicFilter =
        !displayedCurrencies.includes(currency.code) &&
        currency.code !== baseCurrency.code &&
        (currency.code.toLowerCase().includes(query) ||
          (currency.name && currency.name.toLowerCase().includes(query)));

      // Apply type filter
      if (currencyFilter === "all") return basicFilter;
      return basicFilter && currency.type === currencyFilter;
    });

    // Sort results to prioritize top currencies
    results.sort((a, b) => {
      const aIsTop = topCurrencies.includes(a.code);
      const bIsTop = topCurrencies.includes(b.code);

      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;

      // If both are top or both are not top, sort alphabetically
      return a.code.localeCompare(b.code);
    });

    setSearchResults(results);
  }, [
    searchQuery,
    currencyData,
    displayedCurrencies,
    baseCurrency.code,
    currencyFilter,
  ]);

  // Update base search results when base search query changes
  useEffect(() => {
    const query = baseSearchQuery.toLowerCase();
    const topCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "HKD",
      "NZD",
    ];

    let results = [];

    if (query.trim() === "") {
      results = Object.values(currencyData).filter(
        (currency) => currency.code !== baseCurrency.code
      );
    } else {
      results = Object.values(currencyData).filter(
        (currency) =>
          currency.code !== baseCurrency.code &&
          (currency.code.toLowerCase().includes(query) ||
            currency.name.toLowerCase().includes(query))
      );
    }

    // Sort results to prioritize top currencies
    results.sort((a, b) => {
      const aIsTop = topCurrencies.includes(a.code);
      const bIsTop = topCurrencies.includes(b.code);

      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;

      // If both are top or both are not top, sort alphabetically
      return a.code.localeCompare(b.code);
    });

    setBaseSearchResults(results);
  }, [baseSearchQuery, currencyData, baseCurrency.code]);

  // Fetch currency names from API
  const fetchCurrencyNames = async () => {
    try {
      const response = await fetch(CURRENCIES_LIST_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch currency names");
      }
    } catch (err) {
      console.error("Error fetching currency names:", err);
    }
  };

  // Handle currency input change
  const handleCurrencyChange = (value: string, currency: Currency) => {
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue)) {
      // Calculate what the base value should be based on the rate
      const newBaseValue = numValue / currency.rate;
      setBaseValue(newBaseValue);
    }
  };

  // Handle base value input change
  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue)) {
      setBaseValue(numValue);
    } else if (value === "" || value === "-") {
      setBaseValue(0);
    }
  };

  // Refresh exchange rates
  const handleRefresh = () => {
    refreshRates();
  };

  // Toggle search box
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery("");
    }
  };

  // Toggle base currency search box
  const toggleBaseSearch = () => {
    setIsChangingBase(!isChangingBase);
    if (!isChangingBase) {
      setBaseSearchQuery("");
    } else {
      // Initialize base search results with all currencies except the current base
      setBaseSearchResults(
        Object.values(currencyData).filter(
          (currency) => currency.code !== baseCurrency.code
        )
      );
    }
  };

  // Change base currency
  const changeBaseCurrency = (currency: Currency) => {
    setBaseCurrency(currency);
    setBaseSearchQuery("");
    setIsChangingBase(false);
  };

  // Get displayed currencies
  const getDisplayedCurrencies = () => {
    const currencies = Object.values(currencyData).filter((currency) =>
      displayedCurrencies.includes(currency.code)
    );

    // Sort currencies with favorites first
    return currencies.sort((a, b) => {
      const aIsFavorite = favoriteCurrencies.includes(a.code);
      const bIsFavorite = favoriteCurrencies.includes(b.code);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
  };

  // Set a currency as the base currency
  const setAsBaseCurrency = (currency: Currency) => {
    changeBaseCurrency(currency);
  };

  // Add a component for currency icon with fallback
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

  return (
    <div className='space-y-3'>
      {/* Enhanced Base Unit Display with Editable Input */}
      <div className='bg-card p-4 rounded-xl shadow-md text-text'>
        <div className='flex justify-between items-center mb-3'>
          <div className='flex items-center'>
            <label className='text-sm font-medium text-foreground mr-2'>
              Base Currency
            </label>
          </div>
          <button
            onClick={handleRefresh}
            className='text-foreground hover:text-text p-1.5 rounded-full hover:bg-hover transition-colors'
            disabled={isLoading || isRefreshing}
            title='Refresh exchange rates'
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Update the base currency display */}
        <div
          className='flex items-center bg-badge p-3 rounded-lg mb-3 cursor-pointer hover:bg-hover transition-colors'
          onClick={toggleBaseSearch}
        >
          <div className='flex items-center flex-1 min-w-0'>
            <div className='mr-3 w-8 h-8 relative overflow-hidden rounded shadow-sm flex-shrink-0'>
              <CurrencyIcon currency={baseCurrency} />
            </div>
            <div className='min-w-0'>
              <div className='text-lg font-medium text-text truncate'>
                {baseCurrency.name}
              </div>
              <div className='text-sm text-text opacity-70'>
                {baseCurrency.code}
              </div>
            </div>
          </div>
          <div className='relative flex items-center flex-shrink-0 ml-2'>
            <span className='text-2xl font-light mr-1'>
              {baseCurrency.symbol}
            </span>
            <input
              ref={baseInputRef}
              value={
                isBaseInputActive
                  ? baseValue.toString()
                  : formatValue(baseValue)
              }
              onChange={handleBaseValueChange}
              onFocus={() => setIsBaseInputActive(true)}
              onBlur={() => setIsBaseInputActive(false)}
              className='text-right text-2xl font-light b border-0 w-28 input'
              step='any'
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Base Currency Search */}
        {isChangingBase && (
          <div className='mt-2 bg-badge p-3 rounded-lg border border-border backdrop-blur-sm'>
            <div className='relative mb-2'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text w-4 h-4' />
              <input
                value={baseSearchQuery}
                onChange={(e) => setBaseSearchQuery(e.target.value)}
                placeholder='Search for a base currency...'
                className='pl-9 pr-3 py-2 text-sm w-full input'
                autoFocus
              />
              {baseSearchQuery && (
                <button
                  onClick={() => setBaseSearchQuery("")}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-text opacity-70 hover:opacity-100'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>

            {/* Filter buttons for base currency search */}
            <div className='flex space-x-2 mb-2'>
              <button
                onClick={() => setCurrencyFilter("all")}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                  currencyFilter === "all" && "bg-card text-brand font-medium"
                )}
              >
                All
              </button>
              <button
                onClick={() => setCurrencyFilter("fiat")}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                  currencyFilter === "fiat" && "bg-card text-brand font-medium"
                )}
              >
                Fiat
              </button>
              <button
                onClick={() => setCurrencyFilter("crypto")}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                  currencyFilter === "crypto" &&
                    "bg-card text-brand font-medium"
                )}
              >
                Crypto
              </button>
            </div>

            <div
              className='max-h-60 overflow-y-auto'
              style={{
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {baseSearchResults.length > 0 ? (
                <div className='space-y-1'>
                  {baseSearchResults
                    .filter((currency) => {
                      if (currencyFilter === "all") return true;
                      return currency.type === currencyFilter;
                    })
                    .map((currency) => (
                      <div
                        key={currency.code}
                        className='flex items-center justify-between p-2 hover:bg-hover rounded-md cursor-pointer transition-colors'
                        onClick={() => changeBaseCurrency(currency)}
                      >
                        <div className='flex items-center'>
                          <div className='mr-2 w-5 h-5 relative overflow-hidden rounded'>
                            <CurrencyIcon currency={currency} />
                          </div>
                          <span className='text-sm font-medium text-text'>
                            {currency.name}
                          </span>
                          <span className='ml-2 text-xs text-text opacity-80'>
                            {currency.code}
                          </span>
                          {currency.type === "crypto" && (
                            <span className='ml-2 px-1.5 py-0.5 text-xs bg-brand-hover text-text-primary rounded-full'>
                              Crypto
                            </span>
                          )}
                        </div>
                        <button className='text-text opacity-70 hover:opacity-100'>
                          <ArrowUpDown className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='p-2 text-sm text-text opacity-70 text-center'>
                  No currencies found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Currency Management */}
      <div className='flex items-center justify-between bg-card text-text p-3 rounded-xl shadow-sm'>
        <button
          onClick={toggleSearch}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors text-text hover:text-brand",
            isSearching && "text-brand"
          )}
        >
          <Search className='w-4 h-4' />
          {isSearching ? "Close" : "Add Currency"}
        </button>
        {displayedCurrencies.length > 0 && (
          <div className='text-xs text-gray-500'>
            Showing {displayedCurrencies.length}{" "}
            {displayedCurrencies.length === 1 ? "currency" : "currencies"}
          </div>
        )}
      </div>

      {/* Search Box */}
      {isSearching && (
        <div className='bg-card p-4 rounded-xl border border-border shadow-sm'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text w-4 h-4' />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search for a currency...'
              className='pl-9 pr-4 py-2 w-full input'
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-text opacity-70 hover:opacity-100'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div className='flex space-x-2 mt-3 mb-2'>
            <button
              onClick={() => setCurrencyFilter("all")}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                currencyFilter === "all" && "bg-card text-brand font-medium"
              )}
            >
              All
            </button>
            <button
              onClick={() => setCurrencyFilter("fiat")}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                currencyFilter === "fiat" && "bg-card text-brand font-medium"
              )}
            >
              Fiat
            </button>
            <button
              onClick={() => setCurrencyFilter("crypto")}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors bg-badge text-text hover:bg-hover",
                currencyFilter === "crypto" && "bg-card text-brand font-medium"
              )}
            >
              Crypto
            </button>
          </div>

          {/* In the search box section, update the max-h-60 div: */}
          {searchResults.length > 0 ? (
            <div
              className='max-h-60 overflow-y-auto'
              style={{
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {searchResults.map((currency) => (
                <div
                  key={currency.code}
                  className='flex items-center justify-between p-2 hover:bg-hover rounded-md cursor-pointer'
                  onClick={() => addCurrency(currency.code)}
                >
                  <div className='flex items-center'>
                    <div className='mr-2 w-5 h-5 relative overflow-hidden rounded'>
                      <CurrencyIcon currency={currency} />
                    </div>
                    <span className='text-sm font-medium'>{currency.name}</span>
                    <span className='ml-2 text-xs text-text'>
                      {currency.code}
                    </span>
                    {currency.type === "crypto" && (
                      <span className='ml-2 px-1.5 py-0.5 text-xs bg-badge text-text rounded-full'>
                        Crypto
                      </span>
                    )}
                  </div>
                  <button className='text-text hover:text-brand'>
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className='mt-3 p-2 text-sm text-text opacity-70 text-center'>
              No currencies found
            </div>
          ) : (
            <div className='mt-3 p-2 text-sm text-text opacity-70 text-center'>
              Type to search for currencies to add
            </div>
          )}
        </div>
      )}

      {/* Currency Cards */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-card border border-border p-3 rounded-xl animate-pulse'
            >
              <div className='flex justify-between items-center mb-1'>
                <div className='h-4 bg-badge rounded w-20'></div>
                <div className='h-4 bg-badge rounded w-8'></div>
              </div>
              <div className='h-6 bg-badge rounded w-full mt-2'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {getDisplayedCurrencies().length > 0 ? (
            getDisplayedCurrencies().map((currency) => {
              return (
                // Update the currency cards to prevent overflow
                <div
                  key={currency.code}
                  className='relative overflow-hidden transition-all duration-200 bg-card border border-border hover:border-hover  p-3 rounded-xl group'
                >
                  <div className='absolute top-1 right-1 flex space-x-1 z-10'>
                    <button
                      onClick={() => setAsBaseCurrency(currency)}
                      className='p-1 bg-badge rounded-full text-text hover:bg-hover transition-colors'
                      title='Set as base currency'
                    >
                      <ArrowUpDown className='w-3.5 h-3.5' />
                    </button>
                    <button
                      onClick={() => removeCurrency(currency.code)}
                      className='p-1 bg-badge rounded-full text-text hover:bg-error transition-colors'
                      title='Remove currency'
                    >
                      <X className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <div className='flex justify-between items-center mb-2 relative'>
                    <div className='flex items-center min-w-0 pr-12'>
                      <div className='mr-2 w-6 h-6 relative overflow-hidden rounded shadow-sm flex-shrink-0'>
                        <CurrencyIcon currency={currency} />
                      </div>
                      <div className='min-w-0'>
                        <label
                          htmlFor={`currency-${currency.code}`}
                          className='text-sm font-medium text-text truncate block'
                        >
                          {currency.name}
                        </label>
                        <div className='flex items-center'>
                          <div className='text-xs text-foreground'>
                            {currency.code}
                          </div>
                          {currency.type === "crypto" && (
                            <span className='ml-2 px-1.5 py-0.5 text-xs bg-badge text-text rounded-full'>
                              Crypto
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='relative flex items-center bg-badge p-2 rounded-lg'>
                    <span className='text-text mr-1 flex-shrink-0'>
                      {currency.symbol}
                    </span>
                    <CustomNumberInput
                      id={`currency-${currency.code}`}
                      value={
                        activeInput === currency.code
                          ? (baseValue * currency.rate).toString()
                          : formatValue(baseValue * currency.rate)
                      }
                      onChange={(e) => handleCurrencyChange(e, currency)}
                      onFocus={() => setActiveInput(currency.code)}
                      onBlur={() => setActiveInput(null)}
                      className='text-right pr-2 text-base font-medium !bg-transparent border-none input p-1 h-auto transition-all'
                      step={0.1}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className='col-span-full p-6 text-center text-text bg-card rounded-xl'>
              <p className='mb-3'>No currencies selected.</p>
              <button
                onClick={toggleSearch}
                className='px-4 py-2 bg-brand text-text rounded-lg hover:bg-brand-hover transition-colors'
              >
                Add Currency
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
