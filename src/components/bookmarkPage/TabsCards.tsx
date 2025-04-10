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

interface DateGroup {
  date: string;
  timeGroups: {
    time: string;
    cards: Card[];
  }[];
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
      return { type: "flat" as const, groups: [visibleCards] };
    }

    // First group by date
    const dateGroups: Record<string, Record<string, Card[]>> = {};

    visibleCards.forEach((card) => {
      const date = card.date || "default";
      const time = card.time || "default";

      if (!dateGroups[date]) {
        dateGroups[date] = {};
      }

      if (!dateGroups[date][time]) {
        dateGroups[date][time] = [];
      }

      dateGroups[date][time].push(card);
    });

    // Convert to array format
    const result: DateGroup[] = [];

    for (const [date, timeGroups] of Object.entries(dateGroups)) {
      const sortedTimeGroups = Object.entries(timeGroups)
        .map(([time, cards]) => ({ time, cards }))
        .sort((a, b) => b.time.localeCompare(a.time));

      result.push({
        date,
        timeGroups: sortedTimeGroups,
      });
    }

    // Sort dates in descending order
    result.sort((a, b) => {
      if (a.date === "default") return 1;
      if (b.date === "default") return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return { type: "grouped" as const, groups: result };
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

      {shouldShowFavorites && (
        <>
          {cardGroups.type === "flat"
            ? cardGroups.groups.map((group, index) => (
                <CardGroup
                  key={`group-${index}`}
                  cards={group}
                  isListView={isListView}
                  isExtensionsPage={isExtensionsPage}
                  isDownloadPage={isDownloadPage}
                  isShowHourlyLog={isShowHourlyLog}
                  showHourlyLogAfter={index < cardGroups.groups.length - 1}
                  favoriteExe={favoriteExe}
                  setFavoriteExe={setFavoriteExe}
                />
              ))
            : cardGroups.groups.map((dateGroup, dateIndex) => (
                <div key={`date-group-${dateIndex}`}>
                  {dateGroup.date !== "default" && dateIndex !== 0 && (
                    <h4 className=' py-6 pb-2 text-xl font-bold'>
                      {dateGroup.date}
                    </h4>
                  )}
                  {dateGroup.timeGroups.map((timeGroup, timeIndex) => (
                    <CardGroup
                      key={`time-group-${dateIndex}-${timeIndex}`}
                      cards={timeGroup.cards}
                      isListView={isListView}
                      isExtensionsPage={isExtensionsPage}
                      isDownloadPage={isDownloadPage}
                      isShowHourlyLog={isShowHourlyLog}
                      showHourlyLogAfter={
                        timeIndex < dateGroup.timeGroups.length - 1
                      }
                      favoriteExe={favoriteExe}
                      setFavoriteExe={setFavoriteExe}
                      specificTime={timeGroup.time}
                      date={dateGroup.date}
                      isFirstInDateGroup={timeIndex === 0}
                    />
                  ))}
                </div>
              ))}
        </>
      )}

      <InfiniteScrollSentinel
        onLoadMore={loadMoreCards}
        hasMore={hasMoreCards}
      />
    </div>
  );
};

export default TabsCards;
