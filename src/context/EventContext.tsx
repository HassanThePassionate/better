"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  filterEventsForDay,
  getEventColorsForDay,
} from "@/lib/calendar-date-utils";
import { getNextEventId } from "@/lib/event-utils";
import { sampleEvents, allDayEvents } from "@/constant/SampleEvents";
import type { CalendarEvent, EventsContextType } from "@/types/calendar";

// Create the context with a default value
const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Combine all sample events
const combinedEvents: CalendarEvent[] = [
  ...sampleEvents,
  ...allDayEvents.map((event) => ({
    ...event,
    id: event.id,
    title: event.title,
    description: event.title,
    date: event.date,
    endDate: event.endDate,
    color: event.color,
    isVideo: event.isVideo,
    isAllDay: event.isAllDay,
    location: event.location,
    attendees: event.attendees,
  })),
];

// Provider component
export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(combinedEvents);

  // Add a new event
  const addEvent = useCallback(
    (event: Omit<CalendarEvent, "id">) => {
      const newEvent = {
        ...event,
        id: getNextEventId(events),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    },
    [events]
  );

  // Update an existing event
  const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);

  // Delete an event
  const deleteEvent = useCallback((id: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  }, []);

  // Get events for a specific day - memoized to prevent unnecessary recalculations
  const getEventsForDay = useCallback(
    (date: Date) => {
      return filterEventsForDay(events, date);
    },
    [events]
  );

  // Get event colors for a specific day - memoized
  const getEventColorsForDayCallback = useCallback(
    (date: Date) => {
      return getEventColorsForDay(events, date);
    },
    [events]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsForDay,
      getEventColorsForDay: getEventColorsForDayCallback,
    }),
    [
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsForDay,
      getEventColorsForDayCallback,
    ]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

// Custom hook to use the events context
export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
