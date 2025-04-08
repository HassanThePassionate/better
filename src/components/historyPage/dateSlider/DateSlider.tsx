import {
  createDateItem,
  generateDateRange,
  isSameDayAsDate,
} from "@/lib/date-utils";
import { useState } from "react";
import DateSliderBtn from "./DateSliderBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateSliderItem from "./DateSliderItem";

const DateSlider = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const allDates = generateDateRange(730);
  const dateItems = allDates.map((date) => createDateItem(date));
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
      <DateSliderBtn onClick={scrollLeft} icon={<ChevronLeft size={12} />} />
      <div className='flex items-center gap-3 lg:gap-[14px] overflow-x-auto no-scrollbar '>
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

export default DateSlider;
