import { useMenu } from "@/context/MenuContext";
import { Loader2, Mic, Search, X } from "lucide-react";
import { ChangeEvent, JSX, useEffect, useRef } from "react";
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  isVoiceSupported: boolean;
}

const SearchInput = ({
  value,
  onChange,
  onVoiceToggle,
  isListening,
  isVoiceSupported,
}: SearchInputProps): JSX.Element => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };
  const handleClearInput = (): void => {
    onChange("");
  };
  const { open } = useMenu();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className='relative w-full'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground ' />
      {isVoiceSupported && value === "" && (
        <button
          type='button'
          className='absolute  right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground'
          onClick={onVoiceToggle}
        >
          {isListening ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Mic className='h-4 w-4' />
          )}
          <span className='sr-only'>
            {isListening ? "Stop listening" : "Start voice search"}
          </span>
        </button>
      )}
      {value !== "" && (
        <button
          type='button'
          className='absolute  right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground'
          onClick={handleClearInput}
        >
          <X size={20} />
        </button>
      )}
      <input
        value={value}
        onChange={handleInputChange}
        placeholder='Search'
        autoFocus
        ref={inputRef}
        className='pl-[36px] shadow-none w-full text-sm outline-brand  border bg-searchbar rounded-md h-[40px] flex items-center text-text'
      />
    </div>
  );
};

export default SearchInput;
