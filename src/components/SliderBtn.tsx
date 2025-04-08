import { cn } from "@/lib/utils";
import React from "react";

const SliderBtn = ({
  icon,
  id,
  className,
}: {
  icon: React.ReactNode;
  id: string;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "bg-card flex items-center justify-center h-9 w-9 rounded-full hover:bg-hover absolute top-[50%] z-50 translate-y-[-50%] border border-border cursor-pointer",
        className
      )}
      id={id}
    >
      {icon}
    </button>
  );
};

export default SliderBtn;
