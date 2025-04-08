import MoreIcon from "@/components/svgs/MoreIcon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TabCardDetail from "./TabCardDetail";
import { useBookmarks } from "@/context/BookmarkContext";

const MobileCardDetail = () => {
  const { cards } = useBookmarks();
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden block px-4'>
        <MoreIcon />
      </SheetTrigger>
      <SheetContent side='bottom' className=' h-[328px] p-0'>
        <TabCardDetail
          cards={cards}
          className='opacity-100 block max-lg:translate-x-0'
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileCardDetail;
