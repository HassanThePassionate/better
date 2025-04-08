"use client";

import type React from "react";
import type { Card } from "@/types/TabCardType";
import TabCard from "../TabCard";
import ThumbnailCard from "./thumbnailView/ThumbnailCard";
import ExtensionCard from "../../extensionPage/ExtensionCard";
import ExtensionListViewCard from "../../extensionPage/ExtensionListViewCard";
import DownloadCard from "../../downloadPage/DownloadCard";
import { useExtensionContext } from "@/context/ExtensionContext";

interface CardRendererProps {
  data: Card;
  isListView: boolean;
  isExtensionsPage: boolean;
  isDownloadPage: boolean;
  favoriteExe: Card[];
  setFavoriteExe: React.Dispatch<React.SetStateAction<Card[]>>;
  favorite?: boolean;
}

export default function CardRenderer({
  data,
  isListView,
  isExtensionsPage,
  favoriteExe,
  setFavoriteExe,
  isDownloadPage,
  favorite,
}: CardRendererProps) {
  const { filteredExtensions } = useExtensionContext();
  if (isExtensionsPage) {
    if (filteredExtensions.length === 0)
      return (
        <div className='text-center py-12 text-muted-foreground flex items-center w-full justify-center col-span-3'>
          No extensions match the selected filter.
        </div>
      );
    return isListView ? (
      <ExtensionCard
        setFavoriteExe={setFavoriteExe}
        favoriteExe={favoriteExe}
        data={data}
        favorite={favorite}
      />
    ) : (
      <ExtensionListViewCard
        setFavoriteExe={setFavoriteExe}
        favoriteExe={favoriteExe}
        data={data}
        favorite={favorite}
      />
    );
  }
  if (isDownloadPage) {
    return <DownloadCard data={data} />;
  }

  return isListView ? <ThumbnailCard data={data} /> : <TabCard data={data} />;
}
