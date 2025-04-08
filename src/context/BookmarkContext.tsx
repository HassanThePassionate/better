/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Card } from "@/types/TabCardType";
import { tabsData } from "@/constant/tabsData";
import { usePageContext } from "./PageContext";
import { extensions } from "@/constant/extensionData";
import { downloadData } from "@/constant/DownloadsData";
import { historyData } from "@/constant/HistoryData";
import { categoriesData } from "@/constant/categoriesData";
import type { Tag } from "@/types/tag";

type BookmarkContextType = {
  cards: Card[];
  selectedCards: number[];
  selectedCardUrls: string[];
  selectedCategories: string[];
  pinCategories: string[];
  searchTerm: string;
  showCardDetail: boolean;
  showSelectionCard: boolean;
  setSelectedCards: (cards: number[]) => void;
  toggleCard: (id: number, url: string) => void;
  toggleCategory: (categoryId: string) => void;
  setSearchTerm: (term: string) => void;
  setShowCardDetail: (show: boolean) => void;
  setShowSelectionCard: (show: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setSelectedCategories: (categories: string[]) => void;
  setPinCategories: (categories: string[]) => void;
  setCards: (cards: Card[]) => void;
  filteredCards: Card[];
  addCard: (card: Card) => void;
  deleteCard: (id: number | number[]) => void;
  updateCard: (updatedCard: Card) => void;
  categories: Tag[];
  setCategories: (categories: Tag[]) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

// Storage keys as constants
const CATEGORIES_STORAGE_KEY = "categories_data";
const STORAGE_KEYS = {
  tabs: "tabs_data",
  extensions: "extensions_data",
  downloads: "downloads_data",
  history: "history_data",
};

const PIN_CATEGORIES_KEYS = {
  tabs: "tabs_pin_categories",
  extensions: "extensions_pin_categories",
  downloads: "downloads_pin_categories",
  history: "history_pin_categories",
};

const DEFAULT_DATA = {
  tabs: tabsData,
  extensions: extensions,
  downloads: downloadData,
  history: historyData,
};

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const { page } = usePageContext();

  // Get storage keys based on current page
  const storageKey =
    STORAGE_KEYS[page as keyof typeof STORAGE_KEYS] || STORAGE_KEYS.tabs;
  const pinCategoriesKey =
    PIN_CATEGORIES_KEYS[page as keyof typeof PIN_CATEGORIES_KEYS] ||
    PIN_CATEGORIES_KEYS.tabs;

  // Helper function to safely get data from localStorage
  const getFromStorage = useCallback((key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return defaultValue;
    }
  }, []);

  // Helper function to safely set data to localStorage
  const setToStorage = useCallback((key: string, value: any) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }, []);

  // Initialize state with data from localStorage or defaults
  const [cards, setCards] = useState<Card[]>(() =>
    getFromStorage(
      storageKey,
      DEFAULT_DATA[page as keyof typeof DEFAULT_DATA] || tabsData
    )
  );
  const [categories, setCategories] = useState<Tag[]>(() =>
    getFromStorage(CATEGORIES_STORAGE_KEY, categoriesData)
  );
  const [pinCategories, setPinCategories] = useState<string[]>(() =>
    getFromStorage(pinCategoriesKey, [])
  );

  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showSelectionCard, setShowSelectionCard] = useState(false);
  const [selectedCardUrls, setSelectedCardUrls] = useState<string[]>([]);

  // Reset state when page changes
  const resetAllState = useCallback(() => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedCards([]);
    setSelectedCardUrls([]);
    setShowCardDetail(false);
    setShowSelectionCard(false);
  }, []);

  // Update cards when page changes
  useEffect(() => {
    resetAllState();
    setCards(
      getFromStorage(
        STORAGE_KEYS[page as keyof typeof STORAGE_KEYS] || STORAGE_KEYS.tabs,
        DEFAULT_DATA[page as keyof typeof DEFAULT_DATA] || tabsData
      )
    );
    setPinCategories(
      getFromStorage(
        PIN_CATEGORIES_KEYS[page as keyof typeof PIN_CATEGORIES_KEYS] ||
          PIN_CATEGORIES_KEYS.tabs,
        []
      )
    );
  }, [page, getFromStorage, resetAllState]);

  // Persist cards to localStorage when they change
  useEffect(() => {
    setToStorage(storageKey, cards);
  }, [cards, storageKey, setToStorage]);

  // Persist categories to localStorage when they change
  useEffect(() => {
    setToStorage(CATEGORIES_STORAGE_KEY, categories);
  }, [categories, setToStorage]);

  // Persist pinned categories to localStorage when they change
  useEffect(() => {
    setToStorage(pinCategoriesKey, pinCategories);
  }, [pinCategories, pinCategoriesKey, setToStorage]);

  // Filter cards based on search term and selected categories
  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        const matchesSearch = card.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (selectedCategories.length === 0) {
          return matchesSearch;
        }

        const hasSelectedCategory =
          card.tags &&
          card.tags.some((tag) => selectedCategories.includes(tag.id));

        return matchesSearch && hasSelectedCategory;
      }),
    [cards, searchTerm, selectedCategories]
  );

  // Card selection functions
  const toggleCard = useCallback((id: number, url: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );

    setSelectedCardUrls((prev) =>
      prev.includes(url)
        ? prev.filter((cardUrl) => cardUrl !== url)
        : [...prev, url]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCards(cards.map((card) => card.id));
    setSelectedCardUrls(cards.map((card) => card.path));
  }, [cards]);

  const clearSelection = useCallback(() => {
    setSelectedCards([]);
    setSelectedCardUrls([]);
  }, []);

  // Category functions
  const toggleCategory = useCallback((categoryId: string) => {
    const category = categoryId.toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((id) => id !== category)
        : [...prev, category]
    );
  }, []);

  // CRUD operations for cards
  const addCard = useCallback((card: Card) => {
    setCards((prev) => [card, ...prev]);
  }, []);

  const deleteCard = useCallback((ids: number | number[]) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    setCards((prev) => prev.filter((card) => !idsToDelete.includes(card.id)));
  }, []);

  const updateCard = useCallback((updatedCard: Card) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  }, []);

  // Context value
  const value = useMemo(
    () => ({
      cards: filteredCards,
      filteredCards: cards,
      selectedCards,
      selectedCardUrls,
      selectedCategories,
      pinCategories,
      searchTerm,
      showCardDetail,
      showSelectionCard,
      activeTab,
      categories,
      setSelectedCards,
      toggleCard,
      toggleCategory,
      setSearchTerm,
      setShowCardDetail,
      setShowSelectionCard,
      selectAll,
      clearSelection,
      setSelectedCategories,
      setPinCategories,
      setCards,
      addCard,
      deleteCard,
      updateCard,
      setCategories,
      setActiveTab,
    }),
    [
      filteredCards,
      cards,
      selectedCards,
      selectedCardUrls,
      selectedCategories,
      pinCategories,
      searchTerm,
      showCardDetail,
      showSelectionCard,
      activeTab,
      categories,
      toggleCard,
      toggleCategory,
      selectAll,
      clearSelection,
      addCard,
      deleteCard,
      updateCard,
    ]
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
