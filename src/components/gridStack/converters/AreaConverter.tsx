"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";

type Unit = {
  name: string;
  symbol: string;
  conversionFactor: number;
};

const areaUnits: Unit[] = [
  { name: "Square Meter", symbol: "m²", conversionFactor: 1 },
  { name: "Square Kilometer", symbol: "km²", conversionFactor: 0.000001 },
  { name: "Square Centimeter", symbol: "cm²", conversionFactor: 10000 },
  { name: "Square Millimeter", symbol: "mm²", conversionFactor: 1000000 },
  { name: "Square Inch", symbol: "in²", conversionFactor: 1550 },
  { name: "Square Foot", symbol: "ft²", conversionFactor: 10.7639 },
  { name: "Square Yard", symbol: "yd²", conversionFactor: 1.19599 },
  { name: "Square Mile", symbol: "mi²", conversionFactor: 3.861e-7 },
  { name: "Acre", symbol: "ac", conversionFactor: 0.000247105 },
  { name: "Hectare", symbol: "ha", conversionFactor: 0.0001 },
];

export default function AreaConverter() {
  const [baseValue, setBaseValue] = useState<number>(1);
  const [baseUnit, setBaseUnit] = useState<Unit>(areaUnits[0]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isBaseInputActive, setIsBaseInputActive] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const baseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    calculateConversions();
  }, [baseValue, baseUnit]);

  const calculateConversions = () => {
    const newValues: Record<string, number> = {};

    areaUnits.forEach((unit) => {
      // Convert base value to square meters first, then to target unit
      const valueInSqMeters = baseValue / baseUnit.conversionFactor;
      newValues[unit.symbol] = valueInSqMeters * unit.conversionFactor;
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

  //   const clearInput = (unit: Unit) => {
  //     setBaseValue(0);
  //     setBaseUnit(unit);
  //     // Focus the input after clearing
  //     if (inputRefs.current[unit.symbol]) {
  //       inputRefs.current[unit.symbol]?.focus();
  //     }
  //   };

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
              className='text-right text-2xl input'
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
        {areaUnits
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
                  className='text-right pr-2 text-sm font-medium !bg-transparent border-none input h-auto transition-all'
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
