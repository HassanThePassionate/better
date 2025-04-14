"use client";

import { useState, useEffect, useRef } from "react";

import type React from "react";

type Unit = {
  name: string;
  symbol: string;
  conversionFactor: number;
};

const dataUnits: Unit[] = [
  { name: "Byte", symbol: "B", conversionFactor: 1 },
  { name: "Kilobyte", symbol: "KB", conversionFactor: 1 / 1024 },
  { name: "Megabyte", symbol: "MB", conversionFactor: 1 / 1048576 },
  { name: "Gigabyte", symbol: "GB", conversionFactor: 1 / 1073741824 },
  { name: "Terabyte", symbol: "TB", conversionFactor: 1 / 1099511627776 },
  { name: "Petabyte", symbol: "PB", conversionFactor: 1 / 1125899906842624 },
  { name: "Bit", symbol: "bit", conversionFactor: 8 },
  { name: "Kilobit", symbol: "Kbit", conversionFactor: 8 / 1024 },
  { name: "Megabit", symbol: "Mbit", conversionFactor: 8 / 1048576 },
  { name: "Gigabit", symbol: "Gbit", conversionFactor: 8 / 1073741824 },
];

export default function DataConverter() {
  const [baseValue, setBaseValue] = useState<number>(1);
  const [baseUnit, setBaseUnit] = useState<Unit>(dataUnits[0]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isBaseInputActive, setIsBaseInputActive] = useState(false);
  const baseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    calculateConversions();
  }, [baseValue, baseUnit]);

  const calculateConversions = () => {
    const newValues: Record<string, number> = {};

    dataUnits.forEach((unit) => {
      // Convert base value to bytes first, then to target unit
      const valueInBytes = baseValue / baseUnit.conversionFactor;
      newValues[unit.symbol] = valueInBytes * unit.conversionFactor;
    });

    setValues(newValues);
  };

  const handleUnitChange = (value: string, unit: Unit) => {
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue)) {
      setBaseValue(numValue);
      setBaseUnit(unit);
    }
  };

  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue)) {
      setBaseValue(numValue);
    } else if (value === "" || value === "-") {
      setBaseValue(0);
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1e9 || value <= 1e-9) {
      return value.toExponential(6);
    }

    // For regular numbers
    return value.toString().includes(".")
      ? value.toFixed(Math.min(6, value.toString().split(".")[1].length))
      : value.toString();
  };

  return (
    <div className='space-y-3'>
      {/* Enhanced Base Unit Display with Editable Input */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100'>
        <div className='flex justify-between items-center mb-2'>
          <label className='text-sm font-medium text-gray-600'>Base Unit</label>
          <div className='relative'>
            <input
              ref={baseInputRef}
              value={
                isBaseInputActive
                  ? baseValue.toString()
                  : formatValue(baseValue)
              }
              onChange={handleBaseValueChange}
              onFocus={() => setIsBaseInputActive(true)}
              onBlur={() => setIsBaseInputActive(false)}
              className='text-right text-2xl font-light input'
              type='number'
              step='any'
            />
          </div>
        </div>
        <div className='flex items-center bg-white/60 p-2 rounded-lg'>
          <div className='text-base font-medium text-gray-800'>
            {baseUnit.name}
          </div>
          <div className='ml-auto text-base text-gray-500'>
            {baseUnit.symbol}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {dataUnits
          .filter((unit) => unit.symbol !== baseUnit.symbol) // Filter out the base unit
          .map((unit) => (
            <div
              key={unit.symbol}
              className='relative overflow-hidden transition-all duration-200 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm p-3 rounded-xl'
            >
              <div className='flex justify-between items-center mb-1 relative'>
                <label
                  htmlFor={`unit-${unit.symbol}`}
                  className='text-xs font-medium text-gray-500'
                >
                  {unit.name}
                </label>
                <div className='text-xs text-gray-400'>{unit.symbol}</div>
              </div>
              <div className='relative flex items-center'>
                <input
                  ref={(el) => {
                    inputRefs.current[unit.symbol] = el;
                  }}
                  id={`unit-${unit.symbol}`}
                  value={
                    activeInput === unit.symbol
                      ? values[unit.symbol]?.toString() || "0"
                      : formatValue(values[unit.symbol] || 0)
                  }
                  onChange={(e) => handleUnitChange(e.target.value, unit)}
                  onFocus={() => setActiveInput(unit.symbol)}
                  onBlur={() => setActiveInput(null)}
                  className='text-right pr-2 text-sm font-medium bg-transparent border-none focus-visible:ring-blue-300 rounded-lg p-1 h-auto transition-all'
                  type='number'
                  step='any'
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
