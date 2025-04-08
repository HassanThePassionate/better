import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";

interface Props {
  label: string;
  des: string;
  value: "light" | "dark" | "system";
}
const ThemeSelector = ({ label, des, value }: Props) => {
  const { theme, setTheme } = useTheme();
  const isSelected = theme === value;
  const handleChangeTheme = () => {
    setTheme(value);
  };
  return (
    <label
      htmlFor={label}
      className={cn(
        "relative cursor-pointer flex items-start border rounded-md pt-2 pb-2.5 px-4 border-transparent hover:bg-hover ",
        isSelected && "border-brand  bg-hover "
      )}
    >
      <div className='flex h-6 items-center'>
        <input
          id={label}
          aria-describedby='system-description'
          name='theme'
          type='radio'
          checked={isSelected}
          className='h-4 w-4 border-border text-brand  focus:ring-brand '
          value={value}
          onChange={handleChangeTheme}
        />
      </div>
      <div className='ml-3 text-sm leading-6'>
        <div className='font-medium text-text '>{label}</div>
        <div id='system-description' className='text-text  '>
          {des}
        </div>
      </div>
    </label>
  );
};

export default ThemeSelector;
