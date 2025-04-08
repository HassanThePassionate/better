"use client";
import { usePageContext } from "@/context/PageContext";
import { btns } from "@/constant/headerActionBtns";
import SettingIcon from "../svgs/SettingIcon";

import { Sun } from "lucide-react";
import { useThemeDropDownContext } from "@/context/ThemeDropDownContext";
import { useBookmarks } from "@/context/BookmarkContext";

const ActionButtons = () => {
  const { setPage } = usePageContext();
  const { isThemeDropDownOpen, setIsThemeDropDownOpen } =
    useThemeDropDownContext();
  const { setShowCardDetail } = useBookmarks();
  const handleOpenDropDown = () => {
    if (!isThemeDropDownOpen) {
      setShowCardDetail(false);
    }
    setIsThemeDropDownOpen(!isThemeDropDownOpen);
  };
  const navigateTo = (page: string) => {
    return () => setPage(page);
  };

  return (
    <nav
      className='hidden lg:flex items-center justify-end gap-4 pr-4'
      aria-label='Action navigation'
    >
      <button onClick={handleOpenDropDown}>
        <Sun size={22} />
      </button>
      <button className='text-sm text-foreground hover:text-text transition-colors'>
        <SettingIcon />
      </button>
      {btns.map((button, index) => (
        <button
          key={index}
          className='text-sm text-foreground hover:text-text transition-colors'
          onClick={navigateTo(button.action)}
          aria-label={button.label}
        >
          {button.icon}
        </button>
      ))}
    </nav>
  );
};

export default ActionButtons;
