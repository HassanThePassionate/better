"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import Button from "./ui/my-button";

interface RangeDatePickerProps {
  selectedRange?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
}

export default function RangeDatePicker({
  selectedRange,
  onRangeChange,
}: RangeDatePickerProps) {
  const today = new Date();
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  };
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  };
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  };
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  };
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  };
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  };
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  };

  const [month, setMonth] = useState(today);
  const [date, setDate] = useState<DateRange | undefined>(
    selectedRange || last7Days
  );

  // Update parent component when date changes
  useEffect(() => {
    if (onRangeChange) {
      onRangeChange(date);
    }
  }, [date, onRangeChange]);

  // Update local state when selectedRange changes from parent
  useEffect(() => {
    if (selectedRange) {
      setDate(selectedRange);
      if (selectedRange.to) {
        setMonth(selectedRange.to);
      } else if (selectedRange.from) {
        setMonth(selectedRange.from);
      }
    }
  }, [selectedRange]);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onRangeChange) {
      onRangeChange(newDate);
    }
  };

  return (
    <div>
      <div className='rounded-md'>
        <div className='flex max-sm:flex-col'>
          <div className='relative py-4 max-sm:order-1 max-sm:border-t sm:w-32'>
            <div className='h-full sm:border-e'>
              <div className='flex flex-col px-2'>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    const todayRange = {
                      from: today,
                      to: today,
                    };
                    setDate(todayRange);
                    setMonth(today);
                    if (onRangeChange) {
                      onRangeChange(todayRange);
                    }
                  }}
                >
                  Today
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(yesterday);
                    setMonth(yesterday.to);
                    if (onRangeChange) {
                      onRangeChange(yesterday);
                    }
                  }}
                >
                  Yesterday
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(last7Days);
                    setMonth(last7Days.to);
                    if (onRangeChange) {
                      onRangeChange(last7Days);
                    }
                  }}
                >
                  Last 7 days
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(last30Days);
                    setMonth(last30Days.to);
                    if (onRangeChange) {
                      onRangeChange(last30Days);
                    }
                  }}
                >
                  Last 30 days
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(monthToDate);
                    setMonth(monthToDate.to);
                    if (onRangeChange) {
                      onRangeChange(monthToDate);
                    }
                  }}
                >
                  Month to date
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(lastMonth);
                    setMonth(lastMonth.to);
                    if (onRangeChange) {
                      onRangeChange(lastMonth);
                    }
                  }}
                >
                  Last month
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(yearToDate);
                    setMonth(yearToDate.to);
                    if (onRangeChange) {
                      onRangeChange(yearToDate);
                    }
                  }}
                >
                  Year to date
                </Button>
                <Button
                  className='w-full justify-start'
                  onClick={() => {
                    setDate(lastYear);
                    setMonth(lastYear.to);
                    if (onRangeChange) {
                      onRangeChange(lastYear);
                    }
                  }}
                >
                  Last year
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            mode='range'
            selected={date}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            className='p-2'
            disabled={[{ after: today }]}
          />
        </div>
      </div>
    </div>
  );
}
