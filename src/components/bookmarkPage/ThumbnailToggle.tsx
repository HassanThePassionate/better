import { useThumbnailToggler } from "@/context/ThumbnailTogglerContext";
import { cn } from "@/lib/utils";
import { GalleryThumbnails, List } from "lucide-react";

const ThumbnailToggle = () => {
  const { isListView, setIsListView } = useThumbnailToggler();
  const handleListView = () => {
    setIsListView(false);
  };
  const handleThumbnailView = () => {
    setIsListView(true);
  };
  return (
    <div className='h-9 items-center justify-center rounded-lg bg-card p-1 text-foreground grid grid-cols-2 mr-4 max-w-[96px]'>
      <button
        onClick={handleListView}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none  hover:text-text  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
          !isListView && "bg-background text-foreground shadow"
        )}
      >
        <span className='sr-only'>ListView</span>
        <List size={20} />
      </button>
      <button
        onClick={handleThumbnailView}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none  hover:text-text  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
          isListView && "bg-background text-foreground shadow"
        )}
      >
        <span className='sr-only'>ThumbnailView</span>
        <GalleryThumbnails size={20} />
      </button>
    </div>
  );
};

export default ThumbnailToggle;
