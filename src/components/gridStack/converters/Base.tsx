"use client";

import CustomNumberInput from "@/components/ui/CustomNumberInput";
import { useState, useEffect } from "react";

export type Unit = {
  name: string;
  symbol: string;
  conversionFactor: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
};

type UnitConverterProps = {
  title?: string;
  units: Unit[];
  defaultBaseUnit?: Unit;
  defaultValue?: number;
};

export default function Base({
  title,
  units,
  defaultBaseUnit,
  defaultValue = 1,
}: UnitConverterProps) {
  const [baseValue, setBaseValue] = useState<number>(defaultValue);
  const [baseUnit, setBaseUnit] = useState<Unit>(defaultBaseUnit || units[0]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isBaseInputActive, setIsBaseInputActive] = useState(false);

  useEffect(() => {
    calculateConversions();
  }, [baseValue, baseUnit]);

  const calculateConversions = () => {
    const newValues: Record<string, number> = {};

    units.forEach((unit) => {
      // Handle special conversion functions (like temperature)
      if (
        unit.toBase &&
        baseUnit.toBase &&
        unit.fromBase &&
        baseUnit.fromBase
      ) {
        // Convert base value to base unit first (e.g., Celsius for temperature)
        const valueInBaseUnit = baseUnit.toBase(baseValue);
        // Then convert from base unit to target unit
        newValues[unit.symbol] = unit.fromBase(valueInBaseUnit);
      } else {
        // Standard conversion using factors
        // Convert base value to standard unit first, then to target unit
        const valueInStandardUnit = baseValue / baseUnit.conversionFactor;
        newValues[unit.symbol] = valueInStandardUnit * unit.conversionFactor;
      }
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

  const handleBaseValueChange = (value: string) => {
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
      {/* Base Unit Display with Editable Input */}
      <div className='bg-card p-4 rounded-xl shadow-sm border border-border'>
        <div className='flex justify-between items-center mb-2'>
          <label className='text-sm font-medium text-text'>
            {title || "Base Unit"}
          </label>
          <div className='relative w-40'>
            <CustomNumberInput
              value={
                isBaseInputActive
                  ? baseValue.toString()
                  : formatValue(baseValue)
              }
              onChange={handleBaseValueChange}
              onFocus={() => setIsBaseInputActive(true)}
              onBlur={() => setIsBaseInputActive(false)}
              className='text-right text-2xl font-light'
              step={0.1}
            />
          </div>
        </div>
        <div className='flex items-center bg-badge p-2 px-3 rounded-lg'>
          <div className='text-base font-medium text-text'>{baseUnit.name}</div>
          <div className='ml-auto text-base text-foreground'>
            {baseUnit.symbol}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {units
          .filter((unit) => unit.symbol !== baseUnit.symbol)
          .map((unit) => (
            <div
              key={unit.symbol}
              className='relative overflow-hidden transition-all duration-200 bg-card border border-border hover:border-hover p-3 rounded-xl'
            >
              <div className='flex justify-between items-center mb-1 relative'>
                <label
                  htmlFor={`unit-${unit.symbol}`}
                  className='text-xs font-medium text-text'
                >
                  {unit.name}
                </label>
                <div className='text-xs text-text opacity-70'>
                  {unit.symbol}
                </div>
              </div>
              <div className='relative flex items-center'>
                <CustomNumberInput
                  id={`unit-${unit.symbol}`}
                  value={
                    activeInput === unit.symbol
                      ? values[unit.symbol]?.toString() || "0"
                      : formatValue(values[unit.symbol] || 0)
                  }
                  onChange={(value) => handleUnitChange(value, unit)}
                  onFocus={() => setActiveInput(unit.symbol)}
                  onBlur={() => setActiveInput(null)}
                  className='text-right pr-2 text-sm font-medium mt-2 !bg-transparent border-none p-1 h-auto transition-all'
                  step={0.1}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
