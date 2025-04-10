"use client";

import { useEffect, useRef } from "react";
import type React from "react";

import { cn } from "@/lib/utils";
import type { Card } from "@/types/TabCardType";
import { useHeaderContext } from "@/context/HeaderContext";
import { useExtensionContext } from "@/context/ExtensionContext";
import { useDateContext } from "@/context/DateContext";

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
  specificTime?: string;
  date?: string;
  isFirstInDateGroup?: boolean;
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
  specificTime,
  date,
  isFirstInDateGroup = false,
}: CardGroupProps) {
  const containerClasses = cn(
    "flex flex-col gap-2 px-1.5 lg:px-0 mt-2 lg:mt-0 ",
    isListView && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-4"
  );

  const groupRef = useRef<HTMLDivElement>(null);
  const { setCurrentHeader } = useHeaderContext();
  const { filteredExtensions } = useExtensionContext();
  const { page } = usePageContext();

  const { setSelectedDate, registerDateRef, noResultsMessage } =
    useDateContext();
  const time = specificTime || cards[0]?.time || "";
  const groupDate = date || cards[0]?.date || "";
  const id = cards[0]?.id || "";

  // Register this group's ref with the DateContext if it's the first in its date group
  useEffect(() => {
    if (
      isFirstInDateGroup &&
      groupRef.current &&
      groupDate &&
      groupDate !== "default"
    ) {
      try {
        const dateObj = new Date(groupDate);
        if (!isNaN(dateObj.getTime())) {
          const dateString = dateObj.toISOString().split("T")[0];
          registerDateRef(dateString, groupRef.current);
        }
      } catch (e) {
        console.error("Invalid date format:", groupDate, e);
      }
    }
  }, [isFirstInDateGroup, groupDate, registerDateRef]);

  useEffect(() => {
    if (!isShowHourlyLog || !time || !groupDate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            setCurrentHeader({ date: groupDate, time });

            // Update the selected date in the DateSlider when this group is visible
            if (groupDate && groupDate !== "default") {
              try {
                const dateObj = new Date(groupDate);
                if (!isNaN(dateObj.getTime())) {
                  setSelectedDate(dateObj);
                }
              } catch (e) {
                console.error("Invalid date format:", groupDate, e);
              }
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-300px 30px",
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
  }, [
    cards,
    groupDate,
    time,
    isShowHourlyLog,
    setCurrentHeader,
    setSelectedDate,
  ]);

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
    <>
      <div className={cn(isShowHourlyLog && noResultsMessage && "opacity-0")}>
        {isShowHourlyLog && (
          <HourlyLog
            specificTime={time}
            date={isFirstInDateGroup ? groupDate : undefined}
            id={id}
          />
        )}
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
      <p
        className={cn(
          "text-lg text-text font-medium text-center absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12",
          isShowHourlyLog && noResultsMessage && "block"
        )}
      >
        {noResultsMessage}
      </p>
    </>
  );
}
