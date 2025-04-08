"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Card } from "@/types/TabCardType";
import { cn } from "@/lib/utils";
import { useThumbnailToggler } from "@/context/ThumbnailTogglerContext";
import { usePageContext } from "@/context/PageContext";
import { useExtensionContext } from "@/context/ExtensionContext";

import CardGroup from "./thumbnails/CardGroup";
import InfiniteScrollSentinel from "../InfiniteScrollSentinel";
import { useHeaderContext } from "@/context/HeaderContext";

interface TabsCardsProps {
  cards: Card[];
}

const TabsCards = ({ cards }: TabsCardsProps) => {
  const { isListView } = useThumbnailToggler();
  const [favoriteExe, setFavoriteExe] = useState<Card[]>([]);
  const { activeFilter } = useExtensionContext();

  const { page } = usePageContext();
  const { setCurrentHeader } = useHeaderContext();
  const isShowHourlyLog = page === "history";
  const isExtensionsPage = page === "extensions";
  const isDownloadPage = page === "downloads";
  const INITIAL_CARDS_COUNT = isExtensionsPage ? 20 : 100;
  const CARDS_PER_LOAD = isExtensionsPage ? 20 : 40;
  const [visibleCardsCount, setVisibleCardsCount] =
    useState(INITIAL_CARDS_COUNT);

  const loadMoreCards = useCallback(() => {
    setVisibleCardsCount((prevCount) =>
      Math.min(prevCount + CARDS_PER_LOAD, cards.length)
    );
  }, [cards.length]);

  const filteredCards = useMemo(() => {
    if (isExtensionsPage) {
      const favoriteIds = new Set(favoriteExe.map((card) => card.id));
      return cards.filter((card) => !favoriteIds.has(card.id));
    }
    return cards;
  }, [cards, favoriteExe, isExtensionsPage]);

  const visibleCards = useMemo(() => {
    return filteredCards.slice(0, visibleCardsCount);
  }, [filteredCards, visibleCardsCount]);

  const cardGroups = useMemo(() => {
    if (!isShowHourlyLog) {
      return [visibleCards];
    }

    const groups: Record<string, Card[]> = {};

    visibleCards.forEach((card) => {
      if (card.time) {
        const key = card.time;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(card);
      } else {
        const key = "default";
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(card);
      }
    });

    return Object.values(groups).sort((a, b) => {
      if (!a[0].time) return 1;
      if (!b[0].time) return -1;

      const timeA = a[0].time;
      const timeB = b[0].time;

      return timeB.localeCompare(timeA);
    });
  }, [visibleCards, isShowHourlyLog]);

  useEffect(() => {
    if (cards.length > 0 && cards[0].date && cards[0].time) {
      setCurrentHeader({
        date: cards[0].date,
        time: cards[0].time,
      });
    }
  }, [cards, setCurrentHeader]);

  const hasMoreCards = visibleCardsCount < filteredCards.length;

  const shouldShowFavorites = activeFilter !== "pinned";

  return (
    <div className={cn(isListView && "max-w-[970px]")}>
      <div className={cn("mb-12", favoriteExe.length === 0 && "hidden")}>
        <CardGroup
          favorite
          cards={favoriteExe}
          isListView={isListView}
          isExtensionsPage={isExtensionsPage}
          isShowHourlyLog={false}
          showHourlyLogAfter={false}
          favoriteExe={favoriteExe}
          setFavoriteExe={setFavoriteExe}
          isDownloadPage={isDownloadPage}
        />
      </div>

      {shouldShowFavorites &&
        cardGroups.map((group, index) => (
          <CardGroup
            key={`group-${index}`}
            cards={group}
            isListView={isListView}
            isExtensionsPage={isExtensionsPage}
            isDownloadPage={isDownloadPage}
            isShowHourlyLog={isShowHourlyLog}
            showHourlyLogAfter={index < cardGroups.length - 1}
            favoriteExe={favoriteExe}
            setFavoriteExe={setFavoriteExe}
          />
        ))}

      <InfiniteScrollSentinel
        onLoadMore={loadMoreCards}
        hasMore={hasMoreCards}
      />
    </div>
  );
};

export default TabsCards;
