"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

interface HeaderState {
  date: string;
  time: string;
}

interface HeaderContextType {
  currentHeader: HeaderState;
  setCurrentHeader: (header: HeaderState) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  currentHeader: { date: "", time: "" },
  setCurrentHeader: () => {},
});

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentHeader, setCurrentHeader] = useState<HeaderState>({
    date: "Wednesday, 2025/03/05",
    time: "9:30PM",
  });

  return (
    <HeaderContext.Provider value={{ currentHeader, setCurrentHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderContext);
