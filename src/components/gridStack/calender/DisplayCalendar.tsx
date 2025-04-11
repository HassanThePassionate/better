"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { CalendarEvent, EventModalMode } from "@/types/calendar";
import { useEvents } from "@/context/EventContext";
import { MiniCalendar } from "./CalenderWidget";
import { EventsList } from "./EventList";
import { SquareWidget } from "./SmCalendar";
import { RectangularWidget } from "./WideCalendar";
import { Calendar } from "./Calendar";
import { EventModal } from "./EventModal";

export default function EventCalendar({ type }: { type?: string }) {
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDay } =
    useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date("2025-04-08"));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<EventModalMode>("view");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );

  // Memoize events for the selected date to prevent unnecessary recalculations
  const currentDateEvents = useMemo(
    () => getEventsForDay(selectedDate),
    [getEventsForDay, selectedDate]
  );

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Handle month change
  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Open calendar popup
  const openCalendar = useCallback(() => {
    setCalendarOpen(true);
  }, []);

  // Open event modal
  const openEventModal = useCallback(
    (mode: EventModalMode, event?: CalendarEvent) => {
      setEventModalMode(mode);
      setSelectedEvent(event);
      setEventModalOpen(true);
    },
    []
  );

  // Handle event click
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventModalMode("edit");
    setEventModalOpen(true);
  }, []);

  // Handle year change in calendar
  const handleYearChange = useCallback((year: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(year);
      return newDate;
    });
  }, []);

  // Handle month change in calendar
  const handleMonthChangeInCalendar = useCallback((month: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(month);
      return newDate;
    });
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setEventModalOpen(false);
  }, []);

  return (
    <>
      <div className='flex h-full'>
        {type === "large" && (
          <>
            {/* Calendar Section */}
            <MiniCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              onAddEvent={() => openEventModal("add")}
              onOpenCalendar={openCalendar}
            />
            {/* Events Section */}
            <EventsList
              events={currentDateEvents}
              selectedDate={selectedDate}
              onEventClick={handleEventClick}
              onAddEvent={() => openEventModal("add")}
            />
          </>
        )}

        {type === "small" && (
          <SquareWidget
            selectedDate={selectedDate}
            events={currentDateEvents}
            onClick={openCalendar}
          />
        )}
        {type === "wide" && (
          <RectangularWidget
            selectedDate={selectedDate}
            events={currentDateEvents}
            onClick={openCalendar}
            onAddEvent={(e) => {
              e.stopPropagation();
              openEventModal("add");
            }}
          />
        )}
      </div>

      {/* Calendar Popup Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className='max-w-4xl p-0 rounded-xl overflow-hidden min-w-[800px] min-h-[500px]'>
          <div className='flex flex-col h-[500px]'>
            {/* Calendar Header */}
            <DialogHeader className='px-6 py-4 border-b flex justify-between items-center'>
              <div className='flex w-full items-center justify-between'>
                <DialogTitle className='text-xl font-semibold text-left'>
                  Calendar
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Calendar Component */}
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onAddEvent={() => openEventModal("add")}
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChangeInCalendar}
              onEventClick={handleEventClick}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        events={events}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
        mode={eventModalMode}
        selectedEvent={selectedEvent}
      />
    </>
  );
}
