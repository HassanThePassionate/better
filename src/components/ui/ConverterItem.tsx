"use client";

import { useRef } from "react";
import type React from "react";

type ConverterItemProps = {
  name: string;
  symbol: string;
  base?: number;
  prefix?: string;
  value: number | string;
  type?: "unit" | "base";
  isActive: boolean;
  onValueChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  formatValue?: (value: number | string) => string;
};

export default function ConverterItem({
  name,
  symbol,
  base,
  prefix,
  value,
  type = "unit",
  isActive,
  onValueChange,
  onFocus,
  onBlur,
  formatValue = (value) => value.toString(),
}: ConverterItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  return (
    <div className='relative overflow-hidden transition-all duration-200 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm p-3 rounded-xl'>
      <div className='flex justify-between items-center mb-1 relative'>
        <label
          htmlFor={`item-${symbol}`}
          className='text-xs font-medium text-gray-500'
        >
          {name}
        </label>
        <div className='text-xs text-gray-400'>
          {type === "unit" ? symbol : `Base-${base}`}
        </div>
      </div>
      <div className='relative flex items-center'>
        {prefix && type === "base" && (
          <span className='text-gray-500 mr-1'>{prefix}</span>
        )}
        <input
          ref={inputRef}
          id={`item-${symbol}`}
          value={
            isActive
              ? value?.toString() || (type === "unit" ? "0" : "")
              : type === "unit"
              ? formatValue((value as number) || 0)
              : value || ""
          }
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className='text-right pr-2 text-sm font-medium !bg-transparent border-none input p-1 h-auto transition-all'
          type={type === "unit" ? "number" : "text"}
          step={type === "unit" ? "any" : undefined}
        />
      </div>
    </div>
  );
}
