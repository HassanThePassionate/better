"use client";

import type React from "react";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import {
  CalculatorIcon,
  Ruler,
  Weight,
  Square,
  Box,
  Thermometer,
  Gauge,
  Binary,
  Flame,
  Droplet,
  Clock,
  Zap,
  Database,
  Coins,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Calculator from "./Calculator";
import { useFavorites } from "@/context/FavoriteConverterContext";
import Base from "./Base";
import {
  areaUnits,
  dataUnits,
  energyUnits,
  lengthUnits,
  powerUnits,
  pressureUnits,
  speedUnits,
  temperatureUnits,
  timeUnits,
  volumeUnits,
  weightUnits,
} from "@/constant/Units";
import CurrencyConverter from "./CurrencyConverter";
import NumberBaseConverter from "./NumberBaseConverter";

type ConverterType =
  | "calculator"
  | "length"
  | "weight"
  | "area"
  | "volume"
  | "temperature"
  | "speed"
  | "number"
  | "energy"
  | "pressure"
  | "time"
  | "power"
  | "data"
  | "currency";

// Define default converters
const defaultConverters = [
  { id: "currency", name: "Currency", icon: Coins },
  { id: "calculator", name: "Calculator", icon: CalculatorIcon },
  { id: "length", name: "Length", icon: Ruler },
  { id: "weight", name: "Weight", icon: Weight },
  { id: "area", name: "Area", icon: Square },
  { id: "volume", name: "Volume", icon: Box },
  { id: "temperature", name: "Temperature", icon: Thermometer },
  { id: "speed", name: "Speed", icon: Gauge },
  { id: "number", name: "Number Base", icon: Binary },
  { id: "energy", name: "Energy", icon: Flame },
  { id: "pressure", name: "Pressure", icon: Droplet },
  { id: "time", name: "Time", icon: Clock },
  { id: "power", name: "Power", icon: Zap },
  { id: "data", name: "Data", icon: Database },
];

interface UnitConverterProps {
  initialTool?: string | null;
}

export default function UnitConverter({
  initialTool = "currency",
}: UnitConverterProps) {
  const [activeConverter, setActiveConverter] = useState<ConverterType>(
    (initialTool as ConverterType) || "calculator"
  );
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const menuRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const initialRenderRef = useRef(true);
  const { favorites, toggleFavorite } = useFavorites();

  // Sort converters with favorites at the top
  const getSortedConverters = () => {
    // Create a copy of the default converters
    const sortedConverters = [...defaultConverters];

    // Move favorites to the top
    if (favorites.length > 0) {
      // Remove favorites from their original positions
      const favoritesConverters = sortedConverters.filter((c) =>
        favorites.includes(c.id)
      );
      const nonFavoritesConverters = sortedConverters.filter(
        (c) => !favorites.includes(c.id)
      );

      // Combine with favorites first
      return [...favoritesConverters, ...nonFavoritesConverters];
    }

    return sortedConverters;
  };

  const converters = getSortedConverters();

  // Only set the initial tool on first render, not on subsequent renders
  useEffect(() => {
    if (
      initialRenderRef.current &&
      initialTool &&
      defaultConverters.some((c) => c.id === initialTool)
    ) {
      setActiveConverter(initialTool as ConverterType);
      // Find the index of the initial tool
      const index = converters.findIndex((c) => c.id === initialTool);
      if (index !== -1) {
        setFocusedIndex(index);
      }
      initialRenderRef.current = false;
    }
  }, [initialTool, converters]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Initialize refs array
  useEffect(() => {
    menuRefs.current = menuRefs.current.slice(0, converters.length);
  }, [converters.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev < converters.length - 1 ? prev + 1 : 0;
          menuRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : converters.length - 1;
          menuRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          setActiveConverter(converters[focusedIndex].id as ConverterType);
          if (isMobile) setShowSidebar(false);
        }
        break;
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation(); // Prevent the button click from triggering the parent
    toggleFavorite(toolId);
  };

  const renderConverter = () => {
    switch (activeConverter) {
      case "calculator":
        return <Calculator />;
      case "length":
        return <Base title='Length' units={lengthUnits} />;
      case "weight":
        return <Base title='Weight' units={weightUnits} />;
      case "area":
        return <Base title='Area' units={areaUnits} />;
      case "volume":
        return <Base title='Volume' units={volumeUnits} />;
      case "temperature":
        return (
          <Base title='Temperature' units={temperatureUnits} defaultValue={0} />
        );
      case "speed":
        return <Base title='Speed' units={speedUnits} />;
      case "number":
        return <NumberBaseConverter />;
      case "energy":
        return <Base title='Energy' units={energyUnits} />;
      case "pressure":
        return <Base title='Pressure' units={pressureUnits} />;
      case "time":
        return <Base title='Time' units={timeUnits} />;
      case "power":
        return <Base title='Power' units={powerUnits} />;
      case "data":
        return <Base title='Data' units={dataUnits} />;
      case "currency":
        return <CurrencyConverter />;
      default:
        return (
          <div className='p-4 text-center'>
            Calculator functionality coming soon
          </div>
        );
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className='flex flex-col'>
      {/* iOS-style header */}
      <div className='flex items-center justify-between py-2 px-3 bg-card border-b border-border text-text'>
        <div className='flex items-center'>
          {isMobile && (
            <button onClick={toggleSidebar} className='mr-2 text-brand text-sm'>
              {showSidebar ? "Done" : "Menu"}
            </button>
          )}
          <h1 className='text-base font-semibold text-text'>
            {converters.find((c) => c.id === activeConverter)?.name ||
              "Converter"}
          </h1>
        </div>
      </div>

      <div className='flex flex-1'>
        {/* Sidebar - visible on desktop or when toggled on mobile */}
        {(!isMobile || showSidebar) && (
          <div
            className={cn(
              isMobile
                ? "absolute inset-0 z-10 bg-card"
                : "w-56 border-r border-border"
            )}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className='p-1'>
              {isMobile && (
                <div className='flex justify-between items-center p-2 border-b border-border mb-1'>
                  <h2 className='text-base font-semibold text-text'>
                    Select Converter
                  </h2>
                  <button
                    onClick={toggleSidebar}
                    className='text-brand text-sm'
                  >
                    Done
                  </button>
                </div>
              )}
              <ul className='space-y-0.5'>
                {converters.map((converter, index) => {
                  const toolId = converter.id;
                  const isFavorite = favorites.includes(toolId);

                  return (
                    <li key={converter.id}>
                      <div className='flex items-center'>
                        <button
                          ref={(el) => {
                            menuRefs.current[index] = el;
                          }}
                          onClick={() => {
                            setActiveConverter(toolId as ConverterType);
                            setFocusedIndex(index);
                            if (isMobile) setShowSidebar(false);
                          }}
                          onMouseEnter={() => setFocusedIndex(index)}
                          onFocus={() => setFocusedIndex(index)}
                          className={cn(
                            "flex items-center w-full px-3 py-1.5 rounded-lg text-left text-sm outline-none transition-colors",
                            activeConverter === converter.id
                              ? "bg-brand text-text-primary"
                              : focusedIndex === index
                              ? "bg-hover text-text"
                              : "text-text hover:bg-hover"
                          )}
                        >
                          <converter.icon
                            className={cn(
                              "mr-2 h-4 w-4",
                              activeConverter === converter.id
                                ? "text-text"
                                : "text-foreground"
                            )}
                          />
                          {converter.name}
                        </button>
                        <button
                          onClick={(e) => handleToggleFavorite(e, toolId)}
                          className={cn(
                            "ml-1 p-1 rounded-full transition-colors"
                          )}
                          aria-label={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Star
                            className='h-3.5 w-3.5'
                            fill={isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={`flex-1 p-2 ${
            isMobile && showSidebar ? "hidden" : ""
          } scrollbar-hide`}
        >
          {renderConverter()}
        </div>
      </div>
    </div>
  );
}
