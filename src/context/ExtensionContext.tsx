"use client";

import type { Card } from "@/types/TabCardType";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

import { useBookmarks } from "./BookmarkContext";

export type FilterType =
  | "all"
  | "enabled"
  | "disabled"
  | "pinned"
  | "recent"
  | "developer-mode"
  | string;
type ExtensionContextType = {
  activeFilter: FilterType;
  filteredExtensions: Card[];
  setActiveFilter: (filter: FilterType) => void;
  toggleEnabled: (id: number) => void;
  enabledExtensions: Set<number>;
  pinnedExtensions: Set<number>;
  togglePinned: (id: number) => void;
};

// Create the context
const ExtensionContext = createContext<ExtensionContextType | undefined>(
  undefined
);

// Create a provider component
export function ExtensionProvider({ children }: { children: ReactNode }) {
  const { cards } = useBookmarks();

  const [enabledExtensions, setEnabledExtensions] = useState<Set<number>>(
    new Set()
  );

  const [pinnedExtensions, setPinnedExtensions] = useState<Set<number>>(
    new Set()
  );

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [filteredExtensions, setFilteredExtensions] = useState<Card[]>(cards);

  // Toggle extension enabled state
  const toggleEnabled = (id: number) => {
    const newEnabledExtensions = new Set(enabledExtensions);
    if (newEnabledExtensions.has(id)) {
      newEnabledExtensions.delete(id);
    } else {
      newEnabledExtensions.add(id);
    }
    setEnabledExtensions(newEnabledExtensions);
  };

  // Toggle extension pinned state
  const togglePinned = (id: number) => {
    const newPinnedExtensions = new Set(pinnedExtensions);
    if (newPinnedExtensions.has(id)) {
      newPinnedExtensions.delete(id);
    } else {
      newPinnedExtensions.add(id);
    }
    setPinnedExtensions(newPinnedExtensions);
  };

  // Update filtered extensions whenever the filter or extension states change
  useEffect(() => {
    let filtered = [...cards];

    if (activeFilter === "enabled") {
      filtered = cards.filter((ext) => enabledExtensions.has(ext.id));
    } else if (activeFilter === "disabled") {
      filtered = cards.filter((ext) => !enabledExtensions.has(ext.id));
    } else if (activeFilter === "pinned") {
      // Show pinned extensions regardless of enabled/disabled status
      filtered = cards.filter((ext) => pinnedExtensions.has(ext.id));
    } else if (activeFilter === "recent") {
      // Filter to only show extensions installed today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of today

      filtered = cards.filter((ext) => {
        if (!ext.installDate) return false;
        const installDate = new Date(ext.installDate);
        return installDate >= today;
      });
    } else if (activeFilter === "developer-mode") {
      // Show only extensions with developerMode set to true
      filtered = cards.filter((ext) => ext.developerMode === true);
    }

    // For all filters except "pinned", we should still show pinned items at the top
    if (activeFilter !== "pinned" && activeFilter !== "recent") {
      const pinnedItems = filtered.filter((ext) =>
        pinnedExtensions.has(ext.id)
      );
      const nonPinnedItems = filtered.filter(
        (ext) => !pinnedExtensions.has(ext.id)
      );
      filtered = [...pinnedItems, ...nonPinnedItems];
    } else if (activeFilter === "recent") {
      // For recent filter, we still want to respect the date sorting but show pinned at top
      const pinnedItems = filtered.filter((ext) =>
        pinnedExtensions.has(ext.id)
      );
      const nonPinnedItems = filtered.filter(
        (ext) => !pinnedExtensions.has(ext.id)
      );
      filtered = [...pinnedItems, ...nonPinnedItems];
    }

    setFilteredExtensions(filtered);
  }, [activeFilter, enabledExtensions, pinnedExtensions, cards]);

  // Context value
  const value: ExtensionContextType = {
    activeFilter,
    filteredExtensions,
    setActiveFilter,
    toggleEnabled,
    enabledExtensions,
    pinnedExtensions,
    togglePinned,
  };

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtensionContext() {
  const context = useContext(ExtensionContext);
  if (context === undefined) {
    throw new Error(
      "useExtensionContext must be used within a ExtensionProvider"
    );
  }
  return context;
}
