import { format, addDays, isToday, isSameDay } from "date-fns"
import type { DateItem } from "@/types/date-slider"


export function generateDateRange(endDaysFromNow: number): Date[] {
  const today = new Date()
  const dateArray: Date[] = []

  for (let i = 0; i <= endDaysFromNow; i++) {
    dateArray.push(addDays(today, i))
  }

  return dateArray
}


export function formatDateLabel(date: Date): string {
  if (isToday(date)) {
    return "Today"
  }

  const yesterday = addDays(new Date(), -1)
  if (isSameDay(date, yesterday)) {
    return "Yesterday"
  }

  return format(date, "EEEE")
}


export function createDateItem(date: Date): DateItem {
  return {
    date,
    label: formatDateLabel(date),
    subLabel: format(date, "MMM d"),
    isToday: isToday(date),
  }
}


export function isSameDayAsDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2)
}

