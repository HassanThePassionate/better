"use client";

import { extensions } from "@/constant/extensionData";
import { useBookmarks } from "@/context/BookmarkContext";
import { useExtensionContext } from "@/context/ExtensionContext";
import { usePageContext } from "@/context/PageContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Props {
  text: string | number;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

const Badge = ({ text, onClick, className, active }: Props) => {
  const { page } = usePageContext();
  const { cards } = useBookmarks();
  const { enabledExtensions, pinnedExtensions, setActiveFilter } =
    useExtensionContext();

  const getCount = () => {
    if (page === "extensions") {
      if (text === "Enabled") {
        return enabledExtensions.size;
      } else if (text === "Disabled") {
        return cards.length - enabledExtensions.size;
      } else if (text === "Pinned") {
        return pinnedExtensions.size;
      } else if (text === "Recently Installed") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayFormatted = `${today.getFullYear()}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

        return extensions.filter((ext) => {
          if (!ext.installDate) return false;

          return ext.installDate.startsWith(todayFormatted);
        }).length;
      }
    }
    return null;
  };

  const count = getCount();
  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFilter("");
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-1.5 text-xs font-semibold bg-badge rounded-full text-text opacity-80 hover:opacity-100 ",
        active && "bg-brand text-text-primary",
        className
      )}
    >
      {text}
      {count !== null && <span className='ml-1 text-xs'>({count})</span>}
      {page === "extensions" && active && (
        <span
          onClick={clearFilter}
          className='ml-1 mt-0.5 opacity-60 hover:opacity-100'
        >
          <X size={18} />
        </span>
      )}
    </button>
  );
};

export default Badge;
