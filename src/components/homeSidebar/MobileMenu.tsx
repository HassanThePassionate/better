import { HiOutlineMenuAlt1 } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoPlus } from "react-icons/go";
import { usePageContext } from "@/context/PageContext";
import SelectIcon from "../svgs/SelectIcon";
import ExistIcon from "../svgs/ExistIcon";
import AddNewCard from "../addNewCard/AddNewCard";
import DialogBox from "@/modals/DialogBox";
import { useBookmarks } from "@/context/BookmarkContext";

const MobileMenu = () => {
  const { setShowSelectionCard, selectAll, setShowCardDetail, clearSelection } =
    useBookmarks();

  const toggleSelectionCard = (show: boolean) => {
    setShowSelectionCard(show);
    setShowCardDetail(false);

    if (!show) clearSelection();
  };
  const { setPage } = usePageContext();
  const goAddNew = () => {
    setPage("new");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiOutlineMenuAlt1 />
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' className='bg-background ml-8 mt-10'>
        <DialogBox
          trigger={
            <div
              onClick={goAddNew}
              className='flex items-center gap-3 py-3 px-4'
            >
              <GoPlus size={18} />
              Add Bookmark
            </div>
          }
        >
          <AddNewCard />
        </DialogBox>

        <DropdownMenuSeparator className='bg-border' />
        <DropdownMenuItem
          className='flex items-center gap-3 py-3 px-4'
          onClick={() => toggleSelectionCard(true)}
        >
          <SelectIcon />
          Select Multiple
        </DropdownMenuItem>

        <DropdownMenuItem
          className='flex items-center gap-3 py-3 px-4'
          onClick={() => {
            toggleSelectionCard(true);
            selectAll();
          }}
        >
          <SelectIcon />
          Select All
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-border' />
        <DropdownMenuItem className='flex items-center gap-3 py-3 px-4'>
          <ExistIcon />
          Exist Demo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileMenu;
