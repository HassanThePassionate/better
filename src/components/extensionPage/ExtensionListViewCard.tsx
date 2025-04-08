"use client";

import type React from "react";

import type { Card } from "@/types/TabCardType";
import { Switch } from "../ui/switch";
import { BsPin, BsPinFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useBookmarkItem } from "@/hooks/use-bookmark-item";
import Badge from "../ui/Badge";
import { getCategoryName } from "@/lib/category-utils";
import { useBookmarks } from "@/context/BookmarkContext";
import { useExtensionContext } from "@/context/ExtensionContext";

interface ExtensionCardProps {
  data: Card;
  setFavoriteExe: (callback: (prev: Card[]) => Card[]) => void | undefined;
  favoriteExe: Card[];
  favorite?: boolean;
}

const ExtensionListViewCard = ({
  data,
  setFavoriteExe,
  favoriteExe,
  favorite,
}: ExtensionCardProps) => {
  const { handleToggle, title, icon, path, tags, des, id } =
    useBookmarkItem(data);
  const { toggleCategory } = useBookmarks();
  const isFavorite = favoriteExe.some((card) => card.id === data.id);
  const { toggleEnabled, togglePinned, enabledExtensions } =
    useExtensionContext();
  const addFavoriteExe = (e: React.MouseEvent) => {
    e.stopPropagation();

    setFavoriteExe((prev) =>
      isFavorite ? prev.filter((card) => card.id !== data.id) : [...prev, data]
    );
    togglePinned(id);
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl  border-border border group  bg-card flex gap-4 mb-4 relative cursor-pointer",
        isFavorite && favorite && isFavorite && favorite && "bg-[#85bbfd3a]  "
      )}
      onClick={handleToggle}
    >
      <div className='h-[48px] w-[48px]'>
        <img
          src={icon || "/placeholder.svg"}
          alt={title}
          className='rounded-lg'
        />
      </div>
      <div className='grow'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-text'>{title}</h3>
          <div className='flex items-center gap-6'>
            <span
              className={cn(
                "cursor-pointer opacity-0 group-hover:opacity-100 text-text ",
                isFavorite && "block"
              )}
              onClick={addFavoriteExe}
            >
              {isFavorite ? <BsPinFill size={20} /> : <BsPin size={20} />}
            </span>
            <Switch
              checked={enabledExtensions.has(id)}
              onCheckedChange={() => toggleEnabled(id)}
            />
          </div>
        </div>
        <a
          href={path}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm hover:underline text-brand hover:text-brand-hover'
          onClick={(e) => e.stopPropagation()}
        >
          {path}
        </a>
        <p className='mt-3 text-sm'>{des}</p>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex items-center gap-2 mt-1'>
            {tags.map((tag) => (
              <Badge
                text={tag.name}
                onClick={getCategoryName(tag.id, toggleCategory)}
                key={tag.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionListViewCard;
