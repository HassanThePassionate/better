/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  //   addYears,
  //   subYears,
  getDay,
  isWithinInterval,
  differenceInDays,
  addDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { YearSelector } from "./YearSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types for events
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  endDate: string;
  color: string;
  isVideo?: boolean;
  isAllDay?: boolean;
  location?: string;
  attendees?: string[];
  recurrence?: "daily" | "weekly" | "monthly" | "yearly" | "none";
  reminder?: number; // minutes before event
  notes?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAddEvent: () => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function Calendar({
  events,
  selectedDate,
  onDateSelect,
  onAddEvent,
  onYearChange,
  onMonthChange,
  onEventClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [draggedOver, setDraggedOver] = useState<Date | null>(null);
  const monthsRef = useRef<HTMLDivElement>(null);

  // Update internal state when props change
  useEffect(() => {
    setCurrentDate(new Date(selectedDate));
    setActiveMonth(selectedDate.getMonth());
  }, [selectedDate]);

  // Scroll to active month in sidebar
  useEffect(() => {
    if (monthsRef.current) {
      const activeElement = monthsRef.current.querySelector(".active-month");
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeMonth]);

  // Get days for the current month with padding for full weeks
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Month names for sidebar
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Day names for header
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Handle month navigation
  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setActiveMonth(newDate.getMonth());
    onMonthChange(newDate.getMonth());
  };

  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setActiveMonth(newDate.getMonth());
    onMonthChange(newDate.getMonth());
  };

  // Handle year navigation
  //   const prevYear = () => {
  //     const newDate = subYears(currentDate, 1);
  //     setCurrentDate(newDate);
  //     onYearChange(newDate.getFullYear());
  //   };

  //   const nextYear = () => {
  //     const newDate = addYears(currentDate, 1);
  //     setCurrentDate(newDate);
  //     onYearChange(newDate.getFullYear());
  //   };

  // Reset to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setActiveMonth(today.getMonth());
    onDateSelect(today);
    onMonthChange(today.getMonth());
    onYearChange(today.getFullYear());
  };

  // Handle month selection from sidebar
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
    setActiveMonth(monthIndex);
    onMonthChange(monthIndex);
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setShowYearSelector(false);
    onYearChange(year);
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventStart = parseISO(event.date);
        const eventEnd = parseISO(event.endDate);

        // Check if the day falls within the event's time range
        return (
          isWithinInterval(day, { start: eventStart, end: eventEnd }) ||
          isSameDay(eventStart, day) ||
          isSameDay(eventEnd, day)
        );
      })
      .sort((a, b) => {
        // Sort by all-day events first, then by start time
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  };

  // Get event colors for a specific day (for indicators)
  const getEventColorsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventStart = parseISO(event.date);
        const eventEnd = parseISO(event.endDate);
        return (
          isWithinInterval(day, { start: eventStart, end: eventEnd }) ||
          isSameDay(eventStart, day) ||
          isSameDay(eventEnd, day)
        );
      })
      .map((event) => event.color.replace("bg-", ""))
      .slice(0, 3); // Limit to 3 colors max
  };

  // Handle drag and drop for events
  const handleDragStart = (event: React.DragEvent, calEvent: CalendarEvent) => {
    event.dataTransfer.setData("text/plain", calEvent.id.toString());
    setDraggedEvent(calEvent);
  };

  const handleDragOver = (event: React.DragEvent, day: Date) => {
    event.preventDefault();
    setDraggedOver(day);
  };

  const handleDrop = (event: React.DragEvent, day: Date) => {
    event.preventDefault();

    if (draggedEvent) {
      // Calculate the difference in days between the original date and the drop target
      const eventStart = parseISO(draggedEvent.date);
      const eventEnd = parseISO(draggedEvent.endDate);
      const daysDifference = differenceInDays(day, eventStart);

      if (daysDifference !== 0) {
        // Create new dates by adding the difference
        const newStart = addDays(eventStart, daysDifference);
        const newEnd = addDays(eventEnd, daysDifference);

        // Create updated event with new dates
        const updatedEvent = {
          ...draggedEvent,
          date: newStart.toISOString(),
          endDate: newEnd.toISOString(),
        };

        // Call the update function passed from parent
        onEventClick && onEventClick(updatedEvent);
      }
    }

    setDraggedEvent(null);
    setDraggedOver(null);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDraggedOver(null);
  };

  return (
    <div className='flex flex-1 overflow-hidden'>
      {/* Month Sidebar */}
      <div className='w-[80px] border-r flex flex-col'>
        {/* User Avatar */}
        <div className='p-4 flex justify-center'>
          <div className='w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-text-primary font-bold'>
            JD
          </div>
        </div>

        {/* Month List */}
        <ScrollArea className='flex-1'>
          <div ref={monthsRef} className='py-2'>
            {months.map((month, index) => (
              <div
                key={month}
                className={cn(
                  "py-3 text-center cursor-pointer text-sm relative",
                  activeMonth === index
                    ? "font-bold text-error active-month"
                    : "text-text hover:bg-hover"
                )}
                onClick={() => handleMonthSelect(index)}
                role='button'
                tabIndex={0}
                aria-label={`Switch to ${month}`}
                onKeyDown={(e) => e.key === "Enter" && handleMonthSelect(index)}
              >
                {month}
                {activeMonth === index && (
                  <div className='absolute left-0 top-0 bottom-0 w-1 bg-error rounded-r-full'></div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Calendar Area */}
      <div className='flex-1 flex flex-col'>
        {/* Calendar Controls */}
        <div className='p-4 flex items-center justify-between border-b'>
          <Button
            variant='outline'
            className='rounded-full px-4 py-1 text-sm bg-card hover:bg-hover border-0'
            onClick={goToToday}
          >
            Today
          </Button>

          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={prevMonth}
              aria-label='Previous month'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={nextMonth}
              aria-label='Next month'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-center'>
            <h2 className='text-xl font-semibold'>
              {format(currentDate, "MMMM")}
            </h2>
            <div
              className='flex items-center ml-2 cursor-pointer'
              onClick={() => setShowYearSelector(!showYearSelector)}
              role='button'
              tabIndex={0}
              aria-haspopup='true'
              aria-expanded={showYearSelector}
            >
              <span className='text-brand'>{currentDate.getFullYear()}</span>
              <ChevronDown className='h-4 w-4 ml-1 text-brand' />
            </div>
          </div>

          <Button
            className='rounded-full bg-brand hover:bg-brand-hover h-10 w-10 p-0'
            onClick={onAddEvent}
            aria-label='Add event'
          >
            <Plus className='h-5 w-5' />
          </Button>
        </div>

        {/* Year Selector (conditionally rendered) */}
        {showYearSelector && (
          <YearSelector
            currentYear={currentDate.getFullYear()}
            onYearSelect={handleYearSelect}
            onClose={() => setShowYearSelector(false)}
          />
        )}

        {/* Calendar Grid */}
        <div className='flex-1 overflow-y-auto'>
          <div className='grid grid-cols-7 border-b'>
            {dayNames.map((day) => (
              <div
                key={day}
                className='py-2 text-center text-sm text-text font-medium border-r last:border-r-0'
              >
                {day}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7 h-full'>
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = isSameDay(day, selectedDate);
              const dayNumber = format(day, "d");
              const eventColors = getEventColorsForDay(day);
              const hasEvents = eventColors.length > 0;
              const isWeekend = [0, 6].includes(getDay(day));
              const isDraggedOver = draggedOver && isSameDay(draggedOver, day);

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[80px] p-1 border-r border-b  relative",
                    !isCurrentMonth && "bg-card",
                    isSelected && "bg-badge",
                    isWeekend && "bg-hover",
                    isDraggedOver && "bg-home-sidebar-hover",
                    hasEvents &&
                      isCurrentMonth &&
                      "ring-1 ring-inset ring-border"
                  )}
                  onClick={() => {
                    onDateSelect(day);
                    // The parent component will handle opening the modal
                  }}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDrop={(e) => handleDrop(e, day)}
                  role='button'
                  tabIndex={0}
                  aria-label={format(day, "EEEE, MMMM d, yyyy")}
                  aria-selected={isSelected}
                  onKeyDown={(e) => e.key === "Enter" && onDateSelect(day)}
                >
                  <div
                    className={cn(
                      "h-6 w-6 flex items-center justify-center text-sm rounded-full mb-1",
                      isSelected && "bg-brand text-text-primary",
                      isToday(day) && !isSelected && "text-brand font-bold",
                      !isCurrentMonth && "text-gray-400"
                    )}
                  >
                    {dayNumber}
                  </div>

                  <div
                    className={`${
                      dayEvents.length > 0 ? "h-[calc(100%-2rem)]" : "h-8"
                    } overflow-hidden`}
                  >
                    {dayEvents.length > 0 ? (
                      <ScrollArea
                        className={cn("space-y-1 pr-1 max-h-[60px]")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {dayEvents.map((event) => (
                          <TooltipProvider key={event.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`text-xs px-1 py-0.5 rounded-sm truncate ${event.color} text-text-primary cursor-pointer`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick && onEventClick(event);
                                  }}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, event)}
                                  onDragEnd={handleDragEnd}
                                >
                                  {event.isAllDay
                                    ? "• "
                                    : format(parseISO(event.date), "HH:mm") +
                                      " "}
                                  {event.title}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className='p-2'>
                                  <p className='font-bold'>{event.title}</p>
                                  <p className='text-xs text-text'>
                                    {format(
                                      parseISO(event.date),
                                      "MMM d, yyyy • h:mm a"
                                    )}{" "}
                                    -
                                    {format(parseISO(event.endDate), " h:mm a")}
                                  </p>
                                  {event.location && (
                                    <p className='text-xs mt-1'>
                                      {event.location}
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </ScrollArea>
                    ) : (
                      isCurrentMonth && (
                        <div className='flex items-center justify-center h-full mt-1'>
                          <div className='text-[9px] text-text-primary italic'>
                            No events
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {/* iOS-style event indicators */}
                  {hasEvents && isCurrentMonth && (
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
      </div>
    </div>
  );
}
