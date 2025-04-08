"use client";

import { useBookmarks } from "@/context/BookmarkContext";
import { usePageContext } from "@/context/PageContext";
import { Card } from "@/types/TabCardType";

export function useBookmarkItem(data: Card) {
  const { id, path, tags, icon, title, des, date } = data;
  const { page } = usePageContext();
  const {
    toggleCard,
    showSelectionCard,
    selectedCards,
    toggleCategory,
    setActiveTab,
  } = useBookmarks();

  const today = new Date().toDateString();

  const handleToggle = () => {
    if (showSelectionCard) toggleCard(id, path);
    if (setActiveTab) setActiveTab(id);
  };

  const selected = selectedCards.includes(data.id);

  return {
    id,
    path,
    tags,
    icon,
    title,
    des,
    page,
    today,
    handleToggle,
    selected,
    selectedCards,
    showSelectionCard,
    toggleCategory,
    date,
  };
}
