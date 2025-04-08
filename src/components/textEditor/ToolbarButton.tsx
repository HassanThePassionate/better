"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/my-button";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  icon: ReactNode;
}

export default function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  icon,
}: ToolbarButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        isActive ? "bg-hover" : "bg-transparent",
        "h-[40px] w-[40px] shadow-none ring-0"
      )}
      disabled={disabled}
      title={title}
    >
      {icon}
    </Button>
  );
}
