"use client";

import { cn } from "@/lib/utils";

import SidebarItem from "../homeSidebar/SidebarItem";
import FavoriteSection from "./FavoriteSection";
import MostVisited from "./MostVisited";
import Recent from "./Recent";
import Workspace from "./Workspace";
import Tools from "./Tools";
import AddNew from "./AddNew";

// Icons
import Bolt from "../svgs/Bolt";
import CrossIcon from "../svgs/CrossIcon";
import VoiceSearch from "./voiceSearch/VoiceSearch";
import { useMenu } from "@/context/MenuContext";

const Menu = () => {
  const { open, showDropdown, setOpen } = useMenu();

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed top-0 left-0 ml-[64px] w-screen h-screen bg-black/20 hidden",
          open && "block"
        )}
      />

      {/* Menu trigger button */}
      <button onClick={() => setOpen(!open)}>
        <SidebarItem
          icon={<Bolt />}
          tooltip='Menu'
          className='flex '
          linkSelected={open}
        />
      </button>

      <div className=' ml-[52px]  flex  relative'>
        <div
          className={cn(
            "bg-background border border-border shadow-sm p-4 py-8 max-w-[250px]  min-[550px]:max-w-[415px] max-h-[850px]",
            "w-full h-full overflow-y-auto no-scrollbar fixed top-0 rounded-r-md",
            "opacity-0 pointer-events-none  transition duration-300 ease-in-out z-[1200]",
            open && "opacity-100 pointer-events-auto "
          )}
        >
          {/* Search input */}
          <VoiceSearch />

          {/* Menu sections */}
          <FavoriteSection />
          <MostVisited />
          <Recent />
          <Workspace />
          <Tools />

          {/* Add new favorite dropdown */}
          {showDropdown && <AddNew />}
        </div>
        <span
          className={cn(
            "fixed top-3 z-[1600] ml-[435px] bg-card  items-center justify-center rounded-full h-[40px] w-[40px] max-[550px]:ml-[255px]  hidden hover:bg-hover cursor-pointer",
            open && "flex"
          )}
          onClick={() => setOpen(false)}
        >
          <CrossIcon />
        </span>
      </div>
    </>
  );
};

export default Menu;
