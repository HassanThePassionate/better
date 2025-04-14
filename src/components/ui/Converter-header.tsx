"use client";

import { useRef, useState } from "react";
import type React from "react";

type ConverterHeaderProps = {
  title: string;
  baseValue: number | string;
  baseItemName: string;
  baseItemSymbol: string;
  baseItemBase?: number;
  type?: "unit" | "base";
  onValueChange: (value: string) => void;
  formatValue?: (value: number | string) => string;
};

export default function ConverterHeader({
  title,
  baseValue,
  baseItemName,
  baseItemSymbol,
  baseItemBase,
  type = "unit",
  onValueChange,
  formatValue = (value) => value.toString(),
}: ConverterHeaderProps) {
  const [isBaseInputActive, setIsBaseInputActive] = useState(false);
  const baseInputRef = useRef<HTMLInputElement>(null);

  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  return (
    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100'>
      <div className='flex justify-between items-center mb-2'>
        <label className='text-sm font-medium text-gray-600'>{title}</label>
        <div className='relative'>
          <input
            ref={baseInputRef}
            value={
              isBaseInputActive
                ? baseValue.toString()
                : typeof baseValue === "number"
                ? formatValue(baseValue)
                : baseValue || "0"
            }
            onChange={handleBaseValueChange}
            onFocus={() => setIsBaseInputActive(true)}
            onBlur={() => setIsBaseInputActive(false)}
            className='text-right text-2xl font-light input'
            type={type === "unit" ? "number" : "text"}
            step={type === "unit" ? "any" : undefined}
          />
        </div>
      </div>
      <div className='flex items-center bg-white/60 p-2 rounded-lg'>
        <div className='text-base font-medium text-gray-800'>
          {baseItemName}
        </div>
        <div className='ml-auto text-base text-gray-500'>
          {type === "unit" ? baseItemSymbol : `Base-${baseItemBase}`}
        </div>
      </div>
    </div>
  );
}
