import { useBookmarks } from "@/context/BookmarkContext";
import { cn } from "@/lib/utils";
import MoreIcon from "./svgs/MoreIcon";
import { useThemeDropDownContext } from "@/context/ThemeDropDownContext";
interface Props {
  className?: string;
}
const MoreIconBtn = ({ className }: Props) => {
  const { showSelectionCard, setShowCardDetail, showCardDetail } =
    useBookmarks();
  const { setIsThemeDropDownOpen } = useThemeDropDownContext();
  const handleCardDetail = () => {
    if (!showCardDetail) {
      setIsThemeDropDownOpen(false);
    }
    setShowCardDetail(!showCardDetail);
  };
  return (
    <>
      {!showSelectionCard && (
        <button
          className={cn(
            " focus:outline-none focus-visible:ring-1 ring-inset ring-border rounded-r px-4 lg:px-3 h-14 lg:h-12 text-foreground hover:text-text",
            className
          )}
          onClick={handleCardDetail}
        >
          <MoreIcon />
        </button>
      )}
    </>
  );
};

export default MoreIconBtn;
