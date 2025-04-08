import { cn } from "@/lib/utils";
import { Card } from "@/types/TabCardType";
import MoreIconBtn from "../MoreIconBtn";
import Badge from "../ui/Badge";
import { getCategoryName } from "@/lib/category-utils";
import { useBookmarkItem } from "@/hooks/use-bookmark-item";

import DeleteEntry from "../DeleteEntry";
import MobileCardDetail from "./tabCardDetail/MobileCardDetail";

interface Props {
  data: Card;
}
const TabCard = ({ data }: Props) => {
  const {
    title,
    id,
    handleToggle,
    date,
    selected,
    path,
    page,
    showSelectionCard,
    tags,
    toggleCategory,
  } = useBookmarkItem(data);

  return (
    <div
      className={cn(
        "  border-transparent hover:bg-hover overflow-x-auto no-scrollbar select-none bg-card  w-full relative border block rounded-md group",
        selected &&
          "hover:bg-selected-hover border-selected-border bg-selected-bg",
        showSelectionCard && "cursor-pointer"
      )}
      onClick={handleToggle}
    >
      <div className='flex items-center'>
        <div className='flex items-center w-full'>
          <a
            target='_blank'
            className={cn(
              "focus:outline-none focus-visible:ring-1 ring-inset ring-brand  rounded truncate grow flex items-center gap-3 px-5 lg:px-4 h-14 lg:h-12",
              showSelectionCard && "pointer-events-none",
              page === "history" &&
                "max-w-[280px] sm:min-w-[280px] min-w-[200px]"
            )}
            href={path}
          >
            <object
              type='image/png'
              className='w-[16px] h-[16px] flex-none rounded-sm overflow-hidden'
              data={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${path}&size=32`}
            />
            <div className='truncate text-sm font-medium text-text  pr-8 max-w-[135px] sm:max-w-[150px] '>
              {title}
            </div>
          </a>
          <div className='pr-6 text-xs opacity-50  max-w-[300px]   min-w-[300px] tracking-wide max-sm:hidden'>
            <span className='truncate max-w-[170px] block text-text'>
              {path}
            </span>
          </div>

          {page === "history" ? (
            <div className='pr-6 text-xs opacity-50 truncate sm:max-w-[140px] sm:min-w-[120px] lg:min-w-[140px] tracking-wide'>
              {date}
            </div>
          ) : (
            tags.slice(0, 1).map((tag) => (
              <div
                className={cn(
                  " text-xs  truncate max-w-[130px] min-w-[130px] tracking-wide max-lg:hidden",
                  showSelectionCard &&
                    "max-w-[178px] min-w-[178px] pointer-events-none"
                )}
                key={tag.id}
              >
                <Badge
                  text={tag.name}
                  onClick={getCategoryName(tag.id, toggleCategory)}
                />
              </div>
            ))
          )}
        </div>
        <DeleteEntry
          id={id}
          className={cn(
            "mx-2  cursor-pointer group-hover:opacity-60 transition duration-200    text-foreground hover:!opacity-100 ",
            showSelectionCard && "!opacity-0 pointer-events-none"
          )}
        />
        <MobileCardDetail />
        <MoreIconBtn className='opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-card max-sm:opacity-100 max-lg:hidden ' />
      </div>
    </div>
  );
};

export default TabCard;
