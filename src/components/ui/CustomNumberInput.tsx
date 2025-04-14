"use client";

import { useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type React from "react";

interface CustomNumberInputProps {
  value: number | string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  id?: string;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
}

export default function CustomNumberInput({
  value,
  onChange,
  onFocus,
  onBlur,
  className = "",
  id,
  step = 1,
  min,
  max,
  disabled = false,
  placeholder,
}: CustomNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIncrement = () => {
    if (disabled) return;

    const currentValue =
      typeof value === "string" ? Number.parseFloat(value) : value;
    if (isNaN(currentValue)) {
      onChange(step.toString());
      return;
    }

    const newValue = currentValue + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    if (disabled) return;

    const currentValue =
      typeof value === "string" ? Number.parseFloat(value) : value;
    if (isNaN(currentValue)) {
      onChange((-step).toString());
      return;
    }

    const newValue = currentValue - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        ref={inputRef}
        id={id}
        type='text'
        inputMode='decimal'
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className='w-full pr-10 text-right input'
      />
      <div className='absolute right-2 h-full flex flex-col'>
        <button
          type='button'
          onClick={handleIncrement}
          disabled={
            disabled ||
            (max !== undefined &&
              (typeof value === "number"
                ? value
                : Number.parseFloat(value.toString())) >= max)
          }
          className='flex items-center justify-center h-1/2 -mb-1 mt-1 w-6 text-text hover:opacity-100 opacity-70 disabled:opacity-30 disabled:cursor-not-allowed'
          tabIndex={-1}
        >
          <ChevronUp size={14} />
        </button>
        <button
          type='button'
          onClick={handleDecrement}
          disabled={
            disabled ||
            (min !== undefined &&
              (typeof value === "number"
                ? value
                : Number.parseFloat(value.toString())) <= min)
          }
          className='flex items-center justify-center  w-6 text-text hover:opacity-100 opacity-70 disabled:opacity-30 disabled:cursor-not-allowed'
          tabIndex={-1}
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
