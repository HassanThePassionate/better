import { cn } from "@/lib/utils";

const BookmarksIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24px'
      viewBox='0 -960 960 960'
      width='24px'
      fill='currentColor'
      className={cn("icon", className)}
    >
      <path d='M160-80v-560q0-33 23.5-56.5T240-720h320q33 0 56.5 23.5T640-640v560L400-200 160-80Zm80-121 160-86 160 86v-439H240v439Zm480-39v-560H280v-80h440q33 0 56.5 23.5T800-800v560h-80ZM240-640h320-320Z' />
    </svg>
  );
};

export default BookmarksIcon;
