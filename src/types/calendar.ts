import type React from "react"
// Define all types in a central location for better organization and reuse

// Event-related types
export interface CalendarEvent {
  id: number
  title: string
  description?: string
  date: string
  endDate: string
  color: string
  isVideo?: boolean
  isAllDay?: boolean
  location?: string
  attendees?: string[]
  recurrence?: RecurrenceType
  reminder?: number // minutes before event
  notes?: string
}

export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | "none"
export type EventModalMode = "view" | "add" | "edit"

// UI-related types
export interface ColorOption {
  name: string
  value: string
}

export interface RecurrenceOption {
  label: string
  value: RecurrenceType
}

export interface ReminderOption {
  label: string
  value: number
}

// Context-related types
export interface EventsContextType {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (event: CalendarEvent) => void
  deleteEvent: (id: number) => void
  getEventsForDay: (date: Date) => CalendarEvent[]
  getEventColorsForDay: (date: Date) => string[]
}

// Component props types
export interface CalendarProps {
  events: CalendarEvent[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onAddEvent: () => void
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onEventClick?: (event: CalendarEvent) => void
}

export interface MiniCalendarProps {
  currentDate: Date
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
  onAddEvent: () => void
  onOpenCalendar: () => void
}

export interface EventsListProps {
  events: CalendarEvent[]
  selectedDate: Date
  onEventClick: (event: CalendarEvent) => void
  onAddEvent: () => void
}

export interface WidgetProps {
  selectedDate: Date
  events: CalendarEvent[]
  onClick: () => void
}

export interface RectangularWidgetProps extends WidgetProps {
  onAddEvent: (e: React.MouseEvent) => void
}
