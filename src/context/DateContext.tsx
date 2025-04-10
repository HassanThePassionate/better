"use client";

import type React from "react";
import { createContext, useContext, useState, useRef } from "react";

interface DateContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  dateRefs: Map<string, HTMLDivElement>;
  registerDateRef: (dateString: string, ref: HTMLDivElement) => void;
  scrollToDate: (date: Date) => void;
  noResultsMessage: string;
  setNoResultsMessage: (message: string) => void;
}

const DateContext = createContext<DateContextType>({
  selectedDate: null,
  setSelectedDate: () => {},
  dateRefs: new Map(),
  registerDateRef: () => {},
  scrollToDate: () => {},
  noResultsMessage: "",
  setNoResultsMessage: () => {},
});

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const dateRefsRef = useRef(new Map<string, HTMLDivElement>());

  const registerDateRef = (dateString: string, ref: HTMLDivElement) => {
    dateRefsRef.current.set(dateString, ref);
  };

  const scrollToDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const ref = dateRefsRef.current.get(dateString);

    if (ref) {
      setNoResultsMessage("");
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setNoResultsMessage("Sorry, no visits found.");
    }
  };

  return (
    <DateContext.Provider
      value={{
        noResultsMessage,
        setNoResultsMessage,
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
