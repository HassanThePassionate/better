import { cn } from "@/lib/utils";
import InfoIcon from "../components/svgs/CheckIcon";

interface TagNotificationProps {
  text: string;
  visible: boolean;
}

export function TagNotification({ text, visible }: TagNotificationProps) {
  return (
    <div
      className={cn(
        "ml-auto text-sm text-foreground flex items-center gap-1.5 opacity-100 transition-all duration-300 translate-y-[0%] whitespace-nowrap text-ellipsis",
        !visible && "opacity-0 translate-y-[10%]"
      )}
      aria-live='polite'
      aria-atomic='true'
    >
      <InfoIcon />
      {text}
    </div>
  );
}
