"use client";

import { useEffect, useRef } from "react";
import type React from "react";

import { cn } from "@/lib/utils";
import type { Card } from "@/types/TabCardType";
import { useHeaderContext } from "@/context/HeaderContext";
import { useExtensionContext } from "@/context/ExtensionContext";

import CardRenderer from "./CardRenderer";
import HourlyLog from "@/components/historyPage/HourlyLog";
import { usePageContext } from "@/context/PageContext";

interface CardGroupProps {
  cards: Card[];
  isListView: boolean;
  isExtensionsPage: boolean;
  isDownloadPage: boolean;
  isShowHourlyLog: boolean;
  showHourlyLogAfter?: boolean;
  favoriteExe: Card[];
  setFavoriteExe: React.Dispatch<React.SetStateAction<Card[]>>;
  favorite?: boolean;
}

export default function CardGroup({
  cards,
  isListView,
  isExtensionsPage,
  isShowHourlyLog,
  favoriteExe,
  setFavoriteExe,
  isDownloadPage,
  favorite,
}: CardGroupProps) {
  const containerClasses = cn(
    "flex flex-col gap-2 px-1.5 lg:px-0 mt-2 lg:mt-0 ",
    isListView && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-4"
  );

  const groupRef = useRef<HTMLDivElement>(null);
  const { setCurrentHeader } = useHeaderContext();
  const { filteredExtensions } = useExtensionContext();
  const { page } = usePageContext();
  const time = cards[0]?.time || "";
  const date = cards[0]?.date || "";
  const id = cards[0]?.id || "";

  useEffect(() => {
    if (!isShowHourlyLog || !time) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            setCurrentHeader({ date, time });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-280px 30px",
      }
    );

    if (groupRef.current) {
      observer.observe(groupRef.current);
    }

    return () => {
      if (groupRef.current) {
        observer.unobserve(groupRef.current);
      }
    };
  }, [cards, date, time, isShowHourlyLog, setCurrentHeader]);

  const dataToRender = (() => {
    if (favorite && favoriteExe.length > 0) {
      return favoriteExe;
    }
    return page === "extensions" ? filteredExtensions : cards;
  })();

  if (isExtensionsPage && filteredExtensions.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground flex items-center w-full justify-center col-span-3'>
        No extensions match the selected filter.
      </div>
    );
  }
  return (
    <div>
      {isShowHourlyLog && <HourlyLog specificTime={time} date={date} id={id} />}
      <div className={containerClasses} ref={groupRef}>
        {dataToRender.map((card) => (
          <CardRenderer
            favorite={favorite}
            key={card.id}
            isDownloadPage={isDownloadPage}
            data={card}
            isListView={isListView}
            isExtensionsPage={isExtensionsPage}
            favoriteExe={favoriteExe}
            setFavoriteExe={setFavoriteExe}
          />
        ))}
      </div>
    </div>
  );
}
