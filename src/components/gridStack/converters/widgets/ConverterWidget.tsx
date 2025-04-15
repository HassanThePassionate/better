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
  { id: "volume", name: "Volume Unit", icon: Box },
  { id: "temperature", name: "Temperature unit", icon: Thermometer },
  { id: "speed", name: "Speed Unit", icon: Gauge },
  { id: "number", name: "Number base conversion", icon: Binary },

  // Page 2
  { id: "energy", name: "Energy", icon: Flame },
  { id: "pressure", name: "Pressure", icon: Droplet },
  { id: "time", name: "Time", icon: Clock },
  { id: "power", name: "Power", icon: Zap },
  { id: "data", name: "Data", icon: Database },
  { id: "currency", name: "Currency", icon: Coins },
];

const TOOLS_PER_PAGE = 8;

export default function ConverterWidget() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { favorites } = useFavorites();

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
    if (currentPage < totalPagesForSortedTools - 1 && !isAnimating) {
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

  // Find the selected tool
  const selectedToolObj = selectedTool
    ? allConverterTools.find((t) => t.id === selectedTool)
    : null;
  // Get the icon component if a tool is selected
  const IconComponent = selectedToolObj?.icon;

  // Calculate total pages based on sorted tools
  const sortedTools = getSortedTools();
  const totalPagesForSortedTools = Math.ceil(
    sortedTools.length / TOOLS_PER_PAGE
  );

  // Reset to first page if current page is out of bounds after reordering
  useEffect(() => {
    if (currentPage >= totalPagesForSortedTools) {
      setCurrentPage(0);
    }
  }, [favorites, totalPagesForSortedTools, currentPage]);

  return (
    <>
      {/* Widget */}
      <div className='h-full w-full rounded-[20px] overflow-hidden shadow-lg bg-card text-warn-text'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-2 bg-badge'>
          <button
            onClick={goToPrevPage}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md text-foreground cursor-not-allowed",
              currentPage > 0 && "text-text hover:bg-hover cursor-pointer"
            )}
            disabled={currentPage === 0 || isAnimating}
            aria-label='Previous page'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>
          <div className='flex items-center'>
            <h2 className='text-lg font-medium'>converter</h2>
            <div className='flex space-x-1 ml-3'>
              {Array.from({ length: totalPagesForSortedTools }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors bg-card",
                    i === currentPage && "bg-brand"
                  )}
                />
              ))}
            </div>
          </div>
          <button
            onClick={goToNextPage}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md text-foreground cursor-not-allowed",
              currentPage < totalPagesForSortedTools - 1 &&
                "text-text hover:bg-hover cursor-pointer"
            )}
            disabled={
              currentPage === totalPagesForSortedTools - 1 || isAnimating
            }
            aria-label='Next page'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>

        {/* Tools Grid */}
        <div className='relative h-[calc(200px-40px)] overflow-hidden min-[1600px]:mt-6'>
          <div
            className='absolute w-full h-full transition-transform duration-300 ease-in-out scrollbar-hide'
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            <div
              className='flex scrollbar-hide'
              style={{ width: `${totalPagesForSortedTools * 100}%` }}
            >
              {Array.from({ length: totalPagesForSortedTools }).map(
                (_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className='grid grid-cols-4 grid-rows-2 scrollbar-hide'
                    style={{ width: `${100 / totalPagesForSortedTools}%` }}
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
                            className='relative flex flex-col items-center justify-center h-[74px] hover:bg-hover transition-colors'
                            onClick={() => openConverter(tool.id)}
                          >
                            {isFavorite && (
                              <div className='absolute top-1 right-1'>
                                <Star className='h-3 w-3 ' />
                              </div>
                            )}
                            <tool.icon className='w-6 h-6 mb-2 text-text' />
                            <span className='text-xs text-center px-2'>
                              {tool.name}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )
              )}
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
                  {IconComponent && (
                    <IconComponent className='text-text w-5 h-5' />
                  )}
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
            <div className='flex-1 overflow-auto'>
              <UnitConverter initialTool={selectedTool} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
