// Create a new context file to share currency state between components

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// Country flags for common currencies
export const countryFlags: Record<string, string> = {
  EUR: "https://flagcdn.com/eu.svg",
  USD: "https://flagcdn.com/us.svg",
  GBP: "https://flagcdn.com/gb.svg",
  JPY: "https://flagcdn.com/jp.svg",
  AUD: "https://flagcdn.com/au.svg",
  CAD: "https://flagcdn.com/ca.svg",
  CHF: "https://flagcdn.com/ch.svg",
  CNY: "https://flagcdn.com/cn.svg",
  HKD: "https://flagcdn.com/hk.svg",
  NZD: "https://flagcdn.com/nz.svg",
  SEK: "https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/flags/4x3/se.svg",
  KRW: "https://flagcdn.com/kr.svg",
  SGD: "https://flagcdn.com/sg.svg",
  NOK: "https://flagcdn.com/no.svg",
  MXN: "https://flagcdn.com/mx.svg",
  INR: "https://flagcdn.com/in.svg",
  RUB: "https://flagcdn.com/ru.svg",
  ZAR: "https://flagcdn.com/za.svg",
  TRY: "https://flagcdn.com/tr.svg",
  BRL: "https://flagcdn.com/br.svg",
  PKR: "https://flagcdn.com/pk.svg",
  // Add more as needed
};

// Currency symbols for common currencies
export const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  HKD: "HK$",
  NZD: "NZ$",
  SEK: "kr",
  KRW: "₩",
  SGD: "S$",
  NOK: "kr",
  MXN: "Mex$",
  INR: "₹",
  RUB: "₽",
  ZAR: "R",
  TRY: "₺",
  BRL: "R$",
  PKR: "₨",
  // Add more as needed
};

// API URL base for exchange rates
export const API_URL_BASE =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
export const CURRENCIES_LIST_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

// Update the Currency type to include a type field
export type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  flag?: string | null;
  type: "fiat" | "crypto"; // Add type field to distinguish between fiat and crypto
};

// Add a list of common crypto currencies
export const CRYPTO_CURRENCIES = [
  "BTC",
  "ETH",
  "XRP",
  "LTC",
  "BCH",
  "ADA",
  "DOT",
  "LINK",
  "XLM",
  "DOGE",
  "UNI",
  "USDT",
  "USDC",
  "BNB",
  "SOL",
  "MATIC",
  "AVAX",
  "ATOM",
  "ALGO",
  "FIL",
  "XBT",
  "BTCB",
  "BTG",
  "BTN",
  "BTT", // Add Bitcoin variants and other BT* cryptos
  "XMR",
  "DASH",
  "ZEC",
  "EOS",
  "TRX",
  "VET",
  "THETA",
  "NEO",
  "MIOTA",
  "CAKE",
  "AAVE",
  "SNX",
  "COMP",
  "MKR",
  "YFI",
  "SUSHI",
  "1INCH",
  "GRT",
  "BAT",
  "ZRX",
  "ENJ",
  "MANA",
  "SAND",
  "AXS",
  "CHZ",
  "GALA",
  "ICP",
  "FTM",
  "NEAR",
  "EGLD",
];

