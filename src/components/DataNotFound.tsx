import { usePageContext } from "@/context/PageContext";

import { IoBookmarks } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdExtension } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

const DataNotFound = () => {
  const { page } = usePageContext();
  const pageTitles: Record<string, React.ReactNode> = {
    downloads: <IoMdDownload size={28} />,
    history: <FaHistory size={28} />,
    extensions: <MdExtension size={28} />,
  };
  return (
    <div className='text-center pt-10 flex items-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      {pageTitles[page] || <IoBookmarks size={28} />}

      <p className='mt-3 text-sm text-foreground  truncate'>
        Nothing found Data
      </p>
    </div>
  );
};

export default DataNotFound;
