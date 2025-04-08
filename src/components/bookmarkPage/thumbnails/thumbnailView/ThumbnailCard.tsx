import DeleteEntry from "@/components/DeleteEntry";
import MoreIconBtn from "@/components/MoreIconBtn";
import { useBookmarkItem } from "@/hooks/use-bookmark-item";
import { cn } from "@/lib/utils";
import { Card } from "@/types/TabCardType";
interface Props {
  data: Card;
}
const ThumbnailCard = ({ data }: Props) => {
  const { icon, handleToggle, selected, des, showSelectionCard } =
    useBookmarkItem(data);

  return (
    <div
      className={cn(
        "h-fit select-none relative group ",
        showSelectionCard && "cursor-pointer"
      )}
      onClick={handleToggle}
    >
      <a
        href={data.path}
        className={cn(
          "flex flex-col h-[326px] max-w-[296px] bg-card rounded-[16px] gap-y-4 justify-between border border-border hover:border-text  transition duration-200 pb-4 ",
          selected &&
            "hover:bg-selected-hover border-selected-border bg-selected-bg",
          showSelectionCard && "pointer-events-none"
        )}
      >
        <div className='p-6 pb-[5px] w-fit h-auto flex flex-col'>
          <div>
            <img
              src={icon}
              alt='icon'
              className='h-[24px] w-[24px] rounded-full border-text  border'
            />
            <h1 className='text-[14.5px] font-semibold mt-4  line-clamp-2  -tracking-[0.21px] mb-4 '>
              {des}
            </h1>
            <div className='gap-x-4 flex w-full h-auto items-center'>
              <div className='text-xs leading-[18px] text-[#a8b4cf]'>
                almost 2 years ago
              </div>
              <div className='w-1 h-1 bg-[#a8b4cf] rounded-full'></div>
              <div className='text-xs leading-[18px] text-[#a8b4cf]'>
                1m read
              </div>
            </div>
          </div>
        </div>
        <div className='max-w-[286px] w-full max-h-[152px] rounded-[16px] items-end mx-auto -mt-[4px] -mb-[8px] '>
          <img
            src='/thumbnail.jpeg'
            alt='img'
            className='max-w-[280px] w-full h-[152px] p-[6px] rounded-[16px]'
          />
        </div>
      </a>
      <div className='absolute top-1 right-4 flex items-center  '>
        <DeleteEntry
          id={data.id}
          className='opacity-0 group-hover:opacity-100 pr-2'
        />
        <MoreIconBtn className='!px-0 ' />
      </div>
    </div>
  );
};

export default ThumbnailCard;
