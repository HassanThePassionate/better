"use client";

import { useState, useEffect, useRef } from "react";

import type React from "react";

type Base = {
  name: string;
  base: number;
  prefix: string;
};

const numberBases: Base[] = [
  { name: "Decimal", base: 10, prefix: "" },
  { name: "Binary", base: 2, prefix: "0b" },
  { name: "Octal", base: 8, prefix: "0o" },
  { name: "Hexadecimal", base: 16, prefix: "0x" },
  { name: "Base-32", base: 32, prefix: "" },
  { name: "Base-64", base: 64, prefix: "" },
];

// Characters for different bases
const DIGITS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

export default function NumberBaseConverter() {
  const [baseValue, setBaseValue] = useState<string>("10");
  const [baseType, setBaseType] = useState<Base>(numberBases[0]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [isBaseInputActive, setIsBaseInputActive] = useState(false);
  const baseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    calculateConversions();
  }, [baseValue, baseType]);

  const calculateConversions = () => {
    const newValues: Record<number, string> = {};

    try {
      // Parse the input value according to its base
      const decimalValue = Number.parseInt(baseValue, baseType.base);

      if (isNaN(decimalValue)) {
        // If parsing fails, set all values to empty
        numberBases.forEach((base) => {
          newValues[base.base] = "";
        });
      } else {
        // Convert decimal to each base
        numberBases.forEach((base) => {
          if (base.base <= 36) {
            // JavaScript's built-in toString can handle bases 2-36
            newValues[base.base] = decimalValue
              .toString(base.base)
              .toUpperCase();
          } else {
            // Custom conversion for higher bases
            newValues[base.base] = convertFromDecimal(decimalValue, base.base);
          }
        });
      }
    } catch (error) {
      // Handle any conversion errors
      numberBases.forEach((base) => {
        newValues[base.base] = "";
      });
      console.log(error);
    }

    setValues(newValues);
  };

  const convertFromDecimal = (
    decimalValue: number,
    targetBase: number
  ): string => {
    if (decimalValue === 0) return "0";

    let result = "";
    let value = decimalValue;

    while (value > 0) {
      result = DIGITS[value % targetBase] + result;
      value = Math.floor(value / targetBase);
    }

    return result;
  };

  const handleBaseChange = (value: string, base: Base) => {
    // Remove the prefix if present
    let cleanValue = value;
    if (base.prefix && value.startsWith(base.prefix)) {
      cleanValue = value.substring(base.prefix.length);
    }

    // Validate that the input only contains valid digits for the selected base
    const validChars = DIGITS.substring(0, base.base);
    const isValid = [...cleanValue].every((char) => validChars.includes(char));

    if (isValid || cleanValue === "") {
      setBaseValue(cleanValue);
      setBaseType(base);
    }
  };

  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // For number base converter, we need to validate based on the current base
    const validChars = DIGITS.substring(0, baseType.base);
    const isValid = [...value].every((char) => validChars.includes(char));

    if (isValid || value === "") {
      setBaseValue(value === "" ? "" : value);
    }
  };

  return (
    <div className='space-y-3'>
      {/* Enhanced Base Unit Display with Editable Input */}
      <div className='bg-card p-4 rounded-xl shadow-sm border border-border'>
        <div className='flex justify-between items-center mb-2'>
          <label className='text-sm font-medium text-text'>Base Number</label>
          <div className='relative'>
            <input
              ref={baseInputRef}
              value={isBaseInputActive ? baseValue : baseValue || "0"}
              onChange={handleBaseValueChange}
              onFocus={() => setIsBaseInputActive(true)}
              onBlur={() => setIsBaseInputActive(false)}
              className='text-right text-2xl font-light input'
            />
          </div>
        </div>
        <div className='flex items-center bg-badge p-2 px-3 rounded-lg'>
          <div className='text-base font-medium text-text'>{baseType.name}</div>
          <div className='ml-auto text-base text-foreground opacity-75'>
            Base-{baseType.base}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {numberBases
          .filter((base) => base.base !== baseType.base) // Filter out the base type
          .map((base) => (
            <div
              key={base.name}
              className='relative overflow-hidden transition-all duration-200 bg-card border border-border hover:border-hover p-3 rounded-xl'
            >
              <div className='flex justify-between items-center mb-1 relative'>
                <label
                  htmlFor={`base-${base.base}`}
                  className='text-xs font-medium text-text'
                >
                  {base.name}
                </label>
                <div className='text-xs text-text opacity-80'>
                  Base-{base.base}
                </div>
              </div>
              <div className='relative flex items-center'>
                {base.prefix && (
                  <span className='text-text opacity-80 mr-1'>
                    {base.prefix}
                  </span>
                )}
                <input
                  ref={(el) => {
                    inputRefs.current[base.base] = el;
                  }}
                  id={`base-${base.base}`}
                  value={
                    activeInput === base.base
                      ? baseValue
                      : values[base.base] || ""
                  }
                  onChange={(e) => handleBaseChange(e.target.value, base)}
                  onFocus={() => setActiveInput(base.base)}
                  onBlur={() => setActiveInput(null)}
                  className='text-right pr-2 text-sm font-medium !bg-transparent border-none input p-1 h-auto transition-all'
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
