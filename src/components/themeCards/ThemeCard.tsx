import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import ThemeColorBall from "./ThemeColorBall";
import Check from "../svgs/Check";

const ThemeCard = ({
  icon,
  theme,
}: {
  icon: React.ReactNode;
  theme: "light" | "dark" | "sunrise" | "sunset" | "forest";
}) => {
  const { theme: themeValue, setTheme } = useTheme();
  const handleSetTheme = () => setTheme(theme);
  const isSelected = themeValue === theme;

  return (
    <div onClick={handleSetTheme} data-theme={theme}>
      <button
        className={cn(
          "bg-background text-foreground p-6 rounded-[14px]  border-transparent relative flex flex-col hover:bg-hover transition duration-200  border-4 w-[200px] max-h-[200px] ",
          isSelected && " border-brand "
        )}
      >
        <div className='flex items-center gap-1.5'>
          {icon}
          <label className='text-text text-[15px] mb-0.5 capitalize'>
            {theme}
          </label>
        </div>
        <div className='flex flex-wrap mt-2'>
          <ThemeColorBall className='bg-card' />
          <ThemeColorBall className='bg-background ' />
          <ThemeColorBall className='bg-brand' />
          <ThemeColorBall className='bg-text' />
          <ThemeColorBall className='bg-hover' />
          <ThemeColorBall className='bg-background' />
        </div>
        <span
          className={cn(
            "absolute p-1.5 bg-brand rounded-full  -top-2 -right-2",
            !isSelected && "hidden"
          )}
        >
          <Check />
        </span>
      </button>
    </div>
  );
};

export default ThemeCard;
