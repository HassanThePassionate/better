import TabCardDetail from "./tabCardDetail/TabCardDetail";
import TabsCards from "./TabsCards";
import { useBookmarks } from "@/context/BookmarkContext";
import DataNotFound from "../DataNotFound";
import { BackToTopContainer } from "../BackToTop";
import ThemeCards from "../themeCards/ThemeCards";

const TabsArea = () => {
  const { cards } = useBookmarks();

  return (
    <BackToTopContainer className='block lg:grid lg:col-span-2 lg:grid-cols-subgrid   overflow-y-auto no-scrollbar lg:overflow-y-scroll overflow-x-hidden grow pb-4 lg:pb-6 max-lg:pl-[100px] max-sm:pl-[80px] max-lg:pt-2'>
      {cards.length > 0 ? (
        <>
          <TabsCards cards={cards} />
          <TabCardDetail cards={cards} />
          <ThemeCards />
        </>
      ) : (
        <DataNotFound />
      )}
    </BackToTopContainer>
  );
};

export default TabsArea;
