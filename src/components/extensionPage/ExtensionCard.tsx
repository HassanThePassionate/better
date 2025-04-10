"use client";

import type React from "react";
import type { Card } from "@/types/TabCardType";
import { Switch } from "@/components/ui/switch";
import { BsPin, BsPinFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import MoreIconBtn from "../MoreIconBtn";
import { useBookmarkItem } from "@/hooks/use-bookmark-item";
import { toast } from "react-toastify";
import { useExtensionContext } from "@/context/ExtensionContext";

interface ExtensionCardProps {
  data: Card;
  setFavoriteExe: (callback: (prev: Card[]) => Card[]) => void;
  favoriteExe: Card[];
  favorite?: boolean;
}

const ExtensionCard = ({
  data,
  setFavoriteExe,
  favoriteExe,
  favorite,
}: ExtensionCardProps) => {
  const { handleToggle, title, icon, id } = useBookmarkItem(data);
  const { toggleEnabled, togglePinned, enabledExtensions } =
    useExtensionContext();

  // Check if the extension is in favorites
  const isFavorite = favoriteExe.some((card) => card.id === data.id);

  // Handle pin/unpin action
  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    togglePinned(id);

    setFavoriteExe((prev) =>
      isFavorite ? prev.filter((card) => card.id !== data.id) : [...prev, data]
    );

    // Show toast notification
    toast.success(
      isFavorite ? "Removed from Favorites!" : "Added to Favorites!"
    );
  };

  return (
    <div
      className={cn(
        "bg-card rounded-[24px] max-w-[284px] group p-6 flex flex-col relative items-start gap-6 cursor-pointer group border border-transparent",
        isFavorite && favorite && "bg-card-pin"
      )}
      onClick={handleToggle}
    >
      <div className='flex justify-between w-full h-[60px]'>
        <img
          src={icon || "/placeholder.svg"}
          alt={title}
          className='h-[50px] w-[50px]'
        />
        <div className='flex items-start gap-3'>
          <button
            className={cn(
              "cursor-pointer text-text hidden group-hover:block mt-[3px]",
              isFavorite && "block"
            )}
            onClick={handlePinToggle}
            aria-label={isFavorite ? "Unpin extension" : "Pin extension"}
          >
            {isFavorite ? (
              <BsPinFill size={18} className='text-pin' />
            ) : (
              <BsPin size={18} className='text-pin-disabled' />
            )}
          </button>
          <Switch
            checked={enabledExtensions.has(id)}
            onCheckedChange={() => toggleEnabled(id)}
            aria-label={
              enabledExtensions.has(id)
                ? "Disable extension"
                : "Enable extension"
            }
          />
          <MoreIconBtn className='!h-0 lg:px-0' />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='font-semibold text-text'>{title}</h2>
        <p className='text-foreground'>
          A simple journaling app for capturing daily memories with text, photo,
          stickers and video.
        </p>
      </div>
    </div>
  );
};

export default ExtensionCard;