type CurrencyContextType = {
  baseCurrency: Currency;
  baseValue: number;
  currencyData: Record<string, Currency>;
  favoriteCurrencies: string[];
  displayedCurrencies: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  setBaseCurrency: (currency: Currency) => void;
  setBaseValue: (value: number) => void;
  toggleFavorite: (currencyCode: string) => void;
  addCurrency: (currencyCode: string) => void;
  removeCurrency: (currencyCode: string) => void;
  refreshRates: () => Promise<void>;
  formatValue: (value: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseValue, setBaseValue] = useState<number>(1);
  // In the CurrencyProvider function, update the baseCurrency initialization:
  const [baseCurrency, setBaseCurrency] = useState<Currency>({
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 1,
    flag: countryFlags.EUR,
    type: "fiat",
  });
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>([]);
  const [displayedCurrencies, setDisplayedCurrencies] = useState<string[]>([]);
  const [currencyData, setCurrencyData] = useState<Record<string, Currency>>(
    {}
  );
  const [currencyNames, setCurrencyNames] = useState<Record<string, string>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);
  console.log(usingDemoData);
  // Load favorites and displayed currencies from localStorage on mount
  useEffect(() => {
    // Load favorites
    const savedFavorites = localStorage.getItem("favoriteCurrencies");
    if (savedFavorites) {
      try {
        setFavoriteCurrencies(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorite currencies:", e);
        setFavoriteCurrencies(["USD", "GBP", "JPY", "CAD", "AUD"]);
      }
    } else {
      // Default favorites if none saved
      setFavoriteCurrencies(["USD", "GBP", "JPY", "CAD", "AUD"]);
    }

    // Load displayed currencies
    const savedDisplayed = localStorage.getItem("displayedCurrencies");
    if (savedDisplayed) {
      try {
        setDisplayedCurrencies(JSON.parse(savedDisplayed));
      } catch (e) {
        console.error("Failed to parse displayed currencies:", e);
        setDisplayedCurrencies(["USD", "GBP", "JPY", "CAD", "AUD", "CNY"]);
      }
    } else {
      // Default displayed currencies if none saved
      setDisplayedCurrencies(["USD", "GBP", "JPY", "CAD", "AUD", "CNY"]);
    }

    // Fetch currency names
    fetchCurrencyNames();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "favoriteCurrencies",
      JSON.stringify(favoriteCurrencies)
    );
  }, [favoriteCurrencies]);

  // Save displayed currencies to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "displayedCurrencies",
      JSON.stringify(displayedCurrencies)
    );

    // Dispatch a custom event to notify other components about the displayed currencies change
    const event = new CustomEvent("displayedCurrenciesChanged", {
      detail: { displayedCurrencies },
    });
    window.dispatchEvent(event);
  }, [displayedCurrencies]);

  // Fetch currency names
  const fetchCurrencyNames = async () => {
    try {
      const response = await fetch(CURRENCIES_LIST_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch currency names");
      }

      const data = await response.json();
      setCurrencyNames(data);
    } catch (err) {
      console.error("Error fetching currency names:", err);
      // Use hardcoded names as fallback
      setCurrencyNames({
        eur: "Euro",
        usd: "US Dollar",
        gbp: "British Pound",
        jpy: "Japanese Yen",
        aud: "Australian Dollar",
        cad: "Canadian Dollar",
        chf: "Swiss Franc",
        cny: "Chinese Yuan",
        // Add more as needed
      });
    }
  };

  // Use demo data if API fails
  // Update the useDemoData function to include crypto currencies
  const useDemoData = useCallback(() => {
    const demoRates: Record<string, number> = {
      // Fiat currencies
      EUR: 1,
      USD: 1.09,
      GBP: 0.85,
      JPY: 163.21,
      AUD: 1.65,
      CAD: 1.47,
      CHF: 0.98,
      CNY: 7.87,
      HKD: 8.51,
      NZD: 1.78,
      SEK: 11.38,
      KRW: 1467.23,
      SGD: 1.47,
      NOK: 11.51,
      MXN: 18.25,
      INR: 90.67,
      RUB: 100.15,
      ZAR: 20.42,
      TRY: 35.12,
      BRL: 5.51,
      // Crypto currencies
      BTC: 0.000037,
      ETH: 0.00055,
      XRP: 1.65,
      LTC: 0.0089,
      BCH: 0.0032,
      ADA: 2.45,
      DOT: 0.12,
      LINK: 0.075,
      XLM: 3.85,
      DOGE: 15.2,
      XBT: 0.000037, // Same as BTC
      BTCB: 0.000037, // Bitcoin BEP2
      BTG: 0.0045, // Bitcoin Gold
      BTT: 28500, // BitTorrent
      BTN: 82.5, // Bhutanese Ngultrum (actually a fiat currency)
    };

    const newCurrencyData: Record<string, Currency> = {};

    // Adjust rates based on base currency
    const baseRate = demoRates[baseCurrency.code] || 1;

    Object.entries(demoRates).forEach(([code, rate]) => {
      // Special case for BTN which is actually a fiat currency (Bhutanese Ngultrum)
      const isCrypto =
        code === "BTN" ? false : CRYPTO_CURRENCIES.includes(code);

      newCurrencyData[code] = {
        code,
        name: getCurrencyName(code, currencyNames),
        symbol: currencySymbols[code] || code,
        rate: rate / baseRate,
        flag: isCrypto ? null : countryFlags[code],
        type: isCrypto ? "crypto" : "fiat",
      };
    });

    setCurrencyData(newCurrencyData);
    setUsingDemoData(true);
  }, [baseCurrency.code, currencyNames]);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async () => {
    if (Object.keys(currencyNames).length === 0) {
      return; // Wait for currency names to be loaded
    }

    setIsLoading(true);
    setIsRefreshing(true);

    let newCurrencyData: Record<string, Currency> = {}; // Define here to ensure it's always defined

    try {
      // Construct API URL based on base currency
      const apiUrl = `${API_URL_BASE}${baseCurrency.code.toLowerCase()}.json`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();

      // Process the data
      const baseCode = baseCurrency.code.toLowerCase();
      if (data && data[baseCode] && typeof data[baseCode] === "object") {
        newCurrencyData = {};

        // Add base currency first with rate 1 (since it's the base)
        newCurrencyData[baseCurrency.code] = {
          code: baseCurrency.code,
          rate: 1,
          name:
            currencyNames[baseCurrency.code.toLowerCase()] || baseCurrency.name,
          symbol: currencySymbols[baseCurrency.code] || baseCurrency.code,
          flag: countryFlags[baseCurrency.code] || "",
          type: CRYPTO_CURRENCIES.includes(baseCurrency.code)
            ? "crypto"
            : "fiat",
        };

        // Add other currencies
        for (const [code, rate] of Object.entries(data[baseCode])) {
          if (code !== baseCode) {
            // Skip base currency as it's already added
            const upperCode = code.toUpperCase();

            // Special case for BTN which is actually a fiat currency (Bhutanese Ngultrum)
            const isCrypto =
              upperCode === "BTN"
                ? false
                : CRYPTO_CURRENCIES.includes(upperCode);

            newCurrencyData[upperCode] = {
              code: upperCode,
              rate: rate as number,
              name: getCurrencyName(upperCode, currencyNames),
              symbol: currencySymbols[upperCode] || upperCode,
              flag: isCrypto ? null : countryFlags[upperCode] || "",
              type: isCrypto ? "crypto" : "fiat",
            };
          }
        }

        setUsingDemoData(false);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      // Use demo data if API fails
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDemoData();
    } finally {
      setCurrencyData(newCurrencyData); // Set currencyData here
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [baseCurrency, currencyNames, useDemoData]);

  // Fetch exchange rates when component mounts or when base currency changes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isMounted = true; // Add a flag to track component mount status

    const fetchData = async () => {
      if (Object.keys(currencyNames).length > 0) {
        await fetchExchangeRates();
      }
    };

    fetchData();

    // Set up interval for real-time updates (every 5 minutes)
    interval = setInterval(() => {
      if (isMounted && Object.keys(currencyNames).length > 0) {
        fetchExchangeRates();
      }
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [baseCurrency.code, currencyNames, fetchExchangeRates]);

  // Add a custom event system to notify all components when favorites change
  // Toggle favorite status for a currency
  const toggleFavorite = (currencyCode: string) => {
    setFavoriteCurrencies((prev) => {
      // Create a new array to ensure React detects the change
      const newFavorites = prev.includes(currencyCode)
        ? prev.filter((code) => code !== currencyCode)
        : [...prev, currencyCode];

      // Immediately save to localStorage to ensure persistence
      localStorage.setItem("favoriteCurrencies", JSON.stringify(newFavorites));

      // Dispatch a custom event to notify other components about the favorites change
      const event = new CustomEvent("currencyFavoritesChanged", {
        detail: { favoriteCurrencies: newFavorites },
      });
      window.dispatchEvent(event);

      return newFavorites;
    });
  };

  // Add currency to displayed currencies
  const addCurrency = (currencyCode: string) => {
    if (!displayedCurrencies.includes(currencyCode)) {
      const newDisplayed = [...displayedCurrencies, currencyCode];
      setDisplayedCurrencies(newDisplayed);
      localStorage.setItem("displayedCurrencies", JSON.stringify(newDisplayed));

      // Dispatch a custom event to notify other components about the displayed currencies change
      const event = new CustomEvent("displayedCurrenciesChanged", {
        detail: { displayedCurrencies: newDisplayed },
      });
      window.dispatchEvent(event);
    }
  };

  // Remove currency from displayed currencies
  const removeCurrency = (currencyCode: string) => {
    const newDisplayed = displayedCurrencies.filter(
      (code) => code !== currencyCode
    );
    setDisplayedCurrencies(newDisplayed);
    localStorage.setItem("displayedCurrencies", JSON.stringify(newDisplayed));

    // Dispatch a custom event to notify other components about the displayed currencies change
    const event = new CustomEvent("displayedCurrenciesChanged", {
      detail: { displayedCurrencies: newDisplayed },
    });
    window.dispatchEvent(event);
  };

  // Format currency value for display
  const formatValue = (value: number) => {
    if (value < 0.01) return value.toFixed(4);
    return value.toFixed(2);
  };

  // Update base currency
  const updateBaseCurrency = (currency: Currency) => {
    // If the currency is in displayed currencies, remove it
    if (displayedCurrencies.includes(currency.code)) {
      removeCurrency(currency.code);
    }

    // Add the old base currency to displayed currencies if it's not already there
    if (!displayedCurrencies.includes(baseCurrency.code)) {
      addCurrency(baseCurrency.code);
    }

    setBaseCurrency(currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        baseValue,
        currencyData,
        favoriteCurrencies,
        displayedCurrencies,
        isLoading,
        isRefreshing,
        setBaseCurrency: updateBaseCurrency,
        setBaseValue,
        toggleFavorite,
        addCurrency,
        removeCurrency,
        refreshRates: fetchExchangeRates,
        formatValue,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

// Add a function to get crypto icon URL
export const getCryptoIconUrl = (code: string): string => {
  const baseAsset = code.toLowerCase();
  // Try multiple sources in case one fails
  return [
    `https://cryptoicons.org/api/icon/${baseAsset}/200`,
    `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${baseAsset}.svg`,
    `https://sideshift.ai/api/v2/coins/icon/${code}`,
  ][0]; // Default to first source, component will handle fallbacks
};

// Add a helper function to get proper currency names
function getCurrencyName(
  code: string,
  currencyNames: Record<string, string>
): string {
  // Special cases for cryptocurrencies that might not be in the API
  const cryptoNames: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    XRP: "Ripple",
    LTC: "Litecoin",
    BCH: "Bitcoin Cash",
    ADA: "Cardano",
    DOT: "Polkadot",
    LINK: "Chainlink",
    XLM: "Stellar",
    DOGE: "Dogecoin",
    XBT: "Bitcoin",
    BTCB: "Bitcoin BEP2",
    BTG: "Bitcoin Gold",
    BTT: "BitTorrent",
    BTN: "Bhutanese Ngultrum",
  };

  // First check if it's in our crypto names
  if (cryptoNames[code]) {
    return cryptoNames[code];
  }

  // Then check the API data
  if (currencyNames[code.toLowerCase()]) {
    return currencyNames[code.toLowerCase()];
  }

  // Fallback to the code itself
  return code;
}
