"use client";

import { useEffect, useState } from "react";

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// In-memory cache for icons
const iconCache: Record<string, string | null> = {};

// Common coin colors for fallback icons
const coinColors: Record<string, string> = {
  btc: "#f7931a", // Bitcoin orange
  eth: "#627eea", // Ethereum blue
  bnb: "#f3ba2f", // Binance yellow
  sol: "#00ffbd", // Solana teal
  ada: "#0033ad", // Cardano blue
  xrp: "#23292f", // Ripple black
  dot: "#e6007a", // Polkadot pink
  doge: "#c3a634", // Dogecoin gold
  avax: "#e84142", // Avalanche red
  matic: "#8247e5", // Polygon purple
  link: "#2a5ada", // Chainlink blue
  ltc: "#345d9d", // Litecoin blue
  uni: "#ff007a", // Uniswap pink
  atom: "#2e3148", // Cosmos purple
  etc: "#328332", // Ethereum Classic green
  algo: "#000000", // Algorand black
  icp: "#3b00b9", // Internet Computer purple
  fil: "#0090ff", // Filecoin blue
  vet: "#15bdff", // VeChain blue
  xtz: "#a6e000", // Tezos green
  paxg: "#d9a547", // Pax Gold gold
  usdt: "#26a17b", // Tether green
  usdc: "#2775ca", // USD Coin blue
  dai: "#f5ac37", // Dai yellow
  busd: "#f0b90b", // Binance USD yellow
};

// List of known problematic coins that should skip API calls
const PROBLEMATIC_COINS = [
  "FIL",
  "ALGO",
  "ICP",
  "VET",
  "XTZ",
  "PAXG",
  "BUSD",
  "DAI",
  "TUSD",
  "USDD",
  "GUSD",
];

export default function CoinIcon({
  symbol,
  size = 24,
  className = "",
}: CoinIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const baseAsset = symbol.replace(/USDT$|USD$/, "").toUpperCase();

    // Skip problematic coins that we know will fail
    if (PROBLEMATIC_COINS.includes(baseAsset)) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Check in-memory cache first
    if (iconCache[baseAsset] !== undefined) {
      if (iconCache[baseAsset] === null) {
        setHasError(true);
      } else {
        setSvgContent(iconCache[baseAsset]);
      }
      setIsLoading(false);
      return;
    }

    // Check localStorage cache
    try {
      const cachedIcon = localStorage.getItem(`coin-icon-${baseAsset}`);
      if (cachedIcon) {
        setSvgContent(cachedIcon);
        iconCache[baseAsset] = cachedIcon;
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // Ignore localStorage errors
      console.error(e);
    }

    // Set a timeout to prevent hanging on slow API responses
    const timeoutId = setTimeout(() => {
      if (isLoading && isMounted) {
        setHasError(true);
        setIsLoading(false);
        iconCache[baseAsset] = null;
      }
    }, 3000);

    // Try multiple icon APIs with fallbacks
    const fetchIcon = async () => {
      // List of APIs to try in order
      const apiUrls = [
        `https://cryptoicons.org/api/icon/${baseAsset.toLowerCase()}/200`,
        `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${baseAsset.toLowerCase()}.svg`,
        `https://sideshift.ai/api/v2/coins/icon/${baseAsset}`,
      ];

      let success = false;

      for (const url of apiUrls) {
        if (!isMounted) return;

        try {
          const response = await fetch(url, {
            headers: {
              Accept: "image/svg+xml",
            },
            // Add a short timeout to each request
            signal: AbortSignal.timeout(2000),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch icon from ${url}: ${response.status}`
            );
          }

          const svgText = await response.text();

          // Validate SVG content
          if (svgText.trim().startsWith("<svg") || svgText.includes("<?xml")) {
            if (isMounted) {
              setSvgContent(svgText);
              setIsLoading(false);

              // Cache the successful result
              iconCache[baseAsset] = svgText;
              try {
                localStorage.setItem(`coin-icon-${baseAsset}`, svgText);
              } catch (e) {
                // Handle localStorage errors (quota exceeded, etc.)
                console.warn("Could not save icon to localStorage:", e);
              }

              success = true;
              break; // Exit the loop on success
            }
          } else {
            throw new Error("Invalid SVG content received");
          }
        } catch (error) {
          console.warn(
            `Error fetching SVG for ${baseAsset} from ${url}:`,
            error
          );
          // Continue to the next API if this one failed
        }
      }

      // If all APIs failed, mark as error
      if (!success && isMounted) {
        setHasError(true);
        setIsLoading(false);
        iconCache[baseAsset] = null;
      }

      clearTimeout(timeoutId);
    };

    fetchIcon();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [symbol]);

  // Fallback icon with first letter
  if (hasError || !svgContent) {
    const baseAsset = symbol.replace(/USDT$|USD$/, "").toUpperCase();
    const firstLetter = baseAsset.charAt(0);
    const backgroundColor = getColorForCoin(baseAsset);

    return (
      <div
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor,
          color: "white",
          fontSize: size * 0.5,
          fontWeight: "bold",
        }}
      >
        {firstLetter}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-700 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Render the SVG icon
  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// Function to get a color for a coin, either from predefined list or generated
function getColorForCoin(symbol: string): string {
  const baseAsset = symbol.replace(/USDT$|USD$/, "").toLowerCase();

  // Return predefined color if available
  if (coinColors[baseAsset]) {
    return coinColors[baseAsset];
  }

  // Generate a consistent color based on the symbol
  let hash = 0;
  for (let i = 0; i < baseAsset.length; i++) {
    hash = baseAsset.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to a hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}
