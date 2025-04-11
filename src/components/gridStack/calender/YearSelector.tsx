"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YearSelectorProps {
  currentYear: number;
  onYearSelect: (year: number) => void;
  onClose: () => void;
}

export function YearSelector({
  currentYear,
  onYearSelect,
  onClose,
}: YearSelectorProps) {
  const [baseYear, setBaseYear] = useState(Math.floor(currentYear / 9) * 9);

  // Generate a 3x3 grid of years centered around the current year
  const generateYearGrid = () => {
    const years = [];
    for (let i = 0; i < 9; i++) {
      years.push(baseYear + i);
    }
    return years;
  };

  // Navigate to previous set of years
  const prevYearSet = () => {
    setBaseYear(baseYear - 9);
  };

  // Navigate to next set of years
  const nextYearSet = () => {
    setBaseYear(baseYear + 9);
  };

  return (
    <div className='absolute top-[120px] left-1/2 transform -translate-x-1/2 z-50 bg-card rounded-xl shadow-lg p-4 w-[300px]'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Select Year</h3>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          className='h-8 w-8 rounded-full'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={prevYearSet}
          className='h-8 w-8 rounded-full'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <span className='text-sm text-gray-500'>
          {baseYear} - {baseYear + 8}
        </span>
        <Button
          variant='ghost'
          size='icon'
          onClick={nextYearSet}
          className='h-8 w-8 rounded-full'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {generateYearGrid().map((year) => (
          <Button
            key={year}
            variant={year === currentYear ? "default" : "outline"}
            className={`rounded-xl h-12 ${
              year === currentYear
                ? "bg-brand text-text-primary"
                : "bg-badge text-text hover:bg-hover"
            }`}
            onClick={() => onYearSelect(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
