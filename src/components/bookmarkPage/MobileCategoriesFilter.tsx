import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterIcon from "../svgs/FilterIcon";
import Categories from "./thumbnails/Categories";
import ResetFilter from "../header/topbar/ResetFilter";

const MobileCategoriesFilter = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <FilterIcon />
      </SheetTrigger>
      <SheetContent className='bg-card overflow-y-auto no-scrollbar '>
        <ResetFilter />
        <Categories className='max-lg:flex w-full' />
      </SheetContent>
    </Sheet>
  );
};

export default MobileCategoriesFilter;
