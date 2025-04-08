import TabCardDetail from "@/components/bookmarkPage/tabCardDetail/TabCardDetail";
import TabsCards from "@/components/bookmarkPage/TabsCards";

import DataNotFound from "@/components/DataNotFound";
import SearchBar from "@/components/searchPage/SearchBar";
import TopNav from "@/components/header/topbar/TopNav";
import { categoriesData } from "@/constant/categoriesData";
import { useBookmarks } from "@/context/BookmarkContext";
import { cn } from "@/lib/utils";

const Search = () => {
  const { searchTerm, cards } = useBookmarks();
  const filteredCategories = categoriesData.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className='relative bg-background z-30 min-h-screen'>
      <div className='lg:grid grid-cols-[minmax(14rem,1fr)_minmax(32rem,40rem)_minmax(20rem,1fr)] overflow-hidden'>
        <div className='hidden lg:block'></div>
        <div className='w-full h-screen overflow-y-auto overflow-x-hidden no-scrollbar'>
          <SearchBar />
          <div className='min-h-24 w-full pb-4 px-2'>
            <div
              className={cn(
                " flex flex-wrap gap-2 py-2",
                filteredCategories.length <= 0 && "hidden"
              )}
            >
              {searchTerm !== "" && (
                <TopNav
                  categoriesData={filteredCategories}
                  className='mr-2 bg-hover hover:bg-btn-hover text-white font-semibold'
                />
              )}
            </div>
            <div className='flex flex-col gap-2 py-2'>
              {searchTerm !== "" && <TabsCards cards={cards} />}
              {cards.length <= 0 && <DataNotFound />}
            </div>
          </div>
        </div>
        <div className='hidden relative lg:block pt-2'>
          <TabCardDetail cards={cards} />
        </div>
      </div>
    </div>
  );
};

export default Search;
