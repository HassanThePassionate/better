import { Loader2, Mic, Search } from "lucide-react";
import { ChangeEvent, JSX } from "react";
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  isVoiceSupported: boolean;
}

const VoiceSearchInput = ({
  value,
  onChange,
  onVoiceToggle,
  isListening,
  isVoiceSupported,
}: SearchInputProps): JSX.Element => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className='relative w-full'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground ' />
      <input
        value={value}
        onChange={handleInputChange}
        placeholder='Search'
        autoFocus
        className='pl-[36px] shadow-none w-full text-sm outline-brand  border bg-input rounded-md h-[40px] flex items-center text-text'
      />
      {isVoiceSupported && (
        <button
          className={`absolute right-2 h-8 w-8 ${
            isListening ? "text-red-500" : ""
          }`}
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
    </div>
  );
};

export default VoiceSearchInput;
