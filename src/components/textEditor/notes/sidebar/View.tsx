import SidebarItem from "@/components/homeSidebar/SidebarItem";
import ViewIcon from "@/components/svgs/ViewIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { GalleryThumbnails, List } from "lucide-react";
interface Props {
  setCardView: React.Dispatch<React.SetStateAction<boolean>>;
}
export function View({ setCardView }: Props) {
  const setCardViewHandler = () => {
    setCardView(true);
  };
  const setListViewHandler = () => {
    setCardView(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SidebarItem
          icon={<ViewIcon />}
          tooltip='View options'
          className='text-text opacity-60 hover:opacity-100 !p-0 rounded h-6 w-6'
          side='top'
          tooltipClassName='text-xs py-[3px] px-1.5 font-medium '
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[183px] p-2 '>
        <DropdownMenuLabel className='text-[10px] text-text'>
          NOTE LIST VIEW
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            className='flex items-center gap-3 w-full text-text'
            onClick={setCardViewHandler}
          >
            <GalleryThumbnails size={20} />
            Cards
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex items-center gap-3 w-full text-text'
            onClick={setListViewHandler}
          >
            <List size={20} />
            Snippets
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
