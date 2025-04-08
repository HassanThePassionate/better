import { cn } from "@/lib/utils";

const ActionBtn = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "border-border  rounded-[20px] border-dotted border-2 bg-card max-sm:w-full  hover:bg-hover px-[18px] py-2 font-semibold text-[10px] ",
        className
      )}
    >
      {text}
    </button>
  );
};

export default ActionBtn;
