"use client";

import type React from "react";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  setValue?: (value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  setValue,
  placeholder = "Search folders...",
  className,
}: SearchInputProps) {
  const handleClearInput = () => {
    if (setValue) {
      setValue("");
    }
  };
  return (
    <div className={cn("p-2 py-0 border-b", className)}>
      <div className='relative w-full'>
        <Search className='absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground ' />
        {value !== "" && (
          <span
            className='absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground cursor-pointer '
            onClick={handleClearInput}
          >
            <X size={20} />
          </span>
        )}

        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus
          className='pl-[28px] border-0 shadow-none w-full outline-none text-sm h-9 bg-transparent'
        />
      </div>
    </div>
  );
}
