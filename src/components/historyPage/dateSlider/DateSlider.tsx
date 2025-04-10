"use client";

import { createDateItem, isSameDayAsDate } from "@/lib/date-utils";
import { useState } from "react";
import DateSliderBtn from "./DateSliderBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateSliderItem from "./DateSliderItem";

const DateSlider = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // Generate dates centered around today (365 days before and 365 days after)
  const allDates = generateDateRangeAroundToday(365);
  const dateItems = allDates.map((date) => createDateItem(date));

  // Find today's index in the array
  const todayIndex = dateItems.findIndex((item) =>
    isSameDayAsDate(item.date, today)
  );

  // Set initial visible range to show today and some days before it
  const [visibleStartIndex, setVisibleStartIndex] = useState(
    Math.max(0, todayIndex - 6) // Show today and 3 days before if possible
  );

  const visibleDates = dateItems.slice(visibleStartIndex);

  const canScrollLeft = visibleStartIndex > 0;
  const canScrollRight = visibleStartIndex < dateItems.length - 7;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const scrollLeft = () => {
    if (canScrollLeft) {
      setVisibleStartIndex((prev) => prev - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setVisibleStartIndex((prev) => prev + 1);
    }
  };

  return (
    <div className='flex items-center gap-6 justify-between w-full mt-3'>
      <DateSliderBtn onClick={scrollLeft} icon={<ChevronLeft size={12} />} />
      <div className='flex items-center flex-row-reverse gap-3 lg:gap-[14px] overflow-x-auto no-scrollbar'>
        {visibleDates.map((dateItem) => (
          <DateSliderItem
            key={dateItem.date.toDateString()}
            dateItem={dateItem}
            isSelected={isSameDayAsDate(dateItem.date, selectedDate)}
            onSelect={handleDateSelect}
          />
        ))}
      </div>
      <DateSliderBtn onClick={scrollRight} icon={<ChevronRight size={12} />} />
    </div>
  );
};

// Helper function to generate dates centered around today
function generateDateRangeAroundToday(daysEachSide: number) {
  const dates = [];
  const today = new Date();

  // Add past dates (including today)
  for (let i = daysEachSide; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  return dates;
}

export default DateSlider;
