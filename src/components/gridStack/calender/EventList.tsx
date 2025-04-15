"use client";

import { memo, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { Video, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventsListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: () => void;
}

function EventsListComponent({
  events,
  selectedDate,
  onEventClick,
  onAddEvent,
}: EventsListProps) {
  // Format time for display
  const formatEventTime = useCallback((dateString: string) => {
    return format(parseISO(dateString), "h:mm a");
  }, []);

  // Handle event click with memoization
  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      onEventClick(event);
    },
    [onEventClick]
  );

  return (
    <div className='w-1/2 bg-card flex flex-col h-full'>
      {/* Fixed header */}
      <div className='p-3 pb-2 border-b border-border flex justify-between items-center'>
        <h2 className='text-xs font-semibold text-text'>
          {format(selectedDate, "MMMM d")}
        </h2>
        <Button
          variant='ghost'
          size='sm'
          className='h-6 w-6 p-0 rounded-full text-brand hover:bg-hover'
          onClick={onAddEvent}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Scrollable events container */}
      <ScrollArea className='overflow-y-auto max-[1600px]:h-[230px] h-[400px] px-3 py-2'>
        {events.length > 0 ? (
          <div className='space-y-2 pr-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
            {events.map((event) => (
              <div
                key={event.id}
                className='p-2 rounded-xl bg-background shadow-sm border border-border cursor-pointer hover:bg-hover transition-colors'
                onClick={() => handleEventClick(event)}
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
                      <div className='!text-[10px] font-normal bg-badge  text-text  rounded-full px-1.5 py-0 border-0 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                        {event.isAllDay
                          ? "All day"
                          : formatEventTime(event.date)}
                      </div>
                      {event.isVideo && (
                        <Video className='h-3 w-3 ml-1 text-foreground' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title='No events scheduled for this day'
            description='Tap to add an event'
            action={{
              label: "Add Event",
              onClick: onAddEvent,
              icon: <Plus className='h-3 w-3 mr-1' />,
            }}
            size='md'
            className='h-full'
          />
        )}
      </ScrollArea>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const EventsList = memo(EventsListComponent);
