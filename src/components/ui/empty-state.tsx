"use client";

import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon = <Calendar />,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-2",
      icon: "h-4 w-4 text-gray-400",
      title: "text-[10px] text-gray-400",
      description: "text-[9px] text-gray-400",
      button: "text-[9px] h-6 rounded-full",
    },
    md: {
      container: "py-4",
      icon: "h-5 w-5 text-gray-400",
      title: "text-xs text-gray-500",
      description: "text-[10px] text-gray-400",
      button: "text-[10px] rounded-full",
    },
    lg: {
      container: "py-6",
      icon: "h-6 w-6 text-gray-400",
      title: "text-gray-500",
      description: "text-sm text-gray-400",
      button: "rounded-full",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        sizeClasses[size].container,
        className
      )}
    >
      <div
        className={cn(
          "bg-badge rounded-full p-2 mb-2",
          size === "lg" ? "p-4 mb-3" : ""
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          //@ts-ignore
          className: sizeClasses[size].icon,
        })}
      </div>
      <p className={cn("mb-1", sizeClasses[size].title)}>{title}</p>
      {description && (
        <p className={cn("mb-2 text-center", sizeClasses[size].description)}>
          {description}
        </p>
      )}
      {action && (
        <Button
          variant='outline'
          size={size === "lg" ? "default" : "sm"}
          className={sizeClasses[size].button}
          onClick={action.onClick}
        >
          {action.icon || (
            <Plus
              className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
            />
          )}
          {action.label}
        </Button>
      )}
    </div>
  );
}
