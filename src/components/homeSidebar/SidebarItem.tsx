import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageContext } from "@/context/PageContext";
import { cn } from "@/lib/utils";
interface Props {
  icon: React.ReactNode;
  tooltip: string;
  link?: string;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
  tooltipClassName?: string;
  linkSelected?: boolean;
}
const SidebarItem = ({
  icon,
  tooltip,
  link,
  className,
  side = "right",
  tooltipClassName,
  linkSelected,
}: Props) => {
  const { page, setPage } = usePageContext();
  const selected = page === link || linkSelected;
  const handelClick = (link: string) => {
    return () => {
      setPage(link);
    };
  };
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[14px] p-0 transition-colors ",
            "hover:bg-home-sidebar-hover hover:text-default-foreground",
            "focus:bg-default/40 focus:text-default-foreground outline-none",
            selected && "bg-sidebar-selected hover:bg-sidebar-selected",
            className
          )}
          onClick={handelClick(link ? link : page)}
        >
          <div className='flex w-full items-center justify-center text-text'>
            <div>{icon}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn("bg-text  text-card ", tooltipClassName)}
          style={{ zIndex: 1300 }}
        >
          <p className='text-xs'>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarItem;
