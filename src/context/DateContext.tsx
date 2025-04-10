"use client";

import type React from "react";
import { createContext, useContext, useState, useRef } from "react";

interface DateContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  dateRefs: Map<string, HTMLDivElement>;
  registerDateRef: (dateString: string, ref: HTMLDivElement) => void;
  scrollToDate: (date: Date) => void;
}

const DateContext = createContext<DateContextType>({
  selectedDate: null,
  setSelectedDate: () => {},
  dateRefs: new Map(),
  registerDateRef: () => {},
  scrollToDate: () => {},
});

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const dateRefsRef = useRef(new Map<string, HTMLDivElement>());

  const registerDateRef = (dateString: string, ref: HTMLDivElement) => {
    dateRefsRef.current.set(dateString, ref);
  };

  const scrollToDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const ref = dateRefsRef.current.get(dateString);

    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If exact date not found, try to find the closest date
      let closestDate = null;
      let minDiff = Number.POSITIVE_INFINITY;

      dateRefsRef.current.forEach((ref, dateStr) => {
        const refDate = new Date(dateStr);
        const diff = Math.abs(date.getTime() - refDate.getTime());

        if (diff < minDiff) {
          minDiff = diff;
          closestDate = dateStr;
        }
      });

      if (closestDate) {
        const closestRef = dateRefsRef.current.get(closestDate);
        if (closestRef) {
          closestRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        dateRefs: dateRefsRef.current,
        registerDateRef,
        scrollToDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext() {
  return useContext(DateContext);
}
