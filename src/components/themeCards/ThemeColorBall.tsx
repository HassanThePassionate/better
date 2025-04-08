import { cn } from "@/lib/utils";

const ThemeColorBall = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "h-[26px] w-[26px] rounded-full border border-border shadow-md inline-block -mr-2",
        className
      )}
    ></span>
  );
};

export default ThemeColorBall;
