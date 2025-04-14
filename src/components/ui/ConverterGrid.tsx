"use client";

import ConverterItem from "./ConverterItem";

type ConversionItem = {
  name: string;
  symbol: string;
  conversionFactor?: number;
  base?: number;
  prefix?: string;
};

type ConverterGridProps = {
  items: ConversionItem[];
  baseItem: ConversionItem;
  values: Record<string, number | string>;
  activeInput: string | null;
  type?: "unit" | "base";
  onItemChange: (value: string, item: ConversionItem) => void;
  onItemFocus: (symbol: string) => void;
  onItemBlur: () => void;
  formatValue?: (value: number | string) => string;
};

export default function ConverterGrid({
  items,
  baseItem,
  values,
  activeInput,
  type = "unit",
  onItemChange,
  onItemFocus,
  onItemBlur,
  formatValue = (value) => value.toString(),
}: ConverterGridProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
      {items
        .filter((item) => item.symbol !== baseItem.symbol) // Filter out the base item
        .map((item) => (
          <ConverterItem
            key={item.symbol}
            name={item.name}
            symbol={item.symbol}
            base={item.base}
            prefix={item.prefix}
            value={values[item.symbol] || (type === "unit" ? 0 : "")}
            type={type}
            isActive={activeInput === item.symbol}
            onValueChange={(value) => onItemChange(value, item)}
            onFocus={() => onItemFocus(item.symbol)}
            onBlur={onItemBlur}
            formatValue={formatValue}
          />
        ))}
    </div>
  );
}
