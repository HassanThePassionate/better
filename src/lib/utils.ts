import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify";
import { useBookmarks } from "@/context/BookmarkContext";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useHandleDelete = () => {
  const { deleteCard } = useBookmarks()
  return (ids: number[] | number, text?: string) => {
    if (Array.isArray(ids)) {
      if (ids.length === 0) {
        toast.error("No bookmarks selected for deletion")
        return
      }
      
      deleteCard(ids)
      toast.success(text ? text : "Selected Bookmarks Deleted")
    } else {
      deleteCard(ids)
      toast.success(text ? text : "Bookmark Deleted")
    }
  }
}

