"use client";

import type React from "react";

import { format } from "date-fns";
import { Video, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { CalendarEvent } from "@/types/calendar";
import { formatEventTime } from "@/lib/calendar-date-utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RectangularWidgetProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onClick: () => void;
  onAddEvent: (e: React.MouseEvent) => void;
}

export function RectangularWidget({
  selectedDate,
  events,
  onClick,
  onAddEvent,
}: RectangularWidgetProps) {
  const allDayEventsCount = events.filter((event) => event.isAllDay).length;

  return (
    <div
      className='w-full h-full overflow-hidden rounded-2xl shadow-sm border-0 bg-card backdrop-blur-sm cursor-pointer'
      onClick={onClick}
    >
      <div className='p-0 relative h-full'>
        {/* Add button */}
        <div className='absolute top-1 right-3 z-10'>
          <Button
            variant='destructive'
            size='icon'
            className='h-6 w-6 rounded-full p-0 shadow-sm bg-error hover:bg-error'
            onClick={onAddEvent}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex h-full'>
          {/* Left side - Date */}
          <div className='w-[90px] bg-badge flex flex-col items-center   justify-center border-r border-border'>
            <h2 className='text-xs font-bold text-error'>
              {format(selectedDate, "EEEE").toUpperCase()}
            </h2>
            <span className='text-4xl font-bold mt-1'>
              {format(selectedDate, "d")}
            </span>
          </div>

          {/* Right side - Events */}
          <div className='flex-1 flex flex-col h-full'>
            {/* Header with all-day events summary */}
            <div className='px-3 pt-2 pb-1 border-b border-border'>
              {allDayEventsCount > 0 ? (
                <div className='flex items-center'>
                  <div className='bg-purple-500 text-text-primary text-xs px-2 py-0.5 rounded-md inline-block'>
                    {allDayEventsCount} all-day event
                    {allDayEventsCount !== 1 ? "s" : ""}
                  </div>
                </div>
              ) : (
                <div className='h-5'></div>
              )}
            </div>

            {/* Events list */}
            <div className='flex-1 overflow-hidden px-3 py-2'>
              {events.length > 0 ? (
                <ScrollArea className='h-full pr-1 overflow-y-auto '>
                  <div className='space-y-2'>
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className='flex items-center space-x-2 group'
                      >
                        <div
                          className={`w-1 h-8 ${event.color} rounded-full flex-shrink-0`}
                        ></div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-medium truncate max-w-[120px]'>
                              {event.title}
                            </span>
                            {event.isVideo && (
                              <div className='flex items-center space-x-1'>
                                <Video className='h-3 w-3 text-brand mr-1 ' />
                                <Button
                                  size='sm'
                                  className='h-4  text-[9px] rounded-full bg-brand hover:bg-brand-hover px-1.5 py-0 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity !mr-3'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Join
                                </Button>
                              </div>
                            )}
                          </div>
                          <span className='text-[9px] text-gray-500 block'>
                            {event.isAllDay
                              ? "All day"
                              : `${formatEventTime(
                                  event.date
                                )}-${formatEventTime(event.endDate)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyState
                  title='No events scheduled'
                  description='Use + button to add an event'
                  size='sm'
                  className='h-full'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
