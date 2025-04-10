"use client";

import { createDateItem, isSameDayAsDate } from "@/lib/date-utils";
import { useState, useEffect } from "react";
import DateSliderBtn from "./DateSliderBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateSliderItem from "./DateSliderItem";
import { useDateContext } from "@/context/DateContext";

const DateSlider = () => {
  const { selectedDate, setSelectedDate } = useDateContext();

  // Generate dates in sequence: today, yesterday, and backward
  const allDates = generateDateSequence(365); // 365 days in the past
  const dateItems = allDates.map((date) => createDateItem(date));

  // Set initial visible range to show today and some days after it
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  // Update visible range when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    const selectedIndex = dateItems.findIndex((item) =>
      isSameDayAsDate(item.date, selectedDate)
    );

    // Check if selected index is already visible
    const isAlreadyVisible =
      selectedIndex >= visibleStartIndex &&
      selectedIndex < visibleStartIndex + 7;

    if (selectedIndex !== -1 && !isAlreadyVisible) {
      const newStartIndex = Math.max(0, selectedIndex - 3);
      const maxStartIndex = dateItems.length - 7;
      setVisibleStartIndex(Math.min(newStartIndex, maxStartIndex));
    }
  }, [selectedDate, dateItems, visibleStartIndex]);

  const visibleDates = dateItems.slice(
    visibleStartIndex,
    visibleStartIndex + 7
  );

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
      <DateSliderBtn
        onClick={scrollLeft}
        icon={<ChevronLeft size={12} />}
        disabled={!canScrollLeft}
      />
      <div className='flex items-center gap-3 lg:gap-[14px] overflow-x-auto no-scrollbar'>
        {visibleDates.map((dateItem) => (
          <DateSliderItem
            key={dateItem.date.toDateString()}
            dateItem={dateItem}
            isSelected={
              selectedDate
                ? isSameDayAsDate(dateItem.date, selectedDate)
                : false
            }
            onSelect={handleDateSelect}
          />
        ))}
      </div>
      <DateSliderBtn
        onClick={scrollRight}
        icon={<ChevronRight size={12} />}
        disabled={!canScrollRight}
      />
    </div>
  );
};

function generateDateSequence(daysInPast: number) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= daysInPast; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  return dates;
}

export default DateSlider;
