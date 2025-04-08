import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatDateRange } from "@/lib/format-date";
import RangeDatePicker from "@/components/RangeDatePicker";
export const FilterInput = ({
  icon,
  text,
  calendar,
  options = [],
  type = "checkbox",
  dateRange,
  onDateRangeChange,
}: {
  icon: React.ReactNode;
  text: string;
  calendar?: boolean;
  options?: string[];
  type?: "checkbox" | "radio";
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleRadioChange = (option: string) => {
    setSelectedOption(option);
  };

  const displayText = calendar
    ? formatDateRange(dateRange)
    : type === "checkbox"
    ? selectedOptions.length > 0
      ? selectedOptions.join(", ")
      : "Select"
    : selectedOption || "Select";

  return (
    <>
      <div className='py-1 pr-6 pl-5 flex gap-2 items-center justify-between'>
        <div className='flex items-center w-full'>
          <div className='mr-0.5'>{icon}</div>
          <span className='block text-text text-sm font-medium'>{text}</span>
        </div>
        <div className='w-full'>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex justify-between items-center text-sm rounded text-text h-[42px] w-[220px] border py-2 pr-2 pl-3 border-border'>
              <span className='truncate'>{displayText}</span>
              <ChevronDown size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn("w-[220px] p-2", calendar && "w-full p-0")}
            >
              {calendar ? (
                <RangeDatePicker
                  selectedRange={dateRange}
                  onRangeChange={onDateRangeChange}
                />
              ) : (
                <DropdownMenuGroup>
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      className='text-text flex items-center gap-2'
                      onSelect={(e) => e.preventDefault()} // Prevent menu from closing on select
                    >
                      <input
                        type={type}
                        name={text}
                        className='h-4 w-4'
                        checked={
                          type === "checkbox"
                            ? selectedOptions.includes(option)
                            : selectedOption === option
                        }
                        onChange={() =>
                          type === "checkbox"
                            ? handleCheckboxChange(option)
                            : handleRadioChange(option)
                        }
                        id={`${type}-${text}-${option}`}
                      />
                      <label
                        htmlFor={`${type}-${text}-${option}`}
                        className='flex-1 cursor-pointer'
                        onClick={() =>
                          type === "checkbox"
                            ? handleCheckboxChange(option)
                            : handleRadioChange(option)
                        }
                      >
                        {option}
                      </label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
