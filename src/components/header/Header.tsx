import { usePageContext } from "@/context/PageContext";
import ActionsBtns from "./ActionsBtns";
import Searchbar from "./Searchbar";
import BookmarksIcon from "../svgs/BookmarksIcon";
import { JSX } from "react";
import HistoryIcon from "../svgs/HistoryIcon";
import DownloadIcon from "../svgs/DownloadIcon";
import PuzzleIcon from "../svgs/PuzzleIcon";
const iconsMap: Record<string, JSX.Element> = {
  bookmarks: <BookmarksIcon className='h-[28px] w-[28px]' />,
  history: <HistoryIcon className='h-[28px] w-[28px]' />,
  downloads: <DownloadIcon className='h-[28px] w-[28px]' />,
  extensions: <PuzzleIcon className='h-[28px] w-[28px]' />,
};
const Header = () => {
  const { page } = usePageContext();
  const IconComponent = iconsMap[page?.toLowerCase()] || <BookmarksIcon />;
  return (
    <>
      <div className='pl-[100px] py-2 h-[56px] flex items-center gap-2 text-text'>
        {IconComponent}
        <h2 className='text-xl font-semibold  capitalize '>{page}</h2>
      </div>
      <Searchbar />
      <ActionsBtns />
    </>
  );
};

export default Header;
