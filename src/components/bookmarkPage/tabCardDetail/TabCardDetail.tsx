import Badge from "@/components/ui/Badge";
import ActionsBtns from "./ActionsBtns";
import CloseBtn from "./CloseBtn";
import TabCardHeading from "./TabCardHeading";
import { cn } from "@/lib/utils";
import SelectionCard from "../selectionCard/SelectionCard";
import { useBookmarks } from "@/context/BookmarkContext";
import { Card } from "@/types/TabCardType";

interface Props {
  cards: Card[];
  className?: string;
}
const TabCardDetail = ({ cards, className }: Props) => {
  const { showCardDetail, activeTab } = useBookmarks();
  const activeTabData = cards.find((tab) => tab.id === activeTab);
  return (
    <>
      <div
        className={cn(
          "hidden max-[1600px]:fixed  max-[1600px]:right-6 max-lg:right-0 max-lg:w-full opacity-0   transition-all duration-300 ",
          showCardDetail && "opacity-100 lg:block translate-x-0",
          className
        )}
      >
        <div className='sticky top-0  left-0 w-full  lg:max-w-[280px] lg:min-w-72   min-h-[328px]   min-[1600px]:ml-2'>
          <div>
            <div className='py-5 p-6 bg-card  rounded-[14px] w-full  min-h-[328px]'>
              <div className='relative flex flex-col gap-[18px]'>
                <TabCardHeading
                  title={activeTabData?.title}
                  path={activeTabData?.path}
                  className='text-base'
                  imageClassName='h-[28px] w-[28px] mr-1'
                />
                <div className='text-sm overflow-hidden truncate'>
                  <a
                    target='_blank'
                    rel='noopener'
                    title='Open'
                    className='text-brand hover:text-brand-hover '
                    href={activeTabData?.path}
                  >
                    {activeTabData?.path}
                  </a>
                </div>
                <div className='text-sm text-text '>{activeTabData?.des}</div>
                <div className='flex flex-wrap gap-1.5 text-text '>
                  {activeTabData?.tags.map((tag, id) => (
                    <Badge text={tag.name} key={id} />
                  ))}
                </div>
                <div className='flex items-center gap-5'>
                  <div className='text-xs text-text font-semibold '>
                    Updated on 11/20/2024
                  </div>
                  <div className='text-xs text-text font-semibold '>
                    Added on 11/5/2024
                  </div>
                </div>
                <hr className='border-border' />
                <ActionsBtns activeTabData={activeTabData} />
                <CloseBtn />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SelectionCard />
    </>
  );
};

export default TabCardDetail;
