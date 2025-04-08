"use client";
import type { Card } from "@/types/TabCardType";

import DeleteEntry from "../DeleteEntry";
import { copyToClipboard } from "@/lib/handle-copy";
import { toast } from "react-toastify";
import { useBookmarkItem } from "@/hooks/use-bookmark-item";
import { cn } from "@/lib/utils";
interface DownloadCardProps {
  data: Card;
}

const DownloadCard = ({ data }: DownloadCardProps) => {
  const { title, id, handleToggle, icon, selected, path } =
    useBookmarkItem(data);
  const handleCopy = () => {
    copyToClipboard(
      path ?? "",
      () => toast.success("URL copied to clipboard!"),
      () => toast.error("URL is not copied")
    );
  };
  return (
    <div
      className={cn(
        "p-6 border-border border group rounded-lg bg-card flex gap-5 mb-4 relative cursor-pointer max-sm:flex-col",
        selected &&
          "hover:bg-selected-hover border-selected-border bg-selected-bg"
      )}
      onClick={handleToggle}
    >
      <div className='h-[32px] w-[32px]'>
        <img src={icon} alt={title} className='h-[32px] w-[32px] dark:invert' />
      </div>
      <div className='grow flex sm:items-start justify-between max-sm:flex-col'>
        <div>
          <h3 className='font-semibold text-text max-w-[200px] truncate'>
            {title}
          </h3>
          <a
            href={path}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm hover:underline text-brand hover:text-brand-hover max-w-[200px] truncate'
            onClick={(e) => e.stopPropagation()}
          >
            {path}
          </a>
        </div>
        <div className='flex items-center gap-2 flex-wrap w-full justify-end'>
          <button className='btn rounded mt-4' onClick={handleCopy}>
            Copy link
          </button>
          <button className='btn rounded mt-4'>Show folder</button>
        </div>
      </div>
      <DeleteEntry
        id={id}
        text='Download Successfully Deleted'
        className='absolute top-1.5 right-2   transition duration-200'
      />
    </div>
  );
};

export default DownloadCard;
