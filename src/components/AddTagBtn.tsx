import { cn } from "@/lib/utils";
import Badge from "./ui/Badge";

export function TagButton({
  tag,
  isSelected,
  onClick,
}: {
  tag: string;
  isSelected: boolean | undefined;
  onClick: () => void;
}) {
  return (
    <Badge
      text={tag}
      className={cn(
        "flex-none cursor-pointer inline-block  whitespace-nowrap truncate  max-w-xs tag py-2 px-[14px]   text-sm font-semibold text-text capitalize",
        isSelected && " !bg-brand text-text-primary hover:!bg-brand-hover"
      )}
      onClick={onClick}
    />
  );
}
