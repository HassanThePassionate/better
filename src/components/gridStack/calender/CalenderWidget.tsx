"use client";

import { memo, useCallback, useMemo } from "react";
import { format, addDays, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onAddEvent: () => void;
  onOpenCalendar: () => void;
}

function MiniCalendarComponent({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onAddEvent,
  onOpenCalendar,
}: MiniCalendarProps) {
  const { getEventColorsForDay } = useEvents();

  // Generate calendar days efficiently
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const daysOffset = -5; // Start 5 days before the first day of the month

    return Array.from({ length: 35 }).map((_, i) => {
      return addDays(firstDayOfMonth, daysOffset + i);
    });
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  }, [currentDate, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  }, [currentDate, onMonthChange]);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    onMonthChange(today);
    onDateSelect(today);
  }, [onMonthChange, onDateSelect]);

  const handleAddEventClick = useCallback(() => {
    onOpenCalendar();
    onAddEvent();
  }, [onOpenCalendar, onAddEvent]);

  return (
    <div className='w-1/2 border-r border-border bg-card overflow-hidden flex flex-col'>
      <div className='p-3'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-text'>
            {format(currentDate, "MMMM")}
          </h2>
          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              className='rounded-full h-6 w-6 p-0 text-foreground hover:text-text hover:bg-hover'
              onClick={handlePrevMonth}
            >
              <ChevronLeft className='h-3 w-3' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='rounded-full h-6 w-6 p-0 text-foreground hover:text-text hover:bg-hover'
              onClick={handleNextMonth}
            >
              <ChevronRight className='h-3 w-3' />
            </Button>
          </div>
        </div>

        {/* Mini Calendar (simplified) */}
        <div className='grid grid-cols-7 max-[1600px]:mb-1 mb-4'>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={index}
              className='text-center max-[1600px]:text-[10px]  text-xs text-foreground font-medium'
            >
              {day}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7 max-[1600px]:gap-0.5 gap-4'>
          {calendarDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isSelected =
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth() &&
              day.getFullYear() === selectedDate.getFullYear();

            const eventColors = isCurrentMonth ? getEventColorsForDay(day) : [];
            const hasEvents = eventColors.length > 0;

            return (
              <div
                key={i}
                className={cn(
                  "max-[1600px]:h-7 h-8 flex flex-col items-center justify-center relative cursor-pointer",
                  !isCurrentMonth && "text-foreground"
                )}
                onClick={() => {
                  if (isCurrentMonth) {
                    onDateSelect(day);
                  }
                }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full max-[1600px]:text-xs text-sm",
                    isSelected && "bg-brand text-text-primary font-medium",
                    !isSelected && isCurrentMonth && "hover:bg-hover"
                  )}
                >
                  {day.getDate()}
                </div>

                {/* iOS-style event indicators */}
                {hasEvents && (
                  <div className='flex space-x-0.5 absolute -bottom-1 left-1/2 transform -translate-x-1/2'>
                    {eventColors.map((color, index) => (
                      <div
                        key={index}
                        className={`h-1 w-1 rounded-full bg-${color}`}
                        aria-hidden='true'
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Today and Add Event buttons */}
      <div className='mt-auto border-t border-border  max-[1600px]:p-2 p-4 flex justify-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleTodayClick}
          className='max-[1600px]:text-[10px] max-[1600px]:h-6  h-8 text-xs rounded-full border-border text-gray-700 hover:bg-hover text-text px-3'
        >
          Today
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleAddEventClick}
          className='max-[1600px]:text-[10px] max-[1600px]:h-6  h-8 text-xs rounded-full border-border text-brand hover:bg-hover px-3 flex items-center'
        >
          <Plus className='h-3 w-3 mr-1' />
          Add Event
        </Button>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const MiniCalendar = memo(MiniCalendarComponent);
