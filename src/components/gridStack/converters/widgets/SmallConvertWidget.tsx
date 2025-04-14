"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Calculator,
  Ruler,
  Weight,
  Square,
  Box,
  Thermometer,
  Gauge,
  Binary,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  Droplet,
  Clock,
  Zap,
  Database,
  Coins,
  Star,
} from "lucide-react";
import UnitConverter from "../UnitConverter";
import { useFavorites } from "@/context/FavoriteConverterContext";
import { cn } from "@/lib/utils";

type ConverterTool = {
  id: string;
  name: string;
  icon: React.ElementType;
};

// All converter tools across multiple pages
const allConverterTools: ConverterTool[] = [
  // Page 1
  { id: "calculator", name: "Calculator", icon: Calculator },
  { id: "length", name: "Unit of length", icon: Ruler },
  { id: "weight", name: "Weight unit", icon: Weight },
  { id: "area", name: "Area Unit", icon: Square },
  // Page 2
  { id: "volume", name: "Volume Unit", icon: Box },
  { id: "temperature", name: "Temperature unit", icon: Thermometer },
  { id: "speed", name: "Speed Unit", icon: Gauge },
  { id: "number", name: "Number base conversion", icon: Binary },
  // Page 3
  { id: "energy", name: "Energy", icon: Flame },
  { id: "pressure", name: "Pressure", icon: Droplet },
  { id: "time", name: "Time", icon: Clock },
  { id: "power", name: "Power", icon: Zap },
  // Page 4
  { id: "data", name: "Data", icon: Database },
  { id: "currency", name: "Currency", icon: Coins },
];

const TOOLS_PER_PAGE = 4;

export default function SmallConverterWidget() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { favorites } = useFavorites();

  // Sort tools with favorites first
  const getSortedTools = () => {
    if (favorites.length === 0) return allConverterTools;

    // Create a copy and sort with favorites first
    const favoriteTools = allConverterTools.filter((tool) =>
      favorites.includes(tool.id)
    );
    const nonFavoriteTools = allConverterTools.filter(
      (tool) => !favorites.includes(tool.id)
    );

    return [...favoriteTools, ...nonFavoriteTools];
  };

  // Calculate total pages based on sorted tools
  const sortedTools = getSortedTools();
  const totalPages = Math.ceil(sortedTools.length / TOOLS_PER_PAGE);

  // Reset to first page if current page is out of bounds after reordering
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [favorites, totalPages, currentPage]);

  // Handle animation timing
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const openConverter = (toolId: string) => {
    setSelectedTool(toolId);
    setIsPopupOpen(true);
  };

  const closeConverter = () => {
    setIsPopupOpen(false);
    // Reset selected tool when closing to ensure fresh state on next open
    setSelectedTool(null);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Find the selected tool
  const selectedToolObj = selectedTool
    ? allConverterTools.find((t) => t.id === selectedTool)
    : null;
  // Get the icon component if a tool is selected
  const IconComponent = selectedToolObj?.icon;

  return (
    <>
      {/* Widget */}
      <div className='w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-lg bg-card text-text  transition-shadow'>
        {/* Header */}
        <div className='flex items-center justify-between px-3 py-2 bg-badge'>
          <button
            onClick={goToPrevPage}
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded-md text-foreground cursor-not-allowed",
              currentPage > 0 && "text-text hover:bg-hover cursor-pointer"
            )}
            disabled={currentPage === 0 || isAnimating}
            aria-label='Previous page'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
          <div className='flex items-center'>
            <h2 className='text-base font-medium'>converter</h2>
            <div className='flex space-x-1 ml-2'>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 h-1 rounded-full transition-colors bg-card",
                    i === currentPage && "bg-brand"
                  )}
                />
              ))}
            </div>
          </div>
          <button
            onClick={goToNextPage}
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded-md text-foreground cursor-not-allowed",
              currentPage < totalPages - 1 &&
                "text-text hover:bg-hover cursor-pointer"
            )}
            disabled={currentPage === totalPages - 1 || isAnimating}
            aria-label='Next page'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>

        {/* Tools Grid with Animation */}
        <div className='relative h-[calc(200px-32px)] overflow-hidden'>
          <div
            className='absolute w-full h-full transition-transform duration-300 ease-in-out scrollbar-hide'
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            <div
              className='flex scrollbar-hide'
              style={{ width: `${totalPages * 100}%` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className='grid grid-cols-2 grid-rows-2 scrollbar-hide'
                  style={{ width: `${100 / totalPages}%` }}
                >
                  {sortedTools
                    .slice(
                      pageIndex * TOOLS_PER_PAGE,
                      (pageIndex + 1) * TOOLS_PER_PAGE
                    )
                    .map((tool) => {
                      const isFavorite = favorites.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          className='relative flex flex-col items-center justify-center h-[82px] hover:bg-hover transition-colors'
                          onClick={() => openConverter(tool.id)}
                        >
                          {isFavorite && (
                            <div className='absolute top-1 right-1'>
                              <Star className='h-3 w-3 ' />
                            </div>
                          )}
                          <tool.icon className='w-6 h-6 mb-2 text-text' />
                          <span className='text-xs text-center px-1 leading-tight'>
                            {tool.name}
                          </span>
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
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
                  {IconComponent && <IconComponent className=' w-5 h-5' />}
                </div>
                <h1 className='text-lg font-semibold'>Universal Converter</h1>
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
            <div className='flex-1 overflow-auto scrollbar-hide'>
              <UnitConverter initialTool={selectedTool} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
