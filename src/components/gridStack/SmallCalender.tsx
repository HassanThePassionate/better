"use client";

import { useState } from "react";

export default function SmallCalendar() {
  const [currentMonth] = useState(3);
  const [currentYear] = useState(2025);
  const [selectedDate] = useState(8);

  // Days of the week
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Generate calendar days for April 2025
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get day name (Tuesday for the 8th of April 2025)

  // Get month name

  // Check if a day is a weekend
  const isWeekend = (index: number) => {
    return index === 5 || index === 6; // 5 = Saturday, 6 = Sunday in our array
  };

  return (
    <div className=' h-full w-full overflow-hidden  bg-card rounded-[16px] text-text '>
      {/* Right panel - Calendar */}
      <div className='bg-hover text-sm pl-3 font-medium py-2 '>April</div>
      <div className='flex-1 pt-1  p-3'>
        <div className='grid grid-cols-7 gap-0.5 text-center'>
          {/* Days of week headers */}
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`text-sm font-medium ${
                isWeekend(index) ? "text-error" : "text-text"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                flex h-6 w-6 items-center justify-center text-xs
                ${day === null ? "invisible" : ""}
                ${
                  day === selectedDate
                    ? "rounded-full bg-red-500 text-white"
                    : ""
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
