import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CustomLocationDropdown = ({
  icon,
  text,
  options = [],
}: {
  icon: React.ReactNode;
  text: string;
  options: string[];
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <div className='py-1 pr-6 pl-5 flex gap-2 items-center justify-between'>
      <div className='flex items-center w-full'>
        <div className='mr-0.5'>{icon}</div>
        <span className='block text-text text-sm font-medium'>{text}</span>
      </div>
      <div className='w-full relative' ref={dropdownRef}>
        <div
          className='flex justify-between items-center text-sm rounded text-text h-[42px] w-[220px] border border-border relative cursor-pointer'
          onClick={() => setIsOpen(true)}
        >
          <input
            ref={inputRef}
            type='text'
            className='h-full w-full rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer placeholder:text-text bg-transparent'
            placeholder={selectedOption || "Select"}
            value={isOpen ? searchTerm : ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
          <ChevronDown
            size={20}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'
          />
        </div>

        {isOpen && (
          <div className='absolute z-50 w-[220px] max-h-[300px] overflow-auto no-scrollbar bg-card border border-border rounded-md shadow-md mt-1'>
            <div className='p-2'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className='flex items-center gap-2 px-2 py-1.5 hover:bg-hover rounded cursor-pointer'
                    onClick={() => handleSelect(option)}
                  >
                    <label className='flex-1 cursor-pointer text-text text-sm'>
                      {option}
                    </label>
                  </div>
                ))
              ) : (
                <div className='text-center py-2 text-text'>
                  No locations found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
