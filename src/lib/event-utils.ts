import type { CalendarEvent } from "@/types/calendar"

/**
 * Get the next available event ID
 */
export function getNextEventId(events: CalendarEvent[]): number {
  return Math.max(0, ...events.map((e) => e.id)) + 1
}

/**
 * Get available colors for event creation
 */
export function getEventColors() {
  return [
    { name: "Red", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
  ]
}

/**
 * Get recurrence options
 */
export function getRecurrenceOptions() {
  return [
    { label: "None", value: "none" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ]
}

/**
 * Get reminder options
 */
export function getReminderOptions() {
  return [
    { label: "None", value: 0 },
    { label: "5 minutes before", value: 5 },
    { label: "15 minutes before", value: 15 },
    { label: "30 minutes before", value: 30 },
    { label: "1 hour before", value: 60 },
    { label: "2 hours before", value: 120 },
    { label: "1 day before", value: 1440 },
  ]
}
