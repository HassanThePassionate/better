import ThemeCard from "./ThemeCard";

import CrossIcon from "../svgs/CrossIcon";
import { MdOutlineWbSunny } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useThemeDropDownContext } from "@/context/ThemeDropDownContext";

type Theme = "light" | "dark" | "sunrise" | "sunset" | "forest";

const ThemeCards = () => {
  const themes: Theme[] = ["dark", "light", "sunrise", "sunset", "forest"];
  const { isThemeDropDownOpen, setIsThemeDropDownOpen } =
    useThemeDropDownContext();

  const handleCloseDropDown = () => setIsThemeDropDownOpen(false);

  return (
    <div
      className={cn(
        "h-full mb-2 no-scrollbar fixed w-full max-w-[280px] items-center   top-0 mt-[75px] right-6 pt-10 translate-x-[100%] opacity-0 transition duration-300",
        isThemeDropDownOpen && "translate-x-0 opacity-100"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4 p-6 bg-card border border-border rounded-[12px] max-[1600px]:max-h-[660px] overflow-y-auto   mb-2 no-scrollbar w-full max-w-[280px] items-center  bottom-2  pt-10 translate-x-[100%] opacity-0 transition duration-300",
          isThemeDropDownOpen && "translate-x-0 opacity-100"
        )}
      >
        {themes.map((theme) => (
          <ThemeCard
            key={theme}
            theme={theme}
            icon={<MdOutlineWbSunny size={17} />}
          />
        ))}

        <span
          className='absolute top-2 right-2 h-8 w-8 flex items-center justify-center bg-badge hover:bg-input rounded-full cursor-pointer opacity-80 hover:opacity-100'
          onClick={handleCloseDropDown}
        >
          <CrossIcon />
        </span>
      </div>
    </div>
  );
};

export default ThemeCards;
