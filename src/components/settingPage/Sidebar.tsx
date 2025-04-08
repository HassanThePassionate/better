import { sidebarItem } from "@/constant/sidebarItems";

import { cn } from "@/lib/utils";
interface Props {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}
const Sidebar = ({ currentPage, setCurrentPage }: Props) => {
  const goToPage = (page: string) => {
    return () => setCurrentPage(page);
  };
  return (
    <div className='flex gap-1 w-screen md:w-48 md:py-2 overflow-x-auto no-scrollbar md:flex-col border-border bg-hover md:rounded-l-lg md:flex-none border-b md:border-b-0 '>
      {sidebarItem.map((item, i) => (
        <button
          onClick={goToPage(item.link)}
          className={cn(
            "flex items-center gap-4 border-b-2 md:border-none whitespace-nowrap py-4 px-6 font-semibold md:text-left hover:bg-sidebar-hover hover:text-text ",
            currentPage === item.link && "border-brand bg-badge text-text"
          )}
          key={i}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
