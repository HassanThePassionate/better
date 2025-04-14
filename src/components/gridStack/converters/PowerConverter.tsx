"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

type Unit = {
  name: string;
  symbol: string;
  conversionFactor: number;
};

const powerUnits: Unit[] = [
  { name: "Watt", symbol: "W", conversionFactor: 1 },
  { name: "Kilowatt", symbol: "kW", conversionFactor: 0.001 },
  { name: "Megawatt", symbol: "MW", conversionFactor: 0.000001 },
  {
    name: "Horsepower (mechanical)",
    symbol: "hp",
    conversionFactor: 0.00134102,
  },
  {
    name: "Foot-pound per second",
    symbol: "ft·lb/s",
    conversionFactor: 0.737562,
  },
  { name: "BTU per hour", symbol: "BTU/h", conversionFactor: 3.41214 },
  { name: "Calorie per second", symbol: "cal/s", conversionFactor: 0.239006 },
  { name: "Joule per second", symbol: "J/s", conversionFactor: 1 },
];

export default function PowerConverter() {
  const [baseValue, setBaseValue] = useState<number>(1);
  const [baseUnit, setBaseUnit] = useState<Unit>(powerUnits[0]);
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

    powerUnits.forEach((unit) => {
      // Convert base value to watts first, then to target unit
      const valueInWatts = baseValue / baseUnit.conversionFactor;
      newValues[unit.symbol] = valueInWatts * unit.conversionFactor;
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
        {powerUnits
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
