"use client";

import { useState } from "react";
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
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  events,
  formatEventTime,
  getEventColorsForDay,
} from "@/lib/calendar-utils";

export default function MainCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date("2025-04-08")); // Set to April 8th to show multiple events

  // Get days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter events for the selected date
  const filteredEvents = events
    .filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, selectedDate);
    })
    .sort((a, b) => {
      // Sort events by time
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  // Handle month navigation
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Reset to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <>
      <div className='w-full  h-full overflow-hidden rounded-2xl shadow-sm bg-card border-0 '>
        <div className='p-0 h-full'>
          <div className='flex h-full'>
            {/* Calendar Section */}
            <div className='w-1/2 border-r border-border h-full overflow-hidden flex flex-col'>
              <div className='p-3'>
                <div className='flex items-center justify-between mb-3'>
                  <h2 className='text-sm font-semibold text-text'>
                    {format(currentDate, "MMMM")}
                  </h2>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='rounded-full h-6 w-6 p-0 text-foreground hover:text-text hover:bg-gray-100'
                      onClick={prevMonth}
                    >
                      <ChevronLeft className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='rounded-full h-6 w-6 p-0 text-foreground hover:text-text hover:bg-gray-100'
                      onClick={nextMonth}
                    >
                      <ChevronRight className='h-3 w-3' />
                    </Button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className='grid grid-cols-7 mb-1'>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className='text-center text-[10px] text-text font-medium'
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className='grid grid-cols-7 gap-0.5'>
                  {Array.from({ length: getDay(monthStart) }, (_, i) => {
                    const prevMonthDay =
                      subMonths(monthEnd, 1).getDate() -
                      getDay(monthStart) +
                      i +
                      1;
                    return (
                      <div
                        key={`prev-${i}`}
                        className='h-7 flex items-center justify-center text-foreground text-[10px]'
                      >
                        {prevMonthDay}
                      </div>
                    );
                  })}

                  {monthDays.map((day, i) => {
                    // Get event colors for this day
                    const eventColors = getEventColorsForDay(day);
                    const hasEvents = eventColors.length > 0;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "h-7 flex flex-col items-center justify-center relative cursor-pointer",
                          isToday(day) &&
                            !isSameDay(day, selectedDate) &&
                            "font-semibold text-blue-500"
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs",
                            isSameDay(day, selectedDate) &&
                              "bg-brand text-text-primary font-medium",
                            !isSameDay(day, selectedDate) && "hover:bg-hover"
                          )}
                        >
                          {format(day, "d")}
                        </div>

                        {/* iOS-style event indicators */}
                        {hasEvents && (
                          <div className='flex space-x-0.5 absolute -bottom-1'>
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

                  {Array.from({ length: 6 - getDay(monthEnd) }, (_, i) => (
                    <div
                      key={`next-${i}`}
                      className='h-7 flex items-center justify-center text-foreground text-[10px]'
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with Today button */}
              <div className='mt-auto border-t border-border p-2 flex justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToToday}
                  className='text-[10px] h-6 rounded-full border-border text-text hover:bg-hover px-4'
                >
                  Today
                </Button>
              </div>
            </div>

            {/* Events Section with fixed header and scrollable content */}
            <div className='w-1/2 bg-hover flex flex-col h-full'>
              {/* Fixed header */}
              <div className='p-3 pb-2 border-b border-border'>
                <h2 className='text-xs font-semibold text-text'>
                  {format(selectedDate, "MMMM d")}
                </h2>
              </div>

              {/* Scrollable events container - simplified for better compatibility */}
              <div
                className='overflow-y-auto h-[230px]  px-3 py-2'
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(209, 213, 219, 0.5) transparent",
                }}
              >
                {filteredEvents.length > 0 ? (
                  <div className='space-y-2'>
                    {filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className='p-2 rounded-xl bg-background shadow-sm border border-border'
                      >
                        <div className='flex items-start'>
                          <div
                            className={`w-1 h-full min-h-[24px] ${event.color} rounded-full mr-2 mt-0.5`}
                          ></div>
                          <div className='flex-1'>
                            <h3 className='font-medium text-xs text-text'>
                              {event.title}
                            </h3>
                            <p className='text-[10px] text-foreground mt-0.5 line-clamp-1'>
                              {event.description}
                            </p>
                            <div className='flex items-center mt-1'>
                              <div className='text-[10px] font-normal bg-hover text-text rounded-full px-1.5 py-0 border-0'>
                                {formatEventTime(event.date)}
                              </div>
                              {event.isVideo && (
                                <Video className='h-3 w-3 ml-1 text-text' />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-6 text-foreground opacity-80 text-[10px]'>
                    No events scheduled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
