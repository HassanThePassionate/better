"use client";

import { format } from "date-fns";
import { Video } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import type { CalendarEvent } from "@/types/calendar";
import { formatEventTime } from "@/lib/calendar-date-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SquareWidgetProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onClick: () => void;
}

export function SquareWidget({
  selectedDate,
  events,
  onClick,
}: SquareWidgetProps) {
  const allDayEventsCount = events.filter((event) => event.isAllDay).length;

  return (
    <div
      className='w-full h-full overflow-hidden rounded-2xl shadow-sm border-0 bg-card backdrop-blur-sm cursor-pointer'
      onClick={onClick}
    >
      <div className='p-0'>
        {/* iOS-style widget with glass morphism effect */}
        <div className='flex flex-col h-full relative'>
          {/* Widget header with date */}
          <div className='px-3 pt-3 pb-1 flex justify-between items-center'>
            <div className='flex flex-col'>
              <h2 className='text-xs font-bold text-error'>
                {format(selectedDate, "EEEE").toUpperCase()}
              </h2>
              <span className='text-2xl font-bold leading-tight'>
                {format(selectedDate, "d")}
              </span>
            </div>
            {allDayEventsCount > 0 && (
              <div className='bg-purple-500 text-text-primary text-[10px] px-2 py-0.5 rounded-md font-medium'>
                {allDayEventsCount} all-day event
                {allDayEventsCount !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className='w-full h-px bg-border my-1'></div>

          {/* Events list */}
          <div className='px-3 py-1 flex-1 gap-2 overflow-hidden'>
            {events.length > 0 ? (
              <ScrollArea
                className={cn(
                  "space-y-2 ",
                  events.length > 3 && "pr-1 max-[1600px]:h-[120px] h-[200px]  "
                )}
              >
                {events.map((event) => (
                  <div
                    key={event.id}
                    className='flex items-center space-x-2 mb-3'
                  >
                    <div
                      className={`w-1 h-10 ${event.color} rounded-full`}
                    ></div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs font-medium truncate max-w-[120px]'>
                          {event.title}
                        </span>
                        {event.isVideo && (
                          <Video className='h-3 w-3 text-brand mr-4' />
                        )}
                      </div>
                      <span className='text-[9px] text-foreground'>
                        {event.isAllDay
                          ? "All day"
                          : `${formatEventTime(event.date)}-${formatEventTime(
                              event.endDate
                            )}`}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <EmptyState
                title='No events'
                description='Tap to add'
                size='sm'
                className='h-full'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
