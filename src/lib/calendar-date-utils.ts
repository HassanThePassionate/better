import { format, parseISO, isSameDay, isWithinInterval } from "date-fns"
import type { CalendarEvent } from "@/types/calendar"

// Cache for date formatting to avoid repeated calculations
const formatCache = new Map<string, string>()

/**
 * Format time for display with caching
 */
export function formatEventTime(dateString: string): string {
  if (formatCache.has(dateString)) {
    return formatCache.get(dateString)!
  }

  const formatted = format(parseISO(dateString), "h:mm a")
  formatCache.set(dateString, formatted)
  return formatted
}

/**
 * Format a date range for display in a consistent way across the app
 */
export function formatEventDateRange(startDate: string, endDate: string, isAllDay = false): string {
  const cacheKey = `${startDate}-${endDate}-${isAllDay}`

  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!
  }

  const start = parseISO(startDate)
  const end = parseISO(endDate)

  let result: string

  if (isAllDay) {
    result = "All day"
  } else if (isSameDay(start, end)) {
    // Same day events
    result = `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
  } else {
    // Multi-day events
    result = `${format(start, "MMM d, h:mm a")} - ${format(end, "MMM d, h:mm a")}`
  }

  formatCache.set(cacheKey, result)
  return result
}

/**
 * Filter events for a specific day with optimized date comparisons
 */
export function filterEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  // Normalize the date to start and end of day for faster comparisons
  // const dayStart = startOfDay(date)
  // const dayEnd = endOfDay(date)

  return events
    .filter((event) => {
      const eventStart = parseISO(event.date)
      const eventEnd = parseISO(event.endDate)

      return (
        isWithinInterval(date, { start: eventStart, end: eventEnd }) ||
        isSameDay(eventStart, date) ||
        isSameDay(eventEnd, date)
      )
    })
    .sort((a, b) => {
      // Sort by all-day events first, then by start time
      if (a.isAllDay && !b.isAllDay) return -1
      if (!a.isAllDay && b.isAllDay) return 1
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

/**
 * Get event colors for a specific day (for indicators) with optimized filtering
 */
export function getEventColorsForDay(events: CalendarEvent[], day: Date): string[] {
  // Use the same filtering logic as filterEventsForDay but only extract colors
  // const dayStart = startOfDay(day)
  // const dayEnd = endOfDay(day)

  return events
    .filter((event) => {
      const eventStart = parseISO(event.date)
      const eventEnd = parseISO(event.endDate)

      return (
        isWithinInterval(day, { start: eventStart, end: eventEnd }) ||
        isSameDay(eventStart, day) ||
        isSameDay(eventEnd, day)
      )
    })
    .map((event) => event.color.replace("bg-", ""))
    .slice(0, 3) // Limit to 3 colors max
}
